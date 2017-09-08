const lcc = require('line-circle-collision');

class FakeAirspaceChecker {
  /**
   * Determines if the drone is allowed to fly on this flight path
   * 
   * @param {*} origin Array of 2 values: x & y
   * @param {*} destination Array of 2 values: x & y
   * @returns {boolean} True if the drone can fly on this segment, false if not
   */
  static async checkSpace(origin, dest) {
    let isOK;

    try {
      const KILOMETERS_IN_DEGREES = 1 / 111;
      const RADIUS_IN_KILOMETERS = 3;
      const RADIUS_IN_DEGREES = RADIUS_IN_KILOMETERS * KILOMETERS_IN_DEGREES;
      const text = `
[
    {
        "iata": "NRT",
        "lon": "140.38744",
        "iso": "JP",
        "status": 1,
        "name": "Narita International Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "35.773212",
        "size": "large"
    },
    {
        "iata": "MMJ",
        "lon": "137.96666",
        "iso": "JP",
        "status": 1,
        "name": "Matsumoto Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "36.233334",
        "size": "medium"
    },
    {
        "iata": "IBR",
        "lon": "140.41472",
        "iso": "JP",
        "status": 1,
        "name": "Hyakuri Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "36.181667",
        "size": "medium"
    },
    {
        "iata": "MUS",
        "iso": "JP",
        "status": 1,
        "name": "Minami Torishima Airport",
        "continent": "AS",
        "type": "airport",
        "size": "small"
    },
    {
        "iata": "IWO",
        "lon": "141.31667",
        "iso": "JP",
        "status": 1,
        "name": "Iwo Jima Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "24.783333",
        "size": "medium"
    },
    {
        "iata": "KIX",
        "lon": "135.24397",
        "iso": "JP",
        "status": 1,
        "name": "Kansai International Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "34.43533",
        "size": "large"
    },
    {
        "iata": "SHM",
        "lon": "135.35806",
        "iso": "JP",
        "status": 1,
        "name": "Nanki Shirahama Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "33.66139",
        "size": "medium"
    },
    {
        "iata": "UKB",
        "lon": "135.2284",
        "iso": "JP",
        "status": 1,
        "name": "Kobe Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "34.6373",
        "size": "medium"
    },
    {
        "iata": "HIW",
        "lon": "132.41638",
        "iso": "JP",
        "status": 1,
        "name": "Hiroshimanishi Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "34.36361",
        "size": "medium"
    },
    {
        "iata": "TJH",
        "lon": "134.78767",
        "iso": "JP",
        "status": 1,
        "name": "Tajima Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "35.51366",
        "size": "medium"
    },
    {
        "iata": "OBO",
        "lon": "143.21243",
        "iso": "JP",
        "status": 1,
        "name": "Tokachi-Obihiro Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "42.732002",
        "size": "medium"
    },
    {
        "iata": "CTS",
        "lon": "141.68134",
        "iso": "JP",
        "status": 1,
        "name": "New Chitose Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "42.78728",
        "size": "large"
    },
    {
        "iata": "HKD",
        "lon": "140.81581",
        "iso": "JP",
        "status": 1,
        "name": "Hakodate Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "41.776127",
        "size": "medium"
    },
    {
        "iata": "KUH",
        "lon": "144.19682",
        "iso": "JP",
        "status": 1,
        "name": "Kushiro Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "43.04565",
        "size": "medium"
    },
    {
        "iata": "MMB",
        "lon": "144.16722",
        "iso": "JP",
        "status": 1,
        "name": "Memanbetsu Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "43.9",
        "size": "medium"
    },
    {
        "iata": "SHB",
        "lon": "144.95613",
        "iso": "JP",
        "status": 1,
        "name": "Nakashibetsu Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "43.572197",
        "size": "medium"
    },
    {
        "iata": "OKD",
        "lon": "141.382",
        "iso": "JP",
        "status": 1,
        "name": "Okadama Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "43.110374",
        "size": "medium"
    },
    {
        "iata": "RBJ",
        "lon": "141.03334",
        "iso": "JP",
        "status": 1,
        "name": "Rebun Airport Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "45.38333",
        "size": "small"
    },
    {
        "iata": "WKJ",
        "lon": "141.7974",
        "iso": "JP",
        "status": 1,
        "name": "Wakkanai Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "45.39943",
        "size": "medium"
    },
    {
        "iata": "IKI",
        "lon": "129.78833",
        "iso": "JP",
        "status": 1,
        "name": "Iki Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "33.745556",
        "size": "medium"
    },
    {
        "iata": "UBJ",
        "lon": "131.27489",
        "iso": "JP",
        "status": 1,
        "name": "Yamaguchi Ube Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "33.933395",
        "size": "medium"
    },
    {
        "iata": "TSJ",
        "lon": "129.32637",
        "iso": "JP",
        "status": 1,
        "name": "Tsushima Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "34.28615",
        "size": "medium"
    },
    {
        "iata": "MBE",
        "lon": "143.38333",
        "iso": "JP",
        "status": 1,
        "name": "Monbetsu Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "44.266666",
        "size": "medium"
    },
    {
        "iata": "AKJ",
        "lon": "142.45454",
        "iso": "JP",
        "status": 1,
        "name": "Asahikawa Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "43.67109",
        "size": "medium"
    },
    {
        "iata": "OIR",
        "lon": "139.51666",
        "iso": "JP",
        "status": 1,
        "name": "Okushiri Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "42.166668",
        "size": "medium"
    },
    {
        "iata": "RIS",
        "lon": "141.25",
        "iso": "JP",
        "status": 1,
        "name": "Rishiri Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "45.183334",
        "size": "medium"
    },
    {
        "iata": "KUM",
        "lon": "130.65916",
        "iso": "JP",
        "status": 1,
        "name": "Yakushima Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "30.385555",
        "size": "medium"
    },
    {
        "iata": "FUJ",
        "lon": "128.83762",
        "iso": "JP",
        "status": 1,
        "name": "Fukue Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "32.667828",
        "size": "medium"
    },
    {
        "iata": "FUK",
        "lon": "130.4439",
        "iso": "JP",
        "status": 1,
        "name": "Fukuoka Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "33.584286",
        "size": "large"
    },
    {
        "iata": "TNE",
        "lon": "130.9929",
        "iso": "JP",
        "status": 1,
        "name": "New Tanegashima Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "30.604837",
        "size": "medium"
    },
    {
        "iata": "KOJ",
        "lon": "130.71562",
        "iso": "JP",
        "status": 1,
        "name": "Kagoshima Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "31.801224",
        "size": "large"
    },
    {
        "iata": "KMI",
        "lon": "131.44147",
        "iso": "JP",
        "status": 1,
        "name": "Miyazaki Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "31.872498",
        "size": "medium"
    },
    {
        "iata": "OIT",
        "lon": "131.73236",
        "iso": "JP",
        "status": 1,
        "name": "Oita Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "33.477238",
        "size": "medium"
    },
    {
        "iata": "KKJ",
        "lon": "131.03375",
        "iso": "JP",
        "status": 1,
        "name": "Kitaky?sh? Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "33.842793",
        "size": "medium"
    },
    {
        "iata": "HSG",
        "lon": "130.30278",
        "iso": "JP",
        "status": 1,
        "name": "Saga Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "33.153828",
        "size": "medium"
    },
    {
        "iata": "KMJ",
        "lon": "130.85799",
        "iso": "JP",
        "status": 1,
        "name": "Kumamoto Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "32.834133",
        "size": "medium"
    },
    {
        "iata": "NGS",
        "lon": "129.92258",
        "iso": "JP",
        "status": 1,
        "name": "Nagasaki Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "32.9144",
        "size": "medium"
    },
    {
        "iata": "NGO",
        "lon": "136.80528",
        "iso": "JP",
        "status": 1,
        "name": "Chubu Centrair International Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "34.858334",
        "size": "large"
    },
    {
        "iata": "ASJ",
        "lon": "129.70793",
        "iso": "JP",
        "status": 1,
        "name": "Amami Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "28.431522",
        "size": "medium"
    },
    {
        "iata": "OKE",
        "lon": "128.70555",
        "iso": "JP",
        "status": 1,
        "name": "Okierabu Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "27.431667",
        "size": "medium"
    },
    {
        "iata": "KKX",
        "lon": "129.92805",
        "iso": "JP",
        "status": 1,
        "name": "Kikai Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "28.321388",
        "size": "medium"
    },
    {
        "iata": "TKN",
        "lon": "128.88333",
        "iso": "JP",
        "status": 1,
        "name": "Tokunoshima Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "27.833332",
        "size": "medium"
    },
    {
        "iata": "NKM",
        "lon": "136.91957",
        "iso": "JP",
        "status": 1,
        "name": "Nagoya Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "35.25389",
        "size": "medium"
    },
    {
        "iata": "FKJ",
        "lon": "136.22667",
        "iso": "JP",
        "status": 1,
        "name": "Fukui Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "36.13972",
        "size": "medium"
    },
    {
        "iata": "QGU",
        "lon": "136.89522",
        "iso": "JP",
        "status": 1,
        "name": "Gifu Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "35.493137",
        "size": "medium"
    },
    {
        "iata": "KMQ",
        "lon": "136.41342",
        "iso": "JP",
        "status": 1,
        "name": "Komatsu Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "36.40237",
        "size": "medium"
    },
    {
        "iata": "OKI",
        "lon": "133.31667",
        "iso": "JP",
        "status": 1,
        "name": "Oki Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "36.166668",
        "size": "medium"
    },
    {
        "iata": "TOY",
        "lon": "137.18945",
        "iso": "JP",
        "status": 1,
        "name": "Toyama Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "36.64245",
        "size": "medium"
    },
    {
        "iata": "NTQ",
        "lon": "136.9568",
        "iso": "JP",
        "status": 1,
        "name": "Noto Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "37.294678",
        "size": "medium"
    },
    {
        "iata": "HIJ",
        "lon": "132.91945",
        "iso": "JP",
        "status": 1,
        "name": "Hiroshima Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "34.43611",
        "size": "medium"
    },
    {
        "iata": "OKJ",
        "lon": "133.85277",
        "iso": "JP",
        "status": 1,
        "name": "Okayama Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "34.76022",
        "size": "medium"
    },
    {
        "iata": "IZO",
        "lon": "132.88576",
        "iso": "JP",
        "status": 1,
        "name": "Izumo Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "35.41485",
        "size": "medium"
    },
    {
        "iata": "YGJ",
        "lon": "133.24448",
        "iso": "JP",
        "status": 1,
        "name": "Miho Yonago Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "35.500652",
        "size": "medium"
    },
    {
        "iata": "KCZ",
        "lon": "133.67485",
        "iso": "JP",
        "status": 1,
        "name": "K?chi Ry?ma Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "33.547688",
        "size": "medium"
    },
    {
        "iata": "MYJ",
        "lon": "132.70416",
        "iso": "JP",
        "status": 1,
        "name": "Matsuyama Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "33.822224",
        "size": "medium"
    },
    {
        "iata": "ITM",
        "lon": "135.44171",
        "iso": "JP",
        "status": 1,
        "name": "Osaka International Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "34.790974",
        "size": "large"
    },
    {
        "iata": "TTJ",
        "lon": "134.16756",
        "iso": "JP",
        "status": 1,
        "name": "Tottori Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "35.525913",
        "size": "medium"
    },
    {
        "iata": "TKS",
        "lon": "134.59483",
        "iso": "JP",
        "status": 1,
        "name": "Tokushima Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "34.139023",
        "size": "medium"
    },
    {
        "iata": "TAK",
        "lon": "134.01825",
        "iso": "JP",
        "status": 1,
        "name": "Takamatsu Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "34.219017",
        "size": "medium"
    },
    {
        "iata": "IWJ",
        "lon": "131.79028",
        "iso": "JP",
        "status": 1,
        "name": "Iwami Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "34.676388",
        "size": "medium"
    },
    {
        "iata": "AOJ",
        "lon": "140.68922",
        "iso": "JP",
        "status": 1,
        "name": "Aomori Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "40.738758",
        "size": "medium"
    },
    {
        "iata": "GAJ",
        "lon": "140.36583",
        "iso": "JP",
        "status": 1,
        "name": "Yamagata Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "38.410645",
        "size": "medium"
    },
    {
        "iata": "SDS",
        "lon": "138.41667",
        "iso": "JP",
        "status": 1,
        "name": "Sado Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "38.0",
        "size": "medium"
    },
    {
        "iata": "FKS",
        "lon": "140.43279",
        "iso": "JP",
        "status": 1,
        "name": "Fukushima Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "37.226665",
        "size": "medium"
    },
    {
        "iata": "HHE",
        "lon": "141.47084",
        "iso": "JP",
        "status": 1,
        "name": "Hachinohe Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "40.549168",
        "size": "medium"
    },
    {
        "iata": "HNA",
        "lon": "141.13077",
        "iso": "JP",
        "status": 1,
        "name": "Hanamaki Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "39.426926",
        "size": "medium"
    },
    {
        "iata": "AXT",
        "lon": "140.22015",
        "iso": "JP",
        "status": 1,
        "name": "Akita Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "39.61177",
        "size": "medium"
    },
    {
        "iata": "MSJ",
        "lon": "141.3869",
        "iso": "JP",
        "status": 1,
        "name": "Misawa Air Base",
        "continent": "AS",
        "type": "airport",
        "lat": "40.696316",
        "size": "medium"
    },
    {
        "iata": "KIJ",
        "lon": "139.11325",
        "iso": "JP",
        "status": 1,
        "name": "Niigata Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "37.951992",
        "size": "medium"
    },
    {
        "iata": "ONJ",
        "lon": "140.37383",
        "iso": "JP",
        "status": 1,
        "name": "Odate Noshiro Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "40.196415",
        "size": "medium"
    },
    {
        "iata": "SDJ",
        "lon": "140.92389",
        "iso": "JP",
        "status": 1,
        "name": "Sendai Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "38.135555",
        "size": "medium"
    },
    {
        "iata": "SYO",
        "lon": "139.79056",
        "iso": "JP",
        "status": 1,
        "name": "Shonai Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "38.809444",
        "size": "medium"
    },
    {
        "iata": "NJA",
        "lon": "139.35",
        "iso": "JP",
        "status": 1,
        "name": "Atsugi Naval Air Facility",
        "continent": "AS",
        "type": "airport",
        "lat": "35.416668",
        "size": "medium"
    },
    {
        "iata": "HAC",
        "lon": "139.78122",
        "iso": "JP",
        "status": 1,
        "name": "Hachijojima Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "33.117947",
        "size": "medium"
    },
    {
        "iata": "OIM",
        "lon": "139.365",
        "iso": "JP",
        "status": 1,
        "name": "Oshima Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "34.779167",
        "size": "medium"
    },
    {
        "iata": "MYE",
        "lon": "139.5625",
        "iso": "JP",
        "status": 1,
        "name": "Miyakejima Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "34.069443",
        "size": "medium"
    },
    {
        "iata": "HND",
        "lon": "139.78453",
        "iso": "JP",
        "status": 1,
        "name": "Tokyo International Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "35.54907",
        "size": "large"
    },
    {
        "iata": "QUT",
        "lon": "140.00609",
        "iso": "JP",
        "status": 1,
        "name": "Utsunomiya Airport",
        "continent": "AS",
        "type": "airport",
        "lat": "36.631527",
        "size": "medium"
    },
    {
        "iata": "OKO",
        "lon": "139.35",
        "iso": "JP",
        "status": 1,
        "name": "Yokota Air Base",
        "continent": "AS",
        "type": "airport",
        "lat": "35.75",
        "size": "large"
    }
]`;

      const airports = JSON.parse(text);

      const result = airports.reduce((accumulator, airport) => {
        const intersects = lcc(origin, dest, [airport.lon, airport.lat], RADIUS_IN_DEGREES);
        return accumulator || intersects;
      }, false);

      isOK = !result;
    } catch (err) {
      console.error('Error getting stuff', err);
    }

    return isOK;
  }
}

module.exports = FakeAirspaceChecker;
