const form = document.getElementById('calcForm');
const resultSection = document.getElementById('resultSection');

const goalConfig = {
  lose: {
    label: 'Abnehmen',
    delta: -500,
    hint: 'Ein Defizit von ca. 500 kcal entspricht rund 0.5 kg Gewichtsverlust pro Woche.',
    proteinPerKg: 2.0,
    advice: 'Achte im Defizit besonders auf ausreichend Protein — das schützt deine Muskulatur — und auf sättigende, ballaststoffreiche Lebensmittel wie Gemüse, Hülsenfrüchte und Vollkornprodukte.',
    tips: [
      'Mageres Fleisch, Fisch, Eier, Quark oder Tofu für die Proteinzufuhr',
      'Viel Gemüse und Salat für Volumen bei wenig Kalorien',
      'Vollkorn-Kohlenhydrate statt raffiniertem Zucker und Weissmehl',
      'Genug trinken, vor allem Wasser und ungesüsste Getränke'
    ]
  },
  maintain: {
    label: 'Gewicht halten',
    delta: 0,
    hint: 'Dieser Wert entspricht deinem geschätzten Gesamtumsatz — dein Gewicht sollte damit stabil bleiben.',
    proteinPerKg: 1.6,
    advice: 'Für ein stabiles Gewicht zählt vor allem eine ausgewogene Mischung aus allen drei Nährstoffen über den Tag verteilt.',
    tips: [
      'Regelmässige Mahlzeiten mit Protein-, Kohlenhydrat- und Fettquelle',
      'Vollwertige Kohlenhydrate wie Vollkornbrot, Reis oder Kartoffeln',
      'Gesunde Fette aus Nüssen, Olivenöl oder Avocado',
      'Viel Gemüse und Früchte für Vitamine und Ballaststoffe'
    ]
  },
  gain: {
    label: 'Zunehmen',
    delta: 400,
    hint: 'Ein moderater Überschuss von ca. 400 kcal fördert Muskelaufbau, ohne zu viel Fettmasse aufzubauen.',
    proteinPerKg: 1.8,
    advice: 'Für einen Aufbau brauchst du zusätzliche Energie vor allem aus Kohlenhydraten, kombiniert mit genug Protein für den Muskelaufbau und regelmässigem Krafttraining.',
    tips: [
      'Kohlenhydratreiche Beilagen wie Reis, Nudeln, Haferflocken oder Brot',
      'Protein zu jeder Hauptmahlzeit — Fleisch, Fisch, Milchprodukte, Hülsenfrüchte',
      'Kalorienreiche, gesunde Fette wie Nüsse, Nussmus oder Olivenöl',
      'Nicht zu viele Kalorien aus Süssgetränken — lieber vollwertige Lebensmittel'
    ]
  }
};

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
  localStorage.setItem('kalorienrechner-ziel', goalCalories);
  localStorage.setItem('kalorienrechner-goal', goal);

  const proteinG = Math.round(config.proteinPerKg * weight);
  const proteinKcal = proteinG * 4;
  const fatKcal = goalCalories * 0.25;
  const fatG = Math.round(fatKcal / 9);
  const carbsKcal = Math.max(goalCalories - proteinKcal - fatKcal, 0);
  const carbsG = Math.round(carbsKcal / 4);

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

  document.getElementById('readoutValue').textContent = goalCalories;
  document.getElementById('readoutCaption').textContent = `Empfehlung für dein Ziel: ${config.label}`;

  document.getElementById('gProtein').textContent = `${proteinG} g`;
  document.getElementById('gCarbs').textContent = `${carbsG} g`;
  document.getElementById('gFat').textContent = `${fatG} g`;

  document.getElementById('fillProtein').style.width = `${Math.min(proteinKcal / goalCalories * 100, 100)}%`;
  document.getElementById('fillCarbs').style.width = `${Math.min(carbsKcal / goalCalories * 100, 100)}%`;
  document.getElementById('fillFat').style.width = `${Math.min(fatKcal / goalCalories * 100, 100)}%`;

  document.getElementById('readoutMacros').hidden = false;
  resultSection.hidden = false;
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

