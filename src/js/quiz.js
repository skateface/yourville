(function () {
  const form = document.getElementById("quiz-form");
  const result = document.getElementById("quiz-result");
  if (!form || !result) return;

  const archetypes = JSON.parse(document.getElementById("archetype-data").textContent);

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const scores = {};
    const formData = new FormData(form);
    for (const [, value] of formData.entries()) {
      const points = JSON.parse(value);
      for (const slug in points) {
        scores[slug] = (scores[slug] || 0) + points[slug];
      }
    }

    let bestSlug = null;
    let bestScore = -Infinity;
    for (const slug in scores) {
      if (scores[slug] > bestScore) {
        bestScore = scores[slug];
        bestSlug = slug;
      }
    }

    const match = archetypes.find((a) => a.slug === bestSlug);
    if (!match) return;

    document.getElementById("result-emoji").textContent = match.emoji;
    document.getElementById("result-name").textContent = match.name;
    document.getElementById("result-tagline").textContent = match.tagline;
    document.getElementById("result-description").textContent = match.description;
    document.getElementById("result-link").setAttribute("href", match.guide);

    result.classList.add("visible");
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
