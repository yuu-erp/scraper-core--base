import { AxiosRequestConfig } from "axios";
import { Scraper } from "./Scraper";
import { RequireAtLeastOne } from "~/types/utils";
import { readFile, writeFile } from "~/utils";
import { Manga, SourceManga } from "~/types/data";

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

  /**
   * Scrape data from anilist then merge it with data from source
   * @param sources sources of manga
   * @returns merged sources of manga
   */
  async scrapeAnilist(sources?: SourceManga[]): Promise<Manga[]> {
    const fullSources = [] as Manga[];

    if (!sources) {
      const readFileData = readFile(`./data/${this.id}.json`);
      if (!readFileData) throw new Error("No sources");
      sources = JSON.parse(readFileData);
    }

    if (!sources?.length) throw new Error("No sources");

    return fullSources;
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
