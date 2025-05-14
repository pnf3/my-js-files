document.addEventListener("DOMContentLoaded", () => {
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
    metaDescription.content = `<meta name="description" content="Discover the complete, year-wise ${pageTitle} movies list (${dynamicYearRange}), covering films from debut to the latest and upcoming releases.">`;
    document.title = `${pageTitle} Movies List (${dynamicYearRange}) - Filmography`;
    entryTitle.textContent = `${pageTitle} Movies List (${dynamicYearRange}) – Filmography`;
  }

  // Add label to last movie item
  const lastMovieItem = moviesList.querySelector("li:last-child");
  if (lastMovieItem) {
    lastMovieItem.textContent += " - First Movie";
  }

  // Extract actor name for dynamic use
  const actorName = extractActorName(entryTitle);

  // Insert dynamic card before movie list
  if (postSubBody) {
    postSubBody.insertAdjacentHTML("beforebegin", generateDynamicCard(actorName, dynamicYearRange));
  }

  // Update all actor name placeholders
  document.querySelectorAll("[id^='actor-name']").forEach((el) => {
    el.textContent = actorName;
  });

  // Convert list to table
  convertListToTable(moviesList, actorName);

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

  function generateDynamicCard(actorName, yearRange) {
    return `
      <div class="card">
        <p style="margin-bottom:0">Discover the complete, year-wise <span id="actor-name-1">${actorName}</span> movies list (${yearRange}), covering films from debut to the latest and upcoming releases/last movie. This comprehensive <span id="actor-name-2">${actorName}</span> filmography includes all movies, along with release years, film titles, serial numbers, and the total number of films to date.</p>
      </div>`;
  }

  function convertListToTable(list, actorName) {
    const items = [...list.querySelectorAll("li")];
    const table = createTable(items, actorName);
    list.replaceWith(table);
  }

  function createTable(items, actorName) {
    const table = document.createElement("table");
    table.className = "custom-table";
    table.setAttribute("role", "table");
    table.setAttribute("aria-labelledby", "movies-list-title");

    const rows = items.map((item, index) => {
      const anchor = item.querySelector("a");
      const rawText = item.childNodes[0]?.nodeValue?.trim() || "";
      const match = rawText.match(/^(\d{4})[:\s]*(.*)$/);
      const year = match ? match[1] : "";
      const title = match ? match[2] : "";
      const movieName = anchor
        ? `<a href="${anchor.href}" rel="noopener noreferrer">${anchor.textContent}</a>`
        : title;

      return `
        <tr>
          <td>${items.length - index}</td>
          <td>${year}</td>
          <td>${movieName}</td>
        </tr>`;
    }).join("");

    table.innerHTML = `
      <caption class="styled-caption">${actorName} All Movies List Year-Wise</caption>
      <thead>
	  <tr>
          <th colspan="3" scope="col">${actorName} Movies List</th>
         
        </tr>
        <tr>
          <th scope="col">S. No.</th>
          <th scope="col">Release Year</th>
          <th scope="col">Movie Name</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        <tr>
          <td colspan="3"><strong>${actorName} Total Movies Count:</strong> ${items.length}</td>
        </tr>
      </tbody>`;

    return table;
  }
});

  
  document.addEventListener("DOMContentLoaded", () => {
  const metaDescription = document.querySelector("meta[name='description']");
  const tvList = document.getElementById("tv-list");
  const postSubBody = document.querySelector(".post-sub-body#post-sub-body");
  const entryTitle = document.querySelector("h1.entry-title");

  if (!tvList || !entryTitle) return;

  // Extract years dynamically
  const yearRange = getYearRange(tvList); // { start: xxxx, end: yyyy }
  const pageTitle = document.title.replace(" Movies List", "");
  const dynamicYearRange = `${yearRange.start}–${yearRange.end}`;
  const actorName = extractActorName(entryTitle);

  // Update meta title and description
 //if (metaDescription && entryTitle.textContent.includes("TV Shows List")) {
 //   metaDescription.content = `Discover the complete, year-wise ${pageTitle} TV shows list (${dynamicYearRange}), covering all shows from debut to latest.`;
 //   document.title = `${pageTitle} TV Shows List (${dynamicYearRange}) - Complete List`;
 //   entryTitle.textContent = `${pageTitle} TV Shows List (${dynamicYearRange}) – Complete List`;
 // } 

  // Add label to last show item
  const lastShowItem = tvList.querySelector("li:last-child");
  if (lastShowItem) {
    lastShowItem.textContent += " - First Show";
  }

  // === INSERT CARD JUST ABOVE TV TABLE ===
  // Find the first table (movies table), insert card after it
  const movieTable = document.querySelector("table.custom-table");
  if (movieTable && movieTable.parentNode) {
    movieTable.insertAdjacentHTML("afterend", generateDynamicCard(actorName, dynamicYearRange));
  }

  // Update all placeholders with actor name
  document.querySelectorAll("[id^='actor-name']").forEach((el) => {
    el.textContent = actorName;
  });

  // Convert list to table
  convertListToTable(tvList, actorName);

  // === Helper Functions ===

  function getYearRange(list) {
    const years = [...list.querySelectorAll("li")]
      .map(li => {
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

  function generateDynamicCard(actorName, yearRange) {
    return `
      <div class="card">
        <p style="margin-bottom:0">Explore the full, year-wise <span id="actor-name-1">${actorName}</span> TV shows list (${yearRange}), from their debut series to the latest appearances. This detailed <span id="actor-name-2">${actorName}</span> showography includes release years, show titles, serial numbers, and more.</p>
      </div>`;
  }

  function convertListToTable(list, actorName) {
    const items = [...list.querySelectorAll("li")];
    const shows = items.map((item) => {
      const anchor = item.querySelector("a");
      const rawText = item.childNodes[0]?.nodeValue?.trim() || "";
      const match = rawText.match(/^(\d{4})[:\s]*(.*)$/);
      const year = match ? match[1] : "";
      const name = match ? match[2] : "";
      const showName = anchor
        ? `<a href="${anchor.href}" rel="noopener noreferrer">${anchor.textContent}</a>`
        : name;

      return { year, name: showName };
    });

    // Sort by year descending
    shows.sort((a, b) => parseInt(b.year) - parseInt(a.year));

    const table = document.createElement("table");
    table.className = "custom-table";
    table.setAttribute("role", "table");
    table.setAttribute("aria-labelledby", "tv-shows-list-title");

    const rows = shows.map((show, index) => `
      <tr>
        <td>${shows.length - index}</td>
        <td><td>${dynamicYearRange}</td>
</td>
        <td>${show.name}</td>
      </tr>`).join("");

    table.innerHTML = `
      <caption class="styled-caption">${actorName} All TV Shows List Year-Wise</caption>
      <thead>
        <tr>
          <th colspan="3" scope="col">${actorName} TV Shows List</th>
        </tr>
        <tr>
          <th scope="col">S. No.</th>
          <th scope="col">Release Year</th>
          <th scope="col">Show Name</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
        <tr>
          <td colspan="3"><strong>${actorName} Total TV Shows Count:</strong> ${shows.length}</td>
        </tr>
      </tbody>`;

    list.replaceWith(table);
  }
});
