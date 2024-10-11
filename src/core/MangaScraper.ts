import { AxiosRequestConfig } from "axios";
import { MediaType } from "~/types/anilist";
import { SourceManga } from "~/types/data";
import { RequireAtLeastOne } from "~/types/utils";
import { writeFile } from "~/utils";
import Scraper from "./Scraper";

export class MangaScraper extends Scraper {
  type: MediaType.Manga;
  monitorURL: string;

  constructor(
    id: string,
    name: string,
    axiosConfig: RequireAtLeastOne<AxiosRequestConfig, "baseURL">
  ) {
    super(id, name, axiosConfig);

    this.id = id;
    this.name = name;
    this.monitorURL = axiosConfig.baseURL;
    this.type = MediaType.Manga;
  }

  async scrapeAllMangaPages(): Promise<SourceManga[]> {
    const data = await this.scrapeAllPages(this.scrapeMangaPage.bind(this));

    writeFile(`./data/${this.id}.json`, JSON.stringify(data, null, 2));

    return data;
  }

  async scrapeMangaPage(_page: number): Promise<SourceManga[]> {
    throw new Error("scrapeMangaPage Not implemented");
  }
}
