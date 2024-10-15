import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import Proxy from "./Proxy";
import logger from "../logger";
import { RequireAtLeastOne } from "~/types/utils";

interface Server {
  name: string;
}

export const DEFAULT_CONFIG: AxiosRequestConfig = {};

export const DEFAULT_MONITOR_INTERVAL = 1_200_000; // 20 minutes

export class Scraper {
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
  locales: string[];
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
    this.locales = [];
  }
  init() {
    return;
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

    return;
  }
}
