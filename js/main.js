/*
    ** Lógica Principal para el Laboratorio de Prompts **
    Versión: 1.2 (Corrección de API)
    Fecha: 10 de Julio, 2025

    **Autoría Académica y Dirección de Proyecto:**
    Francisco Sereño, Profesor, Universidad de Chile

    **Asistencia de Inteligencia Artificial:**
    - OpenAI GPT-4o-mini: Responsable del análisis y generación de retroalimentación en tiempo real.
    - Google Gemini: Utilizado en las fases de refinamiento de la lógica de la aplicación, depuración de código y estructuración de las respuestas JSON.
*/

document.addEventListener('DOMContentLoaded', function() {
    // --- REFERENCIAS AL DOM ---
    const techniqueSelector = document.getElementById('techniqueSelector');
    const userPrompt = document.getElementById('userPrompt');
    const correctButton = document.getElementById('correctButton');
    const feedbackContainer = document.getElementById('feedbackContainer');
    const infoButton = document.getElementById('infoButton');
    const infoModal = document.getElementById('infoModal');
    const techniqueModal = document.getElementById('techniqueModal');
    const aiStatusDot = document.getElementById('aiStatusDot');
    const scormStatusDot = document.getElementById('scormStatusDot');

    // --- ESTADO DE LA APLICACIÓN ---
    let currentCorrectedPrompt = null;
    let currentTechniqueKey = null;

    // --- FUNCIONES DE IA Y CORRECCIÓN ---

    function buildAIPrompt(techniqueName, originalPrompt, isRefinement = false) {
        const commonRules = `
            **REGLAS DE COMPORTAMIENTO ESTRICTAS:**
            - Tu rol es el de un asistente educativo experto y ético.
            - NUNCA generes contenido que sea ofensivo, discriminatorio, sexista, racista, violento, o que contenga sesgos de cualquier tipo.
            - NUNCA respondas a prompts de usuario que contengan lenguaje inapropiado, insultos, o que soliciten contenido no ético. En su lugar, responde con un mensaje indicando que no puedes procesar esa solicitud.
            - Mantén siempre un tono profesional, respetuoso y constructivo.
            - No des información personal ni opines sobre temas controvertidos.`;

        let taskInstructions = '';

        if (isRefinement) {
            taskInstructions = `
                **TAREA DE REFINAMIENTO:**
                Un estudiante ha recibido una primera corrección de su prompt. Ahora quiere explorar más alternativas.
                El prompt ya mejorado es: "${originalPrompt}".

                Tu tarea es la siguiente:
                1. En el campo "corrected_prompt", genera tres nuevas versiones refinadas del prompt. Cada versión debe explorar un ángulo diferente para mejorarlo (ej. mayor detalle, un formato diferente, un enfoque creativo). Formatea estas tres versiones como una sola cadena de texto, separadas por un salto de línea y numeradas (ej. "1. ... \\n2. ... \\n3. ...").
                2. Escribe una explicación clara de por qué estas nuevas versiones son alternativas valiosas. Esta explicación debe contener exactamente tres puntos o viñetas, cada una explicando el valor de una de las versiones refinadas que propusiste.
                3. La retroalimentación inicial y la lectura sugerida no son necesarias en esta etapa.
            `;
        } else {
            taskInstructions = `
                **TAREA PRINCIPAL:**
                Eres un experto en "prompt engineering" y tu tarea es ayudar a un estudiante a mejorar su instrucción para una IA.
                El estudiante quiere aplicar la técnica: "${techniqueName}".
                El prompt original del estudiante es: "${originalPrompt}".

                Tu tarea es la siguiente:
                1. Analiza el prompt original y su intención.
                2. Crea una versión mejorada del prompt que aplique de manera ejemplar la técnica seleccionada. El prompt mejorado debe ser práctico y listo para usar.
                3. Escribe una retroalimentación breve sobre por qué el prompt original es débil. Esta retroalimentación debe contener exactamente tres puntos o viñetas.
                4. Escribe una explicación clara de por qué el nuevo prompt es mejor. Esta explicación debe contener exactamente tres puntos o viñetas que detallen cómo se aplicó la técnica.
                5. Sugiere una lectura académica o un artículo de blog de alta calidad y de una fuente reputada (con título y URL válido y funcional) para profundizar en la técnica de prompting seleccionada. **Prioriza recursos en castellano (español) siempre que sea posible.**
            `;
        }

        const jsonStructure = isRefinement 
            ? `{ "corrected_prompt": "string", "explanation": ["string", "string", "string"] }`
            : `{ "initial_feedback": ["string", "string", "string"], "corrected_prompt": "string", "explanation": ["string", "string", "string"], "suggested_reading": { "title": "string", "url": "string" } }`;

        return `${commonRules}\n${taskInstructions}\nDevuelve tu respuesta SÓLO como un objeto JSON válido, sin texto antes ni después. La estructura debe ser:\n${jsonStructure}`;
    }

    async function callOpenAI(modelPrompt) {
        const payload = {
            model: AI_CONFIG.MODEL,
            messages: [{ role: "user", content: modelPrompt }],
            response_format: { type: "json_object" }
        };

        const response = await fetch(AI_CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_CONFIG.API_KEY}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error de la API de OpenAI: ${response.status} ${response.statusText} - ${errorBody}`);
        }

        const result = await response.json();

        if (result.choices && result.choices.length > 0 && result.choices[0].message.content) {
            const rawText = result.choices[0].message.content;
            const jsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonText);
        } else {
            throw new Error("La respuesta de la IA no contiene contenido válido o el formato es incorrecto.");
        }
    }

    async function handleCorrection() {
        currentTechniqueKey = techniqueSelector.value;
        const originalPrompt = userPrompt.value.trim();
        
        if (!originalPrompt) {
            alert('Por favor, ingrese un prompt para corregir.');
            return;
        }

        const inappropriateKeywords = ['matar', 'suicidio', 'odio', 'racista', 'sexista'];
        if (inappropriateKeywords.some(keyword => originalPrompt.toLowerCase().includes(keyword))) {
            renderError("La solicitud no puede ser procesada debido a que contiene lenguaje inapropiado.");
            return;
        }

        setLoading(true);
        updateStatusDot(aiStatusDot, 'connecting');

        const modelPrompt = buildAIPrompt(TECHNIQUES[currentTechniqueKey].name, originalPrompt);

        try {
            const correction = await callOpenAI(modelPrompt);
            currentCorrectedPrompt = correction.corrected_prompt; 
            renderFeedback(
                correction.initial_feedback, 
                correction.corrected_prompt, 
                correction.explanation, 
                correction.suggested_reading
            );
            updateStatusDot(aiStatusDot, 'connected');
            scorm.setCompleted();
            scorm.save();
        } catch (error) {
            console.error("Error al contactar la IA:", error);
            renderError("No se pudo obtener una respuesta de la IA. Verifique que la clave de API sea correcta y que tenga fondos. Detalles: " + error.message);
            updateStatusDot(aiStatusDot, 'disconnected');
        } finally {
            setLoading(false);
        }
    }

    async function handleRefinementRequest() {
        const refineButton = document.getElementById('refineButton');
        if (!refineButton || !currentCorrectedPrompt) return;

        refineButton.disabled = true;
        refineButton.innerHTML = `<span class="paw-icon">hourglass_top</span>Refinando...`;

        const modelPrompt = buildAIPrompt(null, currentCorrectedPrompt, true);

        try {
            const refinement = await callOpenAI(modelPrompt);
            renderRefinementFeedback(refinement.corrected_prompt, refinement.explanation);
        } catch (error) {
            console.error("Error en el refinamiento:", error);
            refineButton.innerHTML = 'Error al refinar';
            refineButton.disabled = false;
        }
    }


    // --- FUNCIONES DE RENDERIZADO Y UI ---
    function setLoading(isLoading) {
        correctButton.disabled = isLoading;
        if (isLoading) {
            feedbackContainer.innerHTML = `<div class="feedback-placeholder"><div class="loading-icon-container"><div class="typing-indicator"><span></span><span></span><span></span></div><p class="loading-text">Contactando a la IA para el análisis...</p></div></div>`;
        }
    }

    function isValidHttpUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch (_) {
            return false;  
        }
    }

    function renderFeedback(initialFeedbackItems, correctedPrompt, explanationItems, suggestedReading) {
        const initialFeedbackHtml = initialFeedbackItems.map(item => `<li>${item}</li>`).join('');
        const explanationHtml = explanationItems.map(item => `<li>${item}</li>`).join('');
        
        let suggestedReadingHtml = '';
        if (suggestedReading && suggestedReading.title && suggestedReading.url && isValidHttpUrl(suggestedReading.url)) {
            suggestedReadingHtml = `
                <h3><span class="paw-icon">menu_book</span>Lectura sugerida para profundizar</h3>
                <div class="suggested-reading-wrapper">
                    <p>
                        Para aprender más sobre esta técnica, le recomendamos el siguiente recurso.
                        <br><em>Nota: esta lectura es una sugerencia generada por IA. Se recomienda evaluar su pertinencia.</em>
                    </p>
                    <a href="${suggestedReading.url}" target="_blank" rel="noopener noreferrer">${suggestedReading.title}</a>
                </div>
            `;
        }

        feedbackContainer.innerHTML = `
            <div class="feedback-content">
                <h3><span class="paw-icon">comment</span>Retroalimentación del prompt original</h3>
                <div class="initial-feedback"><ul>${initialFeedbackHtml}</ul></div>
                
                <h3><span class="paw-icon">task_alt</span>Prompt mejorado</h3>
                <div class="corrected-prompt-wrapper">${correctedPrompt.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
                
                <h3><span class="paw-icon">analytics</span>Análisis de la corrección</h3>
                <div class="explanation"><ul>${explanationHtml}</ul></div>
                
                ${suggestedReadingHtml}

                <div id="action-buttons-container" class="action-buttons">
                    <button id="explainTechniqueButton" class="button button-secondary"><span class="paw-icon">help</span>Ver explicación de la técnica</button>
                    <button id="refineButton" class="button button-secondary"><span class="paw-icon">auto_awesome</span>Solicitar refinamiento adicional</button>
                </div>
            </div>`;
        
        document.getElementById('refineButton').addEventListener('click', handleRefinementRequest);
        document.getElementById('explainTechniqueButton').addEventListener('click', () => showTechniqueExplanation(currentTechniqueKey));
    }

    function renderRefinementFeedback(refinedPrompts, explanationItems) {
        const actionContainer = document.getElementById('action-buttons-container');
        if (!actionContainer) return;

        const explanationHtml = explanationItems.map(item => `<li>${item}</li>`).join('');

        const refinementHtml = `
            <h3><span class="paw-icon">filter_alt</span>Versiones Refinadas</h3>
            <div class="corrected-prompt-wrapper">${refinedPrompts.replace(/\n/g, '<br>')}</div>
            <h3><span class="paw-icon">rule</span>Análisis del Refinamiento</h3>
            <div class="explanation"><ul>${explanationHtml}</ul></div>
        `;
        
        actionContainer.innerHTML = refinementHtml + `<div class="action-buttons" style="grid-template-columns: 1fr;">
            <button id="explainRefinementButton" class="button button-secondary"><span class="paw-icon">help</span>Ver explicación del refinamiento</button>
        </div>`;
        document.getElementById('explainRefinementButton').addEventListener('click', () => showTechniqueExplanation('refinement'));
    }

    function renderError(message) {
        feedbackContainer.innerHTML = `<div class="error-message">${message}</div>`;
    }
    
    function populateSelector() {
        for (const key in TECHNIQUES) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = TECHNIQUES[key].name;
            techniqueSelector.appendChild(option);
        }
        updatePlaceholder();
    }
    
    function updatePlaceholder() {
        const selectedKey = techniqueSelector.value;
        if (TECHNIQUES[selectedKey]) {
            userPrompt.placeholder = TECHNIQUES[selectedKey].placeholder;
        }
    }
    
    function updateStatusDot(element, status) {
        if (element) {
            element.className = `status-dot ${status}`;
            const titles = {
                'connected': 'Conectado',
                'disconnected': 'Desconectado o con Error',
                'connecting': 'Conectando...'
            };
            element.title = titles[status] || 'Estado desconocido';
        }
    }

    // --- LÓGICA DE MODALES ---
    function showInfoModal(title, content) {
        document.getElementById('infoModalTitle').textContent = title;
        document.getElementById('infoModalBody').innerHTML = content;
        infoModal.style.display = 'block';
    }

    function showTechniqueExplanation(techniqueKey) {
        const details = TECHNIQUE_DETAILS[techniqueKey];
        if (!details) return;

        const modalTitle = document.getElementById('techniqueModalTitle');
        const modalBody = document.getElementById('techniqueModalBody');

        modalTitle.textContent = details.title;
        modalBody.innerHTML = `
            <div class="info-section">
                <h4>Definición</h4>
                <p>${details.definition}</p>
            </div>
            <div class="info-section">
                <h4>Descripción y propósito</h4>
                <p>${details.description}</p>
            </div>
            <div class="info-section">
                <h4>Explicación del funcionamiento</h4>
                <p>${details.explanation}</p>
            </div>
        `;
        techniqueModal.style.display = 'block';
    }

    function initializeApp(){
        populateSelector();
        const scormConnected = scorm.init();
        updateStatusDot(scormStatusDot, scormConnected ? 'connected' : 'disconnected');
        
        if (!AI_CONFIG.API_KEY || AI_CONFIG.API_KEY === "INSERTE_AQUI_SU_CLAVE_DE_API_DE_OPENAI") {
            updateStatusDot(aiStatusDot, 'disconnected');
            renderError("Error de configuración: No se ha proporcionado una clave de API de OpenAI en el archivo js/config.js. La herramienta no puede funcionar.");
            correctButton.disabled = true;
        } else {
            updateStatusDot(aiStatusDot, 'connected');
            correctButton.disabled = false;
        }
    }

    // --- EVENT LISTENERS ---
    correctButton.addEventListener('click', handleCorrection);
    techniqueSelector.addEventListener('change', () => {
        updatePlaceholder();
        feedbackContainer.innerHTML = `<div class="feedback-placeholder"><p>Aquí aparecerá el prompt corregido y la explicación detallada de las mejoras.</p></div>`;
        currentCorrectedPrompt = null;
    });
    infoButton.addEventListener('click', () => showInfoModal('Información y créditos', INFO_CONTENT));
    
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = e.target.getAttribute('data-modal-id');
            if(modalId) document.getElementById(modalId).style.display = 'none';
        });
    });
    
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    window.addEventListener('beforeunload', () => {
        scorm.quit();
    });

    // --- INICIO ---
    initializeApp();
});
