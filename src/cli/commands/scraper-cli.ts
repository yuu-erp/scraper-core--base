import { select, Separator } from "@inquirer/prompts";
import { Command } from "commander";
import { readFile } from "../../utils";
import scrapers, { getScraper } from "~/scrapers";

export default (program: Command) => {
  return program
    .command("scraper")
    .description("Generate scraper file.")
    .action(async () => {
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
    });
};

const readFileAndFallback = <T>(
  path: string,
  fallbackFn?: () => Promise<T>
) => {
  const fileContent: T = JSON.parse(readFile(path) || "");
  if (!fileContent) return fallbackFn?.();
  return fileContent;
};
