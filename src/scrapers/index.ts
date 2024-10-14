import fs from "fs";
import { MangaScraper } from "../core/MangaScraper";
import { handlePath } from "../utils";

export type MangaScraperId = string;

const readScrapers = (
  relativePath: string
): Record<MangaScraperId, MangaScraper> => {
  const absolutePath = handlePath(relativePath, __dirname);

  if (!fs.existsSync(absolutePath)) {
    console.warn(`Directory ${absolutePath} does not exist.`);
    return {};
  }

  const scraperFiles = fs
    .readdirSync(absolutePath)
    .filter((file) => file.endsWith(".ts"))
    .map((file) => file.replace(".ts", ""));

  const scrapers: Record<MangaScraperId, MangaScraper> = {};
  for (const file of scraperFiles) {
    const { default: Scraper } = require(
      handlePath(`${relativePath}/${file}`, __dirname)
    );
    scrapers[file] = new Scraper();
  }
  return scrapers;
};

const mangaScrapers: Record<MangaScraperId, MangaScraper> =
  readScrapers("./manga");

export default {
  manga: mangaScrapers,
};
