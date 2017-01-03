import * as xml2js from 'xml2js';

export const parseXml = <T>(str: string): T => {
  const parser = new xml2js.Parser({
    async: false,
    explicitArray: false,
  });

  let res: any = null;
  parser.parseString(str, (err: Error, result: any) => {
    if (err) {
      console.log(str);
      throw new Error(`could not parse xml: ${err}`);
    }
    res = result;
  });
  return res;
};
