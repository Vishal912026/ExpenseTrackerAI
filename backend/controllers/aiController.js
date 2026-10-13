import { GoogleGenAI } from "@google/genai";
import Expense from "../models/Expense.js";

const CATEGORIES = ["Food", "Travel", "Shopping", "Bills", "Entertainment", "Health", "Education", "Other"];

export const addExpenseWithAI = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 3) {
      return res.status(400).json({ message: "Please write something like: Yesterday I spent 80 rupees on tea and auto"});
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const today = new Date().toISOString().split("T")[0];

    const prompt = `
You are an expense parser. Today's date is ${today}.
The user writes in Hindi, Hinglish or English. Extract every expense from the text.
Return ONLY a JSON array. Each item must have:
- "title": short name of the expense (string)
- "amount": number in rupees
- "category": one of ${CATEGORIES.join(", ")}
- "date": YYYY-MM-DD ("kal" = yesterday, "parso" = day before yesterday, no date mentioned = today)
If the text has no expense, return [].

Text: "${text}"
`;

      
    const MODELS = ["gemini-3.8-flash", "gemini-3.5-flash-lite"];
    let response;
    let lastError;

    for (const model of MODELS) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { responseMimeType: "application/json" },
          });
          break;
        } catch (err) {
          lastError = err;
          const isNotFound = err.message.includes("404") || err.message.includes("NOT_FOUND");
          const isBusy = err.message.includes("503") || err.message.includes("UNAVAILABLE");

          if (isNotFound) break; 
          if (!isBusy) throw err; 
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
      if (response) break;
    }

    if (!response) throw lastError;

    let items;
    try {
      items = JSON.parse(response.text);
    } catch (err) {
      return res.status(502).json({ message: "Could not understand the AI response, please try again" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No expense found, please describe it more clearly" });
    }

    const docs = items
      .filter((i) => i.title && Number(i.amount) > 0)
      .map((i) => ({
        user: req.user.id,
        title: i.title,
        amount: Number(i.amount),
        category: CATEGORIES.includes(i.category) ? i.category : "Other",
        date: i.date ? new Date(i.date) : new Date(),
        source: "ai",
      }));

    if (docs.length === 0) {
      return res.status(400).json({ message: "No valid expense found" });
    }

    const saved = await Expense.insertMany(docs);
    res.status(201).json(saved);
  } catch (error) {
         console.log("AI error:", error.message);

    const isBusy = error.message.includes("503") || error.message.includes("UNAVAILABLE");
    if (isBusy) {
      return res.status(503).json({ message: "AI is busy right now. Please try again in a few seconds." });
    }

    res.status(500).json({ message: "Something went wrong with the AI. Please try again." });
}
};