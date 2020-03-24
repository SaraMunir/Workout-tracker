init();

async function init() {
  if (location.search.split("=")[1] === undefined) {
    // const workout = await API.getLastWorkout();
    const workout = await $.get( '/api/lastworkouts');
    console.log('my last workout is ',workout)

    if (workout) {
      location.search = "?id=" + workout._id;
    } else {
      document.querySelector("#continue-btn").classList.add("d-none")
    }
  }
}

