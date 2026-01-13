import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: true, // ⭐ REQUIRED
  processEntities: true,
});

export function parseSoapResponse<T>(xml: string, path: string): T {
  const json = parser.parse(xml);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return path.split('.').reduce((obj: any, key) => obj[key], json);
}
