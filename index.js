import { GoogleGenAI } from "@google/genai";
import "dotenv/config"

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


console.log(client)