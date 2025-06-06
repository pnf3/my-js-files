// Optimized JS: One dynamic intro card followed by three h2/table sections

// === GLOBAL SETUP ===
document.addEventListener("DOMContentLoaded", () => {
  const metaDescription = document.querySelector("meta[name='description']");
  const postSubBody = document.querySelector(".post-sub-body#post-sub-body");
  const entryTitle = document.querySelector("h1.entry-title");

  const moviesList = document.getElementById("movies-list");
  const tvList = document.getElementById("tv-list");
  const producerList = document.getElementById("producer-list");

  if (!entryTitle || !moviesList) return;

  const actorName = extractActorName(entryTitle);
  const movieYearRange = getYearRange(moviesList);
  const dynamicYearRange = `${movieYearRange.start}–${movieYearRange.end}`;

  // Update meta title & description
  if (metaDescription && entryTitle.textContent.includes("Movies List")) {
    metaDescription.content = `Explore the complete, year-wise ${actorName} movies list (${dynamicYearRange}) & TV shows — from the debut film to the latest release.`;
    document.title = `${actorName} Movies List (${dynamicYearRange})`;
    entryTitle.textContent = `${actorName} Movies List (${dynamicYearRange})`;
  }

  // Insert one dynamic intro card only
  if (postSubBody) {
    const introCard = `<div class="card"><p class="mb-0">Explore the complete, year-wise ${actorName} movies list (${dynamicYearRange}) & TV shows in the roles of Actor, Director, Producer, or Writer — from the debut film to the latest release. This comprehensive filmography includes all movie titles in chronological order, with release years, a running count, hits and flops, box office collection, OTT releases, and the total number of films to date.</p></div>`;
    postSubBody.insertAdjacentHTML("afterbegin", introCard);
  }

  // Update placeholders
  document.querySelectorAll("[id^='actor-name']").forEach(el => {
    el.textContent = actorName;
  });

  // Convert all lists to tables
  convertListToTable(moviesList, actorName, `${actorName} Movies List Year-Wise`, "Movies");
  if (tvList) convertListToTable(tvList, actorName, `${actorName} TV Shows List Year-Wise`, "TV");
  if (producerList) convertListToTable(producerList, actorName, `${actorName} as Director/Producer/Writer`, "DPWS");

  // === FUNCTIONS ===
  function extractActorName(titleElement) {
    return titleElement?.textContent.replace(/Movies List.*$/, "").trim() || "Actor";
  }

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

  function convertListToTable(list, actorName, heading, type) {
    const items = [...list.querySelectorAll("li")];
    const shows = items.map((item) => {
      const anchor = item.querySelector("a");
      const rawText = item.childNodes[0]?.nodeValue?.trim() || "";
      const yearPart = rawText.split(":"[0])?.trim() || "";
      const namePart = rawText.split(":"[1])?.trim() || "";
      const name = anchor ? `<a href="${anchor.href}" rel="noopener noreferrer">${anchor.textContent}</a>` : namePart;
      return { year: yearPart, name };
    });

    shows.sort((a, b) => {
      const yearA = parseInt(a.year.split("–")[0] || a.year, 10);
      const yearB = parseInt(b.year.split("–")[0] || b.year, 10);
      return yearB - yearA;
    });

    const table = document.createElement("table");
    table.className = "ml-custom-table";
    table.setAttribute("role", "table");
    table.setAttribute("aria-label", heading);

    const rows = shows.map((show, i) => `
      <tr>
        <td>${shows.length - i}</td>
        <td><time datetime="${show.year}" aria-label="Year ${show.year}" title="${type}: ${show.name}">${show.year}</time></td>
        <td>${show.name}</td>
      </tr>`).join("");

    table.innerHTML = `
      <caption class="styled-caption">${heading}</caption>
      <thead>
        <tr>
          <th>S. No.</th>
          <th>Year</th>
          <th>${type === "TV" ? "Show Name" : "Movie Name"}</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3"><strong>${actorName} Total ${type === "DPWS" ? "DPWS" : type} Count:</strong> ${shows.length}</td>
        </tr>
      </tfoot>`;

    // Insert heading before table
    const h2 = document.createElement("h2");
    h2.textContent = heading;
    list.parentNode.insertBefore(h2, list);

    list.replaceWith(table);
  }
});
