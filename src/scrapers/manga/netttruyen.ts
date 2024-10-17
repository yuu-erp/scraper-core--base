import * as cheerio from "cheerio";

import { MangaScraper } from "~/core/MangaScraper";
import logger from "~/logger";
import { fulfilledPromises } from "~/utils";

export default class MangaNettruyenScraper extends MangaScraper {
  constructor() {
    super("netttruyen", "Nettruyen", { baseURL: "https://nettruyenviet.com/" });
  }

  async scrapeMangaPage(page: number) {
    try {
      const { data } = await this.client.get(`${this.baseURL}?${page}`);
      const $ = cheerio.load(data);
      const mangaList = $(".items .item");
      return fulfilledPromises(
        mangaList.toArray().map((el) => {
          const manga = $(el);
          return this.scrapeManga(manga.find("a").attr("href"));
        })
      );
    } catch (error) {
      logger.error(error);
    }
  }

  async scrapeManga(sourceId?: string) {
    const { data } = await this.client.get(`/truyen-tranh/${sourceId}`);
    const $ = cheerio.load(data);
    const blacklistKeys = ["truyện chữ"];
    const mainTitle = $(".title-detail").text().trim();
    const altTitle = this.parseTitle($(".other-name").text().trim());
    const allTitles = [mainTitle, ...altTitle];

    if (
      allTitles.some((title) =>
        blacklistKeys.some((key) => title.toLowerCase().includes(key))
      )
    ) {
      return null;
    }
    return {
      sourceId: this.id,
      sourceMediaId: sourceId,
      titles: allTitles,
    };
  }

  urlToSourceId(url: string) {
    const splitted = url.split("/");
    return splitted[splitted.length - 1];
  }
}
