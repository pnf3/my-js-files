window.addEventListener('load', function () {
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

    const sortedNames = Object.keys(nameLinks).sort((a, b) => b.length - a.length);
    const nameRegexes = sortedNames.map(name => ({
        name,
        regex: new RegExp(`\\b(${name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})\\b`, 'g')
    }));

    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const parent = node.parentNode;
            if (parent && parent.closest('a')) return; // skip if inside link

            let text = node.nodeValue;
            let hasMatch = false;
            const frag = document.createDocumentFragment();

            while (text.length > 0) {
                let found = false;
                for (let { name, regex } of nameRegexes) {
                    const match = regex.exec(text);
                    if (match) {
                        hasMatch = true;

                        if (match.index > 0) {
                            frag.appendChild(document.createTextNode(text.slice(0, match.index)));
                        }

                        const anchor = document.createElement('a');
                        anchor.href = nameLinks[name];
                        anchor.textContent = `👤 ${match[0]}`;
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

    const targets = document.querySelectorAll('.box-office-cast, .box-office-crew');

    targets.forEach(el => {
        processNode(el);
    });
});
