const dayForm = document.getElementById('dayForm');
const dayList = document.getElementById('dayList');
const emptyState = document.getElementById('emptyState');
const dayDate = document.getElementById('dayDate');
const storageKey = 'kalorienrechner-tage';
let savedDays = JSON.parse(localStorage.getItem(storageKey) || '[]');

function formatDate(dateString) {
  return new Intl.DateTimeFormat('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${dateString}T12:00:00`));
}

function nextDayAdvice(day) {
  const target = Number(localStorage.getItem('kalorienrechner-ziel')) || 0;
  if (!target) return 'Berechne zuerst deinen persönlichen Bedarf auf der Rechner-Seite, damit die Empfehlung deinen Zielwert berücksichtigt.';

  const difference = day.calories - target;
  if (difference > 250) return `Heute waren es etwa ${difference} kcal über deinem Ziel. Plane morgen etwas leichtere Portionen und setze auf Gemüse, Protein und ausreichend Wasser.`;
  if (difference < -250) return `Heute waren es etwa ${Math.abs(difference)} kcal unter deinem Ziel. Ergänze morgen eine nährstoffreiche Mahlzeit, damit du dein Ziel regelmässiger erreichst.`;
  return 'Du lagst heute nah an deinem Ziel. Behalte diese gute Balance morgen bei und verteile dein Protein wieder auf mehrere Mahlzeiten.';
}

function renderDays() {
  dayList.innerHTML = '';
  emptyState.hidden = savedDays.length > 0;
  savedDays.sort((a, b) => b.date.localeCompare(a.date));

  savedDays.forEach((day) => {
    const article = document.createElement('article');
    article.className = 'day-card';
    article.innerHTML = `
      <div class="day-card-header">
        <div><p class="day-date">${formatDate(day.date)}</p><p class="day-weight">${day.weight.toLocaleString('de-CH')} kg</p></div>
        <button type="button" class="delete-day" data-date="${day.date}" aria-label="Eintrag vom ${formatDate(day.date)} löschen">Löschen</button>
      </div>
      <div class="day-stats">
        <div><strong>${day.calories}</strong><span>kcal</span></div>
        <div><strong>${day.protein} g</strong><span>Protein</span></div>
        <div><strong>${day.carbs} g</strong><span>Kohlenhydrate</span></div>
        <div><strong>${day.fat} g</strong><span>Fett</span></div>
      </div>
      <p class="day-advice"><span>Empfehlung für morgen</span>${nextDayAdvice(day)}</p>`;
    dayList.appendChild(article);
  });
}

dayForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const day = {
    date: dayDate.value,
    calories: Number(document.getElementById('dayCalories').value),
    protein: Number(document.getElementById('dayProtein').value),
    carbs: Number(document.getElementById('dayCarbs').value),
    fat: Number(document.getElementById('dayFat').value),
    weight: Number(document.getElementById('dayWeight').value)
  };

  savedDays = savedDays.filter((savedDay) => savedDay.date !== day.date);
  savedDays.push(day);
  localStorage.setItem(storageKey, JSON.stringify(savedDays));
  renderDays();
  dayForm.reset();
  dayDate.value = new Date().toISOString().slice(0, 10);
});

dayList.addEventListener('click', (e) => {
  if (!e.target.matches('.delete-day')) return;
  savedDays = savedDays.filter((day) => day.date !== e.target.dataset.date);
  localStorage.setItem(storageKey, JSON.stringify(savedDays));
  renderDays();
});

dayDate.value = new Date().toISOString().slice(0, 10);
renderDays();
