const puppeteer = require('puppeteer');

async function main() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.ah.nl/allerhande/recepten-zoeken");

    var list = await page.evaluate(() => Array.from(document.querySelector("#body-container > div.container.search.loaded > div > div.result-wrapper.clearfix > aside").getElementsByTagName("li"))
        .map((stap) => 
            [stap.innerText, stap.children[0].href]
        ));

    await browser.close();

    for(i=0;i<list.length;i++){
        var full = list[i][0];
        var sub = full.match(/([0-9]+)/g).toString();

        list[i][2] = sub.replace(/,/ , "").toString();
        list[i][1] = list[i][1] + "?Nrpp=" + sub.replace(/,/ , "").toString();
        list[i][0] = full.replace(/\s\([0-9.]+\)/ , "").toString();
    }

    var objArr = [];

    for(i=0;i<list.length;i++){
        objArr.push({
            "naam": list[i][0],
            "link": list[i][1],
            "aantal": list[i][2]
        })
    }

    return objArr;
}

module.exports = main();

// main().then((data) => {
//     console.log(data);
// });