/**
 * views.js
 * 
 * Este módulo contiene las plantillas HTML y lógica para renderizar
 * las diferentes vistas de la aplicación.
 */

/**
 * Renderiza la vista principal con la cuadrícula de juegos
 * @param {HTMLElement} container - El contenedor donde se renderizará la vista
 * @param {string} title - Título a mostrar en esta vista
 */
function renderHomeView(container, title = "Explora Nuestros Mundos Digitales") {
  // Usar el template para la página de inicio
  const template = document.getElementById('home-template');
  
  if (template) {
    // Clonar el contenido del template
    const content = template.content.cloneNode(true);
    
    // Actualizar el título si es necesario
    const titleElement = content.querySelector('#sectionTitle');
    if (titleElement && title) {
      titleElement.textContent = title;
    }
    
    // Limpiar y añadir el contenido al contenedor
    container.innerHTML = '';
    container.appendChild(content);
  } else {
    // Fallback en caso de que el template no exista
    container.innerHTML = `
      <h2 class="text-center mt-5 mb-4" id="sectionTitle">${title}</h2>
      <div id="controls" class="mb-3 d-flex justify-content-between"></div>
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" id="gameGrid"></div>
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center mt-4" id="paginationControls"></ul>
      </nav>
      <div id="detailView" class="mt-5" style="display: none;"></div>
    `;
  }
}

/**
 * Renderiza la vista de nuevos lanzamientos
 * @param {HTMLElement} container - El contenedor donde se renderizará la vista
 * @param {Array} games - Lista de juegos
 */
function renderNewReleasesView(container, games) {
  // Usar el template para la página de nuevos lanzamientos
  const template = document.getElementById('new-releases-template');
  
  if (template) {
    // Clonar el contenido del template
    const content = template.content.cloneNode(true);
    
    // Limpiar y añadir el contenido al contenedor
    container.innerHTML = '';
    container.appendChild(content);
    
    // Ahora que el template está en el DOM, podemos encontrar el grid
    const releasedGames = games.filter(game => 
      game.releaseStatus.toLowerCase() === 'released' || 
      game.releaseStatus.toLowerCase() === 'realeased' // Para manejar el typo en los datos
    );
    
    const newReleasesGrid = document.getElementById('newReleasesGrid');
    if (newReleasesGrid && releasedGames.length > 0) {
      // Excluir el juego destacado que ya se muestra
      const otherGames = releasedGames.filter(game => game.id !== 'puzle');
      
      newReleasesGrid.innerHTML = otherGames.map(game => `
        <div class="col">
          <div class="card h-100 shadow">
            <img src="${game.image}" class="card-img-top" alt="${game.title}" style="height: 200px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${game.title}</h5>
              <p class="card-text">${game.description}</p>
              <div class="mt-auto">
                <span class="badge bg-success mb-2">Just Released!</span>
                <a href="#detail/${game.id}" class="btn btn-success w-100">View Details</a>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }
  } else {
    // Fallback en caso de que el template no exista
    // Filtrar solo juegos lanzados
    const releasedGames = games.filter(game => 
      game.releaseStatus.toLowerCase() === 'released' || 
      game.releaseStatus.toLowerCase() === 'realeased'
    );
    
    container.innerHTML = `
      <h2 class="text-center mt-5 mb-4">Nuevos Lanzamientos</h2>
      <p class="text-center mb-4">¡Descubre nuestros últimos lanzamientos de juegos!</p>
      
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" id="newReleasesGrid">
        ${releasedGames.map(game => `
          <div class="col">
            <div class="card h-100">
              <img src="${game.image}" class="card-img-top" alt="${game.title}" style="height: 200px; object-fit: cover;">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${game.title}</h5>
                <p class="card-text">${game.description}</p>
                <div class="mt-auto">
                  <span class="badge bg-success mb-2">¡Recién Lanzado!</span>
                  <a href="#detail/${game.id}" class="btn btn-success w-100">Ver Detalles</a>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

/**
 * Renderiza la vista de próximos lanzamientos
 * @param {HTMLElement} container - El contenedor donde se renderizará la vista
 * @param {Array} games - Lista de juegos
 */
function renderComingSoonView(container, games) {
  // Usar el template para la página de próximos lanzamientos
  const template = document.getElementById('coming-soon-template');
  
  if (template) {
    // Clonar el contenido del template
    const content = template.content.cloneNode(true);
    
    // Limpiar y añadir el contenido al contenedor
    container.innerHTML = '';
    container.appendChild(content);
    
    // Ahora que el template está en el DOM, podemos encontrar el grid
    const upcomingGames = games.filter(game => 
      game.releaseStatus.toLowerCase() === 'coming_soon' || 
      game.releaseStatus.toLowerCase().includes('development')
    );
    
    const comingSoonGrid = document.getElementById('comingSoonGrid');
    if (comingSoonGrid && upcomingGames.length > 0) {
      // Excluir Portal 2 que ya se muestra
      const otherGames = upcomingGames.filter(game => game.id !== 'mk');
      
      if (otherGames.length > 0) {
        comingSoonGrid.innerHTML = otherGames.map(game => `
          <div class="col">
            <div class="card h-100 shadow">
              <div class="position-relative">
                <img src="${game.image}" class="card-img-top" alt="${game.title}" style="height: 200px; object-fit: cover; filter: grayscale(30%);">
                <div class="position-absolute top-0 end-0 m-2">
                  <span class="badge bg-warning text-dark">Coming Soon</span>
                </div>
              </div>
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${game.title}</h5>
                <p class="card-text">${game.description}</p>
                <div class="mt-auto">
                  <a href="#detail/${game.id}" class="btn btn-outline-success w-100">Preview Details</a>
                </div>
              </div>
            </div>
          </div>
        `).join('');
      } else {
        comingSoonGrid.innerHTML = `
          <div class="col-12 text-center">
            <p class="text-muted">No additional upcoming games at the moment.</p>
          </div>
        `;
      }
    }
  } else {
    // Fallback en caso de que el template no exista
    // Filtrar solo juegos próximos
    const upcomingGames = games.filter(game => 
      game.releaseStatus.toLowerCase() === 'coming_soon' || 
      game.releaseStatus.toLowerCase().includes('development')
    );
    
    container.innerHTML = `
      <h2 class="text-center mt-5 mb-4">Próximamente</h2>
      <p class="text-center mb-4">¡Prepárate para estos próximos títulos!</p>
      
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" id="comingSoonGrid">
        ${upcomingGames.map(game => `
          <div class="col">
            <div class="card h-100">
              <div class="position-relative">
                <img src="${game.image}" class="card-img-top" alt="${game.title}" style="height: 200px; object-fit: cover; filter: grayscale(30%);">
                <div class="position-absolute top-0 end-0 m-2">
                  <span class="badge bg-warning text-dark">Coming Soon</span>
                </div>
              </div>
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${game.title}</h5>
                <p class="card-text">${game.description}</p>
                <div class="mt-auto">
                  <a href="#detail/${game.id}" class="btn btn-outline-success w-100">Preview Details</a>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    // Si no hay juegos próximos, mostrar mensaje
    if (upcomingGames.length === 0) {
      container.innerHTML = `
        <h2 class="text-center mt-5 mb-4">Próximamente</h2>
        <div class="alert alert-info text-center">
          <i class="bi bi-info-circle me-2"></i>
          No hay juegos próximos por el momento. ¡Vuelve más tarde!
        </div>
      `;
    }
  }
}

/**
 * Renderiza la vista Acerca de Nosotros
 * @param {HTMLElement} container - El contenedor donde se renderizará la vista
 */
function renderAboutUsView(container) {
  // Usar el template para la página Acerca de Nosotros
  const template = document.getElementById('about-template');
  
  if (template) {
    // Clonar el contenido del template
    const content = template.content.cloneNode(true);
    
    // Limpiar y añadir el contenido al contenedor
    container.innerHTML = '';
    container.appendChild(content);
    
    // Agregar event listener para el formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('¡Gracias por tu mensaje! Te responderemos pronto.');
        this.reset();
      });
    }
  } else {
    // Fallback en caso de que el template no exista
    container.innerHTML = `
      <div class="container mt-5">
        <h2 class="text-center mb-4">Sobre Pixel Paradise</h2>
        
        <div class="row mb-5">
          <div class="col-md-6">
            <img src="assets/images/team.png" class="img-fluid rounded shadow-lg" alt="Our team" 
                 onerror="this.src='https://placehold.co/600x400?text=Pixel+Paradise+Team'">
          </div>
          <div class="col-md-6">
            <h3 class="mb-3">Our Mission</h3>
            <p>Pixel Paradise was founded in 2023 with a simple mission: to connect gamers with their next favorite game. We believe that gaming is more than just entertainment—it's about experiences, stories, and communities.</p>
            <p>Our curated collection showcases both mainstream titles and hidden gems across all genres, helping you discover games that resonate with your unique tastes and interests.</p>
          </div>
        </div>
        
        <div class="row mb-4">
          <div class="col-md-12">
            <h3 class="text-center mb-4">Our Team</h3>
            <div class="row row-cols-1 row-cols-md-3 g-4">
              <div class="col">
                <div class="card h-100 text-center">
                  <div class="card-body">
                    <div class="mb-3 team-avatar">
                      <img src="assets/images/member1.png" alt="Team Member">
                    </div>
                    <h5 class="card-title">Alex Rodriguez</h5>
                    <p class="card-text text-muted">Founder & Lead Developer</p>
                    <p class="card-text">Gaming enthusiast with a passion for creating seamless digital experiences.</p>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card h-100 text-center">
                  <div class="card-body">
                    <div class="mb-3 team-avatar">
                      <img src="assets/images/member2.png" alt="Team Member">
                    </div>
                    <h5 class="card-title">Jamie Chen</h5>
                    <p class="card-text text-muted">Content Curator</p>
                    <p class="card-text">Always on the lookout for exciting new titles across all gaming platforms.</p>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card h-100 text-center">
                  <div class="card-body">
                    <div class="mb-3 team-avatar">
                      <img src="assets/images/member3.png" alt="Team Member">
                    </div>
                    <h5 class="card-title">Sam Taylor</h5>
                    <p class="card-text text-muted">UX Designer</p>
                    <p class="card-text">Dedicated to creating intuitive and beautiful interfaces for our game showcase.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-12">
            <h3 class="text-center mb-4">Contact Us</h3>
            <div class="card">
              <div class="card-body">
                <form>
                  <div class="mb-3">
                    <label for="nameInput" class="form-label">Name</label>
                    <input type="text" class="form-control" id="nameInput" placeholder="Your name">
                  </div>
                  <div class="mb-3">
                    <label for="emailInput" class="form-label">Email</label>
                    <input type="email" class="form-control" id="emailInput" placeholder="your.email@example.com">
                  </div>
                  <div class="mb-3">
                    <label for="messageInput" class="form-label">Message</label>
                    <textarea class="form-control" id="messageInput" rows="3" placeholder="How can we help you?"></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary">Send Message</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

export { 
  renderHomeView, 
  renderNewReleasesView, 
  renderComingSoonView, 
  renderAboutUsView 
};
