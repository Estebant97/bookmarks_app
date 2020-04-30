const mongoose = require('mongoose');
const uuid = require("uuid");

const bookmarksSchema = mongoose.Schema({
    _id: { 
        type: String, 
        default: uuid.v4,
        required: true
    },
    title : {
        type : String,
        required : true
    }, 
    description: {
        type : String,
        required : true
    },
    url : {
        type : String,
        required : true
    }, 
    rating : {
        type : Number,
        required : true
    }
});

const bookmarksCollection = mongoose.model( 'bookmarks', bookmarksSchema );
const Bookmarks = {
    // POST
    createBookmark : function( newBookmark ){
        return bookmarksCollection
                .create( newBookmark )
                .then( createdBookmark => {
                    return createdBookmark;
                })
                .catch( err => {
                    return err;
                });
    }, 
    // GET
    getAllBookmarks : function() {
        return bookmarksCollection
                .find()
                .then( allBookmarks =>{
                    return allBookmarks;
                })
                .catch( err => {
                    return err;
                });
    },
    //GET By title
    getByTitle : function(findTitle){
        return bookmarksCollection
                .find({"title": findTitle})
                .then( bookmarks => {
                    return bookmarks;
                })
                .catch( err => {
                    return err;
                });
    },
    // Delete by id
    delById : function(findId){
        return bookmarksCollection
                .findOneAndRemove({"_id" : findId})
                .then( bookmark => {
                    return bookmark;
                })
                .catch( err => {
                    return err;
                });
    }, 
    // patch by id
    patchById : function(findId, pTitle,pDescription, pUrl, pRating ){
        return bookmarksCollection
                .findByIdAndUpdate({"_id": findId}, {"title": pTitle, "description": pDescription, "url" : pUrl, "rating":pRating})
                .then( bookmarkUpdate => {
                    return bookmarkUpdate;
                })
                .catch(err => {
                    return err;
                })
    }
}
module.exports = { Bookmarks };