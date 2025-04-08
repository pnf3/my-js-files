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
    document.title = `${pageTitle} Movies List (${dynamicYearRange}) | Year-Wise Complete Filmography`;
    entryTitle.textContent = `${pageTitle} Movies List (${dynamicYearRange}) – Year-Wise Complete Filmography`;
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
        <p style="margin-bottom:0">Discover the complete, year-wise <span id="actor-name-1">${actorName}</span> movies list (${yearRange}), covering films from debut to the latest and upcoming releases. This comprehensive <span id="actor-name-2">${actorName}</span> filmography includes all movies, along with release years, film titles, serial numbers, and the total number of films to date.</p>
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
        ? `<a href="${anchor.href}" target="_blank" rel="noopener noreferrer">${anchor.textContent}</a>`
        : title;

      return `
        <tr>
          <td>${items.length - index}</td>
          <td>${year}</td>
          <td>${movieName}</td>
        </tr>`;
    }).join("");

    table.innerHTML = `
      <caption class="styled-caption">${actorName} Movies List</caption>
      <thead>
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

  
  document.addEventListener("DOMContentLoaded", function () {
    // Select the list and list items
    let tvList = document.getElementById("tv-list");
    let listItems = tvList.querySelectorAll("li");
    let shows = [];

    // Extract year and show name
    listItems.forEach(item => {
        let parts = item.textContent.split(":");
        if (parts.length === 2) {
            let year = parts[0].trim();
            let name = parts[1].trim();
            shows.push({ year, name });
        }
    });

    // Sort shows by year (latest to oldest)
    shows.sort((a, b) => {
        let yearA = parseInt(a.year.match(/\d{4}/)?.[0] || "0", 10);
        let yearB = parseInt(b.year.match(/\d{4}/)?.[0] || "0", 10);
        return yearB - yearA;
    });

    // Create table element
    let table = document.createElement("table");
    table.className = "custom-table";
    table.setAttribute("role", "table");
    table.setAttribute("aria-labelledby", "movies-list-title");

    // Create caption
    let caption = document.createElement("caption");
    caption.className = "styled-caption";
    caption.textContent = "TV Shows List";
    table.appendChild(caption);

    // Create table header
    let thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
            <th scope="col" style="cursor: pointer;">Show No.</th>
            <th scope="col" style="cursor: pointer;">Release Year</th>
            <th scope="col" style="cursor: pointer;">Show Name</th>
        </tr>
    `;
    table.appendChild(thead);

    // Create table body
    let tbody = document.createElement("tbody");
    shows.forEach((show, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${shows.length - index}</td>
            <td>${show.year}</td>
            <td>${show.name}</td>
        `;
        tbody.appendChild(row);
    });

    // Add total count row
    let totalRow = document.createElement("tr");
    totalRow.innerHTML = `<td colspan="3"><strong>Total TV Shows Count</strong>: ${shows.length}</td>`;
    tbody.appendChild(totalRow);

    table.appendChild(tbody);

    // Append the table to the document body (or any specific container)
    let container = document.getElementById("post-sub-body");
    container.appendChild(table);

    // Hide the original <ul>
    tvList.style.display = "none";
});
