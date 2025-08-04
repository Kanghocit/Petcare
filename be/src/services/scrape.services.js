import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

async function scrapeArticleDetail(url, page) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    const html = await page.content();
    const $ = cheerio.load(html);

    const blocks = [];

    // Thử nhiều selector khác nhau để lấy nội dung
    const contentSelectors = [
      "article.fck_detail",
      ".fck_detail",
      ".content_detail",
      ".article-content",
      ".entry-content",
    ];

    let contentFound = false;

    for (const selector of contentSelectors) {
      const contentElement = $(selector);
      if (contentElement.length > 0) {
        contentFound = true;

        // Lấy tất cả các đoạn văn bản
        contentElement.find("p").each((_, p) => {
          const text = $(p).text().trim();
          if (text.length > 10) {
            // Chỉ lấy đoạn văn có độ dài > 10 ký tự
            blocks.push({ text, image: null });
          }
        });

        // Lấy tất cả hình ảnh
        contentElement.find("img").each((_, img) => {
          const imgSrc = $(img).attr("data-src") || $(img).attr("src");
          if (imgSrc) {
            const image = imgSrc.startsWith("http")
              ? imgSrc
              : `https:${imgSrc}`;
            blocks.push({ text: null, image });
          }
        });

        break;
      }
    }

    // Nếu không tìm thấy content, thử lấy từ body
    if (!contentFound) {
      console.log(
        `⚠️ Không tìm thấy content với các selector thông thường cho: ${url}`
      );

      // Lấy tất cả đoạn văn có class Normal
      $("p.Normal").each((_, p) => {
        const text = $(p).text().trim();
        if (text.length > 10) {
          blocks.push({ text, image: null });
        }
      });

      // Lấy tất cả hình ảnh
      $("img[data-src]").each((_, img) => {
        const imgSrc = $(img).attr("data-src") || $(img).attr("src");
        if (imgSrc) {
          const image = imgSrc.startsWith("http") ? imgSrc : `https:${imgSrc}`;
          blocks.push({ text: null, image });
        }
      });
    }

    const author =
      $("p.Normal strong").text().trim() || $(".author").text().trim();

    // Lấy publishTime với nhiều selector khác nhau
    let publishTime =
      $("span.date").text().trim() ||
      $(".time").text().trim() ||
      $(".time-zone").text().trim() ||
      $(".date-time").text().trim();

    // Clean up publishTime nếu cần
    if (publishTime) {
      publishTime = publishTime.replace(/\s+/g, " ").trim();
    }

    console.log(`📄 Đã lấy được ${blocks.length} blocks cho: ${url}`);

    return { blocks, author, publishTime };
  } catch (err) {
    console.error(`❌ Lỗi khi lấy chi tiết bài viết: ${url}`, err.message);
    return { blocks: [] };
  }
}

async function scrapeNews(url) {
  const browser = await puppeteer.launch({
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  );

  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await page.waitForSelector("#list-news article", { timeout: 10000 });

    const html = await page.content();
    const $ = cheerio.load(html);
    const newsList = [];

    const articles = $("#list-news article").toArray();

    for (const el of articles) {
      const title = $(el).find(".title-news a").text().trim();
      const content = $(el).find(".description").text().trim();
      const image = $(el).find("img[itemprop='contentUrl']").attr("data-src");
      const link = $(el).find(".title-news a").attr("href");

      if (title && link) {
        const fullLink = link.startsWith("http")
          ? link
          : `https://vnexpress.net${link}`;
        const fullImage = image?.startsWith("http") ? image : `https:${image}`;

        const child = await scrapeArticleDetail(fullLink, page);

        if (child.blocks.length >= 8 && child.image !== "https:undefined") {
          newsList.push({
            title,
            content,
            image: fullImage,
            link: fullLink,
            child,
          });
        } else {
          console.log(
            `❌ Bài viết ${title} có ${child.blocks.length} blocks, không đủ để lưu`
          );
        }
      }
    }

    return newsList;
  } catch (error) {
    console.error("❌ Lỗi khi scrape:", error.message);
    return [];
  } finally {
    await browser.close();
  }
}

export default scrapeNews;
