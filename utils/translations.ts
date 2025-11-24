
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
        confirmBack: 'Move back to previous stage? XP gained will be reverted.',
        confirmDelete: 'Delete Project? Accumulated XP will be deducted.'
      },
      detail: {
        tabs: { details: 'Details', script: 'AI Script' },
        mentalBlock: 'Mental Block Cure',
        vibe: 'Vibe / Tone',
        context: 'What happens? (Context)',
        goal: 'Goal',
        generate: 'Generate Script with AI',
        generating: 'Writing script...',
        scriptLabel: 'Generated Script',
        save: 'Save Project',
        close: 'Close'
      }
    },
    baseOps: {
      title: 'Base Operations',
      subtitle: 'Daily Maintenance',
      burnoutWarning: 'Complete routine to prevent "Burnout" debuff.',
      resetMsg: 'Tasks reset for new day',
      add: 'Add Task',
      modal: {
        title: 'New Routine Task',
        name: 'Task Name',
        category: 'Category',
        xp: 'XP Reward',
        save: 'Add Routine',
        cancel: 'Cancel'
      },
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
      initialMsg: "Greetings. I am StreamOS v4.0. I am now tracking your real-time progress. How can I assist with your schedule today?",
      actions: {
        plan: 'Plan Day',
        ideas: 'Viral Ideas',
        status: 'Status Check'
      },
      mic: {
        listening: 'Listening...',
        error: 'Mic Error',
        unsupported: 'Browser Not Supported'
      }
    },
    badges: {
      streak3: 'Consistency Rookie (3 Days)',
      streak7: 'Algorithm Favorite (7 Days)',
      level5: 'Affiliate Status (Lvl 5)',
      xp1000: 'Content Machine (1k XP)'
    },
    settings: {
      title: 'System Settings',
      profile: 'Operative Profile',
      name: 'Codename',
      avatar: 'Avatar URL',
      themes: 'Visual Theme',
      backup: 'Data Persistence',
      export: 'Export Backup',
      import: 'Import Backup',
      danger: 'Danger Zone',
      resetXP: 'Reset XP/Level',
      factoryReset: 'Factory Reset (Wipe All)',
      close: 'Close Panel'
    },
    levelUp: {
      congrats: 'LEVEL UP!',
      reached: 'You have reached Level',
      continue: 'Continue The Grind'
    },
    focus: {
      title: 'FOCUS MODE',
      complete: 'SESSION COMPLETE',
      bonus: 'Bonus XP Gained',
      stop: 'Abort Mission',
      resume: 'Resume',
      pause: 'Pause'
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
      startTimer: 'Búnker',
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
        confirmBack: '¿Retroceder etapa? Se revertirá la XP ganada.',
        confirmDelete: '¿Eliminar Proyecto? Se descontará la XP acumulada.'
      },
      detail: {
        tabs: { details: 'Detalles', script: 'IA Guionista' },
        mentalBlock: 'Cura de Bloqueo Mental',
        vibe: 'Vibe / Tono',
        context: '¿Qué ocurre? (Contexto)',
        goal: 'Objetivo',
        generate: 'Generar Guion con IA',
        generating: 'Escribiendo guion...',
        scriptLabel: 'Guion Generado',
        save: 'Guardar Proyecto',
        close: 'Cerrar'
      }
    },
    baseOps: {
      title: 'Operaciones Base',
      subtitle: 'Mantenimiento Diario',
      burnoutWarning: 'Completa la rutina para evitar el debuff de "Burnout".',
      resetMsg: 'Tareas reiniciadas por nuevo día',
      add: 'Añadir Tarea',
      modal: {
        title: 'Nueva Tarea de Rutina',
        name: 'Nombre Tarea',
        category: 'Categoría',
        xp: 'Recompensa XP',
        save: 'Añadir Rutina',
        cancel: 'Cancelar'
      },
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
      initialMsg: "Saludos. Soy StreamOS v4.0. Ahora estoy rastreando tu progreso real. ¿Cómo puedo ayudarte con tu agenda hoy?",
      actions: {
        plan: 'Planificar Día',
        ideas: 'Ideas Virales',
        status: 'Análisis Estado'
      },
      mic: {
        listening: 'Escuchando...',
        error: 'Error de Micro',
        unsupported: 'Navegador No Soportado'
      }
    },
    badges: {
      streak3: 'Novato Constante (3 Días)',
      streak7: 'Favorito del Algoritmo (7 Días)',
      level5: 'Status Afiliado (Nvl 5)',
      xp1000: 'Máquina de Contenido (1k XP)'
    },
    settings: {
      title: 'Configuración del Sistema',
      profile: 'Perfil de Operador',
      name: 'Nombre Clave',
      avatar: 'URL del Avatar',
      themes: 'Tema Visual',
      backup: 'Persistencia de Datos',
      export: 'Exportar Backup',
      import: 'Importar Backup',
      danger: 'Zona de Peligro',
      resetXP: 'Reiniciar XP/Nivel',
      factoryReset: 'Restablecimiento de Fábrica (Borrar Todo)',
      close: 'Cerrar Panel'
    },
    levelUp: {
      congrats: '¡SUBIDA DE NIVEL!',
      reached: 'Has alcanzado el Nivel',
      continue: 'Continuar el Grind'
    },
    focus: {
      title: 'MODO BÚNKER',
      complete: 'SESIÓN COMPLETADA',
      bonus: 'Bonus XP Ganado',
      stop: 'Abortar Misión',
      resume: 'Reanudar',
      pause: 'Pausar'
    }
  }
};

export const getTranslation = (lang: Language) => translations[lang];
