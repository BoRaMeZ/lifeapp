
StreamLife OS v3.1.0 - DOCUMENTACIÓN TÉCNICA Y DE DISEÑO
=========================================================

1. VISIÓN Y CONCEPTO
--------------------
StreamLife OS es un "Dashboard de Productividad Gamificado" diseñado específicamente para el perfil "Ninja Urbano": una persona con trabajo a tiempo completo (8:30 AM - 7:30 PM) que aspira a ser creador de contenido (Streamer/Youtuber) optimizando sus escasas horas libres (9:00 PM - 11:00 PM).

El objetivo no es gestionar el tiempo, sino gestionar la ENERGÍA. La interfaz elimina la fricción cognitiva mediante un diseño inmersivo y mecánicas de videojuego (RPG).

2. SISTEMA DE DISEÑO VISUAL (UI/UX)
-----------------------------------
A. Atmósfera Cyberpunk
   - La interfaz simula un terminal futurista para que el usuario sienta que "entra en la zona" al abrir la app.
   - Modo Oscuro Profundo: Reduce la fatiga visual nocturna.

B. Paleta de Colores (Tailwind config)
   - Fondo Principal: #050b14 (Casi negro, profundidad espacial).
   - Paneles/Tarjetas: #1e293b (Slate-800) con bordes translúcidos.
   - Acentos de Estado:
     * Cyan (#06b6d4): Información, Tecnología, Progreso (Agenda Creativa).
     * Purple (#8b5cf6): Logros, Magia, Niveles (Studio/AI).
     * Green (#10b981): Completado, Dinero, Salud (Base Ops).
     * Pink (#ec4899): Urgencia, Rachas, Pasión (Streaming).

C. Tipografía
   - Encabezados: 'Orbitron' (Sans-serif geométrica, estilo Sci-Fi).
   - Cuerpo: 'Inter' (Alta legibilidad para listas y textos largos).

D. Elementos de Interfaz
   - Bordes: Finos (1px), a menudo con opacidad reducida.
   - Sombras: Resplandores (Glows) de color en lugar de sombras negras tradicionales.
   - Iconografía: Librería 'Lucide-React' para consistencia minimalista.

3. ARQUITECTURA DE GAMIFICACIÓN (CORE MECHANICS)
------------------------------------------------
El núcleo de la app es transformar tareas aburridas en "Misiones" que otorgan recompensas inmediatas.

A. Sistema de XP (Experiencia)
   - Fórmula de Nivel: El XP necesario para el siguiente nivel aumenta progresivamente (NextLevelXP * 1.5).
   - Fuentes de XP:
     * Tareas Domésticas (Base Ops): +10 a +30 XP.
     * Agenda (Bloques de Tiempo): +10 (Tránsito) a +100 XP (Creativo).
     * Proyectos (Studio): +10 (Idea), +20 (Edición), +50 (Finalizado).

B. Economía Reversible (Anti-Exploit)
   - Lógica de "Suma Cero": Para mantener la integridad del juego, cualquier acción revertida resta la XP ganada originalmente.
     * Desmarcar tarea en Agenda/BaseOps: Resta la XP otorgada.
     * Borrar tarea completada: Resta la XP antes de eliminarla.
     * Retroceder proyecto en Studio: Resta la XP de la etapa avanzada.
   - Protección de Nivel: El sistema impide que la XP actual baje de 0 visualmente.

C. Sistema de Rachas (Streak)
   - Verificación al inicio (App.tsx): Compara la fecha actual con 'lastLoginDate'.
     * Si es el día siguiente consecutivo: Racha +1.
     * Si ha pasado más de un día: Racha reinicia a 1.
     * Si es el mismo día: No hay cambios.

D. Logros (Badges)
   - Desbloqueo automático basado en condiciones lógicas en tiempo real.
   - Ejemplos: "Novato Constante" (3 días seguidos), "Máquina de Contenido" (1000 XP acumulada).

4. DETALLE FUNCIONAL POR MÓDULO
-------------------------------

A. DASHBOARD (Centro de Mando)
   - Visualización de Stats: Nivel, Barra de Progreso, Racha actual.
   - Próximo Bloque: Muestra la siguiente actividad agendada según la hora del sistema.
   - Gráficos: Distribución de XP (PieChart usando Recharts) con corrección de redimensionamiento (-1 width bug fix).
   - Vitrina de Trofeos: Muestra los Badges desbloqueados y bloqueados.

B. AGENDA (Línea Temporal Táctica)
   - Funcionalidad: CRUD completo (Crear, Leer, Actualizar, Borrar).
   - Tipos de Bloque: Trabajo, Creativo, Tránsito, Base, Aprendizaje, Sueño.
   - Estado Visual:
     * Pasado/Completado: Opaco, tachado, verde.
     * Pendiente: Brillante, con borde de color según tipo.
   - Persistencia: Se guarda en localStorage ('streamos_agenda').
   - Reinicio Diario: Las tareas se desmarcan automáticamente al cambiar de día, pero la estructura del horario se mantiene.

C. STUDIO (Tablero Kanban Interactivo)
   - Flujo de Trabajo: Idea <-> Grabación <-> Edición <-> Listo.
   - Mecánica de Avance: Botones contextuales (iconos) para mover tarjetas a la derecha (+XP).
   - Mecánica de Retroceso (Rollback):
     * Permite devolver una tarjeta a la columna anterior si hubo un error o replanificación.
     * Incluye confirmación de seguridad (confirm dialog).
     * Aplica penalización de XP (resta lo ganado) para evitar farming infinito.
   - Gestión: Eliminación de proyectos y creación con metadatos (Título, Categoría, Plataforma).
   - Identidad Visual: Iconos para Twitch (Morado), TikTok (Rosa), YouTube (Rojo), Kick (Verde).

D. BASE OPS (Mantenimiento)
   - Concepto: Tareas repetitivas diarias (limpieza, salud) necesarias para no "quemarse".
   - Barra de Progreso: Visualiza qué porcentaje del mantenimiento diario está hecho.
   - Reinicio Diario: Lógica estricta que borra el progreso a las 00:00.

E. AI COACH (Estratega Personal)
   - Motor: Google Gemini 2.5 Flash API.
   - Contexto Inyectado: La IA recibe el Nivel, XP y Racha del usuario en el "System Prompt".
   - Personalidad: "StreamOS", un asistente táctico y motivacional. Usa metáforas de gaming.
   - Bilingüe: Capacidad de responder en Inglés o Español según la configuración global.

5. ASPECTOS TÉCNICOS Y PERSISTENCIA DE DATOS
--------------------------------------------
A. Almacenamiento Local (LocalStorage)
   La app no requiere base de datos externa. Todo vive en el navegador del usuario:
   - 'streamos_stats': Nivel, XP, Racha.
   - 'streamos_agenda': Bloques de tiempo personalizados.
   - 'streamos_projects': Tarjetas del Kanban.
   - 'streamos_tasks': Estado de las tareas diarias.
   - 'streamos_lang': Preferencia de idioma.

B. Internacionalización (i18n)
   - Sistema propio de traducción en 'utils/translations.ts'.
   - Cambio en tiempo real sin recargar la página.
   - Afecta a toda la UI, modales, alertas y a las respuestas de la IA.

C. Responsive Design
   - Desktop: Barra lateral fija (Sidebar).
   - Mobile: Barra de navegación inferior (Bottom Nav) estilo app nativa.
   - Grid adaptable en Dashboard.

6. MANTENIMIENTO Y DEBUGGING
----------------------------
- Para reiniciar la cuenta completa (Factory Reset):
  Abrir consola del navegador (F12) -> Application -> Local Storage -> Click derecho "Clear" -> Recargar página.
- Si el gráfico no carga: Verificar que el contenedor padre tenga un ancho definido (bug de CSS Grid solucionado con min-w-0).

=========================================================
FIN DE DOCUMENTACIÓN
StreamLife OS - "Grind Smart, Not Hard."
