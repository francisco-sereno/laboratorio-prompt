/*
    ** Archivo de Configuración para el Laboratorio de Prompts **
    Versión: 1.2 (Corrección de API)
    Fecha: 10 de Julio, 2025

    **Autoría Académica y Dirección de Proyecto:**
    Francisco Sereño, Profesor, Universidad de Chile

    **Asistencia de Inteligencia Artificial:**
    - Google Gemini: Ayudó a estructurar este archivo de configuración para separar la data de la lógica.
*/

// --- CONFIGURACIÓN DE IA ---
const AI_CONFIG = {
    //================================================================================
    // CRÍTICO: Inserte su clave de API de OpenAI aquí.
    // La clave debe comenzar con "sk-...". Sin una clave válida, la herramienta no funcionará.
    // Reemplace el texto entre las comillas. Ejemplo: API_KEY: "sk-xxxxxxxxxxxxxxxxxxxxxxxx"
    //================================================================================
    API_KEY: " ",

    API_URL: "https://api.openai.com/v1/chat/completions",
    MODEL: "gpt-4o-mini"
};

// --- DATOS Y CONTENIDOS (sin cambios) ---
const INFO_CONTENT = `
    <div class="info-section">
        <h4>Acerca del recurso y sus principios</h4>
        <p>Esta es una actividad interactiva diseñada para la práctica y evaluación de habilidades en la redacción de prompts para inteligencia artificial, basada en los siguientes principios:</p>
        <ul>
            <li><strong>Aprendizaje activo y constructivista:</strong> concebimos esta herramienta como un "dojo" o taller práctico. El aprendizaje no se logra mediante la simple lectura, sino a través de la experimentación, el ensayo y el error, y la reflexión guiada.</li>
            <li><strong>Retroalimentación para la mejora (feedback formativo):</strong> el objetivo principal del análisis no es calificar, sino orientar. La retroalimentación busca ser un andamiaje que permita al usuario identificar áreas de mejora y comprender los fundamentos de una instrucción efectiva.</li>
            <li><strong>Proceso iterativo de refinamiento:</strong> la herramienta replica el ciclo de trabajo real con IA, permitiendo una corrección inicial y, opcionalmente, un refinamiento posterior para explorar alternativas y profundizar en la mejora.</li>
            <li><strong>Conexión teoría-práctica:</strong> tras cada análisis, se ofrece la posibilidad de explorar la definición, propósito y funcionamiento de la técnica aplicada, fortaleciendo la comprensión conceptual.</li>
            <li><strong>IA como asistente cognitivo:</strong> la inteligencia artificial no es solo la tecnología subyacente, sino un socio en el proceso de aprendizaje. Actúa como un experto que ofrece un modelo de desempeño y una justificación de sus decisiones, promoviendo así el desarrollo de la metacognición.</li>
            <li><strong>Ética y seguridad integradas:</strong> el asistente opera bajo estrictas directrices de comportamiento ético. Se han implementado filtros y reglas para prevenir la generación de contenido inadecuado y para promover un uso responsable y seguro de la tecnología de IA.</li>
        </ul>
    </div>
    <div class="info-section">
        <h4>Autoría académica y desarrollo</h4>
        <p>
            <strong>Francisco Sereño</strong><br>
            Profesor, Universidad de Chile<br>
            Doctor(c) en Educación, Universitat de Barcelona
        </p>
    </div>
    <div class="info-section">
        <h4>Asistencia de inteligencia artificial</h4>
        <ul>
            <li><strong>OpenAI GPT-4o-mini:</strong> responsable del análisis y generación de retroalimentación en tiempo real.</li>
            <li><strong>Google Gemini:</strong> utilizado en las fases de refinamiento de la lógica de la aplicación, depuración de código y estructuración de las respuestas JSON.</li>
            <li><strong>Claude Sonnet (Anthropic):</strong> colaboró en el diseño inicial de la interfaz de usuario y en la generación de los primeros contenidos y estilos CSS del prototipo.</li>
        </ul>
    </div>`;

const TECHNIQUES = {
    'zero-shot': { name: 'Ser más específico (zero-shot)', placeholder: 'Ej: ayúdame con mi trabajo.' },
    'role': { name: 'Asignar un rol (role prompting)', placeholder: 'Ej: dame consejos de ejercicio.' },
    'contextual': { name: 'Dar contexto (contextual prompting)', placeholder: 'Ej: ¿cómo puedo organizar mi plata?' },
    'chain-of-thought': { name: 'Pensar paso a paso (chain of thought)', placeholder: 'Ej: ¿debería renunciar?' },
    'tree-of-thoughts': { name: 'Explorar varias opciones (tree of thoughts)', placeholder: 'Ej: ideas para mi aniversario.' }
};

const TECHNIQUE_DETAILS = {
    'zero-shot': {
        title: 'Técnica: Ser más específico (Zero-Shot Prompting)',
        definition: 'Consiste en dar una instrucción directa y clara a la IA, sin proporcionarle ejemplos previos (de ahí el "zero-shot" o "cero intentos"). Es la forma más básica y fundamental de prompting.',
        description: 'Su propósito es obtener una respuesta rápida y concisa a una tarea bien definida. Es ideal para tareas simples como resúmenes, traducciones, o respuestas a preguntas directas, pero su eficacia disminuye con la complejidad de la solicitud.',
        explanation: 'Funciona al delimitar con precisión qué se espera de la IA. Al usar verbos de acción claros (resume, traduce, compara), definir un formato de salida (ej. "en tres puntos", "en una tabla") y especificar una audiencia (ej. "para un niño de 10 años"), se reduce la ambigüedad y se guía a la IA hacia el resultado deseado.'
    },
    'role': {
        title: 'Técnica: Asignar un rol (Role Prompting)',
        definition: 'Consiste en instruir a la IA para que adopte una "personalidad" o un rol de experto específico antes de realizar una tarea.',
        description: 'Se utiliza para que la IA genere respuestas con un tono, estilo y nivel de conocimiento particular. Es muy útil para obtener consejos de expertos, redactar textos con un estilo definido (ej. formal, creativo, técnico) o simular conversaciones.',
        explanation: 'Al asignarle un rol (ej. "Actúa como un nutricionista deportivo"), la IA accede a la información y patrones de lenguaje asociados a esa profesión en sus datos de entrenamiento. Esto le permite generar respuestas más coherentes, detalladas y ajustadas al contexto del rol, superando las respuestas genéricas.'
    },
    'contextual': {
        title: 'Técnica: Dar contexto (Contextual Prompting)',
        definition: 'Implica proporcionar a la IA información de fondo relevante y detallada sobre la situación o problema antes de formular la pregunta principal.',
        description: 'Es fundamental cuando se necesita una respuesta personalizada y no genérica. Se usa para resolver problemas personales, obtener recomendaciones basadas en datos específicos o analizar situaciones complejas.',
        explanation: 'La IA utiliza el contexto proporcionado como la base principal para su razonamiento. Al separar claramente "Contexto" y "Pregunta", se le indica a la IA que debe fundamentar su respuesta en los datos entregados, lo que resulta en soluciones más precisas, relevantes y aplicables a la situación particular del usuario.'
    },
    'chain-of-thought': {
        title: 'Técnica: Pensar paso a paso (Chain of Thought)',
        definition: 'Consiste en instruir a la IA para que no solo dé una respuesta final, sino que también desglose su proceso de razonamiento en una secuencia de pasos lógicos.',
        description: 'Es especialmente útil para problemas complejos que requieren lógica, cálculo o inferencias en múltiples etapas. Permite a la IA "pensar en voz alta", lo que a menudo conduce a conclusiones más precisas y permite al usuario verificar el razonamiento.',
        explanation: 'Al forzar a la IA a seguir una "cadena de pensamiento", se evita que salte a conclusiones apresuradas y erróneas. Este método descompone un problema grande en sub-problemas más pequeños y manejables, mejorando significativamente el rendimiento en tareas de razonamiento matemático, lógico y de planificación.'
    },
    'tree-of-thoughts': {
        title: 'Técnica: Explorar varias opciones (Tree of Thoughts)',
        definition: 'Es una técnica avanzada donde se le pide a la IA que genere múltiples líneas de pensamiento o soluciones (las "ramas" del árbol), las evalúe según ciertos criterios y luego sintetice una respuesta final.',
        description: 'Se utiliza para problemas que no tienen una única solución correcta, como la planificación estratégica, la lluvia de ideas creativa o la toma de decisiones complejas. Fomenta la exploración y la comparación de alternativas.',
        explanation: 'A diferencia de Chain of Thought que sigue un solo camino, Tree of Thoughts explora varios caminos en paralelo. Al pedirle que genere, por ejemplo, tres planes diferentes y los evalúe, se le obliga a considerar el problema desde múltiples ángulos, lo que resulta en soluciones más robustas, creativas y mejor fundamentadas.'
    },
    'refinement': {
        title: 'Proceso: Refinamiento de Prompts',
        definition: 'El refinamiento no es una técnica única, sino un proceso iterativo de mejora continua de un prompt. Se basa en analizar la respuesta de la IA y ajustar la instrucción original para obtener un resultado progresivamente mejor.',
        description: 'Es un metahabilidad crucial en el uso de la IA. Se aplica cuando la primera respuesta no es satisfactoria y se necesita guiar a la IA con mayor precisión. Es la clave para pasar de resultados genéricos a resultados expertos y altamente personalizados.',
        explanation: 'Funciona como un diálogo. Cada refinamiento es una nueva instrucción que corrige el rumbo. Al solicitar alternativas (ej. "ahora hazlo más formal", "ahora enfócate en el aspecto económico", "ahora preséntalo en una tabla"), el usuario actúa como un director, guiando a la IA hacia el resultado exacto que necesita.'
    }
};

// Función de utilidad que se pedía en una versión anterior. Se mantiene por completitud.
function getLocalizedText(key, lang = 'es') {
    // En esta versión no se usa, pero se mantiene la estructura.
    const UI_TEXTS = {}; 
    return (UI_TEXTS[lang] && UI_TEXTS[lang][key]) || key;
}
