import path from "path";
import fs from "fs";

export const handlePath = (
  filePath: string,
  baseUrl: string = path.resolve(process.cwd(), "./src")
) => path.join(baseUrl, filePath);

export const readFile = (filePath: string, basePath?: string) => {
  const fileDir = handlePath(filePath, basePath);

  if (!fs.existsSync(fileDir)) return null;

  return fs.readFileSync(fileDir, "utf-8");
};

export const writeFile = (
  filePath: string,
  data: string,
  basePath?: string
) => {
  const pathname = filePath.replace(/^\.*\/|\/?[^/]+\.[a-z]+|\/$/g, ""); // Remove leading directory markers, and remove ending /file-name.extension

  const pathDir = handlePath(pathname, basePath);

  if (!fs.existsSync(pathDir)) {
    fs.mkdirSync(pathDir, { recursive: true });
  }

  const fileDir = handlePath(filePath, basePath);

  fs.writeFileSync(fileDir, data, { flag: "w" });
};

export const fulfilledPromises = <T extends Promise<any>>(promises: T[]) =>
  Promise.allSettled(promises).then((results) =>
    results
      .filter((result) => result.status === "fulfilled")
      .map((result) => (result as PromiseFulfilledResult<Awaited<T>>).value)
  );
