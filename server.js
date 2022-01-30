'use strict';
const express = require('express');
const cors = require('cors');
const moviesDataJson = require('./Movies-data/data.json'); 

const server = express();
server.use(cors());

server.get('/', handleGet);
server.get('/favourite', handleFavPage);
server.get('*', handleErrorNotFound);

//console.log(moviesDataJson);  Passed 



function Movies (title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

//----------------------Home---------------------------------------

function handleGet(request, response) {
    //console.log("home");

    let data = new Movies (moviesDataJson.title,  moviesDataJson.poster_path, moviesDataJson.overview);
    
    return response.status(200).json(data);
}

//---------------------------Favourites -----------------------------------------
function handleFavPage(request, response) {
    //console.log("fav");
    return response.status(200).send("Welcome to Favorite Movies Page");
}
//-------------------------------Error--------------------------------------

function handleErrorNotFound (request,response){
    return response.status(404).send("Sorry! This page is not found");
}

function handleServerError (request,response){                      //How to call it ? 
    return response.status(500).send("Sorry! Server Error.");
}


server.listen(3000, ()=>{
    console.log("listinig to port 3000");
})
