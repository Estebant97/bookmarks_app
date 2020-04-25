const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const morgan = require( 'morgan' );

const app = express();
const jsonParser = bodyParser.json();

app.use( morgan( 'dev' ) );

//define the structure of 



// Base URL : http://localhost:8080/