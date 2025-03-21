
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

        console.log(`Updated Data for ${movie}:`, data);
    }
}

// Run the function before predicting box office values
addMissingDays();



// Growth rates for each weekday
const growthRates = {
    "Friday": 1.14,
    "Saturday": 1.15,
    "Sunday": 1.20,
    "Monday": 0.90,
    "Tuesday": 0.85,
    "Wednesday": 0.75,
    "Thursday": 0.50
};

// Public holidays
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

// Function to get day details
function getDayDetails(releaseDate, dayNumber) {
    let date = new Date(releaseDate);
    date.setDate(date.getDate() + (dayNumber - 1));
    return {
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        dateString: date.toISOString().split("T")[0] // YYYY-MM-DD format
    };
}

// Function to predict future box office collections
function predictCumulativeBoxOffice() {
    for (let movie in window.dayValues) {
        let data = window.dayValues[movie];
        let releaseDate = data.releaseDate;
        
        // Find last recorded day
        let lastDay = Object.keys(data)
            .map(d => parseInt(d))
            .filter(d => !isNaN(d))
            .sort((a, b) => a - b)
            .pop();

        let futureDays = data.futureDays || 3; // Default to 3 if not specified
        let finalDay = lastDay + futureDays;

        for (let day = lastDay + 1; day <= finalDay; day++) {
            let prev = data[day - 1];
            let prevPrev = data[day - 2];

            if (prev !== undefined && prevPrev !== undefined) {
                let difference = prev - prevPrev; // Daily increase

                let { dayName, dateString } = getDayDetails(releaseDate, day);

                // Apply growth rate
                let growthRate = growthRates[dayName] || 1.0;

                // Boost for public holidays
                if (holidays.includes(dateString)) {
                    growthRate *= 1.25;
                    console.log(`🚀 Holiday Boost on ${dateString} (${dayName})!`);
                }

                // Predict and store value
                let predictedValue = prev + (difference * growthRate);
                data[day] = parseFloat(predictedValue.toFixed(2));

                console.log(`Day ${day} (${dayName}, ${dateString}): Predicted ${data[day]}`);
            }
        }

        // Recalculate total
        let totalCollection = Object.values(data)
            .filter(value => typeof value === "number")
            .reduce((sum, value) => sum + value, 0);

        data.total = parseFloat(totalCollection.toFixed(2));

        console.log(`${movie} Final Data:`, data);
    }
}

// Run prediction
predictCumulativeBoxOffice();