import { AxiosRequestConfig } from "axios";
import { MediaType } from "~/types/anilist";
import { SourceManga } from "~/types/data";
import { RequireAtLeastOne } from "~/types/utils";
import { writeFile } from "~/utils";
import Scraper from "./Scraper";

export type ImageSource = {
  image: string;
  useProxy?: boolean;
};
export type GetImagesQuery = {
  source_id: string;
  source_media_id: string;
  chapter_id: string;
};
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
