// Liste de vos événements
// Pour ajouter un nouvel événement, copiez-collez un bloc entre accolades {} et modifiez les informations.
const evenements = [
  {
    titre: "Premier Webinaire YLTA",
    date: "À venir",
    description: "Notre tout premier webinaire réunira des experts de la Supply Chain pour discuter des opportunités de carrière pour les jeunes en Afrique.",
    image: "📅",
    estImage: false
  },
  {
    titre: "Lancement Officiel de YLTA",
    date: "2025",
    description: "L'association Youth in Logistics & Transport - Africa est officiellement lancée par ses 7 membres fondateurs avec pour ambition de connecter les jeunes du secteur à travers le continent.",
    image: "🚀", // Mettez ici le nom de l'image (ex: "lancement.jpg") ou un emoji
    estImage: false // Mettez "true" si c'est une vraie image, "false" si c'est un emoji
  },
  {
    titre: "Ouverture du Groupe WhatsApp",
    date: "2025",
    description: "Rejoignez notre groupe WhatsApp pour échanger avec d'autres passionnés de logistique et transport, partager des opportunités et rester informés de nos activités.",
    image: "🤝",
    estImage: false
  }
];

// Ne modifiez pas le code ci-dessous
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('events-container');
  if (!container) return;

  if (evenements.length === 0) {
    container.innerHTML = `
      <div class="news-empty reveal visible">
        <div class="empty-icon">📰</div>
        <h3>Les actualités arrivent bientôt !</h3>
        <p>Rejoignez YLTA pour être informé de nos prochains événements.</p>
      </div>
    `;
    return;
  }

  const html = evenements.map((evt, index) => {
    // Gestion de l'image
    let imageHTML = '';
    if (evt.estImage) {
      // Affichage d'une vraie image
      imageHTML = `<img src="${evt.image}" alt="${evt.titre}" style="width: 100%; height: 200px; object-fit: cover; border-bottom: 1px solid var(--border-color); display: block;">`;
    } else {
      // Affichage d'un emoji (design d'origine)
      imageHTML = `<div class="news-img">${evt.image}</div>`;
    }

    // Assignation de la classe d'animation (stagger)
    const staggerClass = 'stagger-' + Math.min(index + 1, 7);

    return `
      <div class="news-card reveal ${staggerClass}">
        ${imageHTML}
        <div class="news-body">
          <p class="news-date">${evt.date}</p>
          <h3>${evt.titre}</h3>
          <p>${evt.description}</p>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
  
  // Relancer l'observeur d'intersection pour les nouveaux éléments
  setTimeout(() => {
    const revealElements = container.querySelectorAll('.reveal');
    if (window.revealObserver) {
      revealElements.forEach(el => window.revealObserver.observe(el));
    }
  }, 100);
});
