window.addEventListener('load', function() {
    const nameLinks = {
        "Bhagyashree Borse":"https://www.newsfocus360.com/2025/05/bhagyashree-borse-movies-list.html",
"Satyadev Kancharana":"https://www.newsfocus360.com/2025/05/satyadev-kancharana-movies-list.html",
"Gowtam Tinnanuri":"https://www.newsfocus360.com/2025/05/gowtam-tinnanuri-movies-list.html",
"Ashok Selvan":"https://www.newsfocus360.com/2025/05/ashok-selvan-movies-list.html",
"Joju George":"https://www.newsfocus360.com/2025/05/joju-george-movies-list.html",
        "Aishwarya Lekshmi":"https://www.newsfocus360.com/2025/05/aishwarya-lekshmi-movies-list.html",
"Vijay Deverakonda":"https://www.newsfocus360.com/2018/12/vijay-deverakonda-movies-list.html",
        "Sargun Mehta":"https://www.newsfocus360.com/2025/05/sargun-mehta-movies-list.html",
"Ammy Virk":"https://www.newsfocus360.com/2024/01/ammy-virk-movies-list.html",
"Nimrat Khaira":"https://www.newsfocus360.com/2025/05/nimrat-khaira-movies-list.html",
"Smeep Kang":"https://www.newsfocus360.com/2025/05/smeep-kang-movies-list.html",
"Kamal Haasan":"https://www.newsfocus360.com/2023/10/kamal-haasan-movies-list.html",
"Silambarasan":"https://www.newsfocus360.com/2024/07/silambarasan-all-movies-list-year-wise.html",
"Mani Ratnam":"https://www.newsfocus360.com/2023/11/mani-ratnam-all-movies-list.html",
"Trisha Krishnan":"https://www.newsfocus360.com/2024/07/trisha-krishnan-all-movies-list-year.html",
"Abhirami":"https://www.newsfocus360.com/2025/05/abhirami-movies-list.html",
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
