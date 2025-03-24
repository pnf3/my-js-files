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
            document.title = `${pageTitle} List: Year-Wise Filmography`;
			entryTitle.textContent = entryTitle.textContent.replace("Filmography", `Complete Filmography`);
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
      return titleElement?.textContent.replace(": Year-Wise Complete Filmography", "").trim() || "Actor";
    }

    function generateDynamicCard(actorName) {
      return `
        <div class="card">
          <p style="margin-bottom:0">
            <p>Explore the complete year-wise <span id="actor-name-1">${actorName}</span> movies list, from his debut to the latest and upcoming releases. This detailed table includes all <span id="actor-name-2">${actorName}</span> movies, with movie numbers, release years, titles, and the total film count to date.</p>
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
        const [year, ...titleParts] = item.textContent.split(": ");
        const title = titleParts.join(": ");
        return `
          <tr>
            <td>${items.length - index}</td>
            <td>${year}</td>
            <td>${title}</td>
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
