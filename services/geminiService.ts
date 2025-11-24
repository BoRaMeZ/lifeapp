
import { GoogleGenAI } from "@google/genai";
import { Language, PlayerStats } from "../types";

const SYSTEM_INSTRUCTION_BASE = `
You are "StreamOS," a strategic productivity AI assistant for a user who works 8:30 AM - 7:30 PM and wants to become a streamer.
The user only has free time from 9:00 PM to 11:00 PM on weekdays, and weekends.
Your goal is to help them manage energy, not just time.
1. Be concise, tactical, and motivational. Use gaming metaphors (XP, leveling up, grinding, missions).
2. For weekday requests, prioritize "Low Energy" tasks like organizing files, cutting simple clips, or planning.
3. For weekend requests, prioritize "High Energy" tasks like Streaming (Sat/Sun 10 PM) or heavy editing.
4. If the user feels overwhelmed, suggest the "Kanban" method: move one small card today.
5. Always remind them that consistency > intensity.
`;

export const sendMessageToGemini = async (
  history: { role: string; text: string }[], 
  message: string, 
  lang: Language,
  stats?: PlayerStats
): Promise<string> => {
  try {
    // Initialize standard Google GenAI client
    // The key is now injected via vite.config.ts define
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Add language instruction
    const langInstruction = lang === 'es' 
      ? "IMPORTANT: RESPOND ONLY IN SPANISH." 
      : "IMPORTANT: RESPOND ONLY IN ENGLISH.";

    // Add stats context
    let statsContext = "";
    if (stats) {
        statsContext = `\nCURRENT USER STATS: Level ${stats.level}, XP ${stats.currentXP}, Streak ${stats.streak} days. Use this data to motivate them (e.g., "Protect your ${stats.streak}-day streak!").`;
    }

    const finalSystemInstruction = `${SYSTEM_INSTRUCTION_BASE}\n${langInstruction}\n${statsContext}`;
    
    // Using gemini-2.5-flash as requested
    const model = 'gemini-2.5-flash';
    
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: finalSystemInstruction,
      },
      // Pass history correctly to the chat session
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
    });

    const result = await chat.sendMessage({
      message: message 
    });

    return result.text || (lang === 'es' ? "Sistema Offline. Sin respuesta." : "System Offline. No response received.");
  } catch (error) {
    console.error("Gemini Error:", error);
    return lang === 'es' 
      ? "Fallo Crítico: No se puede conectar a la Red Neuronal (Error de API)." 
      : "Critical Failure: Unable to connect to Neural Network (API Error).";
  }
};