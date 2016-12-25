const fs = require('fs');
const P = require('bluebird');
const R = require('ramda');
const xml2js = require('xml2js');

const descriptionAttrMap = {
  NAME: 'name',
  POPOS_ADDR: 'address',
  DNTWN_PLAN: 'downtownPlan',
  TYPE: 'type',
  HOURS: 'hours',
  LANDSCAPIN: 'landscaping',
  SEATING_No: 'seating',
  FOOD_SERVI: 'food',
  Art: 'art',
  RESTROOMS: 'restrooms',
  Accessibil: 'accessibility',
  LOCATION: 'location',
  YEAR: 'year',
  SOURCE: 'source',
  Food: 'food',
  Seating: 'seating',
  Restroom: 'restroom',
  Descriptio: 'description',
  Seating_an: 'seatingAndTables',
  Hours_Type: 'hours'
};

const extractDescriptionInfo = parsedDescription => {
  const rawData =
    R.path(['html', 'body', 'table', 'tr', '1', 'td', 'table', 'tr'],
           parsedDescription);
  if (rawData == null) {
    throw new Error('could not parse main description table');
  }
  const attrMap = R.pipe(
    R.map(R.prop('td')),
    R.map(R.over(R.lensIndex(0),
                 key => R.defaultTo(key, R.prop(key, descriptionAttrMap)))),
    R.fromPairs
  )(rawData);
  return attrMap;
};

const parseDescription = P.coroutine(function*(descriptionHtml) {
  const stripped = descriptionHtml.replace(/<(meta|META)[^>]+>/g, '');
  const parser = new xml2js.Parser({
    explicitArray: false,
  });
  try {
    const res = yield P.promisify(parser.parseString)(stripped);
    return extractDescriptionInfo(res);
  } catch (e) {
    console.error('could not parse description');
    return '';
  }
});

const parseXml = P.coroutine(function*(data) {
  const poposRaw = R.path(['kml', 'Document', 'Folder', 'Placemark'], data);
  return P.map(poposRaw, P.coroutine(function*(raw) {
    const parsedDescription = yield parseDescription(raw.description);
    return R.assoc('description', parsedDescription, raw);
  }));
});

const parseDocKml = P.coroutine(function*(fileContents) {
  const parser = new xml2js.Parser({
    explicitArray: false,
  });
  const parsedXml = yield P.promisify(parser.parseString)(fileContents);
  const parsed = yield parseXml(parsedXml);
  return parsed;
});

P.coroutine(function*() {
  const contents = fs.readFileSync(`${__dirname}/../POPOSData/doc.kml`);
  const parsed = yield parseDocKml(contents);
  fs.writeFileSync(`${__dirname}/../popos.json`,
                   JSON.stringify(parsed, null, 2));
})();
