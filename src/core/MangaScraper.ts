import { AxiosRequestConfig } from "axios";
import { SourceManga } from "../types/data";
import { RequireAtLeastOne } from "../types/utils";
import { readFile, writeFile } from "../utils";
import Scraper from "./Scraper";
import { getRetriesId } from "~/utils/anilist";
import { MediaType } from "~/types/anilist";
import { mergeMangaInfo } from "~/utils/data";

export type ImageSource = {
  image: string;
  useProxy?: boolean;
};

export type GetImagesQuery = {
  source_id: string;
  source_media_id: string;
  chapter_id: string;
};

export default class MangaScraper extends Scraper {
  type: MediaType.Manga;

  constructor(
    id: string,
    name: string,
    axiosConfig: RequireAtLeastOne<AxiosRequestConfig, "baseURL">
  ) {
    super(id, name, axiosConfig);

    this.id = id;
    this.name = name;
    this.monitorURL = axiosConfig.baseURL;
  }

  async scrapeAllMangaPages(): Promise<SourceManga[]> {
    const data = await this.scrapeAllPages(this.scrapeMangaPage.bind(this));

    writeFile(`./data/${this.id}.json`, JSON.stringify(data, null, 2));
    return data;
  }

  /**
   * Scrape data from anilist then merge it with data from source
   * @param sources sources of manga
   * @returns merged sources of manga
   */
  async scrapeAnilist(sources: SourceManga[]) {
    const fullSources = [];
    if (!sources) {
      sources = JSON.parse(readFile(`./data/${this.id}.json`));
    }
    if (!sources?.length) {
      throw new Error("No sources");
    }
    for (const source of sources) {
      if (!source?.titles?.length) continue;
      let anilistId: number;
      if (source.anilistId) {
        anilistId = source.anilistId;
      } else {
        anilistId = await getRetriesId(source.titles, MediaType.Manga);
      }

      fullSources.push(mergeMangaInfo(source, anilistId || undefined));
    }
    writeFile(
      `./data/${this.id}-full.json`,
      JSON.stringify(fullSources, null, 2)
    );

    return fullSources;
  }

  async scrapeMangaPages(numOfPages: number): Promise<SourceManga[]> {
    const sourceManga: SourceManga[] = await this.scrapePages(
      this.scrapeMangaPage.bind(this),
      numOfPages
    );

    return sourceManga.filter((manga) => manga?.chapters?.length);
  }

  async scrapeMangaPage(_page: number): Promise<SourceManga[]> {
    throw new Error("scrapeMangaPage Not implemented");
  }

  async scrapeManga(_sourceId: string): Promise<SourceManga> {
    throw new Error("scrapeManga Not implemented");
  }

  async getImages(_ids: GetImagesQuery): Promise<ImageSource[]> {
    throw new Error(" getImagesNot implemented");
  }
}
