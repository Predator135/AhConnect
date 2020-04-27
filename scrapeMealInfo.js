//# Usage: node scrapeMeal.js <input file name>.json[REQUIRED] <output folder>[OPTIONAL]

//Import puppeteer dependancy
const puppeteer = require('puppeteer');

//Import filesystem voor het schrijven naar bestanden op pc
const fs = require('fs');

//Import JSON file met links van sites to scrape
// var links = require('./linksChinees.json')
if(process.argv[2]){
  try{
    console.log("File loaded")
    var links = require("./" + process.argv[2]);

  //main function die de pagina scraped
  async function main(url) {

    //Launch headless chromium browser
    const browser = await puppeteer.launch();

    //Open nieuwe pagina 
    const page = await browser.newPage();
    
    //Navigeer naar de url van de website, afkomstig uit de parameter die meegegeven is in de functie
    await page.goto(url);

    //Haal de titel van het gerecht uit de url en filter die neer naar een clean en bruikbaare titel 
    var splitUrl = url.substr(url.lastIndexOf('/') + 1);
    var splitUrlZonderDashes = splitUrl.replace(/-/g, " ");
    var title = splitUrlZonderDashes.charAt(0).toUpperCase() + splitUrlZonderDashes.slice(1);

    //Haal alle verschillende variables uit de site, gewrapped in een try en catch blok voor het geval dat een field leeg is
    try{
    var ingredients = await page.evaluate(() => Array.from(document.querySelector("#body-container > div.container.detail.loaded > article > section.content > div.content-wrapper > section.js-ingredients.ingredients > ul.list.shopping.ingredient-selector-list").getElementsByTagName("li"))
      .map(ingredient => ingredient.innerText));
    } catch(err){}
    try{
    var bereidingswijze = await page.evaluate(() => Array.from(document.querySelector("#body-container > div.container.detail.loaded > article > section.content > div.content-wrapper > section.preparation > ol").getElementsByTagName("li"))
      .map(stap => stap.innerText));
    } catch(err){}
    try{
    var voedingswaarden = await page.evaluate(() => Array.from(document.querySelector("#body-container > div.container.detail.loaded > article > section.content > div.full-width.theme-grey > div > section.nutrition > ul").getElementsByTagName("li"))
      .map(waarde => waarde.childNodes[0].textContent.toString().trim() + " " + waarde.childNodes[1].innerText.toString().trim()));
    } catch(err){}
    try{
    var benodigdheden = await page.evaluate(() => Array.from(document.querySelector("#body-container > div.container.detail.loaded > article > section.content > div.content-wrapper > section.js-ingredients.ingredients > ul.list.kitchenappliances").getElementsByTagName("li"))
      .map(spul => spul.innerHTML).toString().trim());
    } catch(err){}
    try{
    var bereidTijd = await page.evaluate(() => document.querySelector("#body-container > div.container.detail.loaded > article > section.teaser > ul > li > div > section > ul.short > li.cooking-time > ul > li:nth-child(1)").textContent);
    } catch(err){}
    try{
      var wachtTijd = await page.evaluate(() => document.querySelector("#body-container > div.container.detail.loaded > article > section.teaser > ul > li > div > section > ul.short > li.cooking-time > ul > li:nth-child(2)").textContent);
    }
    catch(err){}
    try{
    var maaltijdType = await page.evaluate(() => document.querySelector("#body-container > div.container.detail.loaded > article > section.teaser > ul > li > div > section > ul.short > li:nth-child(1)").textContent);
    }catch(err){}
    try{

    //Query de url van de foto uit de pagina en filter het neer naar een bruikbare string
    var maaltijdFoto1 = await page.evaluate(() => document.querySelector("#body-container > div.container.detail.loaded > article > section.teaser > ul > li").style.backgroundImage);
    var maaltijdFoto2 = maaltijdFoto1.replace("url(\"", "");
    var maaltijdFoto3 = maaltijdFoto2.replace("\")", "");
  }catch(err){}

    //Sluit de browser
    await browser.close();

    //Definieer het structuur voor het object dat uiteindelijk geexporteerd word
    const mealObj = {
      "url": url,
      "title": title,
      "maaltijdType": maaltijdType,
      "bereidTijd": bereidTijd,
      "wachtTijd": wachtTijd,
      "maaltijdFoto": maaltijdFoto3,
      "ingredienten": [ingredients],
      "bereidingswijze": [bereidingswijze],
      "benodigdheden": [benodigdheden],
      "voedingswaarden": {
          "calorien": "",
          "fats": "",
          "protein": "",
          "carbs": ""
          }
      };

  if(voedingswaarden !== null || voedingswaarden !== 0){
      try{
      mealObj.voedingswaarden.calorien = voedingswaarden[0];
      } catch(err){}
      try{
      mealObj.voedingswaarden.fats = voedingswaarden[3];
      } catch(err){}
      try{
      mealObj.voedingswaarden.protein = voedingswaarden[1];
      } catch(err){}
      try{
      mealObj.voedingswaarden.carbs = voedingswaarden[2];
      } catch(err){}

      var stringedObj = JSON.stringify(mealObj);
      
      var outputDir = process.argv[3].toString();

      if(outputDir == undefined){
      fs.writeFile("" + title +".json", stringedObj, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("JSON file has been saved.");
      });
      } else {
      fs.writeFile(outputDir + "/" + title +".json", stringedObj, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
          console.log("JSON file has been saved.");
        });
      }
    } else{
      console.log("Geen voedingswaarden, niet opgeslagen");
    }
    
  };

  var length = Object.keys(links).length;

  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }  

  async function init() {
    for(i=0;i<length;i++){
      main(links[i].link);
      console.log("Meal " + i);
      await sleep(1800);
    }
  }
init();
} catch(err){
  console.log("File either doesn't exist or is not valid JSON");
}
} else {
console.log("Please define source file name")
}