import { GetImagesQuery, ImageSource, MangaScraper } from "~/core/MangaScraper";
import { SourceManga } from "~/types/data";

export default class MangaNettruyenScraper extends MangaScraper {
  constructor() {
    // Pass axiosConfig to the parent class
    super("nettruyen", "Nettruyen", { baseURL: "" });

    // Languages that the source supports (Two letter code)
    // See more: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
  }
  // @ts-ignore
  shouldMonitorChange(oldPage: string, newPage: string): boolean {}
  // @ts-ignore
  async scrapeMangaPage(page: number): Promise<SourceManga[]> {}
  // @ts-ignore
  async scrapeManga(sourceId: string): Promise<SourceManga> {}
  // @ts-ignore
  async getImages(query: GetImagesQuery): Promise<ImageSource[]> {}
}
