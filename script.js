const form = document.getElementById('calcForm');
const resultSection = document.getElementById('resultSection');
const dial = createDial(document.getElementById('dial'));

const goalConfig = {
  lose: {
    label: 'Abnehmen',
    delta: -500,
    hint: 'Rund 500 kcal unter deinem Bedarf, das sind etwa 0.5 kg weniger pro Woche.',
    proteinPerKg: 2.0,
    advice: 'Im Defizit schützt genug Protein deine Muskeln. Sättigende, ballaststoffreiche Lebensmittel wie Gemüse, Hülsenfrüchte und Vollkorn helfen dir, durchzuhalten.',
    tips: [
      'Mageres Fleisch, Fisch, Eier, Quark oder Tofu als Proteinquelle',
      'Viel Gemüse und Salat für Volumen bei wenig Kalorien',
      'Vollkorn statt Zucker und Weissmehl',
      'Genug trinken, am besten Wasser und ungesüsste Getränke'
    ]
  },
  maintain: {
    label: 'Gewicht halten',
    delta: 0,
    hint: 'Entspricht deinem Gesamtumsatz. Dein Gewicht sollte damit stabil bleiben.',
    proteinPerKg: 1.6,
    advice: 'Für ein stabiles Gewicht zählt eine ausgewogene Mischung aller drei Nährstoffe, verteilt über den Tag.',
    tips: [
      'Regelmässige Mahlzeiten mit Protein, Kohlenhydraten und Fett',
      'Vollwertige Kohlenhydrate wie Vollkornbrot, Reis oder Kartoffeln',
      'Gesunde Fette aus Nüssen, Olivenöl oder Avocado',
      'Viel Gemüse und Früchte für Vitamine und Ballaststoffe'
    ]
  },
  gain: {
    label: 'Zunehmen',
    delta: 400,
    hint: 'Rund 400 kcal über deinem Bedarf. Genug für Muskelaufbau, ohne viel Fett anzusetzen.',
    proteinPerKg: 1.8,
    advice: 'Für den Aufbau brauchst du zusätzliche Energie, vor allem aus Kohlenhydraten, dazu genug Protein und regelmässiges Krafttraining.',
    tips: [
      'Kohlenhydratreiche Beilagen wie Reis, Nudeln, Haferflocken oder Brot',
      'Protein zu jeder Hauptmahlzeit: Fleisch, Fisch, Milchprodukte, Hülsenfrüchte',
      'Energiereiche Fette wie Nüsse, Nussmus oder Olivenöl',
      'Lieber vollwertige Lebensmittel als Süssgetränke'
    ]
  }
};

function showReadout(m) {
  document.getElementById('readoutValue').textContent = m.goalCalories;
  document.getElementById('readoutCaption').textContent = `Tagesziel, Ziel: ${goalConfig[m.goal].label}`;

  document.getElementById('gProtein').textContent = `${m.proteinG} g`;
  document.getElementById('gCarbs').textContent = `${m.carbsG} g`;
  document.getElementById('gFat').textContent = `${m.fatG} g`;

  const pct = (kcal) => `${Math.min(kcal / m.goalCalories * 100, 100)}%`;
  document.getElementById('fillProtein').style.width = pct(m.proteinKcal);
  document.getElementById('fillCarbs').style.width = pct(m.carbsKcal);
  document.getElementById('fillFat').style.width = pct(m.fatKcal);

  document.getElementById('readoutMacros').hidden = false;
  document.querySelector('.readout').classList.add('has-value');
  dial.setShares(macroShares(m));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const gender = form.querySelector('input[name="gender"]:checked').value;
  const goal = form.querySelector('input[name="goal"]:checked').value;
  const age = Number(document.getElementById('age').value);
  const height = Number(document.getElementById('height').value);
  const weight = Number(document.getElementById('weight').value);
  const activity = Number(document.getElementById('activity').value);

  if (!age || !height || !weight) return;

  const bmr = gender === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  const tdee = bmr * activity;
  const config = goalConfig[goal];
  const goalCalories = Math.round(tdee + config.delta);

  const proteinG = Math.round(config.proteinPerKg * weight);
  const proteinKcal = proteinG * 4;
  const fatKcal = goalCalories * 0.25;
  const fatG = Math.round(fatKcal / 9);
  const carbsKcal = Math.max(goalCalories - proteinKcal - fatKcal, 0);
  const carbsG = Math.round(carbsKcal / 4);

  const macros = { goal, goalCalories, proteinG, carbsG, fatG, proteinKcal, carbsKcal, fatKcal };
  try {
    localStorage.setItem('kalorienrechner-ziel', goalCalories);
    localStorage.setItem('kalorienrechner-goal', goal);
    localStorage.setItem('kalorienrechner-makros', JSON.stringify(macros));
  } catch (err) { /* Speicher nicht verfügbar */ }

  document.getElementById('bmrValue').textContent = `${Math.round(bmr)} kcal`;
  document.getElementById('tdeeValue').textContent = `${Math.round(tdee)} kcal`;
  document.getElementById('goalValue').textContent = `${goalCalories} kcal`;
  document.getElementById('goalHint').textContent = config.hint;

  document.getElementById('adviceText').textContent = config.advice;
  const list = document.getElementById('adviceList');
  list.innerHTML = '';
  config.tips.forEach(tip => {
    const li = document.createElement('li');
    li.textContent = tip;
    list.appendChild(li);
  });

  showReadout(macros);
  resultSection.hidden = false;
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Letztes Ergebnis wieder anzeigen
const previous = storedMacros();
if (previous && goalConfig[previous.goal]) showReadout(previous);
