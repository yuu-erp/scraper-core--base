import { AxiosRequestConfig } from "axios";
import { Scraper } from "./Scraper";
import { RequireAtLeastOne } from "~/types/utils";
import { writeFile } from "~/utils";
import { SourceManga } from "~/types/data";

export class MangaScraper extends Scraper {
  id: string;
  name: string;
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
  }
  async scrapeAllMangaPages(): Promise<SourceManga[]> {
    const data = await this.scrapeAllPages(this.scrapeMangaPage.bind(this));

    writeFile(`./data/${this.id}.json`, JSON.stringify(data, null, 2));

    return data;
  }
  async scrapeMangaPage(_page: number): Promise<any> {
    throw new Error("scrapeMangaPage Not implemented");
  }
}
