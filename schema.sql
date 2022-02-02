DROP TABLE IF EXISTS Movie;
CREATE TABLE IF NOT EXISTS Movie (
    id  SERIAL PRIMARY KEY ,
    title VARCHAR (225),
    release_date VARCHAR (225),
    poster_path VARCHAR (225),
    overview VARCHAR (4000)
);
