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
  const hasTVShows = !!tvList;
  const typeText = hasTVShows ? "movies and TV shows" : "movies";
  const titleSuffix = hasTVShows ? "Movies and TV Shows List" : "Movies List";

  metaDescription.content = `Explore the complete, year-wise list of ${pageTitle} ${typeText} (${dynamicYearRange}) — from the debut film to the latest release.`;
  document.title = `${pageTitle} ${titleSuffix} (${dynamicYearRange})`;
  entryTitle.textContent = `${pageTitle} ${titleSuffix} (${dynamicYearRange})`;
}


  if (postSubBody && moviesList) {
    const introCard = document.createElement("div");
    introCard.className = "card";
	const hasTVShows = !!tvList;
  const typeTexts = hasTVShows ? "movies & TV shows" : "movies";
  const typeText = hasTVShows ? "movie & TV show" : "movie";
    introCard.textContent = `Explore the complete list of ${actorName} ${typeTexts} (${dynamicYearRange}), showcasing roles as Actor, Director, Producer, or Writer — from the debut project to the latest release. This comprehensive filmography features all ${typeText} titles organized year-wise, including release years, a running count, hit or flop status, box office collections, OTT release dates, streaming platforms, and the total number of titles to date.`;
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

function generateTableHTML(items, actorName, type, includeDetails = true) {
  const movieData = window.dayValues || {};

  const rows = items.map((item, index) => {
    const anchor = item.querySelector("a");
    const rawText = item.childNodes[0]?.nodeValue?.trim() || "";
    const [yearPartRaw, namePartRaw] = rawText.includes(":") ? rawText.split(":") : [rawText, rawText];
    const year = yearPartRaw.match(/\d{4}/)?.[0] || "";
    const nameText = namePartRaw?.trim() || rawText;
    const plainName = anchor ? anchor.textContent.trim() : nameText;

    // Match exact movie key
    const movieKey = Object.keys(movieData).find(key => {
      const cleanedKey = key.replace(" Box Office Collection: Day-Wise", "").trim().toLowerCase();
      return cleanedKey === plainName.toLowerCase();
    });

    const movieDetails = movieKey ? movieData[movieKey] : null;

    let detailsHTML = "";
    if (includeDetails && movieDetails) {
  const today = new Date();
const release = movieDetails.releaseDate ? new Date(movieDetails.releaseDate) : null;
const daysSinceRelease = release ? Math.floor((today - release) / (1000 * 60 * 60 * 24)) + 1 : Infinity;

const dayKeys = Object.keys(movieDetails)
  .filter(key => /^\d+$/.test(key))
  .map(Number)
  .filter(day => day <= daysSinceRelease)
  .sort((a, b) => a - b);


  let lastValue = 0;
const now = new Date();
const isToday = release && release.toDateString() === now.toDateString();

const hoursNow = now.getHours();
const minutesNow = now.getMinutes();
const currentDayFraction = (hoursNow * 60 + minutesNow) / (24 * 60); // 0 to 1

const dayWiseData = dayKeys.map((day, idx) => {
  const current = parseFloat(movieDetails[day]);
  let daily = current - lastValue;
  lastValue = current;

  // Apply partial value only for current day
  if (day === daysSinceRelease) {
    daily *= currentDayFraction;
  }

  const isLastDay = idx === dayKeys.length - 1;
  const dayLabel = `<strong>Day ${day}${isLastDay && day > 7 ? "+" : ""}</strong>`;
  return `${dayLabel}: ₹${daily.toFixed(2)} Cr`;
}).join(", ");



      detailsHTML = `
        <div class="details">
          ${movieDetails.releaseDate ? `<div><strong>Theatrical Release Date:</strong> ${movieDetails.releaseDate}</div>` : ""}
		${movieDetails.ottReleaseDate ? `<div><strong>OTT Release Date:</strong> ${movieDetails.ottReleaseDate}</div>` : ""}
		${movieDetails.Platform ? `<div><strong>OTT Platform:</strong> ${movieDetails.Platform}</div>` : ""}
		${movieDetails.Budget ? `<div><strong>Budget:</strong> ₹${movieDetails.Budget} Cr</div>` : ""}
		${movieDetails.total ? `<div><strong>Total Box Office:</strong> ₹${movieDetails.total} Cr</div>` : ""}
		${movieDetails.Verdict ? `<div><strong>Verdict:</strong> ${movieDetails.Verdict}</div>` : ""}
		${movieDetails.Rating ? `<div><strong>Rating:</strong> ${movieDetails.Rating}</div>` : ""}
		${dayWiseData ? `<div><strong>Day-wise:</strong> ${dayWiseData}</div>` : ""}
          
        </div>`;
    }

    return `
      <tr role="row">
        <td aria-label="Movie number ${items.length - index}">${items.length - index}</td>
        <td><time datetime="${year}" aria-label="Year ${year}">${year}</time></td>
        <td><div><strong>${plainName}</strong></div>${detailsHTML}</td>
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
