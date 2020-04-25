const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const morgan = require( 'morgan' );
const uuid = require("uuid");
const app = express();
const jsonParser = bodyParser.json();

app.use( morgan( 'dev' ) );
const authenticate = require("./middleware/authenticate");
app.use(authenticate);
//define the structure of bookmarks
let posts = require("./data");
//get all bookmarks
app.get( '/api/bookmarks', ( req, res ) => {
    console.log( "Getting all bookmarks." );
    return res.status( 200 ).json( posts );
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
    let results = [];
    for (let i of posts){
        if(i.title === title){
            results.push(i);
        }
    }
    if(!results.length){
        res.statusMessage = "Title not found";
        return res.status(404).end();
    }
    res.status(200).json( results ); 
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
    const newPost = {
        id: uuid.v4(),
        title: title,
        description: description,
        url: url,
        rating: rating
    }
    posts.push(newPost);
    return res.status( 201 ).json(newPost);
});
//delete posts by id
app.delete( '/api/bookmark/:id', ( req, res ) => {
    let id = req.params.id;
    let itemToRemove = posts.findIndex(post => {
        if(post.id === id){
            return true;
        }
    });
    if( itemToRemove < 0 ){
        res.statusMessage = "That 'id' was not found in the list of posts.";
        return res.status( 404 ).end();
    }
    posts.splice( itemToRemove, 1 );
    return res.status( 200 ).json({});
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
    let post = posts.find(x => {
        if(x.id === id){
            return x;
        }
    });
    if(!bookmark){
        res.statusMessage = "No bookmark for ID requested";
        return res.status( 404 ).end();
    }
    if(title){
        post.title = title;
    }
    if(description){
        post.description = description;
    }
    if(url){
        post.url = url;
    }
    if(rating){
        post.rating = Number(rating);
    }
    res.status( 202 ).json(post);
});
app.listen(3000);
// Base URL : http://localhost:8080/
// GET endpoint : http://localhost:3000/api/bookmarks
// GET endpoint : http://localhost:3000/api/bookmark?title=value
// POST endpoint : http://localhost:3000/api/bookmarks and send in raw JSON the post
// DELETE endpoint : http://localhost:3000/api/bookmark/:id 
// PATCH endpoint: http://localhost:3000/api/bookmark/:id 