document.addEventListener("DOMContentLoaded", () => {
    
    // 1. PANTALLA DE CARGA (1.5 SEGUNDOS)
    const loader = document.getElementById("loader");
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = "0";
            loader.style.visibility = "hidden";
        }, 1500);
    }

    // 2. GALERÍA CON VISOR INTERACTIVO Y FLECHAS
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("img-lightbox");
    const lightboxCaption = document.getElementById("caption-lightbox");
    const imagenesGaleria = document.querySelectorAll(".img-click");
    let indexImagenActual = 0;

    const listaImagenes = Array.from(imagenesGaleria).map(img => ({
        src: img.src,
        alt: img.alt
    }));

    function mostrarImagenLightbox(index) {
        if (index < 0) index = listaImagenes.length - 1;
        if (index >= listaImagenes.length) index = 0;
        indexImagenActual = index;
        lightboxImg.src = listaImagenes[indexImagenActual].src;
        lightboxCaption.textContent = listaImagenes[indexImagenActual].alt;
    }

    imagenesGaleria.forEach((img, index) => {
        img.addEventListener("click", () => {
            lightbox.style.display = "flex";
            mostrarImagenLightbox(index);
        });
    });

    const btnIzq = document.querySelector(".flecha-izq");
    const btnDer = document.querySelector(".flecha-der");
    if (btnIzq && btnDer) {
        btnIzq.addEventListener("click", (e) => { e.stopPropagation(); mostrarImagenLightbox(indexImagenActual - 1); });
        btnDer.addEventListener("click", (e) => { e.stopPropagation(); mostrarImagenLightbox(indexImagenActual + 1); });
    }

    const btnCerrar = document.querySelector(".cerrar-lightbox");
    if (btnCerrar) { btnCerrar.addEventListener("click", () => lightbox.style.display = "none"); }
    if (lightbox) { lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.style.display = "none"; }); }

    document.addEventListener("keydown", (e) => {
        if (lightbox && lightbox.style.display === "flex") {
            if (e.key === "ArrowRight") mostrarImagenLightbox(indexImagenActual + 1);
            if (e.key === "ArrowLeft") mostrarImagenLightbox(indexImagenActual - 1);
            if (e.key === "Escape") lightbox.style.display = "none";
        }
    });

    // 3. ENLACES DE AUDIO (LISTOS PARA CONFIGURAR)
    const sonidoHover = new Audio(); 
    const sonidoClick = new Audio();
    sonidoHover.src = ""; // <-- Pon la ruta de tu mp3 para el Hover aquí
    sonidoClick.src = ""; // <-- Pon la ruta de tu mp3 para el Click aquí
    sonidoHover.volume = 0.2;
    sonidoClick.volume = 0.4;

    document.querySelectorAll(".sound-hover").forEach(elemento => {
        elemento.addEventListener("mouseenter", () => {
            if (sonidoHover.src && sonidoHover.currentTime !== undefined) {
                sonidoHover.currentTime = 0;
                sonidoHover.play().catch(() => {});
            }
        });
        elemento.addEventListener("click", () => {
            if (sonidoClick.src && sonidoClick.currentTime !== undefined) {
                sonidoClick.currentTime = 0;
                sonidoClick.play().catch(() => {});
            }
        });
    });
 // ------------------------------------------
    // 4. RADAR VECTORIAL 3D (ESTILO POLYSPACE 80s/90s)
    // ------------------------------------------
    const canvas = document.getElementById("radarCanvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        
        // Estructura geométrica 3D de la nave espacial retro (Vértices X, Y, Z)
        let vertices = [
            {x: 0,   y: 0,   z: 55},   // 0: Punta de la nave (Frente)
            {x: -35, y: -10, z: -30},  // 1: Ala izquierda
            {x: 35,  y: -10, z: -30},  // 2: Ala derecha
            {x: 0,   y: 20,  z: -25},  // 3: Alerón trasero superior (Cola)
            {x: 0,   y: -8,  z: -10}   // 4: Centro base inferior
        ];

        // Líneas que conectan los vértices (Aristas)
        const aristas = [
            [0, 1], [0, 2], [0, 3], [0, 4], // Conexiones desde la punta
            [1, 4], [2, 4], [3, 4],         // Cierres hacia el centro inferior
            [1, 3], [2, 3], [1, 2]          // Estructura de la base trasera
        ];

        // Ángulos iniciales de rotación
        let anguloX = 0.2;
        let anguloY = 0.6;
        let mousePresionado = false;
        let ultimoMouseX = 0;
        let ultimoMouseY = 0;

        // Captura de eventos para arrastrar y rotar la nave con el mouse
        canvas.addEventListener("mousedown", (e) => {
            mousePresionado = true;
            ultimoMouseX = e.clientX;
            ultimoMouseY = e.clientY;
        });

        window.addEventListener("mouseup", () => mousePresionado = false);

        canvas.addEventListener("mousemove", (e) => {
            if (!mousePresionado) return;
            let deltaX = e.clientX - ultimoMouseX;
            let deltaY = e.clientY - ultimoMouseY;
            
            anguloY += deltaX * 0.01; // Giro horizontal
            anguloX += deltaY * 0.01; // Giro vertical
            
            ultimoMouseX = e.clientX;
            ultimoMouseY = e.clientY;
        });

        // Función matemática para proyectar coordenadas 3D en la pantalla 2D
        function proyectarYRotar(punto) {
            // Rotación en el eje X
            let y1 = punto.y * Math.cos(anguloX) - punto.z * Math.sin(anguloX);
            let z1 = punto.y * Math.sin(anguloX) + punto.z * Math.cos(anguloX);
            
            // Rotación en el eje Y
            let x2 = punto.x * Math.cos(anguloY) + z1 * Math.sin(anguloY);
            let z2 = -punto.x * Math.sin(anguloY) + z1 * Math.cos(anguloY);
            
            // Perspectiva cónica simple
            const distanciaFocal = 300;
            const escalaZoom = 1.6;
            let factorPerspectiva = distanciaFocal / (distanciaFocal + z2);
            
            return {
                x: (x2 * factorPerspectiva * escalaZoom) + canvas.width / 2,
                y: (y1 * factorPerspectiva * escalaZoom) + canvas.height / 2
            };
        }

        // Bucle de renderizado del radar
        function renderizarRadar() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 1. Dibujar rejilla de fondo estilo vector CRT radar
            ctx.strokeStyle = "rgba(0, 242, 254, 0.04)";
            ctx.lineWidth = 1;
            
            // Círculos de distancia del radar
            ctx.beginPath();
            ctx.arc(canvas.width/2, canvas.height/2, 100, 0, Math.PI * 2);
            ctx.arc(canvas.width/2, canvas.height/2, 60, 0, Math.PI * 2);
            ctx.stroke();
            
            // Ejes de coordenadas de fondo
            ctx.beginPath();
            ctx.moveTo(0, canvas.height/2); ctx.lineTo(canvas.width, canvas.height/2);
            ctx.moveTo(canvas.width/2, 0); ctx.lineTo(canvas.width/2, canvas.height);
            ctx.stroke();

            // 2. Calcular posiciones proyectadas actuales
            let puntosProyectados = vertices.map(proyectarYRotar);

            // 3. Dibujar las líneas de la nave con efecto neón (Glow)
            ctx.strokeStyle = "#00f2fe"; // Color Cian original de Neospace
            ctx.lineWidth = 2;
            ctx.lineJoin = "round";
            ctx.shadowBlur = 12; // Genera el resplandor de neón
            ctx.shadowColor = "#00f2fe";

            aristas.forEach(arista => {
                let p1 = puntosProyectados[arista[0]];
                let p2 = puntosProyectados[arista[1]];
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            });
            
            // Apagar sombras para no afectar otros renders del navegador
            ctx.shadowBlur = 0;

            // Rotación automática pasiva si nadie está arrastrando la nave
            if (!mousePresionado) {
                anguloY += 0.006;
            }

            requestAnimationFrame(renderizarRadar);
        }

        // Ejecutar el motor gráfico
        renderizarRadar();
    }
}); 