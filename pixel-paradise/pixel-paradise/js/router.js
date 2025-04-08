/**
 * router.js
 * 
 * Este módulo maneja el enrutamiento del lado del cliente para la aplicación.
 * Permite navegar entre diferentes vistas sin recargar la página completa,
 * creando una experiencia de Single Page Application (SPA).
 */

/**
 * Objeto Router que gestiona las rutas de la aplicación
 */
class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    
    // Escuchar cambios en el hash de la URL
    window.addEventListener('hashchange', () => this.handleRouteChange());
    
    // También manejar la carga inicial de la página
    window.addEventListener('load', () => this.handleRouteChange());
  }

  /**
   * Añade una nueva ruta al router
   * @param {string} route - El nombre de la ruta (sin el símbolo #)
   * @param {Function} handler - Función a ejecutar cuando se active esta ruta
   */
  addRoute(route, handler) {
    this.routes[route] = handler;
  }

  /**
   * Maneja el cambio de ruta basado en el hash de la URL
   */
  handleRouteChange() {
    // Obtener la ruta actual desde el hash de la URL
    let hash = window.location.hash.substring(1); // Eliminar el símbolo #
    
    // Si no hay hash o la página es index.html, usar 'home' como ruta por defecto
    if (!hash || window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
      hash = 'home';
      // Establecer la URL con el hash correspondiente sin recargar la página
      window.history.replaceState(null, null, '#home');
    }
    
    // Extraer la ruta base (sin parámetros)
    const routeParts = hash.split('/');
    const baseRoute = routeParts[0];
    
    // Comprobar si existe un manejador para esta ruta
    if (this.routes[baseRoute]) {
      // Si existe un manejador, ejecutarlo con cualquier parámetro
      this.currentRoute = baseRoute;
      this.routes[baseRoute](routeParts.slice(1));
    } else {
      // Si la ruta no existe, redirigir a home o mostrar página 404
      console.error('Ruta no encontrada:', hash);
      window.location.hash = '#home';
    }
  }

  /**
   * Navega a una ruta específica
   * @param {string} route - La ruta a la que navegar
   */
  navigateTo(route) {
    window.location.hash = route;
  }

  /**
   * Obtiene la ruta actual
   * @returns {string} La ruta actual
   */
  getCurrentRoute() {
    return this.currentRoute;
  }
}

// Exportar una instancia única del router para usar en toda la aplicación
export default new Router();
