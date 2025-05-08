window.addEventListener('load', function() {
    const movieLinks = {
        "Housefull 5": "https://www.newsfocus360.com/2025/05/housefull-5-box-office-collection-day.html",
        "Bhool Chuk Maaf": "https://www.newsfocus360.com/2025/05/bhool-chuk-maaf-box-office-collection.html"
        
    };

    function linkifyElement(el, linksObj) {
        let html = el.innerHTML;

        const sortedMovies = Object.keys(linksObj).sort((a, b) => b.length - a.length);

        sortedMovies.forEach(movie => {
            const link = linksObj[movie];
            const escapedMovie = movie.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp(`\\b(${escapedMovie})\\b`, 'g');
            html = html.replace(regex, `<a href="${link}" target="_blank">$1</a>`);
        });

        el.innerHTML = html;
    }

    // 🔍 Select all elements with the .custom-table class
    const targets = document.querySelectorAll('.post-sub-body.custom-table');

    targets.forEach(el => linkifyElement(el, movieLinks));
});
