window.addEventListener('load', function () {
    const movieLinks = {
        "Dude": "https://www.newsfocus360.com/2025/10/mithra-mandali-box-office-collection.html",
        "Kuberaa": "https://www.newsfocus360.com/2025/05/kuberaa-box-office-collection-day-wise.html",
"Sitaare Zameen Par": "https://www.newsfocus360.com/2025/05/sitaare-zameen-par-box-office.html",
        "Sanju Weds Geetha 2": "https://www.newsfocus360.com/2025/05/sanju-weds-geetha-2-box-office.html",
"Sri Sri Sri Raajavaru": "https://www.newsfocus360.com/2025/05/sri-sri-sri-raajavaru-box-office.html",
"Housefull 5": "https://www.newsfocus360.com/2025/05/housefull-5-box-office-collection-day_24.html",
"Thug Life": "https://www.newsfocus360.com/2025/05/thug-life-box-office-collection-day-wise.html",
        "Dilli Dark": "https://www.newsfocus360.com/2025/05/dilli-dark-box-office-collection-day.html",
"Jinn - The Pet": "https://www.newsfocus360.com/2025/05/jinn-pet-box-office-collection-day-wise.html",
"Vellapanti": "https://www.newsfocus360.com/2025/05/vellapanti-box-office-collection-day.html",
"Shashtipoorthi": "https://www.newsfocus360.com/2025/05/shashtipoorthi-box-office-collection.html",
"The Verdict": "https://www.newsfocus360.com/2025/05/the-verdict-box-office-collection-day.html",
"His Story of Itihaas": "https://www.newsfocus360.com/2025/05/his-story-of-itihaas-box-office.html",
"Shubhchintak": "https://www.newsfocus360.com/2025/05/shubhchintak-box-office-collection-day.html",
"Mhanje Waghache Panje": "https://www.newsfocus360.com/2025/05/mhanje-waghache-panje-box-office.html",
"Agar Magar Kintu Lekin Parantu": "https://www.newsfocus360.com/2025/05/agar-magar-kintu-lekin-parantu-box.html",
"Moonwalk": "https://www.newsfocus360.com/2025/05/moonwalk-box-office-collection-day-wise.html",
"Chidiya": "https://www.newsfocus360.com/2025/05/chidiya-box-office-collection-day-wise.html",
"Ashtapadi": "https://www.newsfocus360.com/2025/05/ashtapadi-box-office-collection-day-wise.html",
"Manidhargal": "https://www.newsfocus360.com/2025/05/manidhargal-box-office-collection-day.html",
"X Roads": "https://www.newsfocus360.com/2025/05/x-roads-box-office-collection-day-wise.html",
"Sonar Kellay Jawker Dhan": "https://www.newsfocus360.com/2025/05/sonar-kellay-jawker-dhan-box-office.html",
"Tomchi": "https://www.newsfocus360.com/2025/05/tomchi-box-office-collection-day-wise.html",
"Saunkan Saunkanay 2": "https://www.newsfocus360.com/2025/05/saunkan-saunkanay-2-box-office.html",
"Bhairavam": "https://www.newsfocus360.com/2025/05/bhairavam-box-office-collection-day-wise.html",
"Bombay": "https://www.newsfocus360.com/2025/05/bombay-box-office-collection-day-wise.html",
"Love Karu Yaaa Shaadi": "https://www.newsfocus360.com/2025/05/love-karu-yaaa-shaadi-box-office.html",
        "Ace": "https://www.newsfocus360.com/2025/05/ace-box-office-collection-day-wise.html",
        "Narivetta": "https://www.newsfocus360.com/2025/05/narivetta-box-office-collection-day-wise.html",
        "Tomchi": "https://www.newsfocus360.com/2025/05/tomchi-box-office-collection-day-wise.html",
        "Sitaare Zameen Par": "https://www.newsfocus360.com/2025/05/sitaare-zameen-par-box-office.html",
        "War 2": "https://www.newsfocus360.com/2025/05/war-2-box-office-collection-day-wise.html",
        "Kingdom": "https://www.newsfocus360.com/2025/05/kingdom-box-office-collection-day-wise.html",
        "Saunkan Saunkanay 2": "https://www.newsfocus360.com/2025/05/saunkan-saunkanay-2-box-office.html",
        "Thug Life": "https://www.newsfocus360.com/2025/05/thug-life-box-office-collection-day-wise.html",
        "Bombay": "https://www.newsfocus360.com/2025/05/bombay-box-office-collection-day-wise.html",
        "Bhairavam": "https://www.newsfocus360.com/2025/05/bhairavam-box-office-collection-day-wise.html",
        "Housefull 5": "https://www.newsfocus360.com/2025/05/housefull-5-box-office-collection-day_24.html",
        "Bhool Chuk Maaf": "https://www.newsfocus360.com/2025/05/bhool-chuk-maaf-box-office-collection_23.html",
        "The Shawshank Redemption": "https://www.newsfocus360.com/2025/05/the-shawshank-redemption-timeless-tale.html"
    };

    const sortedMovies = Object.keys(movieLinks).sort((a, b) => b.length - a.length);
    const movieRegexes = sortedMovies.map(title => ({
        title,
        regex: new RegExp(`\\b(${title.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})\\b`, 'g')
    }));

    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let parent = node.parentNode;

            if (parent && parent.closest('a')) return; // skip if inside a link

            let text = node.nodeValue;
            let hasMatch = false;
            let frag = document.createDocumentFragment();

            while (text.length > 0) {
                let found = false;
                for (let { title, regex } of movieRegexes) {
                    let match = regex.exec(text);
                    if (match) {
                        hasMatch = true;

                        if (match.index > 0) {
                            frag.appendChild(document.createTextNode(text.slice(0, match.index)));
                        }

                        const anchor = document.createElement('a');
                        anchor.href = movieLinks[title];
                        anchor.textContent = match[0];
                        frag.appendChild(anchor);

                        text = text.slice(match.index + match[0].length);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    frag.appendChild(document.createTextNode(text));
                    break;
                }
            }

            if (hasMatch) {
                parent.replaceChild(frag, node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'A') {
            Array.from(node.childNodes).forEach(processNode);
        }
    }

    const targets = document.querySelectorAll('.post-sub-body, .combined-table');

    targets.forEach(el => {
        if (!el.classList.contains('box-office-container')) {
            processNode(el);
        }
    });
});

