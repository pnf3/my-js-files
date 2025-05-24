window.addEventListener('load', function() {
    const nameLinks = {
        "Gavie Chahal": "https://www.newsfocus360.com/2025/05/gavie-chahal-movies-list.html",
"Sanjay Niranjan":"https://www.newsfocus360.com/2025/05/sanjay-niranjan-movies-list.html",
"Deepshikha Nagpal":"https://www.newsfocus360.com/2025/05/deepshikha-nagpal-movies-list.html",
"Bellamkonda Sai Srinivas":"https://www.newsfocus360.com/2025/05/bellamkonda-sai-srinivas-movies-list.html",
"Manchu Manoj":"https://www.newsfocus360.com/2025/05/manchu-manoj-movies-list.html",
"Nara Rohith":"https://www.newsfocus360.com/2025/05/nara-rohith-movies-list.html",
"Vijay Kanakamedala":"https://www.newsfocus360.com/2025/05/vijay-kanakamedala-movies-list.html",
       "Akshay Kumar": "https://www.newsfocus360.com/2023/10/akshay-kumar-movies-list.html",
        "Hrithik Roshan": "https://www.newsfocus360.com/2024/01/hrithik-roshan-all-movies-list-year-wise.html",
        "Nani": "https://www.newsfocus360.com/2018/12/nani-all-movies-list-and-biography-hits.html"
        
    };

    function linkifyElement(el, linksObj) {
        let html = el.innerHTML;

        const sortedNames = Object.keys(linksObj).sort((a, b) => b.length - a.length);

        sortedNames.forEach(name => {
            const link = linksObj[name];
            const escapedName = name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp(`\\b(${escapedName})\\b`, 'g');
            html = html.replace(regex, `<a href="${link}">👤 $1</a>`);
        });

        el.innerHTML = html;
    }

    // 🔍 Select both required divs by their classes
    const targets = document.querySelectorAll('.box-office-cast, .box-office-crew');

    targets.forEach(el => linkifyElement(el, nameLinks));
});
