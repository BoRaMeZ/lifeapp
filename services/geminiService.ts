
import { GoogleGenAI } from "@google/genai";
import { Language, PlayerStats, ProjectCard, AgendaItem, UserProfile, DailyTask, ScriptData } from "../types";

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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
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
        contextData += `\nSTATS: Level ${stats.level}, XP ${stats.currentXP}, Streak ${stats.streak} days.`;
    }

    if (projects) {
        const ideas = projects.filter(p => p.status === 'idea').map(p => p.title).join(', ');
        const recording = projects.filter(p => p.status === 'recording').map(p => p.title).join(', ');
        const editing = projects.filter(p => p.status === 'editing').map(p => p.title).join(', ');
        
        contextData += `\nKANBAN STATUS:
        - Ideas: [${ideas}]
        - Recording: [${recording}]
        - Editing: [${editing}]`;
    }

    if (agenda) {
        const agendaSummary = agenda.map(i => `${i.startTime}-${i.endTime}: ${i.title} (${i.completed ? 'DONE' : 'PENDING'})`).join('\n');
        contextData += `\nCURRENT AGENDA:\n${agendaSummary}`;
    }

    if (tasks) {
        const tasksSummary = tasks.map(t => `- ${t.title} (${t.completed ? 'DONE' : 'PENDING'})`).join('\n');
        contextData += `\nBASE OPS TASKS:\n${tasksSummary}`;
    }

    const finalSystemInstruction = `${SYSTEM_INSTRUCTION_BASE}\n${langInstruction}\n\n=== LIVE SYSTEM DATA ===${contextData}`;
    
    const model = 'gemini-2.5-flash';
    
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: finalSystemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
    });

    const result = await chat.sendMessage({
      message: message 
    });

    return result.text || (lang === 'es' ? "Sistema Offline." : "System Offline.");
  } catch (error) {
    console.error("Gemini Error:", error);
    return lang === 'es' 
      ? "Error de conexión con el Núcleo de IA." 
      : "Connection failure with AI Core.";
  }
};

export const generateVideoScript = async (
  project: ProjectCard, 
  scriptData: ScriptData, 
  lang: Language
): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const model = 'gemini-2.5-flash';

        const langInstruction = lang === 'es' ? 'Output strictly in Spanish.' : 'Output strictly in English.';
        
        const prompt = `
        ACT AS A VIRAL CONTENT SCREENWRITER FOR ${project.platform.toUpperCase()}.
        ${langInstruction}
        
        PROJECT: "${project.title}"
        CATEGORY: ${project.category}
        
        CONTEXT/IDEA: ${scriptData.context}
        VIBE: ${scriptData.vibe}
        GOAL: ${scriptData.goal}
        
        OUTPUT FORMAT:
        Write a concise script with 3 sections:
        1. **HOOK (0-3s)**: Grab attention immediately.
        2. **BODY**: The main content/story. Keep it tight.
        3. **CTA**: Call to action based on the goal.
        
        Use markdown. Keep it ready to read while recording.
        `;

        const result = await ai.models.generateContent({
            model: model,
            contents: prompt
        });

        return result.text || (lang === 'es' ? "Error al generar guion." : "Error generating script.");
    } catch (e) {
        console.error("Script Gen Error", e);
        return lang === 'es' ? "Error de conexión." : "Connection Error.";
    }
}

export const generateStreamTitles = async (
    game: string,
    vibe: string,
    lang: Language
): Promise<string[]> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const model = 'gemini-2.5-flash';
        const langInstruction = lang === 'es' ? 'Output strictly in Spanish.' : 'Output strictly in English.';

        const prompt = `
        Generate 3 CLICKBAIT stream titles for KICK/TWITCH.
        GAME/TOPIC: ${game}
        VIBE: ${vibe}
        ${langInstruction}

        Rules:
        - Use CAPS lock for emphasis.
        - Include 1 emoji per title.
        - Keep it under 60 chars.
        - Return ONLY the 3 titles separated by a pipe character "|".
        Example: ROAD TO UNREAL 🏆 | CRANKING 90s NO SLEEP ⚡ | DROPPING 20 BOMBS 💣
        `;

        const result = await ai.models.generateContent({
            model: model,
            contents: prompt
        });

        const text = result.text || "";
        const titles = text.split('|').map(t => t.trim()).filter(t => t.length > 0);
        return titles.length > 0 ? titles : ["Stream Title 1", "Stream Title 2", "Stream Title 3"];

    } catch (e) {
        return ["Error generating titles", "Try again", "System Offline"];
    }
}
