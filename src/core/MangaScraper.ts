import { AxiosRequestConfig } from "axios";
import { RequireAtLeastOne } from "~/type";

export class MangaScraper {
  id: string;
  name: string;
  monitorURL: string;

  constructor(
    id: string,
    name: string,
    axiosConfig: RequireAtLeastOne<AxiosRequestConfig, "baseURL">
  ) {
    this.id = id;
    this.name = name;
    this.monitorURL = axiosConfig.baseURL;
  }

  async scrapeMangaPage(_page: number): Promise<any> {
    throw new Error("scrapeMangaPage Not implemented");
  }
}
