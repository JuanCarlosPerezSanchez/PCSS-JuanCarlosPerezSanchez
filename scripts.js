// Función para actualizar los íconos de reproducción y silencio
function actualizarIconosMusica(musicaFondo, iconoReproducir, iconoPausar, iconoSonido, iconoSilencio) {
    if (musicaFondo.paused) {
        iconoReproducir.style.display = "inline";
        iconoPausar.style.display = "none";
    } else {
        iconoReproducir.style.display = "none";
        iconoPausar.style.display = "inline";
    }

    if (musicaFondo.muted) {
        iconoSonido.style.display = "none";
        iconoSilencio.style.display = "inline";
    } else {
        iconoSonido.style.display = "inline";
        iconoSilencio.style.display = "none";
    }
}

// Configuración común para la música
function configurarMusica() {
    const musicaFondo = document.getElementById('musica-fondo');
    const botonMusica = document.getElementById('boton-musica');
    const iconoReproducir = document.getElementById('icono-reproducir');
    const iconoPausar = document.getElementById('icono-pausar');
    const botonSilenciar = document.getElementById('boton-silenciar');
    const iconoSonido = document.getElementById('icono-sonido');
    const iconoSilencio = document.getElementById('icono-silencio');
    const controlVolumen = document.getElementById('control-volumen');

    // Establecer el volumen inicial bajo (10%)
    musicaFondo.volume = 0.1;

    // Intentar reproducir automáticamente (puede ser bloqueado por el navegador)
    musicaFondo.play().catch(() => {
        console.log("La reproducción automática fue bloqueada.");
    });

    // Controlar la música (pausar/reanudar)
    botonMusica.addEventListener('click', function () {
        if (musicaFondo.paused) {
            musicaFondo.play();
        } else {
            musicaFondo.pause();
        }
        actualizarIconosMusica(musicaFondo, iconoReproducir, iconoPausar, iconoSonido, iconoSilencio);
    });

    // Controlar el silencio
    botonSilenciar.addEventListener('click', function () {
        musicaFondo.muted = !musicaFondo.muted;
        actualizarIconosMusica(musicaFondo, iconoReproducir, iconoPausar, iconoSonido, iconoSilencio);
    });

    // Controlar el volumen
    controlVolumen.addEventListener('input', function () {
        musicaFondo.volume = controlVolumen.value;
        if (musicaFondo.volume === 0) {
            musicaFondo.muted = true;
        } else {
            musicaFondo.muted = false;
        }
        actualizarIconosMusica(musicaFondo, iconoReproducir, iconoPausar, iconoSonido, iconoSilencio);
    });

    // Actualizar los íconos al cargar la página
    actualizarIconosMusica(musicaFondo, iconoReproducir, iconoPausar, iconoSonido, iconoSilencio);
}

// Configuración para la página de inicio
function configurarInicio() {
    const pantallaInicial = document.getElementById('pantalla-inicial');

    // Redirigir a la pantalla principal al hacer clic en la pantalla inicial
    pantallaInicial.addEventListener('click', function () {
        const musicaFondo = document.getElementById('musica-fondo');
        // Guardar el estado de la música en localStorage
        localStorage.setItem('estadoMusica', JSON.stringify({
            volumen: musicaFondo.volume,
            silenciado: musicaFondo.muted,
            pausado: musicaFondo.paused
        }));

        // Redirigir a la pantalla principal (Principal.html)
        window.location.href = "Principal.html";
    });
}

// Configuración para la página principal
function configurarPrincipal() {
    const musicaFondo = document.getElementById('musica-fondo');
    const controlVolumen = document.getElementById('control-volumen');

    // Recuperar el estado de la música desde localStorage
    const estadoMusicaGuardado = localStorage.getItem('estadoMusica');
    if (estadoMusicaGuardado) {
        const { volumen, silenciado, pausado } = JSON.parse(estadoMusicaGuardado);
        musicaFondo.volume = volumen;
        musicaFondo.muted = silenciado;
        if (!pausado) {
            musicaFondo.play().catch(() => {
                console.log("La reproducción automática fue bloqueada.");
            });
        }
        controlVolumen.value = volumen;
    }

    // Manejar clics en las áreas mapeadas solo en modo escritorio
    if (window.innerWidth > 768) {
        const areas = document.querySelectorAll('area');
        areas.forEach(area => {
            area.addEventListener('click', function (event) {
                event.preventDefault(); // Evitar el comportamiento por defecto del enlace

                // Ocultar todas las secciones
                document.querySelectorAll('.contenedor').forEach(seccion => {
                    seccion.classList.add('oculto');
                });

                // Mostrar la sección correspondiente
                const idSeccion = area.getAttribute('href').substring(1);
                const seccion = document.getElementById(idSeccion);
                if (seccion) {
                    seccion.classList.remove('oculto');
                }
            });
        });
    }
}

// Función para ocultar secciones
function ocultarSeccion(idSeccion) {
    const seccion = document.getElementById(idSeccion);
    if (seccion) {
        seccion.classList.add('oculto');
    }
}

// Función para mostrar secciones en el contenido alternativo
function mostrarSeccion(idSeccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.seccion').forEach(seccion => {
        seccion.classList.add('oculto');
    });

    // Mostrar la sección correspondiente
    const seccion = document.getElementById(idSeccion);
    if (seccion) {
        seccion.classList.remove('oculto');
        seccion.classList.add('visible');
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function () {
    configurarMusica();

    if (document.getElementById('pantalla-inicial')) {
        configurarInicio();
    }

    if (document.getElementById('contenido-principal')) {
        configurarPrincipal();
    }

    // Mostrar contenido alternativo en tabletas y móviles
    if (window.innerWidth <= 768) {
        document.getElementById('contenido-alternativo').style.display = 'flex';
        document.getElementById('contenido-principal').style.display = 'none';
    } else {
        document.getElementById('contenido-alternativo').style.display = 'none';
        document.getElementById('contenido-principal').style.display = 'flex';
    }
});