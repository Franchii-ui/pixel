/**
 * main.js
 * ----------
 * Este archivo es el **punto de entrada principal** de la aplicación web.
 * Se encarga de:
 * 1. Cargar los datos desde archivos externos (JSON y YAML).
 * 2. Aplicar la configuración visual (tema, idioma, etc.).
 * 3. Renderizar la vista inicial (tarjetas de juegos).
 * 4. Manejar el estado de navegación entre vista de tarjetas y detalles.
 * 5. Delegar eventos y conectar los distintos módulos del proyecto.
 */

// --- Importación de módulos (archivos locales) ---
import { loadJSON, loadYAML } from './dataLoader.js';                  // Carga de datos
import { renderGameCards, renderDetailView } from './uiRender.js';    // Renderizado de UI
import { setupEventListeners } from './eventHandler.js';              // Listeners principales

// Esperar a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', async () => {
    // --- Estado centralizado de la aplicación ---
    const appState = {
        games: [],               // Lista de todos los juegos cargados desde el JSON
        config: {},              // Configuración visual y de idioma desde el YAML
        currentFilter: 'todos',  // Filtro activo (por género o "todos")
        currentPage: 1,          // Página actual (útil si hay paginación)
        currentView: 'cards',    // Vista activa: 'cards' o 'detail'
        selectedGameId: null     // ID del juego seleccionado para mostrar detalles
    };

    try {
        // --- Cargar datos iniciales ---
        appState.games = await loadJSON('data/games.json');      // Carga de juegos
        appState.config = await loadYAML('data/config.yaml');    // Carga de configuración

        // --- Aplicar configuración desde YAML ---
        if (appState.config.visual && appState.config.visual.theme) {
            // Cambiar el tema claro/oscuro usando un atributo en <body>
            document.body.setAttribute('data-bs-theme', appState.config.visual.theme);
        }

        if (appState.config.language) {
            // Cambiar el idioma del sitio desde el atributo lang del <html>
            document.documentElement.lang = appState.config.language;
        }

        if (appState.config.visual && !appState.config.visual.showImages) {
            // Mostrar por consola si las imágenes están desactivadas
            console.log("Configuración: No mostrar imágenes.");
        }

    } catch (error) {
        // --- Manejo de errores al cargar datos ---
        console.error('Error loading initial data:', error);

        // Mostrar mensaje de error en la interfaz
        const gameGrid = document.getElementById('gameGrid');
        if (gameGrid) {
            gameGrid.innerHTML = '<p class="text-danger text-center">Error loading game data. Please try again later.</p>';
        }

        // Salir del flujo si los datos no se pudieron cargar
        return;
    }

    /**
     * updateView()
     * Esta función se encarga de mostrar la vista actual,
     * ya sea la grilla de tarjetas o la vista de detalles de un juego.
     */
    function updateView() {
        const gameGrid = document.getElementById('gameGrid');
        const detailView = document.getElementById('detailView');

        if (appState.currentView === 'cards') {
            // --- Vista de tarjetas (listado de juegos) ---
            gameGrid.style.display = 'flex';
            detailView.style.display = 'none';

            // Aplicar el filtro por género o mostrar todos
            const filteredGames = appState.games.filter(game =>
                appState.currentFilter === 'todos' || game.genre.toLowerCase() === appState.currentFilter.toLowerCase()
            );

            // Renderizar tarjetas con los juegos filtrados
            renderGameCards(filteredGames, appState.config);

        } else if (appState.currentView === 'detail') {
            // --- Vista de detalles (juego seleccionado) ---
            gameGrid.style.display = 'none';
            detailView.style.display = 'block';

            // Mostrar información del juego con ID seleccionado
            renderDetailView(appState.selectedGameId, appState.games, appState.config);
        }
    }

    /**
     * setupDetailListeners()
     * Configura eventos que permiten cambiar entre la vista de tarjetas y la vista de detalle.
     */
    function setupDetailListeners() {
        const gameGrid = document.getElementById('gameGrid');

        // Evento delegado para botones "View Details" dentro de cada tarjeta
        gameGrid.addEventListener('click', (event) => {
            if (event.target.tagName === 'A' && event.target.href.includes('#detail')) {
                event.preventDefault();
                const gameId = event.target.href.split('#detail/')[1]; // Extraer ID desde el enlace

                // Cambiar a la vista de detalle
                appState.currentView = 'detail';
                appState.selectedGameId = gameId;
                updateView();
            }
        });

        // Evento para volver a la vista de tarjetas desde la vista de detalle
        const detailView = document.getElementById('detailView');
        detailView.addEventListener('click', (event) => {
            if (event.target.id === 'backToCards') {
                appState.currentView = 'cards';
                appState.selectedGameId = null;
                updateView();
            }
        });
    }

    // --- Inicialización de eventos principales (filtros, paginación, etc.) ---
    setupEventListeners(appState, updateView);

    // --- Inicialización de eventos secundarios (vista de detalles) ---
    setupDetailListeners();

    // --- Render inicial: mostrar la lista de juegos al cargar ---
    updateView();
});

/**
 * dark-mode.js
 * -----------------------
 * Script independiente para gestionar el modo oscuro mediante un interruptor.
 */
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Leer preferencia del usuario almacenada en localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';

    // Aplicar el modo oscuro si estaba habilitado previamente
    if (isDarkMode) {
        body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }

    // Cambiar el tema al activar/desactivar el interruptor
    darkModeToggle.addEventListener('change', () => {
        body.classList.toggle('dark-mode');

        // Guardar la nueva preferencia del usuario
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });
});
