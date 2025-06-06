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
    metaDescription.content = `<meta name="description" content="Explore the complete, year-wise ${pageTitle} movies list (${dynamicYearRange}) & tv shows — from the debut film to the latest release.">`;
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
  if (postSubBody) {
    postSubBody.insertAdjacentHTML("afterbegin", generateDynamicCard(actorName, dynamicYearRange));
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
    return `<div class="card"><p class="mb-0">Explore the complete, year-wise list of ${actorName}'s movies (${yearRange}) & TV shows in the roles of Actor, Director, Producer, or Writer — from the debut film to the latest release. This comprehensive filmography includes all movie titles in chronological order, with release years, a running count, hits and flops, box office collection, OTT releases, and the total number of films to date.</p></div>
	  <h2 id="movies-list-title">${actorName} Movies List Year-Wise</h2>`;
  }

  function convertListToTable(list, actorName) {
    const items = [...list.querySelectorAll("li")];
    const table = createTable(items, actorName);
    list.replaceWith(table);
  }

  function createTable(items, actorName) {
    const table = document.createElement("table");
    table.className = "ml-custom-table";
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
        <tr role="row">
          <td scope="row">${items.length - index}</td>
          <td>${year}</td>
          <td>${movieName}</td>
        </tr>`;
    }).join("");

    table.innerHTML = `
    <!--  <caption class="styled-caption">Complete List of ${actorName} Movies Year-Wise</caption> -->
      <thead role="rowgroup">
	  <tr>
          <th role="columnheader" colspan="3" scope="colgroup">${actorName} Movies List</th>
         
        </tr>
        <tr role="row">
          <th role="columnheader" scope="col">S. No.</th>
          <th role="columnheader" scope="col">Release Year</th>
          <th role="columnheader" scope="col">Movie Name</th>
        </tr>
      </thead>
      <tbody role="rowgroup">
        ${rows}
		</tbody>
		<tfoot role="rowgroup">
        <tr role="row">
          <td colspan="3"><strong>${actorName} Total Movies Count:</strong> ${items.length}</td>
        </tr>
		</tfoot>
      `;

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
  const movieTables = document.querySelectorAll("table.ml-custom-table");
if (movieTables.length > 0) {
  const lastTable = movieTables[movieTables.length - 1];
  lastTable.insertAdjacentHTML("afterend", generateDynamicCard(actorName, dynamicYearRange));
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
    return `<h2 id="tv-shows-list-title">${actorName} TV Shows List Year-Wise</h2>`;
  }

function convertListToTable(list, actorName) {
  const items = [...list.querySelectorAll("li")];
  const shows = items.map((item) => {
    const anchor = item.querySelector("a");
    const rawText = item.childNodes[0]?.nodeValue?.trim() || "";

    const yearPart = rawText.split(":")[0]?.trim() || "";
    const namePart = rawText.split(":")[1]?.trim() || "";

    const showName = anchor
      ? `<a href="${anchor.href}" rel="noopener noreferrer">${anchor.textContent}</a>`
      : namePart;

    return { year: yearPart, name: showName };
  });

  // Sort descending by first year in range
  shows.sort((a, b) => {
    const yearA = parseInt(a.year.split("–")[0] || a.year, 10);
    const yearB = parseInt(b.year.split("–")[0] || b.year, 10);
    return yearB - yearA;
  });

  const table = document.createElement("table");
  table.className = "ml-custom-table";
  table.setAttribute("role", "table");
  table.setAttribute("aria-labelledby", "tv-shows-list-title");

  const rows = shows.map((show, index) => `
    <tr>
      <td>${shows.length - index}</td>
      <td>${show.year}</td>
      <td>${show.name}</td>
    </tr>`).join("");

  table.innerHTML = `
  <!--  <caption class="styled-caption">Complete List of ${actorName} TV Shows Year-Wise</caption> -->
    <thead>
      <tr>
        <th colspan="3" scope="colgroup">${actorName} TV Shows List</th>
      </tr>
      <tr>
        <th scope="col">S. No.</th>
        <th scope="col">Release Year</th>
        <th scope="col">Show Name</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
	  </tbody>
	   <tfoot>
      <tr>
        <td colspan="3"><strong>${actorName} Total TV Shows Count:</strong> ${shows.length}</td>
      </tr>
	  </tfoot>
    `;

  list.replaceWith(table);
}
});


document.addEventListener("DOMContentLoaded", () => {
  const metaDescription = document.querySelector("meta[name='description']");
  const tvList = document.getElementById("producer-list");
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
 // const lastShowItem = tvList.querySelector("li:last-child");
 // if (lastShowItem) {
  //  lastShowItem.textContent += " - First Show";
 // }

  // === INSERT CARD JUST ABOVE TV TABLE ===
  // Find the first table (movies table), insert card after it
  const movieTables = document.querySelectorAll("table.ml-custom-table");
if (movieTables.length > 0) {
  const lastTable = movieTables[movieTables.length - 1];
  lastTable.insertAdjacentHTML("afterend", generateDynamicCard(actorName, dynamicYearRange));
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
    return `<h2 id="producer-movies-list-title">${actorName} Movies List as a Director (D), Producer (P), Writer (W), or Screenplay (S)</h2>
	<p class="mb-0"><strong>Legend:</strong> (DPWS) — D = Director, P = Producer, W = Writer, S = Screenplay</p>
	`;
  }

function convertListToTable(list, actorName) {
  const items = [...list.querySelectorAll("li")];
  const shows = items.map((item) => {
    const anchor = item.querySelector("a");
    const rawText = item.childNodes[0]?.nodeValue?.trim() || "";

    const yearPart = rawText.split(":")[0]?.trim() || "";
    const namePart = rawText.split(":")[1]?.trim() || "";

    const showName = anchor
      ? `<a href="${anchor.href}" rel="noopener noreferrer">${anchor.textContent}</a>`
      : namePart;

    return { year: yearPart, name: showName };
  });

  // Sort descending by first year in range
  shows.sort((a, b) => {
    const yearA = parseInt(a.year.split("–")[0] || a.year, 10);
    const yearB = parseInt(b.year.split("–")[0] || b.year, 10);
    return yearB - yearA;
  });

  const table = document.createElement("table");
  table.className = "ml-custom-table";
  table.setAttribute("role", "table");
  table.setAttribute("aria-labelledby", "producer-movies-list-title");

  const rows = shows.map((show, index) => `
    <tr>
      <td>${shows.length - index}</td>
      <td>${show.year}</td>
      <td>${show.name}</td>
    </tr>`).join("");

  table.innerHTML = `
 <!--   <caption class="styled-caption">Complete List of ${actorName} Movies as a Director (D), Producer (P), Writer (W), or Screenplay (S)</caption> -->
    <thead>
      <tr>
        <th colspan="3" scope="colgroup">${actorName} Movies List as a Director (D), Producer (P), Writer (W), or Screenplay (S)</th>
      </tr>
      <tr>
        <th scope="col">S. No.</th>
        <th scope="col">Release Year</th>
        <th scope="col">Movie Name</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
	  </tbody>
	   <tfoot>
      <tr>
        <td colspan="3"><strong>${actorName} Total Movies Count as a DPWS:</strong> ${shows.length}</td>
      </tr>
	  </tfoot>
    `;

  list.replaceWith(table);
}
});
