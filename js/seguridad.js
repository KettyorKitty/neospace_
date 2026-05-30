/* ==========================================================================
   ESCUDO DE SEGURIDAD GLOBAL AVANZADO - NEOSPACE
   ========================================================================== */

// 1. TRAMPA DEFINITIVA: Bucle de depuración (Inutiliza la consola si logran abrirla)
setInterval(function() {
    debugger;
}, 100);

// 2. Bloqueo total del menú contextual (Clic derecho)
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    alert("SISTEMA PROTEGIDO: El Centro de Comando de NEOSPACE ha bloqueado esta acción.");
});

// 3. Bloqueo de atajos de teclado optimizado (Atrapa todas las variantes)
document.addEventListener('keydown', function(e) {
    // Convertimos la tecla presionada a minúscula para asegurar la coincidencia
    const tecla = e.key.toLowerCase();

    // Condición de seguridad extrema
    if (
        // F12 Directo
        e.key === "F12" || 
        // Ctrl + U (Ver código fuente)
        (e.ctrlKey && tecla === "u") || 
        // Ctrl + S (Guardar página)
        (e.ctrlKey && tecla === "s") || 
        // Ctrl + Shift + I (Inspeccionar)
        (e.ctrlKey && e.shiftKey && tecla === "i") || 
        // Ctrl + Shift + J (Consola)
        (e.ctrlKey && e.shiftKey && tecla === "j") || 
        // Ctrl + Shift + C (Inspector de elementos en vivo)
        (e.ctrlKey && e.shiftKey && tecla === "c")
    ) {
        e.preventDefault();
        alert("ACCESO DENEGADO: Protocolo de seguridad anti-copia activado.");
        return false;
    }
});
