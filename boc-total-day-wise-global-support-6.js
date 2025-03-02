// script.js - Updates table with Box Office Collection (BOC)
document.addEventListener("DOMContentLoaded", function () {
    // Check if "Box Office Collection" tag exists
    const boxOfficeTag = document.querySelector(".queryMessage .query-info");
    if (!boxOfficeTag || boxOfficeTag.textContent.trim() !== "Box Office Collection") {
        console.warn("Box Office Collection tag not found!");
        return; // Stop execution if the tag is missing
    }

    // Select the movie table
    const table = document.querySelector(".movies-table thead tr");
    const tbody = document.querySelector(".movies-table tbody");

    if (!table || !tbody) {
        console.warn("Movies table not found!");
        return;
    }

    // Add "BOC" column to the table header if not already added
    if (!document.querySelector(".movies-table thead th.boc-header")) {
        let bocHeader = document.createElement("th");
        bocHeader.textContent = "BOC (₹ Crore)";
        bocHeader.classList.add("boc-header");
        table.appendChild(bocHeader);
    }

    // Iterate through each row to update BOC
    tbody.querySelectorAll("tr").forEach(row => {
        let movieCell = row.querySelector("td a"); // Find movie title link
        if (movieCell) {
            let movieTitle = movieCell.textContent.trim(); // Get full title from table

            if (dayValues[movieTitle]) {  // Exact match with data values
                // Calculate total box office collection
                let totalGross = Object.values(dayValues[movieTitle])
                    .reduce((sum, value) => sum + parseFloat(value), 0);

                // Add new column with total BOC
                let bocCell = document.createElement("td");
                bocCell.textContent = totalGross.toFixed(2); // Ensure consistent decimal format
                row.appendChild(bocCell);
            } else {
                // If no data available, add empty cell
                let bocCell = document.createElement("td");
                bocCell.textContent = "N/A";
                row.appendChild(bocCell);
            }
        }
    });
});
