import { MangaScraper } from "~/core/MangaScraper";

export default class MangaYuriScraper extends MangaScraper {
  constructor() {
    // Pass axiosConfig to the parent class
    super("yuri", "Yuri", { baseURL: "" });
    // Languages that the source supports (Two letter code)
    // See more: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
  }
}
