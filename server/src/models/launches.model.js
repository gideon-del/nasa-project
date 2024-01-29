const axios = require("axios");
const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");
const DEFEAULT_FLIGH_NUMBER = 100;
const SPACEX_API_UTL = "https://api.spacexdata.com/v4/launches/query";
async function populateLaunches() {
  const response = await axios.post(SPACEX_API_UTL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
  if (response.status !== 200) {
    console.log("Problem Download Launch Data");
    throw new Error("Launch data download failed");
  }
  await response.data.docs.map(async (launch) => {
    const newLaunch = {
      flightNumber: launch["flight_number"],
      mission: launch["name"],
      rocket: launch["rocket"]["name"],
      launchDate: launch["date_local"],
      upcoming: launch["upcoming"],
      success: launch["success"],
      customers: launch["payloads"].flatMap((payload) => payload["customers"]),
    };
    await saveLaunch(newLaunch);
  });
  console.log("Launches Loaded");
}
async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("Launch data already loaded");
    return;
  }
  console.log("Downloading from spaceXAPI");
  //TODO : populate launches data
  await populateLaunches();
}
// launches.set(launch.flightNumber, launch);
async function getAllLaunches(skip, limit) {
  return await launchesDatabase
    .find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    )
    .sort({
      flightNumber: 1,
    })
    .skip(skip)
    .limit(limit);
}
async function saveLaunch(launch) {
  await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}
async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Zero to Mastery", "Nasa"],
    flightNumber: newFlightNumber,
  });
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("No Match planet found");
  }
  await saveLaunch(newLaunch);
}
// async function addNewLaunch(launch) {}
async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return DEFEAULT_FLIGH_NUMBER;
  }
  return latestLaunch.flightNumber;
}
async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}
async function exitsLaunchWithId(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}
async function abortLaunch(id) {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: id,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount === 1;
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  exitsLaunchWithId,
  abortLaunch,
  loadLaunchData,
};
