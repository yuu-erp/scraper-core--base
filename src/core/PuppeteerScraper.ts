import puppeteer, { Browser, Page } from "puppeteer";

export class PuppeteerScraper {
  browser: Browser | null;

  constructor() {
    this.browser = null;
  }

  // Initialize Puppeteer browser
  async init() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({ headless: false });
    }
  }

  // Scrape a page with Puppeteer
  async scrapePage(url: string): Promise<string | null> {
    try {
      // Ensure browser is initialized
      await this.init();

      const page: Page = await this.browser!.newPage();
      await page.goto(url, { waitUntil: "networkidle2" });

      // Extract content (for example, all text from the page)
      //   const content = await page.content();
      const content = await page.evaluate(() => {
        const wrapper = document.querySelector(".wrapper");
        return wrapper ? wrapper.textContent : null; // Trả về nội dung văn bản bên trong class 'wrapper'
      });
      await page.close();
      return content;
    } catch (err) {
      console.error("Error scraping with Puppeteer:", err);
      return null;
    }
  }

  // Close the Puppeteer browser
  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
