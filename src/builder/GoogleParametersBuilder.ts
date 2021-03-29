import { Builder } from "types/Builder";

export class GoogleParametersBuilder implements Builder<string> {
  private code: string;
  private cliendId: string;
  private clientSecret: string;
  private redirectURL: string;
  private grantType: string;

  constructor(private baseURL: string) {}

  build(): string {
    const params = [
      this.code,
      this.cliendId,
      this.clientSecret,
      this.redirectURL,
      this.grantType,
    ]
      .filter(Boolean)
      .join("&");
    return `${this.baseURL}?${params}`;
  }

  withCode(code: string) {
    this.code = `code=${code}`;
    return this;
  }

  withClientId(cliendId: string) {
    this.cliendId = `client_id=${cliendId}`;
    return this;
  }

  withClientSecret(clientSecret: string) {
    this.clientSecret = `client_secret=${clientSecret}`;
    return this;
  }

  withRedirectURL(redirectURL: string) {
    this.redirectURL = `redirect_uri=${redirectURL}`;
    return this;
  }

  withGrantType(grantType: string) {
    this.grantType = `grant_type=${grantType}`;
    return this;
  }
}
