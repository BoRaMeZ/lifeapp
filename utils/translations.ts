
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
      currentLevel: 'Rank',
      noviceStreamer: 'Operative',
      xp: 'XP',
      target: 'Next Rank',
      loginStreak: 'Sync Streak',
      days: 'Days',
      consistency: 'Consistency is power.',
      nextBlock: 'Next Mission',
      objective: 'Objective: Check Studio board.',
      xpDist: 'Performance Radar',
      activeMissions: 'Active Missions',
      badges: 'Medals',
      locked: 'Locked',
      completed: 'Completed',
      remaining: 'Remaining',
      toLevel: 'to Level',
      goLive: 'INITIATE STREAM',
      prepStream: 'PREP SEQUENCE',
      goLiveDesc: 'Launch Protocol',
      activeQuest: 'ACTIVE QUEST',
      upcomingQuest: 'UPCOMING DEPLOYMENT',
      noActiveQuest: 'SYSTEM IDLE - Awaiting Orders',
      startsIn: 'T-Minus',
      attributes: {
          creativity: 'CRE',
          discipline: 'DIS',
          vitality: 'VIT',
          focus: 'FOC',
          technique: 'TEC'
      },
      attributeDesc: {
        creativity: 'Boost via Studio Projects',
        discipline: 'Boost via Base Ops Tasks',
        vitality: 'Boost via Leveling Up',
        focus: 'Boost via Login Streak',
        technique: 'Boost via Unlocking Badges'
      },
      heatmap: 'Activity Log'
    },
    agenda: {
      title: 'Tactical Timeline',
      startTimer: 'Focus Protocol',
      addBlock: 'Assign Mission',
      nowActive: 'ENGAGED',
      empty: 'No missions scheduled. Assign a block to start.',
      modal: {
        title: 'New Time Block',
        name: 'Mission Name',
        desc: 'Briefing',
        start: 'Start Time',
        end: 'End Time',
        type: 'Energy Type',
        isStream: '🔴 IS THIS A STREAM?',
        save: 'Confirm Block',
        cancel: 'Abort'
      },
      types: {
        work: 'Core Grind (Low XP)',
        creative: 'Crafting (High XP)',
        transit: 'Fast Travel',
        base: 'Base Ops',
        learning: 'Intel Gathering',
        sleep: 'Stasis / Recharge'
      },
      items: {
        work: { title: 'The Grind', desc: 'Maintain cover. Save energy.' },
        transit: { title: 'Fast Travel', desc: 'Audio logs/Podcasts. No doomscrolling.' },
        base: { title: 'Base Resupply', desc: 'Shower, food, loot sort. No screens.' },
        creative: { title: 'Skill Up: Creation', desc: 'Single task focus: Edit or Design.' },
        learning: { title: 'Intel Gathering', desc: 'Analyze pro gameplay or tutorials.' },
        sleep: { title: 'System Shutdown', desc: 'Restoration mode.' },
      }
    },
    studio: {
      title: 'Content Studio',
      subtitle: "Pipeline Management. 1 Card/Day Strategy.",
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
        recording: 'To Record',
        editing: 'Processing',
        ready: 'Deployment Ready',
      },
      actions: {
        move: 'Advance',
        delete: 'Archive',
        confirmBack: 'Regression? XP gained will be reverted.',
        confirmDelete: 'Delete Project? Accumulated XP will be deducted.'
      },
      detail: {
        tabs: { details: 'Specs', script: 'AI Script' },
        mentalBlock: 'Creative Unblock',
        vibe: 'Tone / Vibe',
        context: 'Scenario (Context)',
        goal: 'Objective',
        generate: 'Generate Script',
        generating: 'Compiling...',
        scriptLabel: 'Output Script',
        waiting: 'Awaiting input parameters...',
        save: 'Save Config',
        close: 'Dismiss',
        options: {
            vibe: {
                funny: 'Funny / High Energy',
                serious: 'Serious / Educational',
                rage: 'Rage / Gamer Moment',
                chill: 'Chill / Storytime',
                epic: 'Epic / Montage'
            },
            goal: {
                engagement: 'Engagement',
                viral: 'Virality',
                followers: 'Recruitment',
                sales: 'Loot/Promo'
            }
        }
      }
    },
    baseOps: {
      title: 'Base Operations',
      subtitle: 'Maintenance Protocols',
      burnoutWarning: 'Complete routine to prevent "Burnout" debuff.',
      resetMsg: 'Tasks reset for new cycle',
      add: 'Add Routine',
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
      title: 'Tactical AI Coach',
      status: 'Online • Systems Nominal',
      analyzing: 'Calculating...',
      placeholder: "Awaiting orders...",
      initialMsg: "KAIROS OS Online. Tracking biometrics. What is the mission plan?",
      actions: {
        plan: 'Auto-Schedule',
        ideas: 'Gen Ideas',
        status: 'Sys Check'
      },
      mic: {
        listening: 'Receiving Audio...',
        error: 'Comms Error',
        unsupported: 'Hardware Not Supported'
      }
    },
    badges: {
      streak3: 'Consistency Rookie (3 Days)',
      streak7: 'Algorithm Favorite (7 Days)',
      level5: 'Affiliate Status (Lvl 5)',
      xp1000: 'Content Machine (1k XP)'
    },
    settings: {
      title: 'System Config',
      profile: 'Operative Profile',
      name: 'Codename',
      avatar: 'Avatar URL',
      themes: 'Visual Interface',
      backup: 'Data Persistence',
      export: 'Export Data',
      import: 'Import Data',
      danger: 'Dead Zone',
      resetXP: 'Reset Rank',
      factoryReset: 'System Wipe',
      close: 'Exit Config'
    },
    levelUp: {
      congrats: 'RANK UP!',
      reached: 'New Clearance Level',
      continue: 'Continue Mission'
    },
    focus: {
      title: 'BUNKER MODE',
      complete: 'SESSION COMPLETE',
      bonus: 'Bonus XP Gained',
      stop: 'Abort Mission',
      resume: 'Resume',
      pause: 'Pause',
      locked: 'TARGET LOCKED. DISTRACTIONS DISABLED.',
      ready: 'READY TO ENGAGE?'
    },
    stream: {
        title: 'LAUNCHPAD',
        checklist: 'Pre-Flight Checklist',
        generate: 'Generate Titles',
        gamePlaceholder: 'Game/Topic',
        vibePlaceholder: 'Vibe',
        btnGenerate: 'Run Title Gen',
        generating: 'Thinking...',
        items: {
            water: 'Hydration (Water Bottle)',
            obs: 'OBS Scene Check',
            mic: 'Mic Test (No Mute)',
            lights: 'Lighting ON',
            socials: 'Social Notification Posted'
        },
        addItem: 'Add item...',
        add: 'Add',
        onAir: 'ON AIR',
        drinkReminder: 'HYDRATE',
        end: 'END TRANSMISSION'
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
      currentLevel: 'Rango',
      noviceStreamer: 'Operador',
      xp: 'XP',
      target: 'Siguiente',
      loginStreak: 'Racha Sinc',
      days: 'Días',
      consistency: 'La constancia es poder.',
      nextBlock: 'Siguiente Misión',
      objective: 'Objetivo: Revisar tablero.',
      xpDist: 'Radar de Rendimiento',
      activeMissions: 'Misiones Activas',
      badges: 'Medallas',
      locked: 'Bloqueado',
      completed: 'Completado',
      remaining: 'Restante',
      toLevel: 'para Nivel',
      goLive: 'INICIAR TRANSMISIÓN',
      prepStream: 'SECUENCIA DE PREPARACIÓN',
      goLiveDesc: 'Protocolo de Lanzamiento',
      activeQuest: 'MISIÓN ACTIVA',
      upcomingQuest: 'DESPLIEGUE INMINENTE',
      noActiveQuest: 'SISTEMA EN ESPERA - Asigna tarea',
      startsIn: 'T-Menos',
      attributes: {
          creativity: 'CRE',
          discipline: 'DIS',
          vitality: 'VIT',
          focus: 'ENF',
          technique: 'TEC'
      },
      attributeDesc: {
        creativity: 'Sube creando Proyectos en Studio',
        discipline: 'Sube con Rutinas Diarias en Ops',
        vitality: 'Sube al alcanzar nuevo Nivel',
        focus: 'Sube manteniendo tu Racha diaria',
        technique: 'Sube desbloqueando nuevas Medallas'
      },
      heatmap: 'Registro de Actividad'
    },
    agenda: {
      title: 'Línea Temporal Táctica',
      startTimer: 'Protocolo Foco',
      addBlock: 'Asignar Misión',
      nowActive: 'EN CURSO',
      empty: 'Sin misiones. Asigna un bloque para iniciar.',
      modal: {
        title: 'Nueva Misión',
        name: 'Nombre Misión',
        desc: 'Briefing',
        start: 'Hora Inicio',
        end: 'Hora Fin',
        type: 'Tipo de Energía',
        isStream: '🔴 ¿ES UNA TRANSMISIÓN?',
        save: 'Confirmar',
        cancel: 'Abortar'
      },
      types: {
        work: 'Grind Principal (Baja XP)',
        creative: 'Crafteo (Alta XP)',
        transit: 'Viaje Rápido',
        base: 'Ops Base',
        learning: 'Inteligencia',
        sleep: 'Éxtasis / Recarga'
      },
      items: {
        work: { title: 'El Grind', desc: 'Mantener perfil bajo. Ahorrar energía.' },
        transit: { title: 'Viaje Rápido', desc: 'Audio logs/Podcasts. NO doomscrolling.' },
        base: { title: 'Reabastecimiento', desc: 'Ducha, comida, loot. Sin pantallas.' },
        creative: { title: 'Skill Up: Creación', desc: 'Foco único: Editar o Diseñar.' },
        learning: { title: 'Inteligencia', desc: 'Analizar gameplay pro o tutoriales.' },
        sleep: { title: 'Apagado del Sistema', desc: 'Modo restauración.' },
      }
    },
    studio: {
      title: 'Estudio de Contenido',
      subtitle: "Gestión de Pipeline. Estrategia 1 Carta/Día.",
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
        recording: 'Para Grabar',
        editing: 'Procesando',
        ready: 'Listo para Despliegue',
      },
      actions: {
        move: 'Avanzar',
        delete: 'Archivar',
        confirmBack: '¿Regresión? Se revertirá la XP ganada.',
        confirmDelete: '¿Eliminar Proyecto? Se descontará la XP acumulada.'
      },
      detail: {
        tabs: { details: 'Specs', script: 'IA Guionista' },
        mentalBlock: 'Desbloqueo Creativo',
        vibe: 'Vibe / Tono',
        context: 'Escenario (Contexto)',
        goal: 'Objetivo',
        generate: 'Generar Guion',
        generating: 'Compilando...',
        scriptLabel: 'Salida de Guion',
        waiting: 'Esperando parámetros...',
        save: 'Guardar Config',
        close: 'Cerrar',
        options: {
            vibe: {
                funny: 'Gracioso / Alta Energía',
                serious: 'Serio / Educativo',
                rage: 'Rage / Momento Gamer',
                chill: 'Chill / Storytime',
                epic: 'Épico / Montaje'
            },
            goal: {
                engagement: 'Engagement',
                viral: 'Viralidad',
                followers: 'Reclutamiento',
                sales: 'Loot/Promo'
            }
        }
      }
    },
    baseOps: {
      title: 'Operaciones Base',
      subtitle: 'Protocolos de Mantenimiento',
      burnoutWarning: 'Completa para evitar debuff de "Burnout".',
      resetMsg: 'Tareas reiniciadas por nuevo ciclo',
      add: 'Añadir Rutina',
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
      title: 'Coach Táctico IA',
      status: 'En Línea • Sistemas Nominales',
      analyzing: 'Calculando...',
      placeholder: "Esperando órdenes...",
      initialMsg: "KAIROS OS En Línea. Rastreando biométricos. ¿Cuál es el plan de misión?",
      actions: {
        plan: 'Auto-Agenda',
        ideas: 'Gen Ideas',
        status: 'Check Estado'
      },
      mic: {
        listening: 'Recibiendo Audio...',
        error: 'Error de Comms',
        unsupported: 'Hardware No Soportado'
      }
    },
    badges: {
      streak3: 'Novato Constante (3 Días)',
      streak7: 'Favorito del Algoritmo (7 Días)',
      level5: 'Status Afiliado (Nvl 5)',
      xp1000: 'Máquina de Contenido (1k XP)'
    },
    settings: {
      title: 'Configuración de Sistema',
      profile: 'Perfil de Operador',
      name: 'Nombre Clave',
      avatar: 'URL del Avatar',
      themes: 'Interfaz Visual',
      backup: 'Persistencia de Datos',
      export: 'Exportar Datos',
      import: 'Importar Datos',
      danger: 'Zona Muerta',
      resetXP: 'Reiniciar Rango',
      factoryReset: 'Borrado de Sistema',
      close: 'Salir Config'
    },
    levelUp: {
      congrats: '¡RANGO SUBIDO!',
      reached: 'Nuevo Nivel de Acceso',
      continue: 'Continuar Misión'
    },
    focus: {
      title: 'MODO BÚNKER',
      complete: 'SESIÓN COMPLETADA',
      bonus: 'Bonus XP Ganado',
      stop: 'Abortar Misión',
      resume: 'Reanudar',
      pause: 'Pausar',
      locked: 'OBJETIVO FIJADO. DISTRACCIONES DESACTIVADAS.',
      ready: '¿LISTO PARA INICIAR?'
    },
    stream: {
        title: 'PLATAFORMA DESPEGUE',
        checklist: 'Checklist Pre-Vuelo',
        generate: 'Generar Títulos',
        gamePlaceholder: 'Juego/Tema',
        vibePlaceholder: 'Vibe',
        btnGenerate: 'Ejecutar Gen Títulos',
        generating: 'Pensando...',
        items: {
            water: 'Hidratación (Botella)',
            obs: 'Revisar Escena OBS',
            mic: 'Test Micro (No Mute)',
            lights: 'Luces ON',
            socials: 'Notificación Publicada'
        },
        addItem: 'Añadir ítem...',
        add: 'Añadir',
        onAir: 'EN VIVO',
        drinkReminder: 'HIDRATAR',
        end: 'FINALIZAR TRANSMISIÓN'
    }
  }
};

export const getTranslation = (lang: Language) => translations[lang];
