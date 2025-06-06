document.addEventListener("DOMContentLoaded", () => {
  // Call the update functions for Movies, TV Shows, and Producers
  updateMoviesList();
  updateTVList();
  updateProducerList();
});

function updateMoviesList() {
  const metaDescription = document.querySelector("meta[name='description']");
  const moviesList = document.getElementById("movies-list");
  const postSubBody = document.querySelector(".post-sub-body#post-sub-body");
  const entryTitle = document.querySelector("h1.entry-title");

  if (!moviesList || !entryTitle) return;

  // Extract years dynamically from list
  const yearRange = getYearRange(moviesList); // { start: 1988, end: 2025 }
  const pageTitle = document.title.replace(" Movies List", "");
  const dynamicYearRange = `${yearRange.start}–${yearRange.end}`;

  // Update meta title and description
  if (metaDescription && entryTitle.textContent.includes("Movies List")) {
    metaDescription.content = `Explore the complete, year-wise ${pageTitle} movies list (${dynamicYearRange}) & TV shows — from the debut film to the latest release.`;
    document.title = `${pageTitle} Movies List (${dynamicYearRange})`;
    entryTitle.textContent = `${pageTitle} Movies List (${dynamicYearRange})`;
  }

  // Add label to last movie item
  const lastMovieItem = moviesList.querySelector("li:last-child");
  if (lastMovieItem) {
    lastMovieItem.textContent += " - First Movie";
  }

  // Extract actor name for dynamic use
  const actorName = extractActorName(entryTitle);

  // Insert dynamic card before movie list
  if (postSubBody && !document.querySelector(".dynamic-card-movie")) {
    postSubBody.insertAdjacentHTML("afterbegin", generateDynamicCard(actorName, dynamicYearRange, "Movies"));
  }

  // Update all actor name placeholders
  document.querySelectorAll("[id^='actor-name']").forEach((el) => {
    el.textContent = actorName;
  });

  // Convert list to table
  convertListToTable(moviesList, actorName);
}

function updateTVList() {
  const metaDescription = document.querySelector("meta[name='description']");
  const tvList = document.getElementById("tv-list");
  const postSubBody = document.querySelector(".post-sub-body#post-sub-body");
  const entryTitle = document.querySelector("h1.entry-title");

  if (!tvList || !entryTitle) return;

  // Extract years dynamically
  const yearRange = getYearRange(tvList);
  const pageTitle = document.title.replace(" Movies List", "");
  const dynamicYearRange = `${yearRange.start}–${yearRange.end}`;
  const actorName = extractActorName(entryTitle);

  // Add label to last TV show item
  const lastShowItem = tvList.querySelector("li:last-child");
  if (lastShowItem) {
    lastShowItem.textContent += " - First Show";
  }

  // Insert dynamic card above TV list
  const movieTables = document.querySelectorAll("table.ml-custom-table");
  if (movieTables.length > 0 && !document.querySelector(".dynamic-card-tv")) {
    const lastTable = movieTables[movieTables.length - 1];
    lastTable.insertAdjacentHTML("afterend", generateDynamicCard(actorName, dynamicYearRange, "TV Shows"));
  }

  // Update all actor name placeholders
  document.querySelectorAll("[id^='actor-name']").forEach((el) => {
    el.textContent = actorName;
  });

  // Convert list to table
  convertListToTable(tvList, actorName, "TV Shows");
}

function updateProducerList() {
  const metaDescription = document.querySelector("meta[name='description']");
  const producerList = document.getElementById("producer-list");
  const entryTitle = document.querySelector("h1.entry-title");

  if (!producerList || !entryTitle) return;

  // Extract years dynamically
  const yearRange = getYearRange(producerList);
  const pageTitle = document.title.replace(" Movies List", "");
  const dynamicYearRange = `${yearRange.start}–${yearRange.end}`;
  const actorName = extractActorName(entryTitle);

  // Insert dynamic card above producer list
  const movieTables = document.querySelectorAll("table.ml-custom-table");
  if (movieTables.length > 0 && !document.querySelector(".dynamic-card-producer")) {
    const lastTable = movieTables[movieTables.length - 1];
    lastTable.insertAdjacentHTML("afterend", generateDynamicCard(actorName, dynamicYearRange, "Producer/Director/Writer"));
  }

  // Update all actor name placeholders
  document.querySelectorAll("[id^='actor-name']").forEach((el) => {
    el.textContent = actorName;
  });

  // Convert list to table
  convertListToTable(producerList, actorName, "Producer/Director/Writer");
}

// === Helper Functions ===

function getYearRange(list) {
  const years = [...list.querySelectorAll("li")]
    .map((li) => {
      const match = li.textContent.trim().match(/^(\d{4})/);
      return match ? parseInt(match[1], 10) : null;
    })
    .filter(Boolean)
    .sort((a, b) => a - b);

  return {
    start: years[0] || "N/A",
    end: years[years.length - 1] || "N/A"
  };
}

function extractActorName(titleElement) {
  return titleElement?.textContent
    .replace(/Movies List.*$/, "")
    .trim() || "Actor";
}

function generateDynamicCard(actorName, yearRange, type) {
  return `
    <div class="card dynamic-card-${type.toLowerCase().replace("/", "-")}">
      <h2>${actorName} ${type} List Year-Wise</h2>
      <p class="mb-0">Explore the complete, year-wise ${actorName} ${type} list (${yearRange}) — from debut to the latest release. This comprehensive list includes all titles in chronological order, with release years, hits, flops, box office collections, and more.</p>
    </div>
  `;
}

function convertListToTable(list, actorName, type = "Movies") {
  const items = [...list.querySelectorAll("li")];
  const rows = items.map((item, index) => {
    const anchor = item.querySelector("a");
    const rawText = item.childNodes[0]?.nodeValue?.trim() || "";
    const match = rawText.match(/^(\d{4})[:\s]*(.*)$/);
    const year = match ? match[1] : "";
    const title = match ? match[2] : "";
    const itemName = anchor ? `<a href="${anchor.href}" rel="noopener noreferrer">${anchor.textContent}</a>` : title;

    return `
      <tr role="row">
        <td scope="row">${items.length - index}</td>
        <td><time datetime="${year}" aria-label="Release Year ${year}">${year}</time></td>
        <td>${itemName}</td>
      </tr>`;
  }).join("");

  const table = document.createElement("table");
  table.className = "ml-custom-table";
  table.setAttribute("role", "table");
  table.setAttribute("aria-label", `${actorName} ${type} List`);

  table.innerHTML = `
    <caption class="styled-caption">${actorName} ${type} List</caption>
    <thead role="rowgroup">
      <tr role="row">
        <th role="columnheader" scope="col">S. No.</th>
        <th role="columnheader" scope="col">Year</th>
        <th role="columnheader" scope="col">Name</th>
      </tr>
    </thead>
    <tbody role="rowgroup">
      ${rows}
    </tbody>
    <tfoot role="rowgroup">
      <tr role="row">
        <td colspan="3"><strong>${actorName} Total ${type} Count:</strong> ${items.length}</td>
      </tr>
    </tfoot>
  `;

  list.replaceWith(table);
}
