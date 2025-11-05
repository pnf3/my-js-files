document.addEventListener("DOMContentLoaded", function() {
    // Get the current post title
    const postTitleElement = document.querySelector("h1.entry-title");
    if (!postTitleElement) return; // Exit if title is missing

    const postTitle = postTitleElement.textContent.trim();
    const cumulativeValuesObj = dayValues[postTitle]; // Now an object

   
    if (!cumulativeValuesObj) return; // Exit if no data found

    // Convert object values to an ordered array, excluding "total"
  //  const dailyEarnings = Object.keys(cumulativeValuesObj)
   //     .filter(key => !isNaN(key)) // Only numeric keys (day-wise data)
   //     .map(key => parseFloat(cumulativeValuesObj[key]));

  //  console.log(dailyEarnings); // Debugging: Check filtered daily earnings

 // Convert object values to an ordered array, excluding "total"
    const cumulativeValues = Object.keys(cumulativeValuesObj)
        .filter(key => !isNaN(key)) // Only numeric keys (day-wise data)
        .sort((a, b) => a - b) // Ensure the order is correct (ascending)
        .map(key => parseFloat(cumulativeValuesObj[key]));

    console.log("Cumulative Values:", cumulativeValues); // Debugging: Check ordered cumulative earnings

    // Compute daily earnings from cumulative values
    let previousValue = 0;
    let dailyEarnings = cumulativeValues.map((currentValue, index) => {
        let earning = index === 0 ? currentValue : currentValue - previousValue;
        previousValue = currentValue;
        return earning;
    });

    console.log("Daily Earnings:", dailyEarnings); // Debugging: Check computed daily earnings

    // If your table is in descending order, reverse the daily earnings array
   // dailyEarnings.reverse();

    // Get table body
    const tbody = document.getElementById("boxOfficeBody");
    if (!tbody) return;

    let rows = Array.from(tbody.querySelectorAll("tr:not(.week-summary)"));
    let lastRow = rows[0];
    if (!lastRow) return;

    let lastDay = parseInt(lastRow.cells[0].innerText.replace("Day ", ""));
    let releaseDateText = document.getElementById("theatrical-date").innerText.trim();
    let releaseDate = parseDate(releaseDateText);
    let today = new Date(new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata"
    }));
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
        return newDate.toLocaleString("en-US", {
            weekday: "long"
        });
    }

    function parseDate(dateStr) {
        let parts = dateStr.replace(/,/g, "").split(" ");
        let months = {
            "January": 0,
            "February": 1,
            "March": 2,
            "April": 3,
            "May": 4,
            "June": 5,
            "July": 6,
            "August": 7,
            "September": 8,
            "October": 9,
            "November": 10,
            "December": 11
        };
        return new Date(parts[2], months[parts[0]], parseInt(parts[1]));
    }

    function getOrdinal(n) {
        let suffix = ["th", "st", "nd", "rd"];
        let v = n % 100;
        return n + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
    }
});


document.addEventListener("DOMContentLoaded", function() {
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

document.addEventListener("DOMContentLoaded", function() {
    const tbody = document.getElementById("boxOfficeBody");
    let rows = Array.from(tbody.querySelectorAll("tr:not(.week-summary)"));
    let lastRow = rows[0];
    if (!lastRow) return;

    let lastDay = parseInt(lastRow.cells[0].innerText.replace("Day ", ""));
    let lastCollection = parseFloat(lastRow.cells[2].innerText) || 0;
    let releaseDateText = document.getElementById("theatrical-date").innerText.trim();
    let releaseDate = parseDate(releaseDateText);

    let today = new Date(new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata"
    }));
    let maxDayAllowed = Math.floor((today - releaseDate) / (1000 * 60 * 60 * 24)) + 1;

    let newRows = [];
    let weekTotals = {};

    for (let i = 1; i <= 0; i++) {
        let nextDay = lastDay + i;
        if (nextDay > maxDayAllowed) break;

        let dayName = getDayName(releaseDate, nextDay);
        let weekNum = Math.ceil(nextDay / 7);
        if (!weekTotals[weekNum]) weekTotals[weekNum] = 0;

        // Adjust growth based on the day of the week
        if (dayName === "Friday") {
            lastCollection *= 1.25; // ⬆️ 25% Increase over Thursday
        } else if (dayName === "Saturday") {
            lastCollection *= 1.40; // ⬆️ 40% Increase over Friday
        } else if (dayName === "Sunday") {
            lastCollection *= 1.15; // ⬆️ 15% Increase over Saturday
        } else if (dayName === "Monday") {
            lastCollection *= 0.40; // ⬇️ 60% Decrease from Sunday
        } else {
            lastCollection *= 0.75; // ⬇️ 25% Decrease (Tuesday to Thursday)
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
        return newDate.toLocaleString("en-US", {
            weekday: "long"
        });
    }

    function parseDate(dateStr) {
        let parts = dateStr.replace(/,/g, "").split(" ");
        let months = {
            "January": 0,
            "February": 1,
            "March": 2,
            "April": 3,
            "May": 4,
            "June": 5,
            "July": 6,
            "August": 7,
            "September": 8,
            "October": 9,
            "November": 10,
            "December": 11
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
document.addEventListener("DOMContentLoaded", function() {
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

    const movieName = entryTitle.textContent.replace("Box Office Collection: Day-Wise", "").trim() || "Movie";
    document.querySelectorAll("[id^='movie-name-']").forEach(el => el.textContent = movieName);

    let latestDay = null,
        totalSum = 0,
        currentWeek = null;
    const weekSums = {},
        weekTotalElements = {};

    let now = new Date(new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata"
    }));
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
                // Check if the row is for Day 0
                const isDay0 = row.cells[0].innerText.trim() === "Day 0";

                // Exclude Day 0 and today's full collection before 11:59 PM
                if (!isDay0) {
                    if (row === todayRow && (now.getHours() < 23 || now.getMinutes() < 59)) {
                        // Exclude today’s full collection before 11:59 PM, but simulate it
                    } else {
                        totalSum += collection;
                    

                    // Update current week's total, excluding Day 0
                    if (currentWeek) {
                        weekSums[currentWeek] += collection;
                    }
					
					}
                }

                // Update latestDay, excluding Day 0
                if (!isDay0 && !latestDay) {
                    latestDay = row.cells[0].textContent.trim();
                }
            } else {
                row.style.display = "none";
            }
        }
    }

    function updateTodayCollection() {
    let now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

    if (!todayCollectionCell) return; // Ensure today's cell exists

    let fullTodayCollection = parseFloat(todayCollectionCell.dataset.fullValue) || parseFloat(todayCollectionCell.innerText) || 0;
    
    // Store today's full value for reference
    todayCollectionCell.dataset.fullValue = fullTodayCollection;

    let startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    let elapsedTime = (now - startOfDay) / (1000 * 60 * 60 * 24); // Fraction of the day elapsed
    let proportionalCollection = (fullTodayCollection * elapsedTime).toFixed(2); // Collection up to current time

    let previousValue = parseFloat(todayCollectionCell.dataset.prevValue) || 0; // Track last displayed value
    let incrementalIncrease = proportionalCollection - previousValue; // Ensure only the increase is added

    if (incrementalIncrease > 0) {
        todayCollectionCell.innerHTML = `${proportionalCollection}<sup class="star">*</sup> <span style="color: green;" class="up-arrow">&#9650;</span>`;
        animateArrow(todayCollectionCell);
    } else {
        todayCollectionCell.innerHTML = `${proportionalCollection}<sup class="star">*</sup>`;
    }

    // Store the new proportional value
    todayCollectionCell.dataset.prevValue = proportionalCollection;

    // Update weekly total dynamically
    if (currentWeek && incrementalIncrease > 0) {
        weekSums[currentWeek] += incrementalIncrease;
        weekTotalElements[currentWeek].cells[1].textContent = weekSums[currentWeek].toFixed(2);
    }

    // Update total sum dynamically
    if (incrementalIncrease > 0) {
        totalSum += incrementalIncrease;
        totalSumElement.textContent = totalSum.toFixed(2);
        totalSumElement2.textContent = totalSum.toFixed(2);
    }

    generateChart(); // ✅ Update the chart dynamically
}


    // Run immediately when the page loads
    updateTodayCollection();

    // First update after 1 second
    setTimeout(() => {
        updateTodayCollection();

        // Then update every 5 seconds
        setInterval(updateTodayCollection, 60000);
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
            metaDescription.content = `${movieName} - Track worldwide earnings, daily updates, budget, cast, crew, and total gross up to ${latestDay}. Stay tuned for the latest box office performance and verdict.`;
              document.title = `${movieName}  ${latestDay} Box Office Collection`;
        } else {
           // metaDescription.content = `Explore the complete list of ${entryTitle.textContent.trim()} List year-wise, from the first film to the latest and upcoming releases, along with the total movie count.`;
        }
        entryTitle.textContent = entryTitle.textContent.replace("Box Office Collection: Day-Wise", `Day 1 to ${latestDay} Box Office Collection`);
const latestDay2 = document.getElementById("latest-day2");
latestDay2.textContent = latestDay2.textContent.replace("Day-Wise", `From Day 1 to ${latestDay}`);

    }


    // Function to generate the Daily Collection Chart
    function generateChart() {
        let days = ["Day 0"]; // Start with Day 0
        let collections = [0]; // Day 0 has a collection of 0
        let dayCollectionMap = {}; // Store day-wise collections

        // Loop through table rows and store data
        document.querySelectorAll("#boxOfficeBody tr:not(.week-summary)").forEach(row => {
            let dayLabel = row.cells[0].innerText.trim(); // e.g., "Day 5"
            let collectionValue = parseFloat(row.cells[2].innerText) || 0;

            if (dayLabel !== "Day 0") {
                dayCollectionMap[dayLabel] = collectionValue; // Store collection for the day
            }
        });

        // Sort days correctly (convert "Day X" -> X, sort numerically, then convert back)
        let sortedDays = Object.keys(dayCollectionMap)
            .sort((a, b) => parseInt(a.replace("Day ", "")) - parseInt(b.replace("Day ", "")));

        // Push sorted days and their corresponding collections
        sortedDays.forEach(day => {
            days.push(day);
            collections.push(dayCollectionMap[day]);
        });

        // Ensure today's simulated collection is included
        let todaySimulatedValue = parseFloat(todayCollectionCell.innerText) || 0;
        let todayLabel = `Day ${currentDayNum}`;

        if (!days.includes(todayLabel)) {
            days.push(todayLabel);
            collections.push(todaySimulatedValue);
        } else {
            let todayIndex = days.indexOf(todayLabel);
            collections[todayIndex] = todaySimulatedValue;
        }

        // Update or create the chart
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
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let value = context.raw || 0;
                                    return `Collection: ₹${value.toFixed(2)} Cr`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Days"
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: "Day Collection (\u20B9 Cr)"
                            }
                        }
                    }
                }
            });
        }

        generateTotalCollectionChart();
    }




    // Function to generate the Total Collection Chart
    function generateTotalCollectionChart() {
        let totalDays = ["Day 0"]; // Start with Day 0
        let cumulativeCollections = [0]; // Initial total is 0
        let totalSum = 0;

        let rows = document.querySelectorAll("#boxOfficeBody tr:not(.week-summary)");
        let todaySimulatedValue = parseFloat(todayCollectionCell.innerText) || 0;

        [...rows].reverse().forEach(row => {
            let dayLabel = row.cells[0].innerText;
            let collectionValue = parseFloat(row.cells[2].innerText) || 0;

            if (dayLabel !== "Day 0") {
                totalSum += collectionValue;
                totalDays.push(dayLabel);
                cumulativeCollections.push(totalSum);
            }
        });

        let todayLabel = `Day ${currentDayNum}`;
        if (!totalDays.includes(todayLabel)) {
            totalSum += todaySimulatedValue;
            totalDays.push(todayLabel);
            cumulativeCollections.push(totalSum);
        }

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
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let value = context.raw || 0;
                                    return `Collection: ₹${value.toFixed(2)} Cr`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Days"
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: "Total Collection (\u20B9 Cr)"
                            }
                        }
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
    let months = {
        "January": 0,
        "February": 1,
        "March": 2,
        "April": 3,
        "May": 4,
        "June": 5,
        "July": 6,
        "August": 7,
        "September": 8,
        "October": 9,
        "November": 10,
        "December": 11
    };
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
    const table = document.querySelector(".movies-table");
    const tableHead = document.querySelector(".movies-table thead");
    const tableBody = document.querySelector(".movies-table tbody");

    if (!table || !tableHead || !tableBody) {
        console.warn("Movies table not found!");
        return;
    }

    // Add a new row above headers for "Box Office Collection Day Wise" (if not already added)
    if (!document.querySelector(".movies-table thead .boc-header-row")) {
        let headerRow = document.createElement("tr");
        headerRow.classList.add("boc-header-row");

        let headerCell = document.createElement("th");
        headerCell.setAttribute("colspan", "3");
        headerCell.textContent = "Indian Movies Box Office Collection: Day-Wise";
        headerCell.style.textAlign = "center"; // Center align the text

        headerRow.appendChild(headerCell);
        tableHead.prepend(headerRow); // Insert at the top of the thead
    }

    // Select the actual column header row (if it exists) or create it
    let columnHeaderRow = tableHead.querySelector("tr:not(.boc-header-row)");
    if (!columnHeaderRow) {
        columnHeaderRow = document.createElement("tr");
        tableHead.appendChild(columnHeaderRow);
    }

    // Add "BOC" column if not already present
    if (!document.querySelector(".movies-table thead th.boc-header")) {
        let bocHeader = document.createElement("th");
        bocHeader.textContent = "Language";
        bocHeader.classList.add("boc-header");
        columnHeaderRow.appendChild(bocHeader);
    }

    // Add "Release Date" column as the LAST column instead of the first
    if (!document.querySelector(".movies-table thead th.release-date-header")) {
        let releaseDateHeader = document.createElement("th");
        releaseDateHeader.textContent = "Release Date";
        releaseDateHeader.classList.add("release-date-header");
        columnHeaderRow.appendChild(releaseDateHeader); // Append at the end
    }

    // Helper function to clean movie title
    function cleanMovieTitle(title) {
        return title.replace(" Box Office Collection: Day-Wise", "").trim();
    }

    // Create a new object with cleaned movie titles for dayValues comparison
    let cleanedDayValues = {};
    for (let key in dayValues) {
        let cleanedKey = cleanMovieTitle(key);
        cleanedDayValues[cleanedKey] = dayValues[key];
    }

    // Store rows in an array to sort them later
    let rowsData = [];

    // Iterate through each row and update with Release Date, Movie Name, and BOC
    tableBody.querySelectorAll("tr").forEach(row => {
        let movieCell = row.querySelector("td a"); // Find movie title link
        if (movieCell) {
            let originalMovieTitle = movieCell.textContent.trim(); // Get movie title

            // Clean the movie title in the table
            let cleanedMovieTitle = cleanMovieTitle(originalMovieTitle);
            movieCell.textContent = cleanedMovieTitle; // Update table

            let releaseDate = "N/A";
            let bocTotal = "N/A";

            // Check if the cleaned movie title exists in the updated dayValues
            if (cleanedDayValues[cleanedMovieTitle]) { 
                let movieData = cleanedDayValues[cleanedMovieTitle];
                releaseDate = movieData.releaseDate ?? "N/A";
                bocTotal = movieData.Language ?? "N/A";
            }

            // Create BOC cell
            let bocCell = document.createElement("td");
            bocCell.textContent = bocTotal;
            row.appendChild(bocCell); // Append at the end

            // Create Release Date cell and move it to the end
           let releaseDateCell = document.createElement("td");

// Format release date if it's a valid date
if (releaseDate !== "N/A" && !isNaN(new Date(releaseDate))) {
    let dateObj = new Date(releaseDate);
    let formattedDate = dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    releaseDateCell.textContent = formattedDate;
} else {
    releaseDateCell.textContent = releaseDate; // Keep "N/A" as it is
}

row.appendChild(releaseDateCell); // Append at the end


            // Store row data for sorting
            rowsData.push({ row, releaseDate });
        }
    });

    // Sort rows in descending order based on the release date
    rowsData.sort((a, b) => {
        if (a.releaseDate === "N/A") return 1;
        if (b.releaseDate === "N/A") return -1;
        return new Date(b.releaseDate) - new Date(a.releaseDate);
    });

    // Append sorted rows back to the table
    tableBody.innerHTML = ""; // Clear existing rows
    rowsData.forEach(({ row }) => tableBody.appendChild(row));
}); 



