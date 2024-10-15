import { AxiosRequestConfig } from "axios";
import { Scraper } from "./Scraper";
import { RequireAtLeastOne } from "~/types/utils";

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

  async scrapeMangaPage(_page: number): Promise<any> {
    throw new Error("scrapeMangaPage Not implemented");
  }
}
