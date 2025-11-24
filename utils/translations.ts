
import { Language } from '../types';

export const translations = {
  en: {
    nav: {
      dashboard: 'CMD Center',
      agenda: 'Timeline',
      studio: 'Studio',
      baseOps: 'Base Ops',
      aiCoach: 'Coach AI',
    },
    dashboard: {
      currentLevel: 'Current Level',
      noviceStreamer: 'Urban Ninja',
      xp: 'XP',
      target: 'Target',
      loginStreak: 'Login Streak',
      days: 'Days',
      consistency: 'Consistency is key to the algorithm.',
      nextBlock: 'Next Energy Block',
      objective: 'Objective: Check Studio board for tasks.',
      xpDist: 'Weekly XP Distribution',
      activeMissions: 'Active Missions',
      badges: 'Achievements',
      locked: 'Locked',
      completed: 'Completed',
      remaining: 'Remaining',
      toLevel: 'to Level',
    },
    agenda: {
      title: 'Tactical Timeline',
      startTimer: 'Start Timer',
      addBlock: 'Add Time Block',
      empty: 'No schedule defined. Add a block to start.',
      modal: {
        title: 'New Time Block',
        name: 'Task Name',
        desc: 'Description',
        start: 'Start Time',
        end: 'End Time',
        type: 'Energy Type',
        save: 'Save Block',
        cancel: 'Cancel'
      },
      types: {
        work: 'Work (Low XP)',
        creative: 'Creative (High XP)',
        transit: 'Transit',
        base: 'Base Ops',
        learning: 'Learning',
        sleep: 'Rest'
      },
      items: {
        work: { title: 'The Grind (Work)', desc: 'Keep head down. Save energy.' },
        transit: { title: 'Commute & Decompress', desc: 'Listen to music/podcasts. Do NOT doomscroll.' },
        base: { title: 'Arrival & Reset', desc: 'Shower, food, change clothes. No screens.' },
        creative: { title: 'Power Block: Creation', desc: 'One task only: Clip editing OR Thumbnail design.' },
        learning: { title: 'Power Block: Learning', desc: 'Watch 1 tutorial or analyze 1 pro streamer.' },
        sleep: { title: 'System Shutdown', desc: 'Pack bag, sleep.' },
      }
    },
    studio: {
      title: 'Content Studio',
      subtitle: "Manage your content pipeline. Move one card per day.",
      newIdea: 'New Project',
      emptySlot: 'No active projects.',
      addModal: {
        title: 'New Content Idea',
        inputTitle: 'Title (e.g., "Funny Fail")',
        inputCategory: 'Category (e.g., Fortnite)',
        btnCancel: 'Cancel',
        btnCreate: 'Initialize Project',
      },
      cols: {
        idea: 'Ideas Bank',
        recording: 'To Clip/Record',
        editing: 'In Editing',
        ready: 'Ready to Upload',
      },
      actions: {
        move: 'Move',
        delete: 'Archive',
        confirmBack: 'Move back to previous stage? XP gained will be reverted.'
      }
    },
    baseOps: {
      title: 'Base Operations',
      subtitle: 'Daily Maintenance',
      burnoutWarning: 'Complete routine to prevent "Burnout" debuff.',
      resetMsg: 'Tasks reset for new day',
      tasks: {
        t1: 'Dishes Cleared',
        t2: 'Backpack Packed',
        t3: 'Outfit Laid Out',
        t4: 'Drink Water',
        t5: 'Desk Wipe (5min)',
      }
    },
    aiCoach: {
      title: 'Strategy Coach AI',
      status: 'Online • Systems Nominal',
      analyzing: 'Analyzing data...',
      placeholder: "Ask StreamOS for tactics...",
      initialMsg: "Greetings. I am StreamOS v3.0. I am now tracking your real-time progress. How can I assist with your schedule today?",
    },
    badges: {
      streak3: 'Consistency Rookie (3 Days)',
      streak7: 'Algorithm Favorite (7 Days)',
      level5: 'Affiliate Status (Lvl 5)',
      xp1000: 'Content Machine (1k XP)'
    }
  },
  es: {
    nav: {
      dashboard: 'Centro CMD',
      agenda: 'Cronología',
      studio: 'Estudio',
      baseOps: 'Ops Base',
      aiCoach: 'Coach IA',
    },
    dashboard: {
      currentLevel: 'Nivel Actual',
      noviceStreamer: 'Ninja Urbano',
      xp: 'XP',
      target: 'Meta',
      loginStreak: 'Racha Login',
      days: 'Días',
      consistency: 'La constancia es clave para el algoritmo.',
      nextBlock: 'Siguiente Bloque',
      objective: 'Objetivo: Revisar tablero de Estudio.',
      xpDist: 'Distribución Semanal de XP',
      activeMissions: 'Misiones Activas',
      badges: 'Logros',
      locked: 'Bloqueado',
      completed: 'Completado',
      remaining: 'Restante',
      toLevel: 'para Nivel',
    },
    agenda: {
      title: 'Línea Temporal Táctica',
      startTimer: 'Iniciar Timer',
      addBlock: 'Añadir Bloque',
      empty: 'Agenda vacía. Añade un bloque para empezar.',
      modal: {
        title: 'Nuevo Bloque de Tiempo',
        name: 'Nombre Tarea',
        desc: 'Descripción',
        start: 'Hora Inicio',
        end: 'Hora Fin',
        type: 'Tipo de Energía',
        save: 'Guardar Bloque',
        cancel: 'Cancelar'
      },
      types: {
        work: 'Trabajo (Baja XP)',
        creative: 'Creativo (Alta XP)',
        transit: 'Tránsito',
        base: 'Ops Base',
        learning: 'Aprendizaje',
        sleep: 'Descanso'
      },
      items: {
        work: { title: 'El Grind (Trabajo)', desc: 'Cabeza abajo. Ahorra energía.' },
        transit: { title: 'Transporte y Descompresión', desc: 'Música/Podcasts. NO hagas doomscrolling.' },
        base: { title: 'Llegada y Reinicio', desc: 'Ducha, comida, cambio de ropa. Sin pantallas.' },
        creative: { title: 'Bloque de Poder: Creación', desc: 'Solo una tarea: Editar clip O diseñar miniatura.' },
        learning: { title: 'Bloque de Poder: Aprendizaje', desc: 'Ver 1 tutorial o analizar a 1 streamer pro.' },
        sleep: { title: 'Apagado del Sistema', desc: 'Preparar mochila, dormir.' },
      }
    },
    studio: {
      title: 'Estudio de Contenido',
      subtitle: "Gestiona tu flujo. Mueve una tarjeta por día.",
      newIdea: 'Nuevo Proyecto',
      emptySlot: 'Sin proyectos activos.',
      addModal: {
        title: 'Nueva Idea de Contenido',
        inputTitle: 'Título (ej. "Fail Gracioso")',
        inputCategory: 'Categoría (ej. Fortnite)',
        btnCancel: 'Cancelar',
        btnCreate: 'Inicializar Proyecto',
      },
      cols: {
        idea: 'Banco de Ideas',
        recording: 'Grabar/Clipear',
        editing: 'En Edición',
        ready: 'Listo para Subir',
      },
      actions: {
        move: 'Mover',
        delete: 'Archivar',
        confirmBack: '¿Retroceder etapa? Se revertirá la XP ganada.'
      }
    },
    baseOps: {
      title: 'Operaciones Base',
      subtitle: 'Mantenimiento Diario',
      burnoutWarning: 'Completa la rutina para evitar el debuff de "Burnout".',
      resetMsg: 'Tareas reiniciadas por nuevo día',
      tasks: {
        t1: 'Platos Lavados',
        t2: 'Mochila Lista',
        t3: 'Ropa Preparada',
        t4: 'Beber Agua',
        t5: 'Limpiar Escritorio',
      }
    },
    aiCoach: {
      title: 'Coach de Estrategia',
      status: 'En Línea • Sistemas Nominales',
      analyzing: 'Analizando datos...',
      placeholder: "Pide tácticas a StreamOS...",
      initialMsg: "Saludos. Soy StreamOS v3.0. Ahora estoy rastreando tu progreso real. ¿Cómo puedo ayudarte con tu agenda hoy?",
    },
    badges: {
      streak3: 'Novato Constante (3 Días)',
      streak7: 'Favorito del Algoritmo (7 Días)',
      level5: 'Status Afiliado (Nvl 5)',
      xp1000: 'Máquina de Contenido (1k XP)'
    }
  }
};

export const getTranslation = (lang: Language) => translations[lang];
