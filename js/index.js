const BASE_URL = "http://localhost:3000"
const BOOKS_URL = `${BASE_URL}/books`
const USERS_URL = `${BASE_URL}/users`
const BOOKS_USERS_URL =  `${BASE_URL}/books_users`

const bookList = document.querySelector('ul#list');
const bookShowPanel = document.querySelector('div#show-panel');
const bookDiv = document.createElement('div');
bookDiv.id = 'displayed-book';
const title = document.createElement('h2');
title.id = 'book-title';
const image = document.createElement('img');
image.id = 'book-image';
const description = document.createElement('p');
description.id = 'book-description';
bookShowPanel.appendChild(bookDiv);
bookDiv.appendChild(title);
bookDiv.appendChild(image);
bookDiv.appendChild(description);

const readerList = document.createElement('ul');
bookDiv.appendChild(readerList);

const userDropdown = document.createElement('select');
userDropdown.id = 'user-dropdown';
userDropdown.setAttribute('hidden',true);
bookDiv.appendChild(userDropdown);

const button = document.createElement('button');
button.innerText = 'Mark Read';
button.setAttribute('hidden',true);
bookDiv.appendChild(button);








document.addEventListener("DOMContentLoaded", function() {
    getBooks();
    getUsers();

});


function getBooks(){
    fetch(BOOKS_URL)
    .then(resp => resp.json())
    .then(resp => {
        resp.data.forEach(book => {
            buildBookListItem(book);
        });
    })
    .catch(error => {
        console.log(error.message);
    });
};

function buildBookListItem(book){
    let listItem = document.createElement('li');
    listItem.innerText = book.attributes.title;
    listItem.dataset.id = book.id;
    listItem.className = 'book';
    bookList.appendChild(listItem);
    listItem.addEventListener('click',() => {
        getBook(book.id);
    });
};

function getBook(bookId){
    let book_url = BOOKS_URL + `/${bookId}`;
    fetch(book_url)
    .then(resp => resp.json())
    .then(resp => {
        displayBookinShowPanel(resp.data.attributes,resp.data.id);
    })
    .catch(error => {
        console.log(error.message);
    });
};

function displayBookinShowPanel(book,bookId){
    bookDiv.dataset.id = bookId;
    title.innerText = book.title;
    image.src = book.image_url;
    description.innerText = book.description;
    button.removeAttribute('hidden');
    userDropdown.removeAttribute('hidden');
    getBooksUsers(bookId);


}

function getUsers(){
    fetch(USERS_URL)
    .then(resp => resp.json())
    .then(resp => {
        buildUserDropdown(resp.data);
    })
    .catch(error => {
        console.log(error.message);
    });
}


function buildUserDropdown(users){
    users.forEach(user => {
        let userOption = document.createElement('option');
        userOption.setAttribute('value',`${user.attributes.username}`);
        userOption.innerText = user.attributes.username;
        userOption.dataset.id = user.id
        userDropdown.appendChild(userOption); 
        
    });

    
    button.addEventListener('click',() => {
        let selectedUser = userDropdown.options[userDropdown.selectedIndex].getAttribute('data-id');
        let selectedBook = bookDiv.getAttribute('data-id');

        markUserAsHavingReadBook(selectedUser,selectedBook);
        getBooksUsers(selectedBook);

    });
}



function markUserAsHavingReadBook(user_id,book_id){

    let bookUserConfigurationObject = {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json'
        },
        body: JSON.stringify({user_id,book_id})
    };


    fetch(BOOKS_USERS_URL,bookUserConfigurationObject)
    .then(resp => resp.json())
    .then(resp => {
        console.log(resp);
    })
    .catch(error => {
        console.log(error.message);
    });
}

function getBooksUsers(book_id){
    readerList.innerHTML = '';
    fetch(BOOKS_USERS_URL)
    .then(resp => resp.json())
    .then(resp => {
        resp.data.forEach(record => {
            if(record.attributes.book.id == book_id){
                let readerListItem = document.createElement('li');
                readerListItem.innerText = record.attributes.user.username;
                readerList.appendChild(readerListItem);
            }
        })

        console.log('test');
    })
    .catch(error => {
        console.log(error.message);
    });
}