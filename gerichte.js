const recipes = [
  {
    title: 'Gỏi Gà, vietnamesischer Hähnchen-Salat',
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
const dial = createDial(document.getElementById('dial'));

function load(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
let selectedGoal = load('kalorienrechner-goal') || 'maintain';

const macros = storedMacros();
if (macros) {
  document.getElementById('readoutValue').textContent = macros.goalCalories;
  document.getElementById('readoutCaption').textContent = `Dein Tagesziel aus dem Rechner. Ein Hauptgericht deckt davon meist ein Viertel bis ein Drittel.`;
  document.querySelector('.readout').classList.add('has-value');
  dial.setShares(macroShares(macros));
}

function renderRecipes() {
  recipeGrid.innerHTML = '';
  const matchingRecipes = recipes.filter((recipe) => recipe.goal === selectedGoal);
  goalIntro.textContent = `${matchingRecipes.length} Ideen zum Ziel ${goalLabels[selectedGoal]}. Portionsgrösse und Zutaten kannst du an deinen Bedarf anpassen.`;

  matchingRecipes.forEach((recipe) => {
    const card = document.createElement('article');
    card.className = 'recipe-card';
    card.innerHTML = `
      <p class="recipe-meta"><span>${recipe.category}</span><span>${recipe.time}</span></p>
      <h2>${recipe.title}</h2>
      <p class="recipe-text">${recipe.description}</p>
      <a class="recipe-source" href="${recipe.url}" target="_blank" rel="noopener noreferrer">Rezept bei ${recipe.source}</a>`;
    recipeGrid.appendChild(card);
  });

  filterButtons.forEach((button) => {
    const active = button.dataset.goal === selectedGoal;
    button.classList.toggle('selected', active);
    button.setAttribute('aria-pressed', active);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedGoal = button.dataset.goal;
    try { localStorage.setItem('kalorienrechner-goal', selectedGoal); } catch (e) { /* ignorieren */ }
    renderRecipes();
  });
});

renderRecipes();
