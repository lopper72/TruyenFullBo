declare module 'react-native-cheerio' {
  interface CheerioAPI {
    load: (html: string) => CheerioStatic;
  }
  
  interface CheerioStatic {
    (selector: string): Cheerio;
  }
  
  interface Cheerio {
    find: (selector: string) => Cheerio;
    attr: (name: string) => string | undefined;
    text: () => string;
    each: (func: (i: number, elem: any) => void) => void;
  }

  const cheerio: CheerioAPI;
  export default cheerio;
} 