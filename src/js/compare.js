(function () {
  const table = document.getElementById("compare-table");
  const pickA = document.getElementById("pick-a");
  const pickB = document.getElementById("pick-b");
  const pickC = document.getElementById("pick-c");
  if (!table || !pickA || !pickB || !pickC) return;

  const archetypes = JSON.parse(document.getElementById("archetype-data").textContent);

  const traitLabels = {
    walkability: "Walkability",
    natureAccess: "Nature access",
    nightlife: "Nightlife",
    remoteWorkFriendly: "Remote-work friendly",
    paceOfLife: "Pace of life",
  };

  function fillSelect(select, defaultIndex) {
    archetypes.forEach((a, i) => {
      const opt = document.createElement("option");
      opt.value = a.slug;
      opt.textContent = `${a.emoji} ${a.name}`;
      if (i === defaultIndex) opt.selected = true;
      select.appendChild(opt);
    });
  }

  fillSelect(pickA, 0);
  fillSelect(pickB, 4);
  archetypes.forEach((a) => {
    const opt = document.createElement("option");
    opt.value = a.slug;
    opt.textContent = `${a.emoji} ${a.name}`;
    pickC.appendChild(opt);
  });

  function bar(value) {
    const pct = (value / 5) * 100;
    return `<div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>`;
  }

  function render() {
    const slugs = [pickA.value, pickB.value, pickC.value].filter(Boolean);
    const selected = slugs
      .map((slug) => archetypes.find((a) => a.slug === slug))
      .filter(Boolean);

    let html = "<thead><tr><th>Vibe</th>";
    selected.forEach((a) => {
      html += `<th>${a.emoji} ${a.name}</th>`;
    });
    html += "</tr></thead><tbody>";

    Object.keys(traitLabels).forEach((key) => {
      html += `<tr><td>${traitLabels[key]}</td>`;
      selected.forEach((a) => {
        html += `<td>${bar(a.traits[key])}</td>`;
      });
      html += "</tr>";
    });

    html += `<tr><td>Sample towns</td>`;
    selected.forEach((a) => {
      html += `<td>${a.sampleTowns.join(", ")}</td>`;
    });
    html += "</tr>";

    html += `<tr><td>Full guide</td>`;
    selected.forEach((a) => {
      html += `<td><a href="${a.guide}">Read guide →</a></td>`;
    });
    html += "</tr></tbody>";

    table.innerHTML = html;
  }

  [pickA, pickB, pickC].forEach((el) => el.addEventListener("change", render));
  render();
})();
