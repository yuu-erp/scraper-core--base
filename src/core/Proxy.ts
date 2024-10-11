import { AxiosHeaders } from "axios";
import "dotenv/config";

export type Headers = InstanceType<typeof AxiosHeaders>; // Correctly refer to the type of AxiosHeaders

export default class Proxy {
  headers: Headers;

  constructor(headers: Record<string, string>) {
    this.headers = new AxiosHeaders(headers);
  }
}
