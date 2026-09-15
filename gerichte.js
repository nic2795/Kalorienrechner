const recipes = [
  {
    title: 'Gỏi Gà — vietnamesischer Hähnchen-Salat',
    goal: 'lose',
    category: 'Proteinreich & leicht',
    time: '30 min',
    description: 'Knackiger Salat mit Hähnchen und frischen Zutaten. Passt gut, wenn du Volumen und Protein bei moderater Energiedichte suchst.',
    source: 'Kitchen Stories',
    url: 'https://www.kitchenstories.com/salat/goi-ga-vietnamesischer-hahnchen-salat/199826'
  },
  {
    title: 'Green Goddess-Gurkensalat mit Harissa-Kichererbsen',
    goal: 'lose',
    category: 'Ballaststoffreich',
    time: '30 min',
    description: 'Gurke, Kräuter und Kichererbsen bringen viel Biss, Ballaststoffe und pflanzliches Protein auf den Teller.',
    source: 'Kitchen Stories',
    url: 'https://www.kitchenstories.com/salat/green-goddess-gurkensalat-mit-harissa-kichererbsen/199098'
  },
  {
    title: 'Overnight Oats mit frischen Beeren',
    goal: 'maintain',
    category: 'Ausgewogenes Frühstück',
    time: 'Vorbereitung am Vorabend',
    description: 'Haferflocken, Chiasamen, Sojamilch, Beeren und Banane ergeben ein sättigendes Frühstück mit Kohlenhydraten und Ballaststoffen.',
    source: 'Eat this!',
    url: 'https://www.eat-this.org/overnight-oats-mit-frischen-beeren/'
  },
  {
    title: 'Kabeljau „en papillote“ mit Aprikosen',
    goal: 'maintain',
    category: 'Leicht & ausgewogen',
    time: '45 min',
    description: 'Fisch mit Aprikosen, Oliven und Estragon: eine ausgewogene Kombination aus Protein, Gemüse und aromatischen Fetten.',
    source: 'Kitchen Stories',
    url: 'https://www.kitchenstories.com/fischgerichte/kabeljau-en-papillote-mit-aprikosen-oliven-und-estragon/200808'
  },
  {
    title: 'Einfache Onigiri mit gegrilltem Lachs',
    goal: 'maintain',
    category: 'Protein & Kohlenhydrate',
    time: '30 min',
    description: 'Reis und Lachs liefern eine praktische, gut portionierbare Mahlzeit für einen stabilen Tagesrhythmus.',
    source: 'Kitchen Stories',
    url: 'https://www.kitchenstories.com/japanisches-essen/einfache-onigiri-mit-gegrilltem-lachs/197561'
  },
  {
    title: 'Feigen-Pasta mit Balsamico und Pinienkernen',
    goal: 'gain',
    category: 'Energiedicht',
    time: '20 min',
    description: 'Pasta, Pinienkerne und fruchtige Aromen machen daraus eine kompakte Mahlzeit, wenn du mehr Energie unterbringen möchtest.',
    source: 'Kitchen Stories',
    url: 'https://www.kitchenstories.com/italienische-kueche/feigen-pasta-mit-balsamico-und-pinienkernen/201371'
  },
  {
    title: 'One-Pan-Hähnchen mit Pfirsichen',
    goal: 'gain',
    category: 'Protein & Extra-Energie',
    time: '35 min',
    description: 'Hähnchen als Proteinbasis, kombiniert mit einer energiereichen Beilage und fruchtiger Note für ein sättigendes Hauptgericht.',
    source: 'Kitchen Stories',
    url: 'https://www.kitchenstories.com/haehnchen-rezepte/one-pan-hahnchen-mit-pfirsichen/194682'
  },
  {
    title: 'Gegrillte Banane mit Tahini-Macadamia-Füllung',
    goal: 'gain',
    category: 'Energiedichter Snack',
    time: '20 min',
    description: 'Banane, Tahini und Macadamia bringen konzentrierte Energie in einen kleinen Snack. Die Portion lässt sich einfach anpassen.',
    source: 'Kitchen Stories',
    url: 'https://www.kitchenstories.com/sommergerichte/gegrillte-banane-mit-tahini-macadamia-fullung-und-vanilleeis/175809'
  }
];

const goalLabels = {
  lose: 'Abnehmen',
  maintain: 'Gewicht halten',
  gain: 'Zunehmen'
};

const recipeGrid = document.getElementById('recipeGrid');
const goalIntro = document.getElementById('goalIntro');
const filterButtons = document.querySelectorAll('.goal-filter');
let selectedGoal = localStorage.getItem('kalorienrechner-goal') || 'maintain';

function renderRecipes() {
  recipeGrid.innerHTML = '';
  const matchingRecipes = recipes.filter((recipe) => recipe.goal === selectedGoal);
  goalIntro.textContent = `Ausgewählt für: ${goalLabels[selectedGoal]}. Die Gerichte sind nach Portionsgrösse und Zutaten anpassbar.`;

  matchingRecipes.forEach((recipe) => {
    const card = document.createElement('article');
    card.className = 'recipe-card';
    card.innerHTML = `
      <div class="recipe-card-top"><span>${recipe.category}</span><span>${recipe.time}</span></div>
      <h2>${recipe.title}</h2>
      <p>${recipe.description}</p>
      <a class="recipe-source" href="${recipe.url}" target="_blank" rel="noopener noreferrer">Rezept bei ${recipe.source} öffnen <span aria-hidden="true">↗</span></a>`;
    recipeGrid.appendChild(card);
  });

  filterButtons.forEach((button) => {
    button.classList.toggle('selected', button.dataset.goal === selectedGoal);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedGoal = button.dataset.goal;
    localStorage.setItem('kalorienrechner-goal', selectedGoal);
    renderRecipes();
  });
});

renderRecipes();
