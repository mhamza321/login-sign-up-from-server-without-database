//const express = require('express') // older way (es5 format). it does not work in module js.
import express from 'express'  // es6 format
import cors from 'cors' // install it as - npm install cors
import { nanoid } from 'nanoid' // instal it as - npm instal nanoid

const app = express() // for decrypting the data
app.use(express.json());  //  for parsing json data
app.use(cors());

const port = process.env.PORT || 3000  // for deploying on heroku, it is mandatory

// users array for now. later on we will store data in database
let usersBase = [];   // TODO: Replace this with MongoDb

//console.log( nanoid() );

app.post('/signup', (req, res) => {
    let body = req.body;
    // validation
    if(!body.name || !body.email || !body.password || !body.city){
        res.status(400).send(`All fields are required.`);
        return;
    }

    let isFound = false;

    for(let i = 0; i < usersBase.length; i++){
        if(usersBase[i].email === body.email.toLowerCase()){
            isFound = true;
            break;
        }
    }

    if(isFound){ // this email already exists.
        res.status(400).send(
            {
                message:`${body.email} already exists`
            }
            );
            return;
    }

    let newUser = {
        userId: nanoid(),
        name: body.name,
        email: body.email.toLowerCase(),
        password: body.password,
        city: body.city
    }

    usersBase.push(newUser);
    res.status(200).send({message:"Your account has been created successfully."});

})

// login user
app.post('/signin', (req, res) => {
    let body=req.body;
    if(!body.email || !body.password){
        res.status(400).send(
            {message: "Email and password are required."}
        );
        return;
    }

    let isFound = false;

    for(let i = 0; i < usersBase.length; i++){
        if(usersBase[i].email === body.email){
            isFound = true;
            if(usersBase[i].password === body.password){// correct password
                res.status(200).send(
                    {
                        name:usersBase[i].name,
                        email:usersBase[i].email,
                        city:usersBase[i].city,
                        message:"Login Successful"
                    }
                );
                return;

            }else{  // incorrect password
                res.status(401).send(
                    {
                        message: "Incorrect password"
                    }
                );
                return;
            }
        }
        
    }

    if(!isFound){
        res.status(404).send(
            {
                message:"User not found"
            }
        );
        return;
    }
})







// ********** By defualt code **********
app.get('/', (req, res) => {
  console.log("Aik request server per i.")
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})