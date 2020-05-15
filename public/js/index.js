//import { response } from "express";

const API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';

const bookmarkCard = ({ _id, title, description, url, rating }) => `
  <div class="bookmarkCard">
    <h3>${title}</h3>
    <small>${_id}</small>
    <p>${description}</p>
    <p>${rating}</p>
    <a href="${url}" target="_blank" rel="noopener">Go to page!</a>
  </div>
`

//function get by id
function getBookmarkByTitle(title){
    let url = `/api/bookmark?title=${title}`
    let settings = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        }
    }
    let results = document.querySelector('.results');

    fetch(url, settings)
        .then( response => {
            if(response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            results.innerHTML = "";
            if(responseJSON == ''){
                results.innerHTML = `<div> No existe ningun bookmark con ese titulo </div>`;
            }
            responseJSON.forEach( bookmark => {
              results.innerHTML += bookmarkCard(bookmark)
            } )

            // for(let i = 0; i < responseJSON.length; i++){
            //     results.innerHTML += `<div> ${responseJSON[i]._id} </div> <div> ${responseJSON[i].title} </div> <div> ${responseJSON[i].description} </div> <div> ${responseJSON[i].url} </div>`;
            // }
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });

    
}
//function for updating a bookmark

function updateBookmark(id, title, description, url, rating){
    let path = `/api/bookmark/${id}`;

    let data = {
        //si no jala poner _id
        id: id,
        title: title,
        description: description,
        url: url,
        rating: Number(rating)
    }

    let settings = {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body : JSON.stringify( data )
    }
    let results = document.querySelector('.results');
    fetch(path, settings)
        .then( response => {
            if(response.ok){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            if(responseJSON == ''){
                results.innerHTML = `<div> No existe ningun bookmark con ese id </div>`;
            }
            fetchBookmarks();
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

//function for deleting bookmarks
function deleteBookmark(id){
    let url = `/api/bookmark/${id}`;

    let settings = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        }
    }

    return fetch(url, settings)
}
//function for adding bookmarks
function addBookmark(title, description, url, rating){
    let path = '/api/bookmarks';

    let data = {
        //si no jala poner _id
        title: title,
        description: description,
        url: url,
        rating: Number(rating)
    }

    let settings = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector('.results');

    fetch(path, settings)
        .then( response => {
            if(response.ok){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            fetchBookmarks();
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });

}
// function to get all students on load
function fetchBookmarks(){
    let url = '/api/bookmarks';

    let settings = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        }
    }

    let results = document.querySelector('.results');

    fetch(url, settings)
        .then( response => {
            if(response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            results.innerHTML = "";

            responseJSON.forEach( bookmark => {
              results.innerHTML += bookmarkCard(bookmark)
            } )
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

// POST 
function watchAddBookmarkForm(){
    let bookmarkForm = document.querySelector('.add-bookmark-form');

    bookmarkForm.addEventListener( 'submit', (event) => {
        event.preventDefault();
        // function for adding a student
        let title = document.getElementById('add-bookmarkTitle').value;
        let description = document.getElementById('add-bookmarkDescription').value;
        let url = document.getElementById('add-bookmarkUrl').value;
        let rating = document.getElementById('add-bookmarkRating').value;

        addBookmark(title, description, url, rating);
        bookmarkForm.reset();
    })
}
//DELETE watch
//delete-bookmark-form
function watchDelBookmarkForm(){
    let bookmarkForm = document.querySelector('.delete-bookmark-form');

    bookmarkForm.addEventListener( 'submit', (event) => {
        event.preventDefault();
        //function for deleting a bookmark by id
        let id = document.getElementById('delete-bookmarkId').value;
        deleteBookmark(id).then( response => {
            if(response.ok){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            if(responseJSON == ''){
                results.innerHTML = `<div> No existe ningun bookmark con ese titulo </div>`;
            } else {
                fetchBookmarks();
            }
            bookmarkForm.reset()
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
    })
}

//PATCH 
// update-bookmark-form

function watchUpdateBookmarkForm(){
    let bookmarkForm = document.querySelector('.update-bookmark-form');

    bookmarkForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let id = document.getElementById('update-bookmarkId').value;
        let title = document.getElementById('update-bookmarkTitle').value;
        let description = document.getElementById('update-bookmarkDescription').value;
        let url = document.getElementById('update-bookmarkUrl').value;
        let rating = document.getElementById('update-bookmarkRating').value;
        updateBookmark(id, title, description, url, rating);
        bookmarkForm.reset();
    })

}

//GET BY Title
// gbtitle-bookmark-form

function watchGetBookmarkForm(){
    let bookmarkForm = document.querySelector('.gbtitle-bookmark-form');

    bookmarkForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let title = document.getElementById('gbtitle-bookmarkTitle').value;
        getBookmarkByTitle(title);
        bookmarkForm.reset();
    })
}


function init(){
    //get all students on load
    fetchBookmarks();
    watchAddBookmarkForm();
    watchDelBookmarkForm();
    watchUpdateBookmarkForm();
    watchGetBookmarkForm();
}

init();
