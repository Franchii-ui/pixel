/**
 * eventHandler.js
 * 
 * Este módulo se encarga de gestionar las interacciones del usuario con la interfaz.
 * Define y configura los event listeners necesarios para responder a acciones como 
 * la selección de filtros desde un menú desplegable o la navegación entre páginas mediante controles de paginación.
 * Al detectar una interacción, actualiza el estado global y solicita una actualización de la vista.
 */

/**
 * Configura los listeners de eventos para manejar interacciones en la aplicación.
 * @param {Object} appState - Estado global de la aplicación.
 * @param {Function} updateView - Función para actualizar la vista según el estado actual.
 */
function setupEventListeners(appState, updateView) {
    // Listener para el menú desplegable de filtros
    const dropdownMenu = document.querySelector('.dropdown-menu');
    dropdownMenu.addEventListener('click', (event) => {
        // Verifica si el elemento clicado es un botón de filtro
        if (event.target.classList.contains('filtro-boton')) {
            appState.currentFilter = event.target.dataset.filter; // Actualiza el filtro actual
            appState.currentPage = 1; // Reinicia la paginación a la primera página
            updateView(); // Actualiza la vista con el nuevo filtro
        }
    });

    // Listener para los controles de paginación
    const paginationContainer = document.getElementById('paginationControls');
    paginationContainer.addEventListener('click', (event) => {
        // Verifica si el elemento clicado es un enlace de paginación
        if (event.target.tagName === 'A') {
            const page = parseInt(event.target.dataset.page, 10); // Obtiene el número de página del atributo data-page
            if (!isNaN(page)) {
                appState.currentPage = page; // Actualiza la página actual
                updateView(); // Actualiza la vista con la nueva página
            }
        }
    });
}

export { setupEventListeners };
