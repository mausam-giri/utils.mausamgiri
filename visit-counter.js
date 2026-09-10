(function trackHiddenVisits() {
  const el = document.getElementById('visit-count');
  if (!el) return;

  const storageKey = 'utils-visit-counted';
  const alreadyCounted = window.localStorage.getItem(storageKey) === '1';

  fetch('/api/visits', {
    method: alreadyCounted ? 'GET' : 'POST',
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (typeof data.count === 'number') {
        el.textContent = String(data.count);
      }
      if (!alreadyCounted && typeof data.count === 'number') {
        window.localStorage.setItem(storageKey, '1');
      }
    })
    .catch(function () {});
})();
