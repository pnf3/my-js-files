document.addEventListener("DOMContentLoaded", () => {
  const metaDescription = document.querySelector("meta[name='description']");
  const postSubBody = document.querySelector(".post-sub-body#post-sub-body");
  const entryTitle = document.querySelector("h1.entry-title");
  const actorName = extractActorName(entryTitle);

  const moviesList = document.getElementById("movies-list");
  const tvList = document.getElementById("tv-list");
  const dpwsList = document.getElementById("producer-list");

  if (!entryTitle || (!moviesList && !tvList && !dpwsList)) return;

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

  if (metaDescription && entryTitle.textContent.includes("Movies List")) {
    metaDescription.content = `Explore the complete, year-wise ${pageTitle} movies list (${dynamicYearRange}) & TV shows — from the debut film to the latest release.`;
    document.title = `${pageTitle} Movies List (${dynamicYearRange})`;
    entryTitle.textContent = `${pageTitle} Movies List (${dynamicYearRange})`;
  }

  if (postSubBody && moviesList) {
    const introCard = document.createElement("div");
    introCard.className = "card";
    introCard.textContent = `Explore the complete, year-wise ${actorName} movies list (${dynamicYearRange}) & TV shows in the roles of Actor, Director, Producer, or Writer — from the debut film to the latest release. This comprehensive filmography includes all movie titles in chronological order, with release years, a running count, hits and flops, box office collection, OTT releases, and the total number of films to date.`;
    postSubBody.prepend(introCard);
  }

  if (moviesList) {
    const lastMovieItem = moviesList.querySelector("li:last-child");
    if (lastMovieItem) lastMovieItem.textContent += " - First Movie";

    moviesList.insertAdjacentElement("beforebegin", createHeading(`${actorName} Movies List Year-Wise`));
    convertListToTable(moviesList, actorName, "movie");
  }

  if (tvList) {
    const lastShowItem = tvList.querySelector("li:last-child");
    if (lastShowItem) lastShowItem.textContent += " - First Show";

    tvList.insertAdjacentElement("beforebegin", createHeading(`${actorName} TV Shows List Year-Wise`));
    convertListToTable(tvList, actorName, "tv");
  }

  if (dpwsList) {
    const dpwsHeading = document.createElement("div");
    dpwsHeading.innerHTML = `<h2>${actorName} Movies List as a Director (D), Producer (P), Writer (W), or Screenplay (S)</h2>
    <p class="mb-0"><strong>Legend:</strong> (DPWS) — D = Director, P = Producer, W = Writer, S = Screenplay</p>`;
    dpwsList.insertAdjacentElement("beforebegin", dpwsHeading);
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

  function createHeading(text) {
    const h2 = document.createElement("h2");
    h2.textContent = text;
    return h2;
  }

  function convertListToTable(list, actorName, type) {
    const items = [...list.querySelectorAll("li")];
    const table = document.createElement("table");
    table.className = "ml-custom-table";
    table.setAttribute("role", "table");
   table.setAttribute("aria-label", getAriaLabel(actorName, type));
    table.innerHTML = generateTableHTML(items, actorName, type);
    list.replaceWith(table);
  }
function getAriaLabel(actorName, type) {
  if (type === "tv") return `${actorName} TV Shows List`;
  if (type === "dpws") return `${actorName} Movies List as Producer, Director, Writer, or Screenplay`;
  return `${actorName} Movies List`;
}

  function generateTableHTML(items, actorName, type) {
    const rows = items.map((item, index) => {
      const anchor = item.querySelector("a");
      const rawText = item.childNodes[0]?.nodeValue?.trim() || "";
      const [yearPartRaw, namePartRaw] = rawText.includes(":") ? rawText.split(":") : [rawText, rawText];
      const year = yearPartRaw.match(/\d{4}/)?.[0] || "";
      const name = anchor
        ? `<a href="${anchor.href}" rel="noopener noreferrer">${anchor.textContent}</a>`
        : (namePartRaw?.trim() || rawText);

     return `
  <tr role="row">
    <th scope="row" aria-label="Movie number ${items.length - index}">
      ${items.length - index}
    </th>
    <td>
      <time datetime="${year}" aria-label="Year ${year}">
        ${year}
      </time>
    </td>
    <td>
      <strong>${name}</strong>
    </td>
  </tr>
`;
    }).join("");

    const captionText = type === "tv"
      ? `${actorName} TV Shows List`
      : type === "dpws"
        ? `${actorName} Movies List as a Director (D), Producer (P), Writer (W), or Screenplay (S)`
        : `${actorName} Movies List`;

    const countLabel = type === "dpws"
      ? `${actorName} Total Movies Count as a DPWS:`
      : `${actorName} Total ${type === "tv" ? "TV Shows" : "Movies"} Count:`;

    return `
      <caption class="styled-caption">${captionText}</caption>
      <thead role="rowgroup">
        <tr role="row">
          <th role="columnheader" scope="col">S. No.</th>
          <th role="columnheader" scope="col">Year</th>
          <th role="columnheader" scope="col">${type === "tv" ? "Show Name" : "Movie Name"}</th>
        </tr>
      </thead>
      <tbody role="rowgroup">${rows || `<tr><td colspan="3">No data available.</td></tr>`}</tbody>
      <tfoot role="rowgroup">
        <tr role="row">
          <td colspan="3"><strong>${countLabel}</strong> ${items.length}</td>
        </tr>
      </tfoot>`;
  }
});
