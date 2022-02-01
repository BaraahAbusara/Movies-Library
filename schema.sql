DROP TABLE IF EXISTS Movie;
CREATE TABLE IF NOT EXISTS Movie (
    id  SERIAL PRIMARY KEY ,
    title VARCHAR (225),
    release_date DATE (225),
    poster_path IMAGE (225),
    overview TEXT (4000)
);
