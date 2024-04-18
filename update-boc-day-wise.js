// Example mapping of post titles to day values
const dayValues = {
    "The Legacy of Jineshwar Movie Box Office Collection Day-Wise - Upcoming": ["100", "150", "200", "250", "300", "350", "400", "450", "500", "550", "600", "650", "700", "750"],
    "Title 2": ["200", "250", "300", "350", "400", "450", "500", "550", "600", "650", "700", "750", "800", "850"],
    // Add more titles and corresponding day values as needed
};

// Update days for each post
Object.keys(dayValues).forEach(postTitle => {
    const titleElements = document.querySelectorAll('h1.entry-title');
    const dayElements = document.querySelectorAll('[id^="day"]'); // Select all elements with id starting with "day"
    const postIndex = Array.from(titleElements).findIndex(el => el.textContent.trim() === postTitle);
    
    if (postIndex !== -1) {
        const postDayValues = dayValues[postTitle];
        
        // Calculate the day-to-day differences
        let previousValue = parseFloat(postDayValues[0]);
        let differences = [previousValue]; // Keep the first day's value as it is
        
        for (let i = 1; i < postDayValues.length; i++) {
            let currentValue = parseFloat(postDayValues[i]);
            let difference = currentValue - previousValue;
            differences.push(difference);
            previousValue = currentValue;
        }
        
        // Update the day elements with the differences
        differences.forEach((difference, index) => {
            // Calculate the correct index for the day element
            let dayElementIndex = postIndex * 14 + index;
            if (dayElementIndex < dayElements.length) {
                dayElements[dayElementIndex].textContent = difference;
            }
        });
    }
});
