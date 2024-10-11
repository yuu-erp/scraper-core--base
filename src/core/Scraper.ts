import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { errorLogger } from "axios-logger";
import axiosRetry from "axios-retry";
import logger from "~/logger";
import { RequireAtLeastOne } from "~/types/utils";
import Proxy from "./Proxy";
import { SourceAnime, SourceManga } from "~/types/data";

export const DEFAULT_CONFIG: AxiosRequestConfig = {};

export const DEFAULT_MONITOR_INTERVAL = 1_200_000; // 20 minutes

export default class Scraper {
  client: AxiosInstance;
  id: string;
  name: string;
  baseURL: string;
  blacklistTitles: string[];
  monitorURL: string;
  monitorInterval: number;
  monitorAxiosConfig: AxiosRequestConfig;
  disableMonitorRequest: boolean;
  disableMonitor: boolean;
  proxy: Proxy;

  constructor(
    id: string,
    name: string,
    axiosConfig: RequireAtLeastOne<AxiosRequestConfig, "baseURL">
  ) {
    const config = {
      headers: {
        referer: axiosConfig.baseURL,
        origin: axiosConfig.baseURL,
      },
      timeout: 20000,
      ...axiosConfig,
    };
    this.disableMonitor = false;
    this.monitorAxiosConfig = config;
    this.client = axios.create(config);
    this.baseURL = axiosConfig.baseURL;
    this.monitorURL = axiosConfig.baseURL;
    this.monitorInterval = DEFAULT_MONITOR_INTERVAL;
    this.disableMonitorRequest = false;
    this.id = id;
    this.name = name;
    this.proxy = new Proxy({
      referer: axiosConfig.baseURL,
      origin: axiosConfig.baseURL,
    });
    this.blacklistTitles = ["live action"];

    axiosRetry(this.client, { retries: 3 });

    const axiosErrorLogger = (error: AxiosError) => {
      return errorLogger(error, {
        logger: logger.error.bind(logger),
      });
    };

    this.client.interceptors.request.use((config) => config, axiosErrorLogger);

    this.client.interceptors.response.use(
      (response) => response,
      axiosErrorLogger
    );
  }
  init() {
    return null;
  }
  /**
   * The monitor will run this method to check if the monitor should run onChange
   * (defined in cron/fetch)
   * @param oldPage old page that the monitor requested before
   * @param newPage new page that the monitor just requested
   * @returns boolean to let the monitor decided if the onChange function should run.
   */
  shouldMonitorChange(_oldPage: any, _newPage: any): boolean {
    return false;
  }

  protected async scrapeAllPages(scrapeFn: (page: number) => Promise<any>) {
    const list = [];
    let isEnd = false;
    let page = 1;

    while (!isEnd) {
      try {
        const result = await scrapeFn(page).catch((err) =>
          logger.error("error", err)
        );

        if (!result) {
          isEnd = true;

          break;
        }

        console.log(`Scraped page ${page} - ${this.id}`);

        if (result.length === 0) {
          isEnd = true;

          break;
        }

        page++;

        list.push(result);
      } catch (err) {
        isEnd = true;
      }
    }

    return this.removeBlacklistSources(list.flat());
  }

  protected async removeBlacklistSources<T extends SourceAnime | SourceManga>(
    sources: T[]
  ) {
    return sources.filter((source) =>
      source?.titles.some((title) => !this.blacklistTitles.includes(title))
    );
  }
}
