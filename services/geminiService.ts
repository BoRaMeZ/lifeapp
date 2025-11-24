
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
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return lang === 'es' 
        ? "Error: Mal funcionamiento del sistema. API_KEY no detectada." 
        : "Error: System Malfunction. API_KEY not detected.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
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
    
    const model = 'gemini-2.5-flash';
    
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: finalSystemInstruction,
      },
    });

    const contextPrompt = history.map(h => `${h.role === 'user' ? 'User' : 'StreamOS'}: ${h.text}`).join('\n');
    const fullPrompt = `${contextPrompt}\nUser: ${message}`;

    const result = await chat.sendMessage({
      message: message 
    });

    return result.text || (lang === 'es' ? "Sistema Offline. Sin respuesta." : "System Offline. No response received.");
  } catch (error) {
    console.error("Gemini Error:", error);
    return lang === 'es' 
      ? "Fallo Crítico: No se puede conectar a la Red Neuronal." 
      : "Critical Failure: Unable to connect to Neural Network.";
  }
};
