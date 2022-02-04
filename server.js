'use strict';
//comment 
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pg = require('pg');
const moviesDataJson = require('./Movies-data/data.json'); 
const client = new pg.Client(process.env.DATABASE_URL);
// const client = new pg.Client({
//     connectionString: process.env.DATABASE_URL,
//     ssl: { rejectUnauthorized: false } 
// });

const url1 = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`;
 
const PORT = process.env.PORT;


const server = express();
server.use(cors());
server.use(express.json());

server.get('/', handleGet); //home 1
server.get('/favourite', handleFavPage); //fav 
//----------------------------------------------------
server.get('/trending', handleTrendingPage); //trending 
server.get('/search', handleSearchPage); //search ::  localhost:3000/search?searchedMovie=women
//-------------------------------------------------------------
server.get('/movie/top_rated',hendelTopRatedMovies);
server.get('/movie/upcoming',hendelUpComingMovies);
//-----------------------------------------------------
server.post('/addMovie',handelAddMovie);// add movie 
server.use('/getMovies',handelGetMovies) ;// get movie 
//--------------------------------------------------------------
server.put ('/update/:id',handelUpdateMovie);
server.delete('/delete/:id',handelDeleteMovie);
server.get('/getMovie/:id',handelGetMovieId);
//-------------------------------------------------------------
server.get('*', handleErrorNotFound); //404 
//server.use(handleServerError) //500



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
//-----------------------Home---------------------------------------

function handleGet(request, response) {
 
    let data = new Movies (moviesDataJson.title,  moviesDataJson.poster_path, moviesDataJson.overview);
    
     response.status(200).json(data);
}
//---------------------------Favourites -----------------------------------------
function handleFavPage(request, response) {
   
     response.status(200).send("Welcome to Favorite Movies Page");
}
//----------------------------Trending------------------------------------
function handleTrendingPage (request , response)
{   
    let dataAPI=[]; 
    axios.get(url1).then((result)=>{
        result.data.results.forEach(data =>{
        dataAPI.push(new MoviesAPI (data.id ,data.title,data.release_date, data.poster_path, data.overview ));
        });
        response.status(200).json(dataAPI);
    }).catch((errMsg)=>{
        handleServerError (errMsg,request,response); 
    });
}
//------------------------------Search-------------------------------
function handleSearchPage (request , response){
    let searchedMovie=request.query.searchedMovie;
    let searchAPI = []; 
   //let search = "Happiness";
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&query=${searchedMovie}`;
    axios.get(url).then((result)=>{
        result.data.results.forEach(data =>{
            searchAPI.push(new MoviesAPI (data.id ,data.title,data.release_date, data.poster_path, data.overview ));
        }); 
        response.status(200).json(searchAPI);
    }).catch((errMsg)=>{
        handleServerError (errMsg,request,response); 
    });

}
//---------------------------------------------------------------------------
function hendelTopRatedMovies (request,response)
{
    let dataTopRatedMovies=[];
    let url2 = `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.APIKEY}&language=en-US&page=1`;
    axios.get(url2).then((result)=>{
        result.data.results.forEach(data =>{
            dataTopRatedMovies.push(new MoviesAPI (data.id ,data.title,data.release_date, data.poster_path, data.overview ));
        });
        response.status(200).json(dataTopRatedMovies);
    }).catch((errMsg)=>{
        handleServerError (errMsg,request,response); 
    });
}
function hendelUpComingMovies (request,response)
{
    let dataUpComingMovies=[];
    let url3 = `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.APIKEY}&language=en-US&page=1`;
    axios.get(url3).then((result)=>{
        result.data.results.forEach(data =>{
            dataUpComingMovies.push(new MoviesAPI (data.id ,data.title,data.release_date, data.poster_path, data.overview ));
        });
        response.status(200).json(dataUpComingMovies);
    }).catch((errMsg)=>{
        handleServerError (errMsg,request,response); 
    });
}


 
//-------------------------------Task13----------------------------------
function handelAddMovie(request , response)
{
    const movie = request.body; 
    let sql= `INSERT INTO movieTable (title,release_date, poster_path, overview,comment)VALUES($1,$2,$3,$4,$5) RETURNING *;`;
    
    let values = [movie.title,movie.release_date,movie.poster_path,movie.overview,movie.comment]; 
    client.query(sql,values).then(data=>{response.status(200).json(data.rows)}).catch(error=>{
        console.log(error);
        handleServerError(error,request,response);
    });
}

function handelGetMovies (request,response)
{
    let sql='SELECT * FROM movieTable;';
    client.query(sql).then(data=>{
    response.status(200).json(data.rows)
    }).catch(error=>{
        handleServerError(error,request,response);
    });
}
// ------------------------------Task14-------------------------------------

function handelUpdateMovie (request,response)           //update movie comments by id  
{
    const id = request.params.id;
    const movie = request.body; 
    const sql = `UPDATE movieTable 
    SET title=$1,release_date=$2, poster_path=$3, overview=$4,comment=$5
    WHERE id = $6 RETURNING *;`;
    let values = [movie.title,movie.release_date,movie.poster_path,movie.overview,movie.comment,id]; 
    client.query (sql,values).then(data=>{
        response.status(200).json(data.rows);
    }).catch(error=>{
        console.log(error);
        handleServerError(error,request,response);
    });

}

function handelDeleteMovie(request,response)        //Delete movie by id  
{
    const id = request.params.id;

    const sql = `DELETE FROM movieTable WHERE id=${id};`; 
    client.query(sql).then(()=>{
        response.status(200).json("Movie has been deleted");
    }).catch(error=>{
        handleServerError(error,request,response);
    });
}

function handelGetMovieId (request,response)        //get movie by id 
{
    const id = request.params.id;

    const sql = `SELECT * FROM movieTable WHERE id=$1;`;
    const values = [id]; 
    client.query(sql,values).then(data=>{
        response.status(200).json(data.rows)
        }).catch(error=>{
            
            handleServerError(error,request,response);
        });

}

//-------------------------------Errors--------------------------------------

function handleErrorNotFound (request,response){
    const error = {
    //    status : 404,
        message : "Sorry! This page is not found"
    };
     response.status(404).send(error);
    
}

function handleServerError (Error,request,response){                      
    const error = {
        status : 500,
        message : Error
    };
    console.log(response); 
    response.status(500).send(error);
}

client.connect().then(()=>{
    server.listen(PORT,()=>{
    console.log(`listining to port ${PORT}`)
    });
});


// server.listen(PORT,()=>{
//     console.log(`listining to port ${PORT}`)
// });
// server.listen(3000, ()=>{
//     console.log("listinig to port 3000");
