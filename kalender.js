const dayForm = document.getElementById('dayForm');
const dayList = document.getElementById('dayList');
const emptyState = document.getElementById('emptyState');
const dayDate = document.getElementById('dayDate');
const storageKey = 'kalorienrechner-tage';
const dial = createDial(document.getElementById('dial'));

function load(key, fallback) {
  try { return localStorage.getItem(key) ?? fallback; } catch (e) { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, value); } catch (e) { /* Speicher nicht verfügbar */ }
}

let savedDays = JSON.parse(load(storageKey, '[]'));
const target = Number(load('kalorienrechner-ziel', 0)) || 0;

function todayLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('de-CH', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${dateString}T12:00:00`));
}

function nextDayAdvice(day) {
  if (!target) return 'Berechne zuerst deinen Bedarf im Rechner, dann bezieht sich die Empfehlung auf dein Tagesziel.';

  const difference = day.calories - target;
  if (difference > 250) return `Etwa ${difference} kcal über deinem Ziel. Plane morgen etwas kleinere Portionen mit mehr Gemüse und Protein, und trink genug Wasser.`;
  if (difference < -250) return `Etwa ${Math.abs(difference)} kcal unter deinem Ziel. Ergänze morgen eine nährstoffreiche Mahlzeit, damit du dein Ziel regelmässiger erreichst.`;
  return 'Nah an deinem Ziel. Mach morgen so weiter und verteil dein Protein wieder auf mehrere Mahlzeiten.';
}

function statusColor(calories) {
  if (!target) return 'var(--c-carbs)';
  const diff = calories - target;
  if (diff > 250) return 'var(--c-fat)';
  if (diff < -250) return 'var(--c-protein)';
  return 'var(--c-carbs)';
}

function renderReadout() {
  const latest = savedDays[0];
  const value = document.getElementById('readoutValue');
  const caption = document.getElementById('readoutCaption');
  const facts = document.getElementById('readoutFacts');
  const readout = document.querySelector('.readout');

  if (!latest) {
    value.textContent = '0000';
    readout.classList.remove('has-value');
    facts.hidden = true;
    dial.setShares([]);
    return;
  }

  readout.classList.add('has-value');
  value.textContent = latest.calories;
  facts.hidden = false;
  document.getElementById('factTarget').textContent = target ? `${target} kcal` : 'nicht berechnet';
  document.getElementById('factWeight').textContent = `${latest.weight.toLocaleString('de-CH')} kg`;
  document.getElementById('factCount').textContent = savedDays.length;

  if (target) {
    const pct = Math.round(latest.calories / target * 100);
    caption.textContent = `${formatDate(latest.date)}: ${pct} % deines Tagesziels. Der Strich auf der Skala markiert 100 %.`;
    dial.setProgress(latest.calories / target, statusColor(latest.calories));
  } else {
    caption.textContent = `${formatDate(latest.date)}. Berechne im Rechner dein Tagesziel, um es hier zu vergleichen.`;
    dial.setShares([
      { value: latest.protein * 4, color: 'var(--c-protein)' },
      { value: latest.carbs * 4, color: 'var(--c-carbs)' },
      { value: latest.fat * 9, color: 'var(--c-fat)' }
    ]);
  }
}

function renderDays() {
  dayList.innerHTML = '';
  emptyState.hidden = savedDays.length > 0;
  savedDays.sort((a, b) => b.date.localeCompare(a.date));

  savedDays.forEach((day) => {
    const ratio = target ? Math.min(day.calories / target, 1.5) / 1.5 * 100 : 0;
    const article = document.createElement('article');
    article.className = 'day-card';
    article.innerHTML = `
      <div class="day-card-header">
        <div>
          <h3 class="day-date">${formatDate(day.date)}</h3>
          <p class="day-weight">${day.weight.toLocaleString('de-CH')} kg</p>
        </div>
        <button type="button" class="delete-day" data-date="${day.date}" aria-label="Eintrag vom ${formatDate(day.date)} löschen">Löschen</button>
      </div>
      ${target ? `<div class="day-meter" aria-hidden="true"><span style="width:${ratio}%; background:${statusColor(day.calories)}"></span></div>` : ''}
      <div class="day-stats">
        <div><strong>${day.calories}</strong><span>kcal</span></div>
        <div class="protein"><strong>${day.protein} g</strong><span>Protein</span></div>
        <div class="carbs"><strong>${day.carbs} g</strong><span>Kohlenhydrate</span></div>
        <div class="fat"><strong>${day.fat} g</strong><span>Fett</span></div>
      </div>
      <p class="day-advice"><strong>Für morgen:</strong> ${nextDayAdvice(day)}</p>`;
    dayList.appendChild(article);
  });

  renderReadout();
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
  save(storageKey, JSON.stringify(savedDays));
  renderDays();
  dayForm.reset();
  dayDate.value = todayLocal();
});

dayList.addEventListener('click', (e) => {
  if (!e.target.matches('.delete-day')) return;
  savedDays = savedDays.filter((day) => day.date !== e.target.dataset.date);
  save(storageKey, JSON.stringify(savedDays));
  renderDays();
});

dayDate.value = todayLocal();
renderDays();
