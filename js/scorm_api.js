/*
    ** SCORM API Wrapper (v1.2 y 2004) **
    Simplifica la comunicación con el LMS.
    Versión: 3.1
    Fecha: 10 de Julio, 2025

    **Autoría Académica y Dirección de Proyecto:**
    Francisco Sereño, Profesor, Universidad de Chile

    **Asistencia de Inteligencia Artificial:**
    - Google Gemini: Utilizado para la depuración y refactorización de esta librería.
    - OpenAI GPT-4o-mini: Utilizado para validar la integración de esta librería en el recurso principal.
*/
(function(window) {
    'use strict';

    window.scorm = {};

    let API = null;
    let scormVersion = null;
    let isInitialized = false;

    function findAPI(win) {
        let findAPITries = 0;
        while ((win.API == null) && (win.API_1484_11 == null) && (win.parent != null) && (win.parent != win)) {
            findAPITries++;
            if (findAPITries > 7) {
                console.error("Error: Se excedió el número de intentos para encontrar la API.");
                return null;
            }
            win = win.parent;
        }
        return win.API_1484_11 || win.API;
    }

    window.scorm.init = function() {
        API = findAPI(window);
        if (!API) {
            console.error("Error: No se pudo encontrar la API de SCORM.");
            return false;
        }

        if (typeof API.Initialize === "function") {
            scormVersion = "2004";
        } else if (typeof API.LMSInitialize === "function") {
            scormVersion = "1.2";
        } else {
            console.error("No se pudo determinar la versión de la API de SCORM.");
            return false;
        }

        const initMethod = scormVersion === '2004' ? 'Initialize' : 'LMSInitialize';
        if (String(API[initMethod]("")) === "true") {
            isInitialized = true;
            return true;
        } else {
            console.error("Error en la inicialización de SCORM: " + getError().string);
            return false;
        }
    };

    window.scorm.get = function(element) {
        if (!isInitialized) return "";
        const getMethod = scormVersion === '2004' ? 'GetValue' : 'LMSGetValue';
        const value = API[getMethod](element);
        const errorCode = getError().code;
        if (value === '' && errorCode !== '0' && errorCode !== '403') { 
            console.warn("SCORM GetValue Warning: " + getError().string);
        }
        return String(value);
    };

    window.scorm.set = function(element, value) {
        if (!isInitialized) return false;
        const setMethod = scormVersion === '2004' ? 'SetValue' : 'LMSSetValue';
        if (String(API[setMethod](element, value)) === "true") {
            return true;
        } else {
            console.error("SCORM SetValue Error: " + getError().string);
            return false;
        }
    };

    window.scorm.save = function() {
        if (!isInitialized) return false;
        const commitMethod = scormVersion === '2004' ? 'Commit' : 'LMSCommit';
        return String(API[commitMethod]("")) === "true";
    };

    window.scorm.quit = function() {
        if (!isInitialized) return false;
        const status = scorm.get(scormVersion === '2004' ? 'cmi.completion_status' : 'cmi.core.lesson_status');
        if (status !== 'completed' && status !== 'passed') {
            scorm.set(scormVersion === '2004' ? 'cmi.exit' : 'cmi.core.exit', 'suspend');
        } else {
             scorm.set(scormVersion === '2004' ? 'cmi.exit' : 'cmi.core.exit', '');
        }
        const termMethod = scormVersion === '2004' ? 'Terminate' : 'LMSFinish';
        if (String(API[termMethod]("")) === "true") {
            isInitialized = false;
        }
    };

    window.scorm.setCompleted = function() {
        if (!isInitialized) return;
        const status = scorm.get(scormVersion === '2004' ? 'cmi.completion_status' : 'cmi.core.lesson_status');
        if (status === 'completed' || status === 'passed') return;

        if (scormVersion === '2004') {
            scorm.set('cmi.completion_status', 'completed');
            scorm.set('cmi.success_status', 'passed');
            scorm.set('cmi.score.scaled', '1.0');
            scorm.set('cmi.score.raw', '100');
            scorm.set('cmi.score.min', '0');
            scorm.set('cmi.score.max', '100');
        } else {
            scorm.set('cmi.core.lesson_status', 'passed');
            scorm.set('cmi.core.score.raw', '100');
            scorm.set('cmi.core.score.min', '0');
            scorm.set('cmi.core.score.max', '100');
        }
    };

    function getError() {
        if (!API) return { code: "-1", string: "API no encontrada" };
        const getErrorMethod = scormVersion === '2004' ? 'GetLastError' : 'LMSGetLastError';
        const getDiagnosticMethod = scormVersion === '2004' ? 'GetDiagnostic' : 'LMSGetDiagnostic';
        const code = API[getErrorMethod]();
        const string = API[getDiagnosticMethod](code);
        return { code: String(code), string: String(string) };
    }

})(window);
