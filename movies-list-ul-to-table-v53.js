document.addEventListener("DOMContentLoaded", () => {
  const metaDescription = document.querySelector("meta[name='description']");
  const postSubBody = document.querySelector(".post-sub-body#post-sub-body");
  const entryTitle = document.querySelector("h1.entry-title");
  const actorName = extractActorName(entryTitle);

  const moviesList = document.getElementById("movies-list");
  const tvList = document.getElementById("tv-list");
  const dpwsList = document.getElementById("producer-list");

  // Stop if we don't have the title or at least one list
  if (!entryTitle || (!moviesList && !tvList && !dpwsList)) return;

  // Extract year range from all available lists
  const allYears = [
    ...getYears(moviesList),
    ...getYears(tvList),
    ...getYears(dpwsList)
  ].sort((a, b) => a - b);

  const yearRange = {
    start: allYears[0] || "N/A",
    end: allYears[allYears.length - 1] || "N/A"
  };

  const dynamicYearRange = `${yearRange.start}–${yearRange.end}`;
  const pageTitle = document.title.replace(" Movies List", "");

  // Update meta description and title
  if (metaDescription && entryTitle.textContent.includes("Movies List")) {
    metaDescription.content = `Explore the complete, year-wise ${pageTitle} movies list (${dynamicYearRange}) & TV shows — from the debut film to the latest release.`;
    document.title = `${pageTitle} Movies List (${dynamicYearRange})`;
    entryTitle.textContent = `${pageTitle} Movies List (${dynamicYearRange})`;
  }

  // === Insert only one intro card ===
  if (postSubBody && moviesList) {
    postSubBody.insertAdjacentHTML("afterbegin", generateIntroCard(actorName, dynamicYearRange));
  }

  // === Insert Movies Table ===
  if (moviesList) {
    const lastMovieItem = moviesList.querySelector("li:last-child");
    if (lastMovieItem) lastMovieItem.textContent += " - First Movie";

  moviesList.insertAdjacentHTML("beforebegin", `<h2>${actorName} Movies List Year-Wise</h2>`);
    convertListToTable(moviesList, actorName, "movie");
  }

  // === Insert TV Shows Table ===
 if (tvList) {
  const lastShowItem = tvList.querySelector("li:last-child");
  if (lastShowItem) lastShowItem.textContent += " - First Show";

  tvList.insertAdjacentHTML("beforebegin", `<h2>${actorName} TV Shows List Year-Wise</h2>`);
  convertListToTable(tvList, actorName, "tv");
}


  // === Insert DPWS Table ===
 if (dpwsList) {
  dpwsList.insertAdjacentHTML("beforebegin", `<h2>${actorName} Movies List as a Director (D), Producer (P), Writer (W), or Screenplay (S)</h2>
    <p class="mb-0"><strong>Legend:</strong> (DPWS) — D = Director, P = Producer, W = Writer, S = Screenplay</p>`);
  convertListToTable(dpwsList, actorName, "dpws");
}


  // === Shared Helper Functions ===

  function extractActorName(titleElement) {
    return titleElement?.textContent.replace(/Movies List.*$/, "").trim() || "Actor";
  }

  function getYears(list) {
    if (!list) return [];
    return [...list.querySelectorAll("li")]
      .map(li => {
        const match = li.textContent.trim().match(/^(\d{4})/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter(Boolean);
  }

  function generateIntroCard(actorName, yearRange) {
    return `<div class="card"><p class="mb-0">Explore the complete, year-wise ${actorName} movies list (${yearRange}) & TV shows in the roles of Actor, Director, Producer, or Writer — from the debut film to the latest release. This comprehensive filmography includes all movie titles in chronological order, with release years, a running count, hits and flops, box office collection, OTT releases, and the total number of films to date.</p></div>`;
  }

  function convertListToTable(list, actorName, type) {
    const items = [...list.querySelectorAll("li")];
    const table = document.createElement("table");
    table.className = "ml-custom-table";
    table.setAttribute("role", "table");
    table.setAttribute("aria-label", `${actorName} ${type === 'tv' ? 'TV Shows' : 'Movies'} List`);

    const rows = items.map((item, index) => {
      const anchor = item.querySelector("a");
      const rawText = item.childNodes[0]?.nodeValue?.trim() || "";
      const [yearPart, namePart] = rawText.split(":").map(s => s.trim());
      const name = anchor
        ? `<a href="${anchor.href}" rel="noopener noreferrer">${anchor.textContent}</a>`
        : namePart;

      const year = type === "movie"
        ? (rawText.match(/^(\d{4})[:\s]*(.*)$/)?.[1] || "")
        : yearPart;

      return `
        <tr>
          <td>${items.length - index}</td>
          <td><time datetime="${year}" aria-label="Year ${year}" title="${type === 'tv' ? 'TV Show' : 'Movie'}: ${name}">${year}</time></td>
          <td>${name}</td>
        </tr>`;
    }).join("");

    const captionText = type === "tv"
      ? `${actorName} TV Shows List`
      : type === "dpws"
        ? `${actorName} Movies List as a Director (D), Producer (P), Writer (W), or Screenplay (S)`
        : `${actorName} Movies List`;

    const countLabel = type === "dpws"
      ? `${actorName} Total Movies Count as a DPWS:`
      : `${actorName} Total ${type === "tv" ? "TV Shows" : "Movies"} Count:`;

    table.innerHTML = `
      <caption class="styled-caption">${captionText}</caption>
      <thead>
        <tr>
          <th scope="col">S. No.</th>
          <th scope="col">Year</th>
          <th scope="col">${type === "tv" ? "Show Name" : "Movie Name"}</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr>
          <td colspan="3"><strong>${countLabel}</strong> ${items.length}</td>
        </tr>
      </tfoot>`;

    list.replaceWith(table);
  }
});
