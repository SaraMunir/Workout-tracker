//Mongo Connection
const mongoose = require("mongoose");

//====models==========
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;

const workOutSchema = new Schema({
            type: String,
            name: String,
            duration: Number,
            weight: Number,
            reps: Number,
            sets: Number,
            distance: Number,
            date: { type: Date, default: Date.now },
            completed: { type: Boolean, default: false },
            updated_at: { type: Date, default: Date.now }
    })
const WorkOut = mongoose.model("WorkOut", workOutSchema);

const workOutDaySchema = new Schema({
    date: { type: Date, default: Date.now },
    workouts: [{ type: Schema.Types.ObjectId, ref: "WorkOut" }]
})
const WorkOutDay = mongoose.model("WorkOutDay", workOutDaySchema);
//======
async function createWorkout( myPost ){
    let workOutDay;
    const currentDay = new Date();
    // workOutDay = await WorkOutDay.create( { date: currentDay} );
    // const workOutDayId = workOutDay._id;
    let workoutType = myPost.type;
    if (workoutType === "resistance"){
        const myResult = await WorkOut.create( { 
                type: myPost.type,
                name: myPost.name,
                duration: myPost.duration,
                weight: myPost.weight,
                reps:  myPost.reps,
                sets: myPost.sets
        } );
        console.log( 'in orm created workout is ', myResult)
        // const wrkOutId = myResult._id;
        // dbResult = await WorkOutDay.update({ date: currentDay}, { $push: { workouts: wrkOutId } });
        // dbResult = await WorkOutDay.find({ date: currentDay});
        // console.log(`current day data is :`, dbResult)

        return myResult;

    } else if (workoutType === "cardio") {
        const myResult = await WorkOut.create( { 
            type: myPost.type,
            name: myPost.name,
            distance: myPost.distance,
            duration: myPost.duration
        } );
        console.log( 'in orm created workout is ', myResult)
        return myResult;
    }
}

async function listWorkOuts(){
    const myList =  await WorkOut.find({ completed: false})
    console.log('my list in orm is : ', myList);
    return myList;
}
async function listCompletedWorkOuts(){
    const myList =  await WorkOut.find({ completed: true})
    console.log('my completed last workout in orm is : ', myList);
    return myList;
}
async function lastWorkOut(){
    const myLastWrkOutDay =  await WorkOut.find({ completed: true, }).sort({ _id: -1 }).limit(1)
    const lastDate= myLastWrkOutDay[0].date
    console.log('my last workout date in orm is : ', lastDate);
    // console.log('my completed last workout in orm is : ', myLastWrkOut);
    
    const myLastWrkOuts =  await WorkOut.find({ date: lastDate});

    return myLastWrkOuts;
}

// completeWorkout
async function completeWorkout( workOtId, date ){

    const myResult = await WorkOut.update({_id: workOtId},
        { $set:{    completed: true,
                    date: date
        } })
    console.log(myResult);
    return myResult;
}

module.exports = { 
    createWorkout,
    listWorkOuts,
    completeWorkout,
    listCompletedWorkOuts,
    lastWorkOut
}