/**
 * uiRender.js
 * 
 * Este módulo se encarga de gestionar el renderizado dinámico de la interfaz de usuario
 * para una lista de videojuegos. Contiene funciones que crean y muestran tanto las tarjetas
 * individuales de cada juego en la vista principal como la vista de detalle de un juego específico.
 * Utiliza Bootstrap para el diseño responsivo y se adapta a configuraciones como la visualización de imágenes.
 */

/**
 * Renderiza las tarjetas de juegos en el contenedor principal.
 * @param {Array} games - Lista de juegos a renderizar.
 * @param {Object} config - Configuración de la aplicación (por ejemplo, si mostrar imágenes).
 */
function renderGameCards(games, config) {
    const gameGrid = document.getElementById('gameGrid');
    gameGrid.innerHTML = ''; // Limpia el contenedor antes de renderizar

    // Itera sobre cada juego y crea una tarjeta
    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'col'; // Clase de Bootstrap para diseño responsivo
        card.innerHTML = `
            <div class="card h-100">
                <img src="${game.image}" class="card-img-top" alt="${game.title}" style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${game.title}</h5>
                    <p class="card-text">${game.description}</p>
                    <div class="mt-auto d-flex justify-content-center">
                        <a href="#detail/${game.id}" class="btn btn-success">View Details</a>
                    </div>
                </div>
            </div>
        `;
        gameGrid.appendChild(card); // Añade la tarjeta al contenedor
    });
}

/**
 * Renderiza la vista de detalles de un juego específico.
 * @param {string} gameId - ID del juego a mostrar en detalle.
 * @param {Array} games - Lista de juegos disponibles.
 * @param {Object} config - Configuración de la aplicación (por ejemplo, si mostrar imágenes).
 */
function renderDetailView(gameId, games, config) {
    const game = games.find(g => g.id === gameId); // Encuentra el juego por su ID
    const detailViewContainer = document.getElementById('detailView');

    if (!game) {
        // Manejo de error: juego no encontrado
        console.error(`Game with ID "${gameId}" not found.`);
        detailViewContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Error</h4>
                <p>The game you are trying to view does not exist. Please try selecting another game.</p>
                <hr>
                <button id="backToCards" class="btn btn-secondary mt-3">Back to Cards</button>
            </div>
        `;
        return;
    }

    // Renderizar detalles del juego si se encuentra
    detailViewContainer.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                ${config.visual.showImages ? `<img src="${game.image}" class="img-fluid rounded shadow" alt="${game.title}" style="max-height: 400px; object-fit: cover; width: 100%;">` : ''}
            </div>
            <div class="col-md-6">
                <h2 class="mb-3">${game.title}</h2>
                <p>${game.description}</p>
                <p><strong>Genre:</strong> ${game.genre}</p>
                <p><strong>Status:</strong> ${game.releaseStatus}</p>
                <button id="backToCards" class="btn btn-secondary mt-3">Back to Cards</button>
            </div>
        </div>
    `;
}

export { renderGameCards, renderDetailView };
