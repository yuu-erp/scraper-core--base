import { select, Separator } from "@inquirer/prompts";
import { Command } from "commander";
import { readFile } from "../../utils";
import scrapers, { getScraper } from "~/scrapers";
import { MangaScraper } from "~/core/MangaScraper";
import logger from "~/logger";

export default (program: Command) => {
  return program
    .command("scraper")
    .description("Generate scraper file.")
    .action(async () => {
      try {
        const type = await select({
          message: "What is the type of the scraper?",
          choices: [
            {
              name: "Manga",
              value: "manga",
              description: "Choose this for scraping manga content.",
            },
            new Separator(),
            {
              name: "Anime",
              value: "anime",
              disabled: true,
              description: "Scraping anime content is currently disabled.",
            },
            {
              name: "Image",
              value: "image",
              disabled: "(image is not available)",
              description: "Image scraping is currently not available.",
            },
            {
              name: "Video",
              value: "video",
              disabled: "(video is not available)",
              description: "Video scraping is currently not available.",
            },
          ],
        });
        const allScrapers = type === "manga" ? scrapers.manga : scrapers.manga;
        const dataChoices = Object.values(allScrapers).map((value) => ({
          name: value.name,
          value: value.id,
        }));
        const id = await select({
          message: "What's the ID of the scraper?",
          choices: dataChoices,
        });
        const scraper = getScraper(id);
        await scraper.init();

        const mangaScraper = scraper as MangaScraper;
        const sources = await readFileAndFallback(`./data/${id}.json`, () =>
          mangaScraper.scrapeAllMangaPages()
        );
        const mergedSources = await readFileAndFallback(
          `./data/${id}-full.json`,
          () => mangaScraper.scrapeAnilist(sources)
        );
        console.log("Scraper init successfully");
      } catch (err) {
        logger.error(err);
      }
    });
};
const readFileAndFallback = <T>(
  path: string,
  fallbackFn?: () => Promise<T>
) => {
  const readFileData = readFile(path);
  if (!readFileData) return fallbackFn?.();
  const fileContent: T = JSON.parse(readFileData);
  if (!fileContent) return fallbackFn?.();
  return fileContent;
};
