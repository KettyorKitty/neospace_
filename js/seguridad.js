/* ==========================================================================
   ESCUDO DE SEGURIDAD GLOBAL - NEOSPACE
   ========================================================================== */

// 1. Bloqueo total del menú contextual (Clic derecho)
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    alert("SISTEMA PROTEGIDO: El Centro de Comando de NEOSPACE ha bloqueado esta acción.");
});

// 2. Bloqueo de atajos de teclado para inspección y copia
document.addEventListener('keydown', function(e) {
    if (
        // F12 (Herramientas de desarrollador)
        e.key === "F12" || 
        // Ctrl + Shift + I (Inspeccionar) o Ctrl + Shift + J (Consola)
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "j" || e.key === "J")) || 
        // Ctrl + U (Ver código fuente)
        (e.ctrlKey && (e.key === "u" || e.key === "U")) || 
        // Ctrl + S (Guardar página completa)
        (e.ctrlKey && (e.key === "s" || e.key === "S"))
    ) {
        e.preventDefault();
        alert("ACCESO DENEGADO: Protocolo de seguridad anti-copia activado.");
        return false;
    }
});
