
StreamLife OS v3.2.1 - DOCUMENTACIÓN TÉCNICA Y DE DISEÑO
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
   - LEVEL UP: Animación visual épica (LevelUpModal) al cruzar el umbral de XP.
   - Fuentes de XP:
     * Tareas Domésticas (Base Ops): +10 a +30 XP.
     * Agenda (Bloques de Tiempo): +10 (Tránsito) a +100 XP (Creativo).
     * Proyectos (Studio): +10 (Idea), +20 (Edición), +50 (Finalizado).

B. Economía Reversible (Anti-Exploit)
   - Lógica de "Suma Cero": Para mantener la integridad del juego, cualquier acción revertida resta la XP ganada originalmente.
     * Desmarcar tarea en Agenda/BaseOps: Resta la XP otorgada.
     * Borrar tarea completada: Resta la XP antes de eliminarla.
     * Retroceder proyecto en Studio: Resta la XP de la etapa avanzada.
     * Borrar Proyecto en Studio: Calcula el valor total de XP que tenía esa tarjeta y lo resta.
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
   - Perfil de Usuario: Nombre clave y Avatar personalizable desde Settings.
   - Próximo Bloque: Muestra la siguiente actividad agendada según la hora del sistema.
   - Gráficos: Distribución de XP (PieChart usando Recharts).
   - Vitrina de Trofeos: Muestra los Badges desbloqueados y bloqueados.

B. AGENDA (Línea Temporal Táctica)
   - Funcionalidad: CRUD completo (Crear, Leer, Actualizar, Borrar).
   - Tipos de Bloque: Trabajo, Creativo, Tránsito, Base, Aprendizaje, Sueño.
   - Estado Visual:
     * Pasado/Completado: Opaco, tachado, verde.
     * Pendiente: Brillante, con borde de color según tipo.
   - Persistencia: Se guarda en localStorage ('streamos_agenda').
   - Reinicio Diario: Las tareas se desmarcan automáticamente al cambiar de día.

C. STUDIO (Tablero Kanban Interactivo)
   - Flujo de Trabajo: Idea <-> Grabación <-> Edición <-> Listo.
   - Mecánica de Avance: Botones contextuales para mover tarjetas (+XP).
   - Mecánica de Retroceso/Borrado (Seguridad):
     * Mover atrás: Resta la XP ganada en el paso anterior.
     * Borrar proyecto: Calcula la "vida" del proyecto y resta toda la XP ganada antes de borrarlo.
   - Identidad Visual: Iconos para Twitch (Morado), TikTok (Rosa), YouTube (Rojo), Kick (Verde).

D. BASE OPS (Mantenimiento)
   - Concepto: Tareas repetitivas diarias (limpieza, salud).
   - Personalización: Totalmente editable (CRUD). Puedes crear tus propias rutinas con XP personalizada y borrarlas.
   - Priorización: Flechas Arriba/Abajo para ordenar la lista según importancia personal.
   - Barra de Progreso: Visualiza qué porcentaje del mantenimiento diario está hecho.
   - Reinicio Diario: Lógica estricta que borra el progreso a las 00:00, manteniendo la lista de tareas personalizada.

E. AI COACH (Estratega Personal + AGENTE)
   - Motor: Google Gemini 2.5 Flash API.
   - Contexto Inyectado: La IA recibe el Nivel, XP y Racha del usuario.
   - Capacidades de Agente: Puede crear Agenda, Añadir Tareas y Completar Tareas automáticamente.
   - Entrada de Voz (NUEVO): Integración con Web Speech API para dictar comandos.
   - Bilingüe: Capacidad de responder en Inglés o Español.

F. SYSTEM SETTINGS (Configuración)
   - Perfil: Edición de Nombre y Avatar.
   - Backup:
     * Exportar: Genera un archivo .JSON con toda la base de datos local.
     * Importar: Restaura los datos desde el archivo. Útil para mover datos de PC a Móvil.
   - Danger Zone: Reinicio de XP o Reseteo de Fábrica.

5. ASPECTOS TÉCNICOS Y PERSISTENCIA DE DATOS
--------------------------------------------
A. Almacenamiento Local (LocalStorage)
   La app no requiere base de datos externa. Todo vive en el navegador del usuario.
   Claves principales: 'streamos_stats', 'streamos_agenda', 'streamos_projects', 'streamos_tasks', 'streamos_profile'.

B. Internacionalización (i18n)
   - Sistema propio de traducción en 'utils/translations.ts'.
   - Afecta a toda la UI, modales, alertas y a las respuestas de la IA.

C. Responsive Design
   - Desktop: Barra lateral fija (Sidebar).
   - Mobile: Barra de navegación inferior (Bottom Nav) estilo app nativa.
   - Grid adaptable en Dashboard.

=========================================================
FIN DE DOCUMENTACIÓN
StreamLife OS - "Grind Smart, Not Hard."