// This is server-side code, rule is intended for client, console.error() is required.
/* eslint-disable no-console */
/* eslint-disable padded-blocks */
const fs = require('fs');
const fetch = require('isomorphic-fetch');

const LOCATION_DATA_PATH = '../data/';
const DATA_FILE = 'location.json';

const stations = ['Nishi-Funabashi', 'Yoyogi-Uehara', 'Naka-Meguro', 'Wako-shi', 'Nakano', 'Kotake-Mukaihara', 'Oshiage', 'Meguro', 'Akabane Iwabuchi', 'Shirokane-Takanawa', 'Shirokanedai', 'Ikebukuro', 'Kita-Senju', 'Otemachi', 'Ginza', 'Shibuya', 'Shimbashi', 'Shinjuku', 'Ueno', 'Takadanobaba', 'Iidabashi', 'Nihombashi', 'Tokyo', 'Nishi-Nippori', 'Toyosu', 'Yurakucho', 'Omotesando', 'Kudanshita', 'Kokkai Gijido-mae', 'Tameike-Sanno', 'Kasumigaseki', 'Toyocho', 'Ichigaya', 'Akihabara', 'Roppongi', 'Kayabacho', 'Mitsukoshimae', 'Monzen-Nakacho', 'Hatchobori', 'Toranomon', 'Yotsuya', 'Akasaka Mitsuke', 'Aoyama-Itchome', 'Shinjuku Sanchome', 'Kasai', 'Ebisu', 'Nishi-Kasai', 'Shin-Kiba', 'Asakusa', 'Hibiya', 'Korakuen', 'Shin-Ochanomizu', 'Jimbocho', 'Kinshicho', 'Akasaka', 'Ningyocho', 'Kamiyacho', 'Gaienmae', 'Urayasu', 'Kiba', 'Higashi-Ginza', 'Meiji-Jingumae', 'Hanzomon', 'Waseda', 'Ogikubo', 'Suitengumae', 'Tsukiji', 'Myogadani', 'Nakano Sakaue', 'Nagatacho', 'Tsukishima', 'Minami-Sunamachi', 'Hiroo', 'Oji', 'Machiya', 'Gyotoku', 'Awajicho', 'Ochanomizu', 'Kojimachi', 'Nishi-Shinjuku', 'Takebashi', 'Roppongi-Itchome', 'Kanda', 'Edogawabashi', 'Minami-Gyotoku', 'Hongo-Sanchome', 'Myoden', 'Sumiyoshi', 'Chikatetsu Narimasu', 'Shinjuku-gyoemmae', 'Naka-Okachimachi', 'Kyobashi', 'Kiyosumi-Shirakawa', 'Azabu-Juban', 'Yotsuya-Sanchome', 'Heiwadai', 'Kagurazaka', 'Nogizaka', 'Shintomicho', 'Kodenmacho', 'Gokokuji', 'Minowa', 'Hikawadai', 'Komagome', 'Ginza-itchome', 'Kanamecho', 'Higashi-Ikebukuro', 'Senkawa', 'Shin-Koenji', 'Yushima', 'Oji-Kamiya', 'Nijubashimae', 'Shin-Nakano', 'Honancho', 'Chikatetsu Akatsuka', 'Higashi-Koenji', 'Iriya', 'Nishi-Waseda', 'Tawaramachi', 'Todai-mae', 'Kita-Ayase', 'Nezu', 'Minami-Senju', 'Tatsumi', 'Sendagi', 'Baraki-Nakayama', 'Ochiai', 'Ueno-Hirokoji', 'Minami-Asagaya', 'Shin-Otsuka', 'Yoyogi-Koen', 'Suehirocho', 'Higashi-Shinjuku', 'Hon-Komagome', 'Nakano-Shimbashi', 'Nakano-Fujimicho', 'Inaricho', 'Kita-Sando', 'Sakuradamon', 'Zoshigaya', 'Shimo', 'Nishigahara'];


(async () => {
  try {
    const fetchLocation = station =>
      fetch(`http://maps.googleapis.com/maps/api/geocode/json?address="${station}"`)
        .then(res => res.json())
        .then(res => res)
        .catch(err => console.error('Error getting address', err));

    const promises = stations.map(station => fetchLocation(station));
    const responses = await Promise.all(promises);

    const results = responses.map((res, index) => {
      const center = res.results[0].geometry.location;
      const id = res.results[0].place_id;
      const params = {
        id,
        name: stations[index],
        lat: center.lat,
        lng: center.lng,
      };
      return params;
    });

    fs.writeFile(LOCATION_DATA_PATH + DATA_FILE, JSON.stringify(results), (err) => {
      if (err) console.error('The file has not been saved!', err);
      else console.log('The file has been saved!');
    });

  } catch (err) {
    console.error('Error updating records', err);
  }
})();
