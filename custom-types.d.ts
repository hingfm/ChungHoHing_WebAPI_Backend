// custom-types.d.ts

declare module 'oauth' {
  export class OAuth2 {
      constructor(
          clientId: string,
          clientSecret: string,
          baseSite: string,
          authorizePath: string | null,
          accessTokenPath: string,
          customHeaders: any | null
      );

      getOAuthAccessToken(
          extraParams: any,
          params: { grant_type: string },
          callback: (error: Error | null, accessToken: string | null, refreshToken?: string, results?: any) => void
      ): void;
  }
}

declare module 'csv-parser' {
  const content: any;
  export default content;
}