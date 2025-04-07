/**
 * Valida la estructura de los datos JSON cargados.
 * Esta función se asegura de que cada juego tenga los campos obligatorios 
 * y que estos sean del tipo y formato esperado.
 *
 * @param {Array} data - Datos JSON cargados (esperamos un array de objetos juego).
 * @throws {Error} - Lanza un error con detalles si los datos no son válidos.
 */
function validateGameData(data) {
    // Verificamos que el contenido principal sea un array
    if (!Array.isArray(data)) {
        throw new Error("Invalid data format: Expected an array of games.");
    }

    // Recorremos cada objeto "juego" dentro del array para validarlo individualmente
    data.forEach((game, index) => {
        // Validamos que el campo `id` exista, sea una cadena y no esté vacío
        if (typeof game.id !== 'string' || game.id.trim() === '') {
            throw new Error(`Invalid game ID at index ${index}.`);
        }

        // Validamos que el campo `title` exista, sea una cadena y no esté vacío
        if (typeof game.title !== 'string' || game.title.trim() === '') {
            throw new Error(`Invalid game title at index ${index}.`);
        }

        // Validamos que `description` exista y sea una cadena (puede estar vacía, pero debe ser string)
        if (typeof game.description !== 'string') {
            throw new Error(`Invalid game description at index ${index}.`);
        }

        // Validamos que `genre` sea una cadena no vacía (ej: 'RPG', 'Shooter', etc.)
        if (typeof game.genre !== 'string' || game.genre.trim() === '') {
            throw new Error(`Invalid game genre at index ${index}.`);
        }

        // Validamos que el estado de lanzamiento (`releaseStatus`) sea una cadena no vacía (ej: 'Released', 'In development')
        if (typeof game.releaseStatus !== 'string' || game.releaseStatus.trim() === '') {
            throw new Error(`Invalid game release status at index ${index}.`);
        }

        // Validamos que haya una URL de imagen válida como string no vacío
        if (typeof game.image !== 'string' || game.image.trim() === '') {
            throw new Error(`Invalid game image URL at index ${index}.`);
        }
    });
}

/**
 * Carga un archivo JSON desde una ruta especificada.
 * Realiza una petición HTTP al archivo y lo convierte en un objeto JS.
 *
 * @param {string} filePath - Ruta relativa o absoluta del archivo JSON (ej: './data/games.json').
 * @returns {Promise<Object>} - Promesa que resuelve con los datos validados.
 * @throws {Error} - Lanza un error si la carga falla o si el contenido no es válido.
 */
async function loadJSON(filePath) {
    // Realizamos la solicitud al archivo JSON
    const response = await fetch(filePath);

    // Si la respuesta no es OK (404, 500, etc.), lanzamos error
    if (!response.ok) throw new Error(`Error loading JSON: ${response.status}`);

    // Convertimos el cuerpo de la respuesta en un objeto JS
    const data = await response.json();

    // Validamos que los datos cargados cumplan con la estructura esperada
    validateGameData(data);

    // Retornamos los datos ya validados
    return data;
}

/**
 * Carga un archivo YAML desde una ruta especificada y lo transforma a JSON.
 * Es útil si los datos vienen de un CMS o un archivo de configuración legible por humanos.
 *
 * @param {string} filePath - Ruta relativa o absoluta del archivo YAML (ej: './data/games.yaml').
 * @returns {Promise<Object>} - Promesa que resuelve con los datos convertidos a JSON.
 * @throws {Error} - Lanza un error si la carga falla.
 */
async function loadYAML(filePath) {
    // Hacemos la solicitud HTTP para obtener el contenido YAML como texto
    const response = await fetch(filePath);

    // Verificamos si la respuesta fue exitosa
    if (!response.ok) throw new Error(`Error loading YAML: ${response.status}`);

    // Extraemos el texto YAML del cuerpo de la respuesta
    const yamlText = await response.text();

    // Usamos la librería jsyaml para convertir el texto YAML en un objeto JavaScript (JSON)
    return jsyaml.load(yamlText);
}

// Exportamos las funciones para que puedan ser importadas en otros archivos del proyecto
export { loadJSON, loadYAML };
