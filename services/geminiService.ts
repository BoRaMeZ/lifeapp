
import { GoogleGenAI } from "@google/genai";
import { Language, PlayerStats, ProjectCard, AgendaItem, UserProfile, DailyTask, ScriptData, VisionAnalysis, LootChallenge } from "../types";

const SYSTEM_INSTRUCTION_BASE = `
You are "StreamOS," an elite productivity AI Agent for a streamer with a full-time job.
You have READ/WRITE access to the user's Agenda and Tasks.

CAPABILITIES:
1. **Analyze**: Read user data to give tactical advice.
2. **Execute**: You can MODIFY the app state by returning a JSON block.

AVAILABLE ACTIONS (Return inside \`\`\`json\`\`\` block):

A. **CREATE_AGENDA**: Replace the entire daily schedule.
   Use when user says "Plan my day" or "Reset schedule".
   Structure:
   {
     "action": "CREATE_AGENDA",
     "payload": [
       { "startTime": "21:00", "endTime": "21:45", "title": "...", "desc": "...", "type": "creative", "xpReward": 50 }
     ]
   }

B. **ADD_TASK**: Add a single task to Base Ops.
   Use when user says "Remind me to call mom" or "Add task".
   Structure:
   {
     "action": "ADD_TASK",
     "payload": { "title": "...", "category": "admin", "xp": 15 }
   }

C. **COMPLETE_TASK**: Mark a task as done by searching its title (fuzzy match).
   Use when user says "I drank water" or "Done with dishes".
   Structure:
   {
     "action": "COMPLETE_TASK",
     "payload": { "searchTitle": "water" }
   }

RULES:
- If executing an action, output the JSON block at the END of your response.
- Keep the text response concise and "Gamer/Cyberpunk" themed.
- Types for Agenda: 'work', 'creative', 'transit', 'base', 'learning', 'sleep'.
`;

// USE LATEST EXPERIMENTAL MODEL - 2.0 Flash is the current state-of-the-art free model
const MODEL_NAME = 'gemini-2.0-flash-exp';

// DIRECT KEY INJECTION to bypass Vite/Vercel env issues
const API_KEY = "AIzaSyD9lsVMXwFZZIScX0OZ-II6dyu0UT3bGJI";

const getAIClient = () => {
    return new GoogleGenAI({ apiKey: API_KEY });
};

// --- CHAT & AGENT FUNCTION ---
export const sendMessageToGemini = async (
  history: { role: string; text: string }[], 
  message: string, 
  lang: Language,
  stats?: PlayerStats,
  projects?: ProjectCard[],
  agenda?: AgendaItem[],
  tasks?: DailyTask[],
  userProfile?: UserProfile
): Promise<string> => {
  try {
    const ai = getAIClient();
    
    // Add language instruction
    const langInstruction = lang === 'es' 
      ? "IMPORTANT: RESPOND IN SPANISH." 
      : "IMPORTANT: RESPOND IN ENGLISH.";

    // Build the Context Payload
    let contextData = "";
    
    if (userProfile) {
        contextData += `\nUSER PROFILE: Name: ${userProfile.name}`;
    }

    if (stats) {
        contextData += `\nSTATS: Level ${stats.level} | XP: ${stats.currentXP} | Streak: ${stats.streak} days`;
    }

    if (agenda && agenda.length > 0) {
        const simpleAgenda = agenda.map(i => `${i.startTime}-${i.endTime}: ${i.title} (${i.completed ? 'DONE' : 'TODO'})`).join(' | ');
        contextData += `\nCURRENT AGENDA: [ ${simpleAgenda} ]`;
    }

    if (projects && projects.length > 0) {
        const counts = { idea: 0, recording: 0, editing: 0, ready: 0 };
        projects.forEach(p => counts[p.status]++);
        contextData += `\nSTUDIO STATUS: Ideas:${counts.idea}, Recording:${counts.recording}, Editing:${counts.editing}, Ready:${counts.ready}`;
    }

    if (tasks && tasks.length > 0) {
        const pending = tasks.filter(t => !t.completed).map(t => t.title).join(', ');
        contextData += `\nPENDING BASE OPS: ${pending || "None! All clear."}`;
    }

    const systemInstruction = `${SYSTEM_INSTRUCTION_BASE}\n${langInstruction}\nCONTEXT DATA:\n${contextData}`;

    // Convert history to format expected by GenerateContent
    let fullPrompt = `${systemInstruction}\n\n`;
    history.forEach(msg => {
        fullPrompt += `${msg.role === 'user' ? 'USER' : 'MODEL'}: ${msg.text}\n`;
    });
    fullPrompt += `USER: ${message}`;

    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: { role: 'user', parts: [{ text: fullPrompt }] },
    });

    return response.text || (lang === 'es' ? "Error: Sin respuesta." : "Error: No response.");

  } catch (error) {
    console.error("Gemini Error:", error);
    return lang === 'es' 
        ? "⚠️ Error de conexión con el núcleo de IA. (Revisa tu API Key o conexión)" 
        : "⚠️ AI Core Connection Error. (Check API Key or Network)";
  }
};

// --- SCRIPT GENERATOR ---
export const generateVideoScript = async (project: ProjectCard, scriptData: ScriptData, lang: Language): Promise<string> => {
    try {
        const ai = getAIClient();
        const prompt = `
        ACT AS: Expert Viral Scriptwriter.
        TASK: Write a short video script (TikTok/Reels/Shorts).
        LANGUAGE: ${lang === 'es' ? 'Spanish' : 'English'}.
        
        PROJECT INFO:
        - Title: ${project.title}
        - Platform: ${project.platform}
        - Category: ${project.category}
        
        PARAMETERS:
        - Vibe: ${scriptData.vibe}
        - Goal: ${scriptData.goal}
        - Context/Story: ${scriptData.context}
        
        OUTPUT FORMAT:
        [HOOK] (0-3s): ...
        [BODY] (The story/content): ...
        [CTA] (Call to action): ...
        
        Keep it punchy, engaging, and under 60 seconds spoken.
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: { role: 'user', parts: [{ text: prompt }] }
        });

        return response.text || "";
    } catch (e) {
        console.error(e);
        return "Error generating script.";
    }
};

// --- LOOT GENERATOR ---
export const generateLootChallenge = async (lang: Language, context?: string): Promise<LootChallenge> => {
    try {
        const ai = getAIClient();
        const contextPrompt = context ? `CONTEXT: User is currently playing/doing: "${context}". Tailor the challenge to this.` : "CONTEXT: General gaming/productivity challenge.";
        
        const prompt = `
        ACT AS: Video Game Loot Box System.
        TASK: Generate a single procedural "Daily Challenge" for a streamer.
        LANGUAGE: ${lang === 'es' ? 'Spanish' : 'English'}.
        ${contextPrompt}
        
        OUTPUT JSON ONLY:
        {
            "title": "Short catchy title",
            "description": "Specific instruction (e.g. Win with only pistol / Edit for 1hr straight)",
            "xpReward": number (between 50 and 500 based on difficulty),
            "rarity": "common" | "rare" | "legendary"
        }
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: { role: 'user', parts: [{ text: prompt }] },
            config: { responseMimeType: 'application/json' }
        });

        const text = response.text || "{}";
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);

    } catch (e) {
        console.error(e);
        return {
            title: "System Glitch",
            description: "Connection failed. Free XP granted.",
            xpReward: 10,
            rarity: 'common'
        };
    }
};

// --- VISION ANALYSIS ---
export const analyzeThumbnail = async (base64Image: string, lang: Language): Promise<VisionAnalysis> => {
    try {
        const ai = getAIClient();
        
        // Clean base64 string
        const cleanBase64 = base64Image.split(',')[1] || base64Image;

        const prompt = `
        ACT AS: YouTube/Twitch CTR Expert.
        TASK: Analyze this thumbnail image.
        LANGUAGE: ${lang === 'es' ? 'Spanish' : 'English'}.
        
        OUTPUT JSON ONLY:
        {
            "score": number (0-100),
            "critique": "1 sentence summary of main issue or strength",
            "improvements": ["bullet point 1", "bullet point 2", "bullet point 3"]
        }
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: {
                role: 'user',
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } }
                ]
            },
            config: { responseMimeType: 'application/json' }
        });

        const text = response.text || "{}";
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);

    } catch (e) {
        console.error(e);
        return {
            score: 0,
            critique: "Vision Module Offline.",
            improvements: ["Check network connection", "Try a smaller image"]
        };
    }
};

// --- BRIEFING GENERATOR (TTS TEXT) ---
export const generateBriefing = async (agenda: AgendaItem[], stats: PlayerStats, lang: Language): Promise<string> => {
    try {
        const ai = getAIClient();
        
        const activeItem = agenda.find(i => !i.completed) || agenda[0];
        const nextTime = activeItem ? activeItem.startTime : "Unknown";
        const nextTitle = activeItem ? activeItem.title : "Rest";

        const prompt = `
        ACT AS: Military/Sci-Fi AI Ops Chief (Jarvis/Cortana style).
        TASK: Write a 2-sentence briefing for the user "Operator".
        LANGUAGE: ${lang === 'es' ? 'Spanish' : 'English'}.
        DATA:
        - Time: ${new Date().getHours()}:00
        - Next Mission: ${nextTitle} at ${nextTime}
        - Current Streak: ${stats.streak} days
        
        Keep it immersive, tactical, and motivating. No emojis. Just text for speech synthesis.
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: { role: 'user', parts: [{ text: prompt }] }
        });

        return response.text || (lang === 'es' ? "Sistemas listos. Adelante." : "Systems online. Good luck.");
    } catch (e) {
        return lang === 'es' ? "Error generando briefing." : "Briefing generation error.";
    }
};

// --- DEBRIEF PROCESSOR ---
export const processDebrief = async (transcript: string, lang: Language): Promise<{itemsToAdd: string[], itemsToRemove: string[]}> => {
    try {
        const ai = getAIClient();
        const prompt = `
        ACT AS: Stream Manager AI.
        TASK: Analyze this post-stream debrief log and update the checklist.
        TRANSCRIPT: "${transcript}"
        
        If user mentions something failed (e.g. "mic was muted", "forgot water"), ADD it to checklist.
        If user mentions something is no longer needed (e.g. "don't need light"), REMOVE it.
        
        OUTPUT JSON ONLY:
        {
            "itemsToAdd": ["Check Mic Mute", "Bring Water"],
            "itemsToRemove": ["Old Item"]
        }
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: { role: 'user', parts: [{ text: prompt }] },
            config: { responseMimeType: 'application/json' }
        });

        const text = response.text || "{}";
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (e) {
        return { itemsToAdd: [], itemsToRemove: [] };
    }
};

// --- STREAM TITLE GENERATOR ---
export const generateStreamTitles = async (game: string, vibe: string, lang: Language): Promise<string[]> => {
    try {
        const ai = getAIClient();
        const prompt = `
        ACT AS: Twitch/Kick Clickbait Expert.
        TASK: Generate 3 viral stream titles.
        GAME/TOPIC: ${game}
        VIBE: ${vibe}
        LANGUAGE: ${lang === 'es' ? 'Spanish' : 'English'}.
        
        OUTPUT FORMAT: Just 3 lines of text. No numbers, no quotes.
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: { role: 'user', parts: [{ text: prompt }] }
        });

        const text = response.text || "";
        return text.split('\n').filter(line => line.trim().length > 0).slice(0, 3);
    } catch (e) {
        return ["Error generating titles", "Try manual entry", "System Offline"];
    }
};
