import { AxiosHeaders, AxiosRequestHeaders } from "axios";
import "dotenv/config";

export type Headers = AxiosRequestHeaders;

export default class Proxy {
  headers: Headers;

  constructor(headers: { [key: string]: string }) {
    this.headers = AxiosHeaders.from(headers) as AxiosRequestHeaders;
  }
}
