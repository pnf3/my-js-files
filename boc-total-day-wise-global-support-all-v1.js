document.addEventListener("DOMContentLoaded", function () {
    // Get the current post title
    const postTitleElement = document.querySelector("h1.entry-title");
    if (!postTitleElement) return; // Exit if title is missing

    const postTitle = postTitleElement.textContent.trim();
   const cumulativeValuesObj = dayValues[postTitle]; // Now an object

// Convert object values to an ordered array
const dailyEarnings = Object.values(cumulativeValuesObj).map(value => parseFloat(value));


    // Compute daily earnings from cumulative values
   // let previousValue = 0;
 //   let dailyEarnings = cumulativeValues.map((currentValue, index) => {
  //     let earning = index === 0 ? parseFloat(currentValue) : parseFloat(currentValue) - previousValue;
   //     previousValue = parseFloat(currentValue);
   //     return earning;
  //  });

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
                <td>${collection.toFixed(2)}</td>
            </tr>`
        );

        // Insert Week Summary on Last Day of the Week
        if (nextDay % 7 === 0) {
            let weekOrdinal = getOrdinal(weekNum);
            newRows.unshift(
                `<tr class="week-summary">
                    <td colspan="2">${weekOrdinal} Week Total</td>
                    <td>${weekTotals[weekNum].toFixed(2)}</td>
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


   document.addEventListener("DOMContentLoaded", function () {
            const table = document.getElementById("boxOfficeTable");
            const tbody = document.getElementById("boxOfficeBody");

            // Sorting Function
            function sortTable(n) {
                let rows = Array.from(tbody.rows);
                let isAscending = table.getAttribute("data-sort") !== "asc";
                table.setAttribute("data-sort", isAscending ? "asc" : "desc");

                rows.sort((rowA, rowB) => {
                    let cellA = rowA.cells[n].innerText.trim();
                    let cellB = rowB.cells[n].innerText.trim();

                    if (!isNaN(cellA) && !isNaN(cellB)) {
                        return isAscending ? cellA - cellB : cellB - cellA;
                    }
                    return isAscending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
                });

                tbody.innerHTML = "";
                rows.forEach(row => tbody.appendChild(row));
            }

            // Add Sorting Click Event
            document.querySelectorAll("th").forEach((th, index) => {
                th.style.cursor = "pointer";
                th.addEventListener("click", () => sortTable(index));
            });

            // Hover Effect
            tbody.addEventListener("mouseover", (e) => {
                if (e.target.tagName === "TD") e.target.parentNode.style.backgroundColor = "#f1f1f1";
            });

            tbody.addEventListener("mouseout", (e) => {
                if (e.target.tagName === "TD") e.target.parentNode.style.backgroundColor = "";
            });

            // Make Table Responsive
            let container = document.querySelector(".box-office-container");
            container.style.overflowX = "auto";

          


        });

      document.addEventListener("DOMContentLoaded", function () {
    const tbody = document.getElementById("boxOfficeBody");
    let rows = Array.from(tbody.querySelectorAll("tr:not(.week-summary)"));
    let lastRow = rows[0];
    if (!lastRow) return;

    let lastDay = parseInt(lastRow.cells[0].innerText.replace("Day ", ""));
    let lastCollection = parseFloat(lastRow.cells[2].innerText) || 0;
    let releaseDateText = document.getElementById("theatrical-date").innerText.trim();
    let releaseDate = parseDate(releaseDateText);

    let today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    let maxDayAllowed = Math.floor((today - releaseDate) / (1000 * 60 * 60 * 24)) + 1;

    let newRows = [];
    let weekTotals = {};

    for (let i = 1; i <= 30; i++) {
        let nextDay = lastDay + i;
        if (nextDay > maxDayAllowed) break;

        let dayName = getDayName(releaseDate, nextDay);
        let weekNum = Math.ceil(nextDay / 7);
        if (!weekTotals[weekNum]) weekTotals[weekNum] = 0;

        // Adjust growth based on the day of the week
if (dayName === "Friday") {
    lastCollection *= 1.25;  // ⬆️ 25% Increase over Thursday
} else if (dayName === "Saturday") {
    lastCollection *= 1.40;  // ⬆️ 40% Increase over Friday
} else if (dayName === "Sunday") {
    lastCollection *= 1.15;  // ⬆️ 15% Increase over Saturday
} else if (dayName === "Monday") {
    lastCollection *= 0.40;  // ⬇️ 60% Decrease from Sunday
} else {
    lastCollection *= 0.75;  // ⬇️ 25% Decrease (Tuesday to Thursday)
}


        weekTotals[weekNum] += lastCollection;

        newRows.unshift(
            `<tr>
                <td>Day ${nextDay}</td>
                <td>${dayName}</td>
                <td>${lastCollection.toFixed(2)}</td>
            </tr>`
        );

        // **Insert Week Summary on Last Day of the Week**
        if (nextDay % 7 === 0) {
            let weekOrdinal = getOrdinal(weekNum);
            newRows.unshift(
                `<tr class="week-summary">
                    <td colspan="2">${weekOrdinal} Week Total</td>
                    <td>${weekTotals[weekNum].toFixed(2)}</td>
                </tr>`
            );
        }
    }

    tbody.innerHTML = newRows.join("") + tbody.innerHTML;

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

let chartInstance, totalChartInstance;
let todayCollectionCell, currentDayNum;
    document.addEventListener("DOMContentLoaded", function () {
    const metaDescription = document.querySelector("meta[name='description']");
    const entryTitle = document.querySelector("h1.entry-title");
    const latestDayElement = document.getElementById("latest-day");
    const nextDayElement = document.getElementById("next-day");
    const totalSumElement = document.getElementById("totalSum");
    const totalSumElement2 = document.getElementById("totalSum-2");
    const rows = document.querySelectorAll("#boxOfficeBody tr");
    const releaseDateElement = document.getElementById("theatrical-date");
    const chartCanvas = document.getElementById("boxOfficeChart");
    let chartInstance = null;
      

    if (!entryTitle || rows.length === 0 || !releaseDateElement || !chartCanvas) return;

    const movieName = entryTitle.textContent.replace("Worldwide Box Office Collection Day Wise", "").trim() || "Movie";
    document.querySelectorAll("[id^='movie-name-']").forEach(el => el.textContent = movieName);

    let latestDay = null, totalSum = 0, currentWeek = null;
    const weekSums = {}, weekTotalElements = {};

    let now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    let releaseDateText = releaseDateElement.innerText.trim();
    let releaseDate = parseDate(releaseDateText);
    let currentDayNum = Math.floor((now - releaseDate) / (1000 * 60 * 60 * 24)) + 1;
    let todayRow = Array.from(rows).find(row => row.cells[0].innerText === `Day ${currentDayNum}`);
    let todayCollectionCell = todayRow ? todayRow.cells[2] : null;

    totalSum = 0;
    for (const row of rows) {
        if (row.classList.contains("week-summary")) {
            currentWeek = row.cells[0].textContent.match(/\d+/)?.[0];
            if (currentWeek) {
                weekSums[currentWeek] = 0;
                weekTotalElements[currentWeek] = row;
            }
        } else {
            const collectionCell = row.cells[2];
            const collection = parseFloat(collectionCell?.textContent.trim());

            if (!isNaN(collection)) {
                if (row === todayRow && (now.getHours() < 23 || now.getMinutes() < 59)) {
                    // Exclude today’s full collection before 11:59 PM, but simulate it
                } else {
                    totalSum += collection;
                }

                if (currentWeek) weekSums[currentWeek] += collection;
                if (!latestDay) latestDay = row.cells[0].textContent.trim();
            } else {
                row.style.display = "none";
            }
        }
    }

    function updateTodayCollection() {
        let now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

        let prevDayRow = Array.from(rows).find(row => row.cells[0].innerText === `Day ${currentDayNum - 1}`);
        let prevCollection = prevDayRow ? parseFloat(prevDayRow.cells[2].innerText) : 0;

        if (prevCollection === 0 || !todayCollectionCell) return;

        let maxTodayCollection = prevCollection * 0.9;
        let startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        let elapsedTime = (now - startOfDay) / (1000 * 60 * 60 * 24);
        let simulatedCollection = (maxTodayCollection * elapsedTime).toFixed(2);

        let previousValue = parseFloat(todayCollectionCell.innerText) || 0;
        if (simulatedCollection > previousValue) {
            todayCollectionCell.innerHTML = `${simulatedCollection}<sup class="star">*</sup> <span style="color: green;" class="up-arrow">&#9650;</span>`;
            animateArrow(todayCollectionCell);
        } else {
            todayCollectionCell.innerHTML = `${simulatedCollection}<sup class="star">*</sup>`;
        }

        totalSumElement.textContent = (totalSum + parseFloat(simulatedCollection)).toFixed(2);
        totalSumElement2.textContent = (totalSum + parseFloat(simulatedCollection)).toFixed(2);

        generateChart(); // ✅ Update the chart dynamically
    }

    // Run immediately when the page loads
updateTodayCollection();

// First update after 1 second
setTimeout(() => {
    updateTodayCollection();
    
    // Then update every 5 seconds
    setInterval(updateTodayCollection, 5000);
}, 1);



    Object.entries(weekSums).forEach(([week, sum]) => {
        if (sum > 0) {
            weekTotalElements[week].cells[1].textContent = sum.toFixed(2);
        } else {
            weekTotalElements[week].style.display = "none";
        }
    });

    if (totalSumElement) totalSumElement.textContent = totalSum.toFixed(2);
    if (totalSumElement2) totalSumElement2.textContent = totalSum.toFixed(2);

    if (latestDayElement && nextDayElement && latestDay) {
        latestDayElement.textContent = latestDay;
        const latestDayNumber = parseInt(latestDay.replace(/\D/g, ""), 10);
        nextDayElement.textContent = !isNaN(latestDayNumber) ? `Day ${latestDayNumber + 1}` : "Day ?";
    }

    if (metaDescription) {
        if (entryTitle.textContent.includes("Box Office Collection")) {
            metaDescription.content = `${movieName} Box Office Collection: Track worldwide earnings, daily updates, and total revenue up to ${latestDay}. Stay tuned for more!`;
          //  document.title = `${movieName} Worldwide Box Office Collection ${latestDay}`;
        } 
	
	else {
            metaDescription.content = `Explore ${entryTitle.textContent.trim()} List year-wise, from the first film to the latest and upcoming releases, along with the total movie count.`;
        }
        entryTitle.textContent = entryTitle.textContent.replace("Day Wise", latestDay);

    }
     

// Function to generate the Daily Collection Chart
function generateChart() {
    let days = [];
    let collections = [];

    document.querySelectorAll("#boxOfficeBody tr:not(.week-summary)").forEach(row => {
        let dayLabel = row.cells[0].innerText;
        let collectionValue = parseFloat(row.cells[2].innerText) || 0;

        days.push(dayLabel);
        collections.push(collectionValue);
    });

    // Get today's collection value
    let todaySimulatedValue = parseFloat(todayCollectionCell.innerText) || 0;
    let todayLabel = `Day ${currentDayNum}`;

    // ✅ If today's data is missing, add it correctly
    if (!days.includes(todayLabel)) {
        days.push(todayLabel);
        collections.push(todaySimulatedValue);
    } else {
        // ✅ Update the last value (today’s collection)
        let todayIndex = days.indexOf(todayLabel);
        collections[todayIndex] = todaySimulatedValue;
    }

    // ✅ Reverse to maintain correct chart order (first day at bottom)
    days.reverse();
    collections.reverse();

    if (chartInstance) {
        chartInstance.data.labels = days;
        chartInstance.data.datasets[0].data = collections;
        chartInstance.update();
    } else {
        let ctx = document.getElementById("boxOfficeChart").getContext("2d");
        chartInstance = new Chart(ctx, {
            type: "line",
            data: {
                labels: days,
                datasets: [{
                    label: "Daily Collection (\u20B9 Cr)",
                    data: collections,
                    borderColor: "blue",
                    backgroundColor: "rgba(0,0,255,0.2)",
                    fill: true
                }]
            },
           options: {
                scales: {
                    x: { title: { display: true, text: "Days" } },
                    y: { title: { display: true, text: "Day Collection (\u20B9 Cr)" } }
                }
            }
        });
    }

    generateTotalCollectionChart(collections);
}

// Function to generate the Total Collection Chart (from Day 1 to Current Day)
function generateTotalCollectionChart() {
    let totalDays = [];
    let cumulativeCollections = [];
    let totalSum = 0;

    let rows = document.querySelectorAll("#boxOfficeBody tr:not(.week-summary)");
    let todaySimulatedValue = parseFloat(todayCollectionCell.innerText) || 0;
    
    // Loop in reverse order to process from Day 1 to current day
    [...rows].reverse().forEach(row => {
        let dayLabel = row.cells[0].innerText;
        let collectionValue = parseFloat(row.cells[2].innerText) || 0;

        totalSum += collectionValue; // Add each day's collection to the total
        totalDays.push(dayLabel);
        cumulativeCollections.push(totalSum);
    });

    // ✅ Ensure today's simulated collection is included in order
    let todayLabel = `Day ${currentDayNum}`;
    if (!totalDays.includes(todayLabel)) {
        totalSum += todaySimulatedValue;
        totalDays.push(todayLabel);
        cumulativeCollections.push(totalSum);
    }

    // ✅ No need to reverse; already in correct order (Day 1 → Current Day)
    if (totalChartInstance) {
        totalChartInstance.data.labels = totalDays;
        totalChartInstance.data.datasets[0].data = cumulativeCollections;
        totalChartInstance.update();
    } else {
        let ctxTotal = document.getElementById("totalCollectionChart").getContext("2d");
        totalChartInstance = new Chart(ctxTotal, {
            type: "line",
            data: {
                labels: totalDays,
                datasets: [{
                    label: "Total Collection (\u20B9 Cr)",
                    data: cumulativeCollections,
                    borderColor: "green",
                    backgroundColor: "rgba(0,255,0,0.2)",
                    fill: true
                }]
            },
            options: {
                scales: {
                    x: { title: { display: true, text: "Days" } },
                    y: { title: { display: true, text: "Total Collection (\u20B9 Cr)" } }
                }
            }
        });
    }
}

// Generate both charts once when the page loads
setTimeout(() => {
    generateChart();
    generateTotalCollectionChart();
}, 1000);

// Update charts dynamically every 5 seconds
setInterval(() => {
    generateChart();
    generateTotalCollectionChart();
}, 5000);

});

function parseDate(dateStr) {
    let parts = dateStr.replace(/,/g, "").split(" ");
    let months = { "January": 0, "February": 1, "March": 2, "April": 3, "May": 4, "June": 5, "July": 6, "August": 7, "September": 8, "October": 9, "November": 10, "December": 11 };
    return new Date(parts[2], months[parts[0]], parseInt(parts[1]));
}

function animateArrow(cell) {
    let arrow = cell.querySelector(".up-arrow");
    if (!arrow) return;
    arrow.style.opacity = "1";
    setTimeout(() => {
        arrow.style.opacity = "0";
    }, 1000);
}



function updateTime() {
    const timeElement = document.querySelector('.entry-time time');
    if (!timeElement) return;

    // Get the release date from the page
    const releaseDateElement = document.querySelector('#theatrical-date');
    if (!releaseDateElement) return;

    // Parse the release date (assuming format "Month DD, YYYY")
    const releaseDate = new Date(releaseDateElement.textContent + " 00:00:00");

    // Get the current date and time
    const now = new Date();

    // Check if the current date is within 30 days of the release date
    const daysSinceRelease = Math.floor((now - releaseDate) / (1000 * 60 * 60 * 24));

    if (daysSinceRelease < 0 || daysSinceRelease > 30) {
        console.log("Outside the 30-day update window.");
        return; // Stop updating if it's before release or after 30 days
    }

    // Convert to IST (GMT+5:30)
    const offset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + offset);

    // Format date as MM/DD/YYYY
    const formattedDate = istTime.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
    });

    // Format time as HH:MM:SS AM/PM
    const formattedTime = istTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    // Format datetime attribute in ISO 8601 with timezone offset (+05:30)
    const isoDateTime = istTime.toISOString().slice(0, 19);
    const timezoneOffset = "+05:30";

    // Update the time element
    timeElement.textContent = `${formattedDate} ${formattedTime}`;
    timeElement.setAttribute('datetime', `${isoDateTime}${timezoneOffset}`);

    // Schedule the next update in 1 hour
    setTimeout(updateTime, 3600000);
}

// Run on page load
updateTime();

  document.addEventListener("DOMContentLoaded", function () {
      var timeElements = document.querySelectorAll("time.published"); // Select all time elements
      
      timeElements.forEach(function (timeElement) {
          var dateStr = timeElement.getAttribute("datetime");
          if (dateStr) {
              var date = new Date(dateStr);

              var options = {
                  year: "numeric", month: "long", day: "numeric",
                  hour: "2-digit", minute: "2-digit",
                  hour12: true, timeZone: "Asia/Kolkata"
              };

              timeElement.innerHTML = date.toLocaleString("en-US", options) + " IST - NF360";
          }
      });
  });
  
     function loadRelatedPostsTable() {
        const relatedItems = document.querySelectorAll(".related-items .post");

        if (relatedItems.length === 0) {
            // Retry after 500ms if elements are not yet loaded
            setTimeout(loadRelatedPostsTable, 0);
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
        setTimeout(loadRelatedPostsTable, 0); // Delay initial execution by 1 second
    });



   // Get the button element by its class
    var button = document.querySelector(".show-cf.btn");

    // Replace the text content of the button
    if (button) {
        button.textContent = "Post a Comment";
    }
	
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
