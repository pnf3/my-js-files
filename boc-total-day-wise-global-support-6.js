
   // script.js - Updates table with Box Office Collection (BOC)
document.addEventListener(&quot;DOMContentLoaded&quot;, function () {
    // Check if &quot;Box Office Collection&quot; tag exists
    const boxOfficeTag = document.querySelector(&quot;.queryMessage .query-info&quot;);
    if (!boxOfficeTag || boxOfficeTag.textContent.trim() !== &quot;Box Office Collection&quot;) {
        console.warn(&quot;Box Office Collection tag not found!&quot;);
        return; // Stop execution if the tag is missing
    }

    // Select the movie table
    const table = document.querySelector(&quot;.movies-table thead tr&quot;);
    const tbody = document.querySelector(&quot;.movies-table tbody&quot;);

    if (!table || !tbody) {
        console.warn(&quot;Movies table not found!&quot;);
        return;
    }

    // Add &quot;BOC&quot; column to the table header if not already added
    if (!document.querySelector(&quot;.movies-table thead th.boc-header&quot;)) {
        let bocHeader = document.createElement(&quot;th&quot;);
        bocHeader.textContent = &quot;BOC (\u20B9 Crore)&quot;;
        bocHeader.classList.add(&quot;boc-header&quot;);
        table.appendChild(bocHeader);
    }

    // Iterate through each row to update BOC
    tbody.querySelectorAll(&quot;tr&quot;).forEach(row =&gt; {
        let movieCell = row.querySelector(&quot;td a&quot;); // Find movie title link
        if (movieCell) {
            let movieTitle = movieCell.textContent.trim(); // Get full title from table

            if (dayValues[movieTitle]) {  // Exact match with data values
                // Calculate total box office collection
                let totalGross = Object.values(dayValues[movieTitle])
    .reduce((sum, value) =&gt; sum + parseFloat(value), 0);


                // Add new column with total BOC
                let bocCell = document.createElement(&quot;td&quot;);
                bocCell.textContent = totalGross;
                row.appendChild(bocCell);
            } else {
                // If no data available, add empty cell
                let bocCell = document.createElement(&quot;td&quot;);
                bocCell.textContent = &quot;N/A&quot;;
                row.appendChild(bocCell);
            }
        }
    });
});

