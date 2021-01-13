const https = require("https")

const getOptions = (_path) => {
  return {
    hostname: 'nysdmvqw.us.qmatic.cloud',
    port: 443,
    path: '/qwebbook/rest/schedule/branches/' + _path + "?_ie=" + (new Date()).getTime(),
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    },
    rejectUnauthorized: false
  }
}

const locations = {
  "1182b855bd56271c687d54d6d7f9559926297a76260f8329574d3396bf810763": "Bronx - Bronx License Center",
  "99f6c320206ee03f9dcce5b83eddcbfd30cd2e30bbe53c51d7116c2b33ce9ccd": "Bronx - Bronx Registration Center",
  "c92d2048b00326a0d9452e478db504ce41ec8f67f8e008034295cbf85cf902df": "Brooklyn - Atlantic Center Mall",
  "0b2bd54bb4e54eae475cf1b266cf85bec683771e5e231af74e292177ae5e2640": "Brooklyn - Coney Island",
  "ba4178c73f0cb0c91cf158865f174487cd4dcc79a86bdbbe5502730ed7e7b5b1": "Manhattan - Harlem",
  "8bcc5ca5cad16666ba6f5dd43d15241e172bd511f7e8d6f2e1caa2380b66776a": "Manhattan - Lower Manhattan (Financial District)",
  "0ea16b72515a86e0cc00d186b249b0ebc61ed10b5289394af9b0cab8de5dafda": "Manhattan - Midtown Manhattan (Near Penn Station)",
  "2a72087de98905257b00d3408dd0421a1082b53303159b04cbf5da672673fb4a": "Nassau - Bethpage",
  "bcdeedf10b9b7f92097db7d887686d1df79e2acdcec31334f4efbbbd679c9320": "Nassau - Garden City",
  "512e28a9b920ee045bf588bf0de12289f3b06abf6623aaf228c145251a2a2b71": "Nassau - Massapequa",
  "07ba47584cb979f930533fe6de50c8fa5be76bee3f52598e6e9e38e8820880db": "Nassau - Oak Street License Center",
  "fb052d6eae67926d8d5449d7317c8528e1e3d02b19441ead85f3150915e2abbe": "Queens - College Point",
  "d0099bebf8e51979019b5e45b2c7dfeab9830f0213a4da0cfd569ec145eb07a9": "Queens - Jamaica",
  "887df9bcd65c813a07ac3ae5e818d4faec1aa02bb467ea5cb2e1e2e878bfa32a": "Queens - Queens College License Center",
  "2da2cfd743542bc26618bf7d35559501aee630de80c66a5f884f86d61bc5e780": "Queens - Springfield Gardens",
  "8d970b60f29441704f53fe8d08a389388cbbd7c2081232fb59d9289e3ac1bf35": "Suffolk - Dix Hills/Huntington",
  "d0ab21c7180a46944a09a853677eb3357d8b53f4ea9f95651c5f154b5d3250ea": "Suffolk - Hauppauge",
  // "8038f30cdf05b89c635d129eb40b032cd9fff65d13158319a2df996b55f4f597": "Suffolk - Medford",
  // "f11ab9eacb835e5e5d55e738c011f1dfc5bd39ca3064b9db2946d5bbedc2569d": "Suffolk - Port Jefferson",
  // "c366dfde60f1fc6007fbe3457b20d131b92a2273a8a2473968474e8acfb00a8b": "Suffolk - Riverhead",
  // "1dfcc7900a35932a83e8b05b89d7c67e63a666dc4288bc73262712725787176d": "Westchester - Peekskill",
  // "ee9d5b38b121f0dd4a336a6f36aedff585229808390ebad45860feb74c2d5b63": "Westchester - White Plains",
  "46a32c2d34d1c7719a9e760613f0b7567b34987534a02d5be6cf98c6792a5110": "Westchester - Yonkers"
};

const serviceID = '10226f4de0f460aa67bb735db97f9eb434b8ac2a144e40a20ff1e1848ffbeae7';

const get = (_path) => new Promise((resolve, reject) => {
  const req = https.request(getOptions(_path), res => {
    let data = '';

    res.on('data', d => {
      data += d;
    });

    res.on('end', () => {
      resolve(JSON.parse(data));
      data = '';
    });
  })

  req.on('error', (e) => {
    console.log(e);
    return resolve('[]');
  });

  req.end();
});

const getDates = async location => {
  return await get(`${location}/services/${serviceID}/dates`)

}

const getTimes = async (location, day) => {
  return await get(`${location}/services/${serviceID}/dates/${day}/times`)
}

module.exports = async function request() {
  const status = [];

  for (let l in locations) {
    if (locations.hasOwnProperty(l)) {
      const days = await getDates(l);
      const times = {};

      if (days.length !== 0) {
        for (let i = 0; i < days.length; i++) {
          times[days[i].date] = (await getTimes(l, days[i].date))
        }
      }

      status.push({
        id: l,
        name: locations[l],
        days,
        times
      });
      
    }
  }

  return status;
};