import { input, select, Separator } from "@inquirer/prompts";
import { Command } from "commander";
import { readFile, writeFile } from "~/utils";
import { replaceTemplate } from "~/utils/template";

export default (program: Command) => {
  return program
    .command("generate")
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
        const id = await input({
          message: "What is the ID of the scraper?",
        });
        const name = await input({
          message: "What is the name of the scraper?",
        });

        const templateFileName =
          type === "manga" ? "MangaScraper.ts" : "AnimeScraper.ts";

        const template = readFile(
          `./src/cli/templates/${templateFileName}`,
          process.cwd()
        ) as string;

        const scraperDirectory =
          type === "manga" ? "./src/scrapers/manga/" : "./src/scrapers/anime/";

        const scraperFile = `${scraperDirectory}${id}.ts`;

        const replacedTemplate = replaceTemplate(template, [
          {
            replacer: "__name__",
            value: name,
          },
          {
            replacer: "__id__",
            value: id,
          },
        ]);
        writeFile(scraperFile, replacedTemplate, process.cwd());
        console.log(`Scraper file generated at ${scraperFile}`);
      } catch (err: any) {
        console.error(err);
        program.error(err.message);
      }
    });
};
