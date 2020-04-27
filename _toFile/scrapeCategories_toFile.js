//Import puppeteer dependancy
const puppeteer = require('puppeteer');

//Import filesystem voor het schrijven naar bestanden op pc
const fs = require('fs');

//main function die de pagina scraped
async function main(url) {
    //Launch headless chromium browser
    const browser = await puppeteer.launch();

    //Open nieuwe pagina 
    const page = await browser.newPage();

    //Navigeer naar de url van de website, afkomstig uit de parameter die meegegeven is in de functie
    await page.goto(url);

    var list = await page.evaluate(() => Array.from(document.querySelector("#body-container > div.container.search.loaded > div > div.result-wrapper.clearfix > aside").getElementsByTagName("li"))
        .map((stap) => 
            [stap.innerText, stap.children[0].href + "Nrpp=1000"]
        ));
    
    // console.log(list);
    var parsed = JSON.stringify(list);

    fs.writeFile("" + "allLinks.json", parsed, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("JSON file has been saved.");
    });

    //Sluit de browser
    await browser.close();
}

main("https://www.ah.nl/allerhande/recepten-zoeken");