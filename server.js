// globals
const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const morgan = require( 'morgan' );
const uuid = require("uuid");
const mongoose = require( 'mongoose' );
const jsonParser = bodyParser.json();
const { Bookmarks } = require('./models/bookmarkModel');
const authenticate = require("./middleware/authenticate");
const cors = require( './middleware/cors' );
const {DATABASE_URL, PORT} = require( './config' );
// use
const app = express();
app.use( cors );
app.use( express.static( "public" ) );
app.use( morgan( 'dev' ) );
app.use(authenticate);
//define the structure of bookmarks
let posts = require("./data");
//get all bookmarks
app.get( '/api/bookmarks', ( req, res ) => {
    console.log( "Getting all bookmarks." );
    Bookmarks
        .getAllBookmarks()
        .then( result => {
            return res.status( 200 ).json( result );
        })
        .catch( err => {
            res.statusMessage = "Something is wrong with the Database. Try again later.";
            return res.status( 500 ).end();
        })
});
//get bookmarks by title
app.get( '/api/bookmark', ( req, res ) => {
    console.log( "Getting a student by title using the integrated param." );
    console.log( req.params );
    let title = req.query.title;
    if(!title){
        res.statusMessage = "Title not sent as param";
        return res.status(406).end();
    }
    Bookmarks
        .getByTitle(title)
        .then( result => {
            return res.status( 200 ).json( result );
        })
        .catch( err => {
            res.statusMessage = "Title not found.";
            return res.status( 404 ).end();
        });
});
//post new bookmark
app.post( '/api/bookmarks', jsonParser, ( req, res ) => {
    console.log( "Adding a new bookmark to the list." );
    console.log( "Body ", req.body );
    const {title, description, url, rating} = req.body;
    if(!title || !description || !url || !rating){
        res.statusMessage = "Fields missing in body";
        res.status( 406 ).end();
    }
    let newBookmark = {title, description, url, rating};

    Bookmarks
        .createBookmark( newBookmark )
        .then( result => {
            if( result.errmsg ){
                res.statusMessage = "cannot post";
                return res.status( 409 ).end();
            }
                return res.status( 201 ).json( result ); 
        })
        .catch( err => {
            res.statusMessage = "Something is wrong with the Database. Try again later.";
            return res.status( 500 ).end();
        });
    });
//delete posts by id
app.delete( '/api/bookmark/:id', ( req, res ) => {
    let id = req.params.id;
    Bookmarks
        .delById( id )
        .then( result => {
            if( result.errmsg ){
                res.statusMessage = "That 'id' was not found in the list of posts.";
                return res.status( 404 ).end();
            }
                return res.status( 201 ).json( result ); 
        })
        .catch( err => {
            res.statusMessage = "Something is wrong with the Database. Try again later.";
            return res.status( 500 ).end();
        });
});
//patch posts
app.patch('/api/bookmark/:id', jsonParser, (req, res) => {
    const {id,title,description,url,rating} = req.body;
    const psid = req.params.id;
    if(!id){
        res.statusMessage = "ID is not sent in request";
        return res.status( 406 ).end();
    }
    if(id !== psid){
        res.statusMessage = "Request ID doesnt match ID";
        return res.status( 409 ).end();
    }
    Bookmarks
        .patchById(psid, title, description, url, rating)
        .then( result => {
            if( result.errmsg ){
                res.statusMessage = "No bookmark for ID requested";
                return res.status( 404 ).end();
            }
                return res.status( 202 ).json( result ); 
        })
        .catch( err => {
            res.statusMessage = "Something is wrong with the Database. Try again later.";
            return res.status( 500 ).end();
        });
});
app.listen( PORT, () => {
    console.log( "This server is running on port 8080" );

    new Promise( ( resolve, reject ) => {

        const settings = {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true
        };
        mongoose.connect( DATABASE_URL, settings, ( err ) => {
            if( err ){
                return reject( err );
            }
            else{
                console.log( "Database connected successfully." );
                return resolve();
            }
        })
    })
    .catch( err => {
        console.log( err );
    });
});
// Base URL : http://localhost:8080/
// GET endpoint : http://localhost:8080/api/bookmarks
// GET endpoint : http://localhost:8080/api/bookmark?title=value
// POST endpoint : http://localhost:8080/api/bookmarks and send in raw JSON the post
// DELETE endpoint : http://localhost:8080/api/bookmark/id 
// PATCH endpoint: http://localhost:8080/api/bookmark/id 