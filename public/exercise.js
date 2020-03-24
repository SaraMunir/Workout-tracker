const workoutTypeSelect = document.querySelector("#type");
const cardioForm = document.querySelector(".cardio-form");
const resistanceForm = document.querySelector(".resistance-form");
const cardioNameInput = document.querySelector("#cardio-name");
const nameInput = document.querySelector("#name");
const weightInput = document.querySelector("#weight");
const setsInput = document.querySelector("#sets");
const repsInput = document.querySelector("#reps");
const durationInput = document.querySelector("#duration");
const resistanceDurationInput = document.querySelector("#resistance-duration");
const distanceInput = document.querySelector("#distance");
const completeButton = document.querySelector("button.complete");
const addButton = document.querySelector("button.add-another");
const toast = document.querySelector("#toast");
const newWorkout = document.querySelector(".new-workout")


$(document).ready( async function(){


  printWorkOuts();

})


let workoutType = null;
let shouldNavigateAway = false;

// async function initExercise() {
//   let workout;

//   if (location.search.split("=")[1] === undefined) {
//     // workout = await API.createWorkout()
//     console.log(workout)
//   }
//   if (workout) {
//     location.search = "?id=" + workout._id;
//   }

// }

// initExercise();

function handleWorkoutTypeChange(event) {
  workoutType = event.target.value;

  if (workoutType === "cardio") {
    cardioForm.classList.remove("d-none");
    resistanceForm.classList.add("d-none");
  } else if (workoutType === "resistance") {
    resistanceForm.classList.remove("d-none");
    cardioForm.classList.add("d-none");
  } else {
    cardioForm.classList.add("d-none");
    resistanceForm.classList.add("d-none");
  }

  validateInputs();
}

function validateInputs() {
  let isValid = true;

  if (workoutType === "resistance") {
    if (nameInput.value.trim() === "") {
      isValid = false;
    }

    if (weightInput.value.trim() === "") {
      isValid = false;
    }

    if (setsInput.value.trim() === "") {
      isValid = false;
    }

    if (repsInput.value.trim() === "") {
      isValid = false;
    }

    if (resistanceDurationInput.value.trim() === "") {
      isValid = false;
    }
  } else if (workoutType === "cardio") {
    if (cardioNameInput.value.trim() === "") {
      isValid = false;
    }

    if (durationInput.value.trim() === "") {
      isValid = false;
    }

    if (distanceInput.value.trim() === "") {
      isValid = false;
    }
  }

  if (isValid) {
    completeButton.removeAttribute("disabled");
    addButton.removeAttribute("disabled");
  } else {
    completeButton.setAttribute("disabled", true);
    addButton.setAttribute("disabled", true);
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();

  let workoutData = {};

  if (workoutType === "cardio") {
    workoutData.type = "cardio";
    workoutData.name = cardioNameInput.value.trim();
    workoutData.distance = Number(distanceInput.value.trim());
    workoutData.duration = Number(durationInput.value.trim());
  } else if (workoutType === "resistance") {
    workoutData.type = "resistance";
    workoutData.name = nameInput.value.trim();
    workoutData.weight = Number(weightInput.value.trim());
    workoutData.sets = Number(setsInput.value.trim());
    workoutData.reps = Number(repsInput.value.trim());
    workoutData.duration = Number(resistanceDurationInput.value.trim());
  }
  console.log('workoutData created is : ', workoutData);

  // await API.addExercise(workoutData);
  // await API.createWorkout(workoutData);
  apiResult = await $.post( '/api/postWorkouts', workoutData);
  printWorkOuts();
  clearInputs();
  cardioForm.classList.add("d-none");
  resistanceForm.classList.add("d-none");
  toast.classList.add("success");

}
async function printWorkOuts(){

  const myWorkOutList = await $.get( '/api/workouts');
  console.log('myWorkOutList is : ', myWorkOutList)

  $('#appendWorkOutList').html('');

  
  myWorkOutList.forEach( function( workout ){

    const currentDay = new Date()
    console.log(currentDay);
    const today= moment(currentDay).format('dddd');
    console.log(today);

    
    $('#currentDay').html(`${today} Workout`)
    if (workout.type === "resistance"){
      $('#appendWorkOutList').append( `
    <h2>Your Exercise  to be completed List</h2>
    <div class="card-type">
      <div class="workout-type flexingComponents">
        <h4 class="bordered-label">Exercise Type: ${workout.type}</h4>
      </div>
      <div class="flexingComponents exerciseL">
        <h4 class="bordered-label">Exercise Name: ${workout.name}</h4>
      </div>
      <div class="flexingComponents weightL">
        <h4 class="bordered-label">Weight (lbs):</h4>
        <div class="bordered">${workout.weight}</div>
      </div>
      <div class="flexingComponents setsL">
        <h4 class="bordered-label">Sets:</h4>
        <div class="bordered">${workout.sets}</div>
      </div>
      <div class="flexingComponents repsL">
        <h4 class="bordered-label">Reps:</h4>
        <div class="bordered">${workout.reps}</div>
      </div>
      <div class="flexingComponents durationL">
        <h4 class="bordered-label">Duration (minutes):</h4>
        <div class="bordered">${workout.duration}</div>
      </div>
      <div class="flexingComponents">
        <div class="huge ui blue button" onClick="completeWorkOut('${workout._id}')" style="margin: 0 auto;">
          Complete
        </div>
      </div>
    </div>
      `)
    }
    else if (workout.type === "cardio"){
      $('#appendWorkOutList').append( `
    <h2>Your Exercise  to be completed List</h2>
    <div class="card-type">
      <div class="workout-type flexingComponents">
        <h4 class="bordered-label">Exercise Type: ${workout.type}</h4>
      </div>
      <div class="flexingComponents exerciseL">
        <h4 class="bordered-label">Exercise Name: ${workout.name}</h4>
      </div>
      <div class="flexingComponents DistanceL">
        <h4 class="bordered-label">Distance (miles):</h4>
        <div class="bordered">${workout.distance}</div>
      </div>
      <div class="flexingComponents DurationL">
        <h4 class="bordered-label">Duration (minutes):</h4>
        <div class="bordered">${workout.duration}</div>
      </div>
      <div class="flexingComponents">
        <div class="huge ui blue button" onClick="completeWorkOut('${workout._id}')" style="margin: 0 auto;">
          Complete
        </div>
      </div>
    </div>
      `)
    }
  })
};


function handleToastAnimationEnd() {
  toast.removeAttribute("class");
  if (shouldNavigateAway) {
    location.href = "/";
  }
}
async function completeWorkOut(workID){

  let year = new Date().getFullYear();
  let month = new Date().getMonth()+1;
  var day = new Date().getDate();
  let currentUpdateTime = `${year}-0${month}-${day}`

  console.log('currentUpdateTime', currentUpdateTime)
  const apiResult = await $.ajax({
    url: `/api/completeWorkout/${workID}/${currentUpdateTime}`,
    type: 'DELETE'
  });
  alert( apiResult.message );
  printWorkOuts();
  // location.href = '/index.html';

}

function clearInputs() {
  cardioNameInput.value = "";
  nameInput.value = "";
  setsInput.value = "";
  distanceInput.value = "";
  durationInput.value = "";
  repsInput.value = "";
  resistanceDurationInput.value = "";
  weightInput.value = "";
}

if (workoutTypeSelect) {
  workoutTypeSelect.addEventListener("change", handleWorkoutTypeChange);
}
if (completeButton) {
  completeButton.addEventListener("click", function (event) {
    shouldNavigateAway = true;
    handleFormSubmit(event);
  });
}
if (addButton) {
  addButton.addEventListener("click", handleFormSubmit);
}
toast.addEventListener("animationend", handleToastAnimationEnd);

document
  .querySelectorAll("input")
  .forEach(element => element.addEventListener("input", validateInputs));


