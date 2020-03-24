init();

async function init() {
  if (location.search.split("=")[1] === undefined) {
    // const workout = await API.getLastWorkout();
    const workout = await $.get( '/api/lastworkouts');
    const workout2 = await $.get( '/api/uncompletedworkouts');
    console.log('my last workout is ',workout)

    if (workout2) {
      location.search = "?id=" + workout2._id;
    } else {
      document.querySelector("#continue-btn").classList.add("d-none")
    }
  }
}

