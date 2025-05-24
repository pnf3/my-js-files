window.addEventListener('load', function() {
    const movieLinks = {
	    "Bombay": "https://www.newsfocus360.com/2025/05/bombay-box-office-collection-day-wise.html",
"Bhairavam":"https://www.newsfocus360.com/2025/05/bhairavam-box-office-collection-day-wise.html",
        "Housefull 5": "https://www.newsfocus360.com/2025/05/housefull-5-box-office-collection-day.html",
        "Bhool Chuk Maaf": "https://www.newsfocus360.com/2025/05/bhool-chuk-maaf-box-office-collection_23.html",
		"The Shawshank Redemption": "https://www.newsfocus360.com/2025/05/the-shawshank-redemption-timeless-tale.html"
    };

    function linkifyElement(el, linksObj) {
        let html = el.innerHTML;

        const sortedMovies = Object.keys(linksObj).sort((a, b) => b.length - a.length);

        sortedMovies.forEach(movie => {
            const link = linksObj[movie];
            const escapedMovie = movie.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp(`\\b(${escapedMovie})\\b`, 'g');
            html = html.replace(regex, `<a href="${link}">$1</a>`);
        });

        el.innerHTML = html;
    }

    // Select all elements with the .post-sub-body class
    const targets = document.querySelectorAll('.post-sub-body, .post-boc-body');

    targets.forEach(el => {
        // Skip elements with the .box-office-container class
        if (!el.classList.contains('box-office-container')) {
            linkifyElement(el, movieLinks);
        }
    });
});
