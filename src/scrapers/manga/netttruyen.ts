import * as cheerio from "cheerio";

import { GetImagesQuery, MangaScraper } from "~/core/MangaScraper";
import logger from "~/logger";
import { SourceChapter, SourceManga } from "~/types/data";
import { fulfilledPromises } from "~/utils";

export default class MangaNettruyenScraper extends MangaScraper {
  constructor() {
    super("netttruyen", "Nettruyen", { baseURL: "https://nettruyenviet.com/" });
  }

  async scrapeMangaPage(page: number): Promise<SourceManga[]> {
    try {
      const { data } = await this.client.get("/?page=" + page);

      const $ = cheerio.load(data);
      const mangaList = $(".items .item");

      return fulfilledPromises(
        mangaList.toArray().map((el) => {
          const manga = $(el);

          const slug = this.urlToSourceId(manga.find("a").attr("href") || "");

          return this.scrapeManga(slug);
        })
      );
    } catch (err) {
      logger.error(err);
      return [];
    }
  }

  async scrapeManga(sourceId: string): Promise<SourceManga> {
    const { data } = await this.client.get(`/truyen-tranh/${sourceId}`);

    const $ = cheerio.load(data);

    const blacklistKeys = ["truyện chữ"];

    const mainTitle = $(".title-detail").text().trim();
    const altTitle = this.parseTitle($(".other-name").text().trim());

    const allTitles = [mainTitle, ...altTitle];

    const { titles } = this.filterTitles(allTitles);

    if (
      allTitles.some((title) =>
        blacklistKeys.some((key) => title.toLowerCase().includes(key))
      )
    ) {
      return null;
    }

    const chapters: SourceChapter[] = $("div.chapter")
      .toArray()
      .map((el) => {
        const chapter = $(el).find("a");
        const chapterName = chapter.text().trim();
        const chapter_id = chapter.data("id").toString();
        return {
          name: chapterName,
          sourceChapterId: chapter_id,
          sourceMediaId: sourceId,
        };
      });

    return {
      chapters,
      sourceId: this.id,
      sourceMediaId: sourceId,
      titles,
    };
  }

  async getImages(query: GetImagesQuery) {
    const { source_media_id, chapter_id } = query;

    const { data } = await this.client.get(
      `/truyen-tranh/${source_media_id}/chap-0/${chapter_id}`
    );

    return this.composeImages(data);
  }

  composeImages(html: string) {
    const $ = cheerio.load(html);

    const images = $(".page-chapter");

    return images.toArray().map((el) => {
      const imageEl = $(el).find("img");
      const source = imageEl.data("original") as string;

      const protocols = ["http", "https"];

      const image = protocols.some((protocol) => source.includes(protocol))
        ? source
        : `https:${source}`;

      return {
        image,
        useProxy: true,
      };
    });
  }

  urlToSourceId(url: string) {
    const splitted = url.split("/");
    const slug = splitted[splitted.length - 1];
    const slugSplitted = slug.split("-");

    return slugSplitted.slice(0, slugSplitted.length - 1).join("-");
  }
}
