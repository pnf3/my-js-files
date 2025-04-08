document.addEventListener("DOMContentLoaded", () => {
    // Get references to frequently accessed DOM elements
    const includeYearsInTitle = false; // toggle this to true/false
    const pageTitle = document.title.replace(" List", "");
    const metaDescription = document.querySelector("meta[name='description']");
    const moviesList = document.getElementById("movies-list");
    const entryTitle = document.querySelector("h1.entry-title");

    if (moviesList) {
        const listItems = Array.from(moviesList.querySelectorAll("li"));
        listItems.sort((a, b) => parseInt(b.textContent) - parseInt(a.textContent));
        moviesList.innerHTML = "";
        listItems.forEach(li => moviesList.appendChild(li));

        const years = listItems.map(li => parseInt(li.textContent));
        const minYear = Math.min(...years);
        const maxYear = Math.max(...years);

        if (metaDescription && entryTitle.textContent.includes("Movies List")) {
            metaDescription.content = `Explore the complete ${pageTitle} movies list, sorted year-wise — from the debut film to the latest and upcoming releases. Includes total number of movies to date.`;

            const baseTitle = `${pageTitle} Movies List (Year-Wise) | Complete Filmography`;
            const finalTitle = includeYearsInTitle ? `${baseTitle} [${minYear}–${maxYear}]` : baseTitle;

            document.title = finalTitle;
            entryTitle.textContent = finalTitle;
        }
    }


    // Update last movie list item
    const lastMovieItem = moviesList.querySelector("li:last-child");
    if (lastMovieItem) {
      lastMovieItem.textContent += " - First Movie";
    }

    // Update H1 Titles
   // document.querySelectorAll(".entry-title").forEach((h1) => {
  //    h1.textContent = h1.textContent.replace("Movies List", "All Movies List: Year-Wise");
  //  });

    // Insert Dynamic Content Before .post-sub-body
    const actorName = extractActorName(entryTitle);
    if (postSubBody) {
      postSubBody.insertAdjacentHTML("beforebegin", generateDynamicCard(actorName));
    }

    // Update Dynamic Actor Names
    document.querySelectorAll("[id^='actor-name']").forEach((element) => {
      element.textContent = actorName;
    });

    // Convert Movie List to Table
    convertListToTable(moviesList, actorName);

    // Helper Functions
    function extractActorName(titleElement) {
      return titleElement?.textContent.replace("Movies List: Year-Wise", "").trim() || "Actor";
    }

    function generateDynamicCard(actorName) {
      return `
        <div class="card">
          <p style="margin-bottom:0">
            Explore the complete <span id="actor-name-1">${actorName}</span> movies list year wise, from the first film to the latest and upcoming releases. This detailed table includes <span id="actor-name-2">${actorName}</span> all movies list, with movie numbers, release years, movie names, and the total movies count to date.
          </p>
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

    let tableRows = items.map((item, index) => {
        const anchor = item.querySelector("a"); // Get the <a> tag if available
        let textContent = item.childNodes[0].nodeValue.trim(); // Extract text before any <a> tag

        // Extract year and movie name properly
        const match = textContent.match(/^(\d{4})[:\s]*(.*)$/);
        let year = match ? match[1] : "";  // Year (first match group)
        let title = match ? match[2] : ""; // Title (second match group)

        // If there's a link, use it for the movie title
        let movieName = anchor ? `<a href="${anchor.href}" target="_blank">${anchor.textContent}</a>` : title;

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
            <th scope="col">Movie No.</th>
            <th scope="col">Release Year</th>
            <th scope="col">Movie Name</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
          <tr>
            <td colspan="3"><strong>${actorName} Total Movies Count</strong>: ${items.length}</td>
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
