    window.dayValues = {}; // Initialize an empty object

    function loadJSONData(id) {
        let scriptTag = document.getElementById(id);
        if (scriptTag) {
            try {
                return JSON.parse(scriptTag.innerText); // Parse JSON from script content
            } catch (error) {
                console.error("Error parsing JSON from", id, error);
                return {};
            }
        }
        return {};
    }

    // Load both JSON data parts and merge them
    window.dayValues = {
        ...loadJSONData("boxOfficerunning"), 
     //   ...loadJSONData("boxOfficecompleted"),
		...boxOfficeData,		
    };

   // console.log("Loaded Data:", window.dayValues); // Check in console


// Function to fill missing days with `null`
function addMissingDays() {
    for (let movie in window.dayValues) {
        let data = window.dayValues[movie];

        // Find first and last available day
        let existingDays = Object.keys(data)
            .map(d => parseInt(d))
            .filter(d => !isNaN(d)) // Get only numeric keys
            .sort((a, b) => a - b);

        let firstDay = existingDays[0]; // First available day
        let lastDay = existingDays[existingDays.length - 1]; // Last available day

        // Add missing days with null
        for (let day = firstDay; day <= lastDay; day++) {
            if (!(day in data)) {
                data[day] = null;
            }
        }

        // Ensure total remains unchanged
        data.total = data.total;

      //  console.log(`Updated Data for ${movie}:`, data);
    }
}

// Run the function before predicting box office values
addMissingDays();

// Growth rates for each weekday
const growthRates = {
    "Friday": 1.14,   // +10%
    "Saturday": 1.15, // +15%
    "Sunday": 1.20,   // +20%
    "Monday": 0.90,   // -15%
    "Tuesday": 0.85,  // -20%
    "Wednesday": 0.75,// -25%
    "Thursday": 0.50  // -30%
};

// List of public holidays (YYYY-MM-DD format)
const holidays = [
    "2025-01-01", "2025-01-06", "2025-01-14", "2025-01-26", "2025-02-02",
    "2025-02-12", "2025-02-19", "2025-02-23", "2025-02-26", "2025-03-13",
    "2025-03-14", "2025-03-31", "2025-04-10", "2025-04-16", "2025-04-18",
    "2025-05-12", "2025-06-07", "2025-07-06", "2025-08-15", "2025-08-16",
    "2025-08-27", "2025-09-05", "2025-09-29", "2025-09-30", "2025-10-01",
    "2025-10-02", "2025-10-07", "2025-10-10", "2025-10-20", "2025-10-22",
    "2025-10-23", "2025-10-28", "2025-11-05", "2025-11-24", "2025-12-24",
    "2025-12-25"
];

// Function to get day name and formatted date
function getDayDetails(releaseDate, dayNumber) {
    let date = new Date(releaseDate);
    date.setDate(date.getDate() + (dayNumber - 1));
    return { 
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        dateString: date.toISOString().split("T")[0] // YYYY-MM-DD format
    };
}

// Function to calculate the current day since release
function getCurrentDay(releaseDate) {
    let release = new Date(releaseDate);
    let today = new Date(); // Automatically gets the current date

    let diffTime = today - release;
    let dayNumber = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include release day

    return dayNumber;
}

// Function to get time progress (how much of the day has passed)
function getDayProgress() {
    let now = new Date();
    let hours = now.getHours();
    let progress = hours / 24; // Convert to percentage (0 to 1)

    return progress;
}

// Function to predict missing values and update total
function predictCumulativeBoxOffice() {
    for (let movie in window.dayValues) {
        let data = window.dayValues[movie];
        let releaseDate = data.releaseDate;

        // Find last available day (highest key)
        let lastDay = Object.keys(data)
            .map(d => parseInt(d))
            .filter(d => !isNaN(d))
            .sort((a, b) => a - b)
            .pop();

        // Use movie-specific futureDays or default to 3
        let futureDays = data.futureDays || 0;
        let finalDay = lastDay + futureDays;

        const verbose = false; // Set to true for detailed logs

        for (let day = 1; day <= finalDay; day++) {
            if (data[day] === null || data[day] === undefined) { // Predict only missing values
                let prev = data[day - 1];
                let prevPrev = data[day - 2];

                // Calculate difference
                let difference = prevPrev !== undefined ? prev - prevPrev : prev * 0.9; // Assume 10% growth if only one value exists

                // Get day details
                let { dayName, dateString } = getDayDetails(releaseDate, day);

                // Apply base growth rate
                let growthRate = growthRates[dayName] || 1.0;

                // Apply holiday boost
                if (holidays.includes(dateString)) {
                    growthRate *= 1.25;
                  //  console.log(`🚀 Holiday Boost Applied on ${dateString} (${dayName})!`);
                }

                // Predict the value
                let predictedValue = prev + (difference * growthRate);
                data[day] = parseFloat(predictedValue.toFixed(2));

                if (verbose) {
                   // console.log(`Day ${day} (${dayName}, ${dateString}): Predicted ${data[day]}`);
                }
            }
        }

        // Get the current day based on release date
        let currentDay = getCurrentDay(releaseDate);
        let prevDayValue = data[currentDay - 1] || 0;
        let fullDayValue = data[currentDay] || prevDayValue;

        // Adjust current day's value based on the time of day
        let progress = getDayProgress();
        let adjustedCurrentDayValue = prevDayValue + (fullDayValue - prevDayValue) * progress;

        // Set total to the adjusted current day's value
        if (data.total === null || data.total === undefined) {
            data.total = parseFloat(adjustedCurrentDayValue.toFixed(2));
        }

      //  console.log(`${movie} Final Data:`, data);
    }
}

// Run the function
predictCumulativeBoxOffice();

(function updateMovieVerdicts() {
    const today = new Date(); // Get today's date

    for (const movie in window.dayValues) {
        let data = window.dayValues[movie];

        if (!data.releaseDate || !data.total || !data.Budget) continue; // Skip if essential data is missing

        // Calculate days completed since release
        let releaseDate = new Date(data.releaseDate);
        let daysCompleted = Math.floor((today - releaseDate) / (1000 * 60 * 60 * 24)) + 1; // +1 to include today

        if (daysCompleted <= 0) continue; // If the release date is in the future, skip

        let totalSoFar = data.total;
        let rating = data.Rating || 5; // Default rating if missing
        let budget = data.Budget;

        // Define expected run days based on rating
        let maxRunDays = rating >= 9 ? 30 : rating >= 8 ? 25 : rating >= 6 ? 20 : 14;
        let minRunDays = rating >= 9 ? 25 : rating >= 8 ? 20 : rating >= 6 ? 14 : 10;

        // Capped days completed (so days don't increase after movie is out of theaters)
        let actualRunDays = Math.min(daysCompleted, maxRunDays);

        // Calculate Estimated Total (range: conservative & optimistic estimates)
        let estimatedTotalMin = (totalSoFar / actualRunDays) * minRunDays;
        let estimatedTotalMax = (totalSoFar / actualRunDays) * maxRunDays;

        // Apply Verdict Score Formula
        function getVerdictScore(estimatedTotal) {
            let baseScore = estimatedTotal / budget;
            let ratingMultiplier = 1 + (rating - 5) / 10;
            return baseScore * ratingMultiplier;
        }

        let verdictScoreMin = getVerdictScore(estimatedTotalMin);
        let verdictScoreMax = getVerdictScore(estimatedTotalMax);

        function getVerdict(score) {
    if (typeof score !== "number" || isNaN(score)) return "Coming Soon";
    if (score <= 0.5) return "Flop";
    if (score <= 1) return "Below Average";
    if (score <= 1.5) return "Average";
    if (score <= 3) return "Hit";
    if (score <= 5) return "Super Hit";
    return "Blockbuster";
}


        let verdictMin = getVerdict(verdictScoreMin);
        let verdictMax = getVerdict(verdictScoreMax);

        // If the verdict is "null", update it. Otherwise, keep the manual verdict.
        if (data.Verdict === "null") {
            data.Verdict = verdictMin === verdictMax ? verdictMin : `${verdictMin} to ${verdictMax}`;
        }

      //  console.log(`Movie: ${movie}`);
     //   console.log(`Days Completed (Capped): ${actualRunDays}/${daysCompleted}`);
      //  console.log(`Total So Far: ₹${totalSoFar} Cr`);
      //  console.log(`Expected Run Days: ${minRunDays} - ${maxRunDays}`);
      //  console.log(`Estimated Total: ₹${estimatedTotalMin.toFixed(2)} Cr to ₹${estimatedTotalMax.toFixed(2)} Cr`);
      //  console.log(`Verdict Score: ${verdictScoreMin.toFixed(2)} to ${verdictScoreMax.toFixed(2)}`);
      //  console.log(`Final Verdict: ${data.Verdict}`);
      //  console.log('----------------------');
    }
})();


  window.addEventListener("DOMContentLoaded", function() {
        var pageTitle = document.title.trim(); // Get the page title
        var movieData = window.dayValues[pageTitle]; // Find matching movie data

        if (movieData) {
            var totalBoxOffice = movieData["total"] || 0;
            var budget = movieData["Budget"] || 0;
            var rating = movieData["Rating"] || "N/A";
            var verdict = movieData["Verdict"] !== "null" ? movieData["Verdict"] : "TBD";
            var language = movieData["Language"] || "Unknown";
			var cast = movieData["Cast"] || "Unknown";

            // Calculate Profit/Loss Percentage
            var profitLoss = ((totalBoxOffice - budget) / budget) * 100;
            var profitLossElement = document.getElementById("profit-loss-2");

            // Apply color and sign formatting
            if (profitLoss >= 0) {
                profitLossElement.style.color = "green";
                profitLossElement.innerHTML = "+" + profitLoss.toFixed(2) + "%"; // Add + sign for positive values
            } else {
                profitLossElement.style.color = "red";
                profitLossElement.innerHTML = profitLoss.toFixed(2) + "%"; // Negative values already have -
            }

            // Insert values into HTML
          //  document.getElementById("totalSum-2").textContent = totalBoxOffice.toFixed(2);
            document.getElementById("budget-2").textContent = budget.toFixed(2);
            document.getElementById("rating-2").textContent = rating;
            document.getElementById("verdict-2").textContent = verdict;
            document.getElementById("language-2").textContent = language;
			document.getElementById("cast-2").textContent = cast;
        } else {
            console.warn("No data found for movie:", pageTitle);
        }
    });
