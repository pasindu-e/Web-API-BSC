// Seed data generator for the Sri Lanka Police Tuk-Tuk Monitoring System.
// Produces a single JSON object with referential integrity guaranteed:
//   provinces -> districts -> stations -> vehicles -> pings
// Run with:  node generateSeed.js   (writes seed.json)

const fs = require("fs");

// ---------------------------------------------------------------------------
// Deterministic PRNG so the generated data is reproducible run-to-run.
// ---------------------------------------------------------------------------
let _seed = 20260621;
function rand() {
  // Mulberry32
  _seed |= 0;
  _seed = (_seed + 0x6d2b79f5) | 0;
  let t = Math.imul(_seed ^ (_seed >>> 15), 1 | _seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function randInt(min, max) {
  return Math.floor(rand() * (max - min + 1)) + min;
}
function pick(arr) {
  return arr[Math.floor(rand() * arr.length)];
}
function round(n, dp = 6) {
  const f = Math.pow(10, dp);
  return Math.round(n * f) / f;
}

// ---------------------------------------------------------------------------
// 1. Provinces (9)
// ---------------------------------------------------------------------------
const provinceNames = [
  "Western",
  "Central",
  "Southern",
  "Northern",
  "Eastern",
  "North Western",
  "North Central",
  "Uva",
  "Sabaragamuwa",
];

const provinces = provinceNames.map((name, i) => ({
  id: i + 1,
  name: `${name} Province`,
}));

// ---------------------------------------------------------------------------
// 2. Districts (25) mapped to real provinces, each with an approx centre.
// ---------------------------------------------------------------------------
// [name, provinceName, lat, lng]
const districtSeed = [
  ["Colombo", "Western", 6.9271, 79.8612],
  ["Gampaha", "Western", 7.0917, 79.9999],
  ["Kalutara", "Western", 6.5854, 79.9607],
  ["Kandy", "Central", 7.2906, 80.6337],
  ["Matale", "Central", 7.4675, 80.6234],
  ["Nuwara Eliya", "Central", 6.9497, 80.7891],
  ["Galle", "Southern", 6.0535, 80.221],
  ["Matara", "Southern", 5.9549, 80.555],
  ["Hambantota", "Southern", 6.1241, 81.1185],
  ["Jaffna", "Northern", 9.6615, 80.0255],
  ["Kilinochchi", "Northern", 9.3803, 80.3770],
  ["Mannar", "Northern", 8.9810, 79.9044],
  ["Vavuniya", "Northern", 8.7514, 80.4971],
  ["Mullaitivu", "Northern", 9.2671, 80.8142],
  ["Batticaloa", "Eastern", 7.7102, 81.6924],
  ["Ampara", "Eastern", 7.2917, 81.6747],
  ["Trincomalee", "Eastern", 8.5874, 81.2152],
  ["Kurunegala", "North Western", 7.4863, 80.3623],
  ["Puttalam", "North Western", 8.0362, 79.8283],
  ["Anuradhapura", "North Central", 8.3114, 80.4037],
  ["Polonnaruwa", "North Central", 7.9403, 81.0188],
  ["Badulla", "Uva", 6.9934, 81.0550],
  ["Monaragala", "Uva", 6.8908, 81.3500],
  ["Ratnapura", "Sabaragamuwa", 6.6828, 80.3992],
  ["Kegalle", "Sabaragamuwa", 7.2513, 80.3464],
];

const provinceIdByName = Object.fromEntries(
  provinceNames.map((n, i) => [n, i + 1])
);

const districts = districtSeed.map(([name, provName, lat, lng], i) => ({
  id: i + 1,
  name,
  province_id: provinceIdByName[provName],
  _lat: lat,
  _lng: lng,
}));

// ---------------------------------------------------------------------------
// 3. Stations (>= 20) — give every district at least one police station,
//    then add extra stations to busier districts.
// ---------------------------------------------------------------------------
const stationSuffix = [
  "Police Station",
  "Police Division HQ",
  "Traffic Police Station",
  "Police Post",
];

const stations = [];
let stationId = 1;

// One HQ station per district (25 stations -> already >= 20).
for (const d of districts) {
  stations.push({
    id: stationId++,
    name: `${d.name} ${stationSuffix[0]}`,
    district_id: d.id,
    _lat: d._lat,
    _lng: d._lng,
  });
}

// Add extra stations to a handful of major districts.
const busyDistricts = ["Colombo", "Gampaha", "Kandy", "Galle", "Jaffna"];
for (const dn of busyDistricts) {
  const d = districts.find((x) => x.name === dn);
  for (let k = 1; k <= 2; k++) {
    stations.push({
      id: stationId++,
      name: `${d.name} ${stationSuffix[k % stationSuffix.length]} ${k}`,
      district_id: d.id,
      _lat: round(d._lat + (rand() - 0.5) * 0.08),
      _lng: round(d._lng + (rand() - 0.5) * 0.08),
    });
  }
}

// ---------------------------------------------------------------------------
// 4. Vehicles (>= 200) distributed across stations.
// ---------------------------------------------------------------------------
const TOTAL_VEHICLES = 220;
// Sri Lanka style plates: e.g. "WP ABC-1234" / "CP QK-4567".
const plateProvincePrefix = [
  "WP",
  "CP",
  "SP",
  "NP",
  "EP",
  "NW",
  "NC",
  "UP",
  "SG",
];
const plateLetters = "ABCDEFGHJKLMNPQRSTUVWXYZ";

function platePart(len) {
  let s = "";
  for (let i = 0; i < len; i++) s += plateLetters[randInt(0, plateLetters.length - 1)];
  return s;
}

const vehicles = [];
const usedPlates = new Set();
const usedDevices = new Set();

for (let i = 0; i < TOTAL_VEHICLES; i++) {
  const station = stations[i % stations.length];

  let registration_number;
  do {
    registration_number = `${pick(plateProvincePrefix)} ${platePart(3)}-${randInt(1000, 9999)}`;
  } while (usedPlates.has(registration_number));
  usedPlates.add(registration_number);

  let device_id;
  do {
    device_id = `GPS-${String(randInt(100000, 999999))}`;
  } while (usedDevices.has(device_id));
  usedDevices.add(device_id);

  vehicles.push({
    id: i + 1,
    registration_number,
    device_id,
    station_id: station.id,
    _lat: station._lat,
    _lng: station._lng,
  });
}

// ---------------------------------------------------------------------------
// 5. Pings — at least 7 days of pings per vehicle.
//    We emit a few pings per day per vehicle (simulated patrol route around
//    the home station) so the dataset stays large but manageable.
// ---------------------------------------------------------------------------
const DAYS = 7;
const PINGS_PER_DAY = 6; // 6 pings/day * 7 days = 42 pings per vehicle.
const pings = [];
let pingId = 1;

// Anchor the 7 days ending "now" (generation date).
const endTime = new Date("2026-06-21T18:00:00.000Z").getTime();
const dayMs = 24 * 60 * 60 * 1000;
const startTime = endTime - DAYS * dayMs;

for (const v of vehicles) {
  // Each vehicle wanders on a small random walk around its station.
  let lat = v._lat;
  let lng = v._lng;

  for (let d = 0; d < DAYS; d++) {
    for (let p = 0; p < PINGS_PER_DAY; p++) {
      // Spread pings across the day with a little jitter.
      const slot = (d * PINGS_PER_DAY + p);
      const totalSlots = DAYS * PINGS_PER_DAY;
      const baseTs = startTime + Math.floor((slot / totalSlots) * (DAYS * dayMs));
      const ts = baseTs + randInt(0, 90 * 60 * 1000); // up to 90 min jitter

      // Random walk, kept within a realistic patrol radius (~5km).
      lat += (rand() - 0.5) * 0.01;
      lng += (rand() - 0.5) * 0.01;
      lat = Math.max(v._lat - 0.05, Math.min(v._lat + 0.05, lat));
      lng = Math.max(v._lng - 0.05, Math.min(v._lng + 0.05, lng));

      pings.push({
        id: pingId++,
        vehicle_id: v.id,
        latitude: round(lat),
        longitude: round(lng),
        timestamp: new Date(ts).toISOString(),
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Strip internal helper fields (those prefixed with "_") before output.
// ---------------------------------------------------------------------------
function clean(arr) {
  return arr.map((o) => {
    const c = {};
    for (const k of Object.keys(o)) if (!k.startsWith("_")) c[k] = o[k];
    return c;
  });
}

const data = {
  provinces: clean(provinces),
  districts: clean(districts),
  stations: clean(stations),
  vehicles: clean(vehicles),
  pings: clean(pings),
};

// ---------------------------------------------------------------------------
// Integrity self-check — fail loudly if any foreign key is orphaned.
// ---------------------------------------------------------------------------
function assertFk(childArr, fkField, parentArr, label) {
  const ids = new Set(parentArr.map((p) => p.id));
  for (const row of childArr) {
    if (!ids.has(row[fkField])) {
      throw new Error(`Orphaned ${label}: ${fkField}=${row[fkField]} not found`);
    }
  }
}
assertFk(data.districts, "province_id", data.provinces, "district.province_id");
assertFk(data.stations, "district_id", data.districts, "station.district_id");
assertFk(data.vehicles, "station_id", data.stations, "vehicle.station_id");
assertFk(data.pings, "vehicle_id", data.vehicles, "ping.vehicle_id");

fs.writeFileSync("seed.json", JSON.stringify(data, null, 2));

console.log("seed.json written");
console.log({
  provinces: data.provinces.length,
  districts: data.districts.length,
  stations: data.stations.length,
  vehicles: data.vehicles.length,
  pings: data.pings.length,
});
