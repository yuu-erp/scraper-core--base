import * as cheerio from "cheerio";

import { MangaScraper } from "~/core/MangaScraper";
import logger from "~/logger";
import { SourceChapter, SourceManga } from "~/types/data";
import { fulfilledPromises } from "~/utils";

export default class MangaNettruyenScraper extends MangaScraper {
  constructor() {
    super("netttruyen", "Nettruyen", { baseURL: "https://nettruyenviet.com/" });
  }
  // @ts-ignore
  async scrapeMangaPage(page: number): Promise<SourceManga[]> {
    try {
      const { data } = await this.client.get(`${this.baseURL}?${page}`);
      const $ = cheerio.load(data);
      const mangaList = $(".items .item");
      return await fulfilledPromises(
        mangaList.toArray().map((el) => {
          const manga = $(el);
          return this.scrapeManga(
            this.urlToSourceId(manga.find("a").attr("href") || "")
          );
        })
      );
    } catch (error) {
      logger.error(error);
    }
  }

  async scrapeManga(sourceId: string): Promise<SourceManga> {
    const { data } = await this.client.get(`/truyen-tranh/${sourceId}`);
    const $ = cheerio.load(data);

    const blacklistKeys = ["truyện chữ"];

    const mainTitle = $(".title-detail").text();
    const altTitle = this.parseTitle($(".other-name").text().trim());

    const allTitles = [mainTitle, ...altTitle];

    const { titles } = this.filterTitles(allTitles);

    if (
      allTitles.some((title) =>
        blacklistKeys.some((key) => title.toLowerCase().includes(key))
      )
    ) {
      // @ts-ignore
      return null;
    }

    const chapters: SourceChapter[] = $("div.chapter")
      .toArray()
      .map((el) => {
        const chapter = $(el).find("a");
        const chapterName = chapter.text().trim();
        const chapter_id = chapter.data("id")?.toString() || "";

        return {
          name: chapterName,
          sourceChapterId: chapter_id,
          sourceMediaId: sourceId,
        };
      })
      .filter((chapter) => chapter.sourceChapterId !== "");

    return {
      chapters,
      sourceId: this.id,
      sourceMediaId: sourceId,
      titles,
    };
  }

  urlToSourceId(url: string) {
    const splitted = url.split("/");
    return splitted[splitted.length - 1];
  }
}
