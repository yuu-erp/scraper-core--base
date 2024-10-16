import { MangaScraper } from "~/core/MangaScraper";
import { SourceManga } from "~/types/data";
import cheerio from "cheerio";
import { fulfilledPromises } from "~/utils";
import logger from "~/logger";

export default class MangaYuriScraper extends MangaScraper {
  constructor() {
    super("yuri", "Yuri", { baseURL: "https://nettruyenviet.com/" });
    this.locales = ["vi"];
    this.monitorInterval = 20 * 60 * 1000;
  }

  async scrapeMangaPage(page: number) {
    try {
      console.log("scrapeMangaPage - page: ", page);
      const { data } = await this.client.get(`${this.baseURL}/?page${page}`);
      console.log("scrapeMangaPage - data: ", data);
    } catch (err) {
      console.log("err", err);
      logger.error(err);
    }
  }
}
