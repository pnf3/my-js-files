document.addEventListener("DOMContentLoaded", function () {
    // Define cumulative box office collections for movies
    const dayValues = {
        "Ruslaan: Day-Wise Box Office Collection": ["100", "120", "150", "180", "210", "250", "300", "350", "400", "450", "500", "550", "600", "650", "700"],
        "BOC Final Template 5": ["100","120"],
        // Add more movie titles and data
    };

    // Get the current post title
    const postTitleElement = document.querySelector("h1.entry-title");
    if (!postTitleElement) return; // Exit if title is missing

    const postTitle = postTitleElement.textContent.trim();
    const cumulativeValues = dayValues[postTitle];

    if (!cumulativeValues) return; // Exit if no data exists for this title

    // Compute daily earnings from cumulative values
    let previousValue = 0;
    let dailyEarnings = cumulativeValues.map((currentValue, index) => {
        let earning = index === 0 ? parseFloat(currentValue) : parseFloat(currentValue) - previousValue;
        previousValue = parseFloat(currentValue);
        return earning;
    });

    // Reverse daily earnings to match the table's descending order
//    dailyEarnings.reverse();

    // Get table body
    const tbody = document.getElementById("boxOfficeBody");
    if (!tbody) return;

    let rows = Array.from(tbody.querySelectorAll("tr:not(.week-summary)"));
    let lastRow = rows[0];
    if (!lastRow) return;

    let lastDay = parseInt(lastRow.cells[0].innerText.replace("Day ", ""));
    let releaseDateText = document.getElementById("theatrical-date").innerText.trim();
    let releaseDate = parseDate(releaseDateText);
    let today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    let maxDayAllowed = Math.floor((today - releaseDate) / (1000 * 60 * 60 * 24)) + 1;

    let newRows = [];
    let weekTotals = {};

    // Insert missing days dynamically
    for (let i = 0; i < dailyEarnings.length; i++) {
        let nextDay = lastDay + (i + 1);
        if (nextDay > maxDayAllowed) break;

        let dayName = getDayName(releaseDate, nextDay);
        let weekNum = Math.ceil(nextDay / 7);
        if (!weekTotals[weekNum]) weekTotals[weekNum] = 0;

        let collection = dailyEarnings[i] || 0;
        weekTotals[weekNum] += collection;

        newRows.unshift(
            `<tr>
                <td>Day ${nextDay}</td>
                <td>${dayName}</td>
                <td>${collection.toFixed(1)}</td>
            </tr>`
        );

        // Insert Week Summary on Last Day of the Week
        if (nextDay % 7 === 0) {
            let weekOrdinal = getOrdinal(weekNum);
            newRows.unshift(
                `<tr class="week-summary">
                    <td colspan="2">${weekOrdinal} Week Total</td>
                    <td>${weekTotals[weekNum].toFixed(1)}</td>
                </tr>`
            );
        }
    }

    // Append new rows to the table
    tbody.innerHTML = newRows.join("") + tbody.innerHTML;

    // Update total collection
   // const totalSumCell = document.getElementById("totalSum");
   // if (totalSumCell) {
   //     totalSumCell.textContent = cumulativeValues[cumulativeValues.length - 1] + " Crs";
   // }

    // Helper Functions
    function getDayName(releaseDate, dayNum) {
        let newDate = new Date(releaseDate);
        newDate.setDate(newDate.getDate() + dayNum - 1);
        return newDate.toLocaleString("en-US", { weekday: "long" });
    }

    function parseDate(dateStr) {
        let parts = dateStr.replace(/,/g, "").split(" ");
        let months = {
            "January": 0, "February": 1, "March": 2, "April": 3, "May": 4, "June": 5,
            "July": 6, "August": 7, "September": 8, "October": 9, "November": 10, "December": 11
        };
        return new Date(parts[2], months[parts[0]], parseInt(parts[1]));
    }

    function getOrdinal(n) {
        let suffix = ["th", "st", "nd", "rd"];
        let v = n % 100;
        return n + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
    }
});
