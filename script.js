document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // 1. PANTALLA DE CARGA (PRELOADER - 1.5 SEGUNDOS)
    // ==========================================================================
    const loader = document.getElementById("loader");
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = "0";
            loader.style.visibility = "hidden";
        }, 1500);
    }

    // ==========================================================================
    // 2. GALERÍA CON VISOR INTERACTIVO Y FLECHAS (MODAL LIGHTBOX)
    // ==========================================================================
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("img-lightbox");
    const lightboxCaption = document.getElementById("caption-lightbox");
    const imagenesGaleria = document.querySelectorAll(".img-click");
    let indexImagenActual = 0;

    // Solo ejecuta esta parte si el script encuentra imágenes de galería en la página actual
    if (imagenesGaleria.length > 0) {
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
    }

    // ==========================================================================
    // 3. ENLACES DE AUDIO (SISTEMA GLOBAL DE EFECTOS DE SONIDO)
    // ==========================================================================
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

    // ==========================================================================
    // 4. RADAR VECTORIAL 3D (MOTOR GRÁFICO ESTILO POLYSPACE 80s/90s)
    // ==========================================================================
    const canvas = document.getElementById("radarCanvas");
    // El "if (canvas)" protege el código en páginas que no tienen el radar (como sistema.html o nosotros.html)
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

        // Ejecutar el motor gráfico del radar
        renderizarRadar();
    }

    // ==========================================================================
    // 5. ANIMACIONES DE SCROLL EN CASCADA (INTEGRADO DE SOFÍA)
    // ==========================================================================
    const elementosAnimar = document.querySelectorAll('.panel-sistema, .tarjeta-info, .tarjeta-boss, .lista-habilidades .habilidad');

    // Solo ejecuta el observador de scroll si encuentra elementos específicos en la página actual
    if (elementosAnimar.length > 0) {
        const observador = new IntersectionObserver((entradas, observador) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('visible');
                    observador.unobserve(entrada.target);
                }
            });
        }, {
            threshold: 0.15 
        });

        elementosAnimar.forEach(elemento => {
            elemento.classList.add('oculto-scroll');
            observador.observe(elemento);
        });
    }

});
/* ==========================================================================
   LÓGICA DEL CARRUSEL DE GALERÍA (NOSOTROS)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const pista = document.querySelector('.carrusel-pista');
    const btnIzq = document.querySelector('.carrusel-flecha.izq');
    const btnDer = document.querySelector('.carrusel-flecha.der');
    const puntos = Array.from(document.querySelectorAll('.carrusel-punto'));

    // Verificamos que los elementos existan (para evitar errores en otras páginas)
    if (!pista || !btnIzq || !btnDer) return;

    const slides = Array.from(pista.querySelectorAll('.carrusel-slide'));
    let indiceActual = 0;

    // Función principal para mover la pista de imágenes
    function moverCarrusel(indice) {
        // Calculamos el ancho de una tarjeta más el espacio (gap de 20px)
        const anchoSlide = slides[0].getBoundingClientRect().width;
        const desplazamiento = -(anchoSlide + 20) * indice; 
        
        pista.style.transform = `translateX(${desplazamiento}px)`;
        
        // Actualizar la iluminación del puntito activo
        puntos.forEach(punto => punto.classList.remove('activo'));
        if (puntos[indice]) {
            puntos[indice].classList.add('activo');
        }
    }

    // Evento: Clic en la flecha derecha
    btnDer.addEventListener('click', () => {
        // En celular se muestra 1 tarjeta, en PC se muestran 3
        const maxSlides = window.innerWidth <= 768 ? slides.length - 1 : slides.length - 3;
        
        if (indiceActual < maxSlides) {
            indiceActual++;
            moverCarrusel(indiceActual);
        }
    });

    // Evento: Clic en la flecha izquierda
    btnIzq.addEventListener('click', () => {
        if (indiceActual > 0) {
            indiceActual--;
            moverCarrusel(indiceActual);
        }
    });

    // Evento: Clic en los puntitos de navegación
    puntos.forEach((punto, index) => {
        punto.addEventListener('click', () => {
            const maxSlides = window.innerWidth <= 768 ? slides.length - 1 : slides.length - 3;
            // Evita que al hacer clic en el último punto en PC, quede un espacio vacío
            if(index <= maxSlides) {
                indiceActual = index;
                moverCarrusel(indiceActual);
            }
        });
    });

    // Recalcular posiciones si el usuario cambia el tamaño de la ventana
    window.addEventListener('resize', () => {
        moverCarrusel(indiceActual);
    });
});
