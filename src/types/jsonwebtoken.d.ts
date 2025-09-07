declare module "jsonwebtoken" {
  export type Secret = string | Buffer | { key: string } | undefined;
  export function sign(
    payload: any,
    secretOrPrivateKey: Secret,
    options?: any
  ): string;
  export function verify(
    token: string,
    secretOrPublicKey: Secret,
    options?: any
  ): any;
  export function decode(token: string, options?: any): any;
  const jwt: {
    sign: typeof sign;
    verify: typeof verify;
    decode: typeof decode;
  };
  export default jwt;
}
