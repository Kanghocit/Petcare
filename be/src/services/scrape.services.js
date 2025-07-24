import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

async function scrapeNews(url) {
  const browser = await puppeteer.launch({
    headless: false, // debug dễ
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // 🛡️ Tránh bị chặn bot
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  );

  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // Chờ chắc chắn phần tử bài viết đã có
    await page.waitForSelector("#list-news article", { timeout: 10000 });

    const html = await page.content();
    const $ = cheerio.load(html);
    const newsList = [];

    $("#list-news article").each((_, el) => {
      const title = $(el).find(".title-news a").text().trim();
      const content = $(el).find(".description").text().trim();
      const image = $(el).find("img[itemprop='contentUrl']").attr("data-src");
      const link = $(el).find(".title-news a").attr("href");

      if (title && link) {
        newsList.push({
          title,
          content,
          image: image?.startsWith("http") ? image : `https:${image}`,
          link: link.startsWith("http") ? link : `https://vnexpress.net${link}`,
        });
      }
    });

    return newsList;
  } catch (error) {
    console.error("❌ Lỗi khi scrape:", error.message);
    return [];
  } finally {
    await browser.close();
  }
}

export default scrapeNews;
