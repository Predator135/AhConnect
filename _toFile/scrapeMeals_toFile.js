//Import puppeteer dependancy
const puppeteer = require('puppeteer');

//Import filesystem voor het schrijven naar bestanden op pc
const fs = require('fs');
var links = require("./allLinks.json")

//main function die de pagina scraped
async function main(url, i) {
    //Launch headless chromium browser
    const browser = await puppeteer.launch();

    //Open nieuwe pagina 
    const page = await browser.newPage();

    //Navigeer naar de url van de website, afkomstig uit de parameter die meegegeven is in de functie
    await page.goto(url);

    var list = await page.evaluate(() => Array.from(document.querySelector("#items-wrapper").getElementsByTagName("a"))
        .map(stap => stap.href));
    
    let x = (list) => list.filter((v,i) => list.indexOf(v) === i);
    var mw = x(list);
    var arr = [];

    for(i=0;i<mw.length;i++){
        arr.push({"link": mw[i]})
    }

    // console.log(mw);
    // console.log(list);
    var parsed = JSON.stringify(arr);
    try{
    fs.writeFile("" +  links[i][0].split(" ")[0] + "Gerechten.json", parsed, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("JSON file has been saved.");
    });} catch(err){}

    //Sluit de browser
    await browser.close();
}

  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }  

  async function init() {
    for(i=0;i<links.length;i++){
      main(links[i][1], i);
      console.log(links[i][1]);
      await sleep(1800);
    }
  }
init();