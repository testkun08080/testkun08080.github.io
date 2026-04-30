/// <reference types="vike/types" />
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
