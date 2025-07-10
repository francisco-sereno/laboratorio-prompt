Laboratorio de Prompts: Un Recurso Educativo Interactivo
Versión: 8.0 (SCORM Modular)
Fecha: 10 de Julio, 2025
Autor: Francisco Sereño, Universidad de Chile

1. Descripción General del Recurso
El "Laboratorio de Prompts" es un Objeto de Contenido Compartible (SCO) compatible con SCORM 1.2 y 2004, diseñado como una herramienta de aprendizaje activo para el desarrollo de competencias en la redacción de instrucciones para modelos de inteligencia artificial (Prompt Engineering).

El recurso permite a los estudiantes practicar la aplicación de técnicas de prompting específicas, recibir retroalimentación formativa generada por IA en tiempo real, y explorar iterativamente el refinamiento de sus instrucciones.

2. Perspectiva Pedagógica
Este recurso se fundamenta en los siguientes principios de aprendizaje:

Constructivismo y Aprendizaje Activo: El estudiante construye su conocimiento a través de la práctica deliberada y la experimentación en un entorno seguro ("learning by doing").

Retroalimentación Formativa: El análisis de la IA no es una calificación, sino un andamiaje que guía al estudiante, destacando fortalezas y proveyendo rutas claras para la mejora.

Metacognición: Al ofrecer un ciclo de "corrección -> explicación -> refinamiento", se fomenta que el estudiante reflexione sobre su propio proceso de pensamiento y la estructura de sus instrucciones.

Conexión Teoría-Práctica: La herramienta permite al estudiante no solo ejecutar una técnica, sino también acceder a su definición y explicación conceptual, cerrando la brecha entre el saber y el hacer.

Uso Ético de la IA: Se integran reglas de comportamiento y filtros para modelar un uso responsable y seguro de las tecnologías de IA generativa.

3. Descripción Técnica
El recurso está construido con tecnologías web estándar y empaquetado para su uso en cualquier Learning Management System (LMS) compatible con SCORM.

Estructura: HTML5, CSS3, y JavaScript (ECMAScript 6+).

Modularidad: El código está separado en archivos de estructura (index.html), estilos (css/styles.css), configuración (js/config.js), lógica principal (js/main.js) y comunicación con el LMS (js/scorm_api.js) para facilitar su mantenimiento y escalabilidad.

taller_prompt_m2/
├── imsmanifest.xml
├── metadata.xml
├── index.html
├── README.md
├── LICENSE.md
├── js/
│   ├── scorm\_api.js
│   ├── config.js
│   └── main.js
└── css/
    └── styles.css

Conectividad: Utiliza la API de OpenAI para conectarse al modelo gpt-4o-mini. Se requiere una clave de API válida para su funcionamiento.

Seguimiento:

SCORM: Al recibir la primera retroalimentación exitosa de la IA, el recurso envía una señal de completed y passed al LMS.

Google Analytics: Incluye un tag de Google (gtag.js) para el seguimiento anónimo de la interacción con el recurso (ID: G-7K2W55Z732).

4. Instrucciones de Ensamblaje del Paquete SCORM
Para crear el paquete .zip que se subirá al LMS, siga estos pasos:

Cree una carpeta principal (ej. paquete-scorm-laboratorio).

Dentro de ella, cree una subcarpeta llamada css y otra llamada js.

Coloque los archivos de la siguiente manera:

index.html en la carpeta raíz.

imsmanifest.xml en la carpeta raíz.

LICENSE.md en la carpeta raíz.

README.md en la carpeta raíz.

styles.css dentro de la carpeta css.

config.js, main.js, y scorm_api.js dentro de la carpeta js.

Comprima la carpeta principal (paquete-scorm-laboratorio) en un único archivo .zip. Este archivo es el paquete SCORM final.

5. Licenciamiento
Este proyecto utiliza un licenciamiento dual. El contenido pedagógico se distribuye bajo CC BY-NC-SA 4.0, mientras que el código fuente se distribuye bajo GNU GPL v3.0. Para más detalles, consulte el archivo LICENSE.md.
