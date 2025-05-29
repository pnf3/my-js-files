window.addEventListener('load', function() {
    const movieLinks = {
	    "Ace": "https://www.newsfocus360.com/2025/05/ace-box-office-collection-day-wise.html",
"Narivetta": "https://www.newsfocus360.com/2025/05/narivetta-box-office-collection-day-wise.html",
	    "Tomchi":"https://www.newsfocus360.com/2025/05/tomchi-box-office-collection-day-wise.html",
	    "Sitaare Zameen Par":"https://www.newsfocus360.com/2025/05/sitaare-zameen-par-box-office.html",
"War 2":"https://www.newsfocus360.com/2025/05/war-2-box-office-collection-day-wise.html",
"Kingdom":"https://www.newsfocus360.com/2025/05/kingdom-box-office-collection-day-wise.html",
	    "Saunkan Saunkanay 2":"https://www.newsfocus360.com/2025/05/saunkan-saunkanay-2-box-office.html",
"Thug Life":"https://www.newsfocus360.com/2025/05/thug-life-box-office-collection-day-wise.html",
	    "Bombay": "https://www.newsfocus360.com/2025/05/bombay-box-office-collection-day-wise.html",
"Bhairavam":"https://www.newsfocus360.com/2025/05/bhairavam-box-office-collection-day-wise.html",
        "Housefull 5": "https://www.newsfocus360.com/2025/05/housefull-5-box-office-collection-day_24.html",
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
    const targets = document.querySelectorAll('.post-sub-body, .combined-table');

    targets.forEach(el => {
        // Skip elements with the .box-office-container class
        if (!el.classList.contains('box-office-container')) {
            linkifyElement(el, movieLinks);
        }
    });
});
