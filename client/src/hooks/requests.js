const API_URL = "http://localhost:8000/v1";
console.log("v2");
async function httpGetPlanets() {
  // TODO: Once API is ready.
  // Load planets and return as JSON.
  const response = await fetch(`${API_URL}/planets`);
  return await response.json();
}

async function httpGetLaunches() {
  console.log(API_URL);
  const response = await fetch(`${API_URL}/launches`);
  const fetachedLaunches = await response.json();
  return fetachedLaunches.sort((a, b) => a?.flightNumber - b?.flightNumber);
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
}

async function httpSubmitLaunch(launch) {
  try {
    const response = await fetch(`${API_URL}/launches`, {
      method: "POST",
      body: JSON.stringify(launch),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
    // TODO: Once API is ready.
    // Submit given launch data to launch system.
  } catch (error) {
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  try {
    // TODO: Once API is ready.
    // Delete launch with given ID.
    const response = await fetch(`${API_URL}/launches/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
