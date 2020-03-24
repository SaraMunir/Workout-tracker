const express = require("express");

const PORT = process.env.PORT || 3000;

const orm = require( './orm' );

const app = express();


app.use( express.static('public') );
app.use( express.urlencoded({ extended: false }) );

app.post( '/api/postWorkouts', async function( req, res ){
    // console.log( `[POST api/registration] recieved: `, req.body );
    console.log('in the server file received req.body is : ', req.body);
    await orm.createWorkout( req.body );

    res.send( { message: `Thank you, saved workout ${req.body.name}` } );
} );

app.get( '/api/workouts', async function( req, res ){
    const myWorkOutList = await orm.listWorkOuts();
    res.send(myWorkOutList);
});
app.get( '/api/completedWorkouts', async function( req, res ){
    const myCompletedWorkOutList = await orm.listCompletedWorkOuts();
    res.send(myCompletedWorkOutList);
});

app.delete( `/api/completeWorkout/:id/:time`, async function( req, res ){
    console.log( `[DELETE api/completeWorkout] id=${req.params.id}` );
    await orm.completeWorkout( req.params.id , req.params.time  );

    res.send( { message: `Thank you, completed #${req.params.id} at #${req.params.time}`} );
} );



//When New WorkOut clicked => send to exercise.html file
// app.get("/exercise",  (req, res) => {
//     const readExerciseFile =  fs.readFileSync('public/exercise.html','utf-8');
//     res.send(readExerciseFile);
// });
//When dashboard clicked => send to stats.html file
// app.get("/stats",  (req, res) => {
//     const readExerciseFile =  fs.readFileSync('public/stats.html','utf-8');
//     res.send(readExerciseFile);
// });
// app.post("/api/workouts", async (req, res) => {
// })



app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})