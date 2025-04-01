document.addEventListener("DOMContentLoaded", () => {
    // Get references to frequently accessed DOM elements
    const pageTitle = document.title.replace(" List", "");
    const metaDescription = document.querySelector("meta[name='description']");
    const moviesList = document.getElementById("movies-list");
    const postSubBody = document.querySelector(".post-sub-body#post-sub-body");
    const entryTitle = document.querySelector("h1.entry-title");

   if (metaDescription) {
        if (entryTitle.textContent.includes("Movies List")) {
            metaDescription.content = `Explore ${pageTitle} List year wise, from the first film to the latest and upcoming releases, along with the total movies count.`;
          //  document.title = `${pageTitle} List: Year-Wise Filmography`;
			// entryTitle.textContent = entryTitle.textContent.replace("Movies List", `Movies List: Year-Wise Complete Filmography`);
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
      return titleElement?.textContent.replace("Movies List: Year-Wise Complete Filmography", "").trim() || "Actor";
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