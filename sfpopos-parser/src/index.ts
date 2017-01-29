import * as fs from 'fs';
import * as R from 'ramda';

import { parseXml } from './util';

const descriptionAttrMap = {
  Accessibil: 'accessibility',
  Art: 'art',
  DNTWN_PLAN: 'downtownPlan',
  Descriptio: 'description',
  FOOD_SERVI: 'food',
  Food: 'food',
  HOURS: 'hours',
  Hours_Type: 'hours',
  LANDSCAPIN: 'landscaping',
  LOCATION: 'location',
  NAME: 'name',
  POPOS_ADDR: 'address',
  RESTROOMS: 'restrooms',
  Restroom: 'restroom',
  SEATING_No: 'seating',
  SOURCE: 'source',
  Seating: 'seating',
  Seating_an: 'seatingAndTables',
  TYPE: 'type',
  YEAR: 'year',
};

interface RawPopos {
  $: {
    id: string;
  };
  name: string;
  Snippet: string;
  description: string;
  styleUrl: string;
  Point: {
    altitudeMode: string;
    coordinates: string;
  };
};

// Response from POPOS arcgis /identify endpoint
interface RawPoposMapElement {
  Accessibility: string;
  Art: string;
  BLOCK_NUM: string;
  CASE_NO: string;
  COMMISSION_REQ_SIZE: string;
  Description: string;
  FOOD_SERVICE: string;
  Food: string;
  HOURS: string;
  Hours_Type: string;
  ID_For_Map: string;
  LANDSCAPING: string;
  LOCATION: string;
  LOT_NUM: string;
  Lattitue: string;
  Longitude: string;
  Map: string;
  Motion_File: string;
  NAME: string;
  OBJECTID: string;
  Observed_size: string;
  POPOS_ADDRESS: string;
  Pic_File: string;
  RESTROOMS: string;
  Required_size__by_code: string;
  Restroom: string;
  SEATING_No: string;
  SOURCE: string;
  Seating: string;
  Seating_and_Tables: string;
  Shape: string;
  Subject_To_Downtown_PLN: string;
  TYPE: string;
  YEAR: string;
  signage: string;
};

interface RawPoposResult {
  attributes: RawPoposMapElement;
  displayFieldName: string;
  layerId: number;
  layerName: 'Art' | 'POPOS';
  value: string;
};

interface PoposDetailResponse {
  results: Array<RawPoposResult>;
};

interface PoposDescription {
  FID: string;
  name: string;
  address: string;
  downtownPlan: string;
  type: string;
  CASE_NO: string;
  hours: string;
  landscaping: string;
  seating: string;
  food: string;
  art: string;
  restrooms: string;
  accessibility: string;
  location: string;
  year: string;
  source: string;
  restroom: string;
  description: string;
  seatingAndTables: string;
};

interface Coordinates {
  lat: string;
  lng: string;
};

interface Popos {
  name: string;
  description: PoposDescription;
  styleUrl: string;
  imageFilename: string | null;
  coordinates: Coordinates | null;
};

const extractDescriptionInfo = (parsedDescription: any): PoposDescription => {
  const rawData =
    R.path(['html', 'body', 'table', 'tr', '1', 'td', 'table', 'tr'],
           parsedDescription) as Array<any>;
  if (rawData == null) {
    throw new Error('could not parse main description table');
  }
  const attrMap = R.pipe(
    R.map(R.prop('td')),
    R.map(([k, v]) => [R.defaultTo(k, R.prop(k, descriptionAttrMap)), v] as [string, string]),
    R.fromPairs,
  )(rawData) as any;
  return attrMap;
};

const parseDescription = (descriptionHtml: string) => {
  const stripped = descriptionHtml.replace(/<(meta|META)[^>]+>/g, '');
  const parsedDescriptionHtml = parseXml(stripped);
  return extractDescriptionInfo(parsedDescriptionHtml);
};

const parseCoordinates = (coordinatesStr: string): Coordinates | null => {
  const match = /(-?\d*\.?\d*),(-?\d*\.?\d*)/.exec(coordinatesStr);
  if (match != null) {
    return {
      lat: match[1],
      lng: match[2],
    };
  } else {
    return null;
  }
};

const parseKml = (data: any): Array<Popos> => {
  const poposRaw = R.path(['kml', 'Document', 'Folder', 'Placemark'], data) as Array<RawPopos>;
  const res: Array<Popos> = poposRaw.map((raw) => ({
    coordinates: parseCoordinates(raw.Point.coordinates),
    description: parseDescription(raw.description),
    imageFilename: null,
    name: raw.name,
    styleUrl: raw.styleUrl,
  }));
  return res;
};

// Add image filename from arcgis response to POPOS parsed eariler.
const mergeDetails = (
  allPopos: Array<Popos>,
  mapElements: Array<RawPoposMapElement>,
): Array<Popos> => {
  const mapElementsByName =
    R.indexBy<RawPoposMapElement>(R.prop('NAME'), mapElements);
  return allPopos.map(popos => {
    const mapElement = mapElementsByName[popos.name];
    if (mapElement == null) {
      return popos;
    } else {
      return R.assoc('imageFilename', mapElement.Pic_File, popos);
    }
  });
};

(() => {
  // TODO: replace these with cli args / option to download
  const contents =
    fs.readFileSync(`${__dirname}/../POPOSData/doc.kml`).toString();
  const poposParsedXml = parseXml<any>(contents);
  const parsed = parseKml(poposParsedXml);

  const details =
    fs.readFileSync(`${__dirname}/../popos-detail.json`).toString();
  const detailsParsedXml = JSON.parse(details) as PoposDetailResponse;
  const rawMapElements = detailsParsedXml.results.map(r => r.attributes);

  const poposWithDetails = mergeDetails(parsed, rawMapElements);

  fs.writeFileSync(`${__dirname}/../popos.json`,
                   JSON.stringify(poposWithDetails, null, 2));
})();
