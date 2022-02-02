DROP TABLE IF EXISTS movieTable;
CREATE TABLE IF NOT EXISTS movieTable (
    id  SERIAL PRIMARY KEY ,
    title VARCHAR (225),
    release_date VARCHAR (225),
    poster_path VARCHAR (225),
    overview VARCHAR (4000),
    comment VARCHAR (4000)
);
