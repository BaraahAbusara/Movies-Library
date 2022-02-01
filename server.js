'use strict';
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const moviesDataJson = require('./Movies-data/data.json'); 

const url1 = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`
 
const PORT = process.env.PORT;

const server = express();
server.use(cors());

server.get('/', handleGet); //home 1
server.get('/favourite', handleFavPage); //fav 1
server.get('/trending', handleTrendingPage); //trending 0
server.get('/search', handleSearchPage); //search 0
server.get('*', handleErrorNotFound); //404 1
server.use(handleServerError) //500

//console.log(moviesDataJson);  Passed 

function Movies (title, poster_path, overview) {        //for JSONData
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

function MoviesAPI (id,title,release_date, poster_path, overview) {      //for APIData
    this.id=id ; 
    this.title = title;
    this.release_date=release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

//----------------------Home---------------------------------------

function handleGet(request, response) {
 
    let data = new Movies (moviesDataJson.title,  moviesDataJson.poster_path, moviesDataJson.overview);
    
    return response.status(200).json(data);
}


//---------------------------Favourites -----------------------------------------
function handleFavPage(request, response) {
    //console.log("fav");
    return response.status(200).send("Welcome to Favorite Movies Page");
}
//----------------------------Trending------------------------------------
function handleTrendingPage (request , response)
{   
    let dataAPI=[]; 
    axios.get(url1).then((result)=>{
        //console.log(result); 
        result.data.results.forEach(data =>{
        dataAPI.push(new MoviesAPI (data.id ,data.title,data.release_date, data.poster_path, data.overview ));
        });
        response.status(200).json(dataAPI);
    }).catch((errMsg)=>{
        handleServerError (errMsg); 
    });
}
//------------------------------Search-------------------------------
function handleSearchPage (request , response){
    let searchAPI = []; 
    let search = "Happiness";
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&query=${search}`;
    axios.get(url).then((result)=>{
        result.data.results.forEach(data =>{
            searchAPI.push(new MoviesAPI (data.id ,data.title,data.release_date, data.poster_path, data.overview ));
        }); 
        response.status(200).json(searchAPI);
    }).catch((errMsg)=>{
        handleServerError (errMsg); 
    });
    //console.log("Search");


}
//-------------------------------Error--------------------------------------

function handleErrorNotFound (request,response){
     response.status(404).send("Sorry! This page is not found");
    
}

function handleServerError (Error,request,response){                      //How to call it ? 
  //  response.status(500).send(`Sorry! Error ${Error} Happened`);
    console.log("500");
}

server.listen(PORT,()=>{
    console.log(`listining to port ${PORT}`)

// server.listen(3000, ()=>{
//     console.log("listinig to port 3000");
});
