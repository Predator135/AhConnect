const puppeteer = require('puppeteer');
const fs = require('fs');

async function main(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

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
        list[i][0] = full.replace(/\s\([0-9]+\)/ , "").toString();
    }

    var obj = {
        
    };
    console.log(list);
    // return stringedObj;
}

main("https://www.ah.nl/allerhande/recepten-zoeken").then((data) => {
    console.log(data);
});