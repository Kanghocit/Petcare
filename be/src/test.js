import scrapeNews from "./services/scrape.services.js";

scrapeNews("https://vnexpress.net/chu-de/thu-cung-6644")
  .then((data) => console.log(JSON.stringify(data, null, 2)))
  .catch(console.error);
