    function loadRelatedPostsTable() {
        const relatedItems = document.querySelectorAll(".related-items .post");

        if (relatedItems.length === 0) {
            // Retry after 500ms if elements are not yet loaded
            setTimeout(loadRelatedPostsTable, 500);
            return;
        }

        const tableBody = document.querySelector("#moviesTable tbody");
        const relatedWrap = document.getElementById("related-wrap");

        if (relatedWrap) {
            relatedWrap.innerHTML = ""; // Remove existing div layout
        }

        relatedItems.forEach(post => {
            let titleElement = post.querySelector(".entry-title a");
            let link = titleElement ? titleElement.href : "#";
            let title = titleElement ? titleElement.textContent.trim() : "Unknown Title";

            let row = document.createElement("tr");

            row.innerHTML = `
                <td>${title}</td>
                <td><a href="${link}" target="_blank">View</a></td>
            `;

            tableBody.appendChild(row);
        });
    }

    // Run function when the page is fully loaded
    document.addEventListener("DOMContentLoaded", function () {
        setTimeout(loadRelatedPostsTable, 1000); // Delay initial execution by 1 second
    });


   // Get the button element by its class
    var button = document.querySelector(".show-cf.btn");

    // Replace the text content of the button
    if (button) {
        button.textContent = "Post a Comment";
    }