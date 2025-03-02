
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
