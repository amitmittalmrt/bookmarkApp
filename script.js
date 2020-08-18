const modal = document.getElementById('modal');
const modalShow= document.getElementById('show-modal');
const modalClose= document.getElementById('close-modal');
const bookmarkForm= document.getElementById('bookmark-form');
const websiteNameEl=document.getElementById('website-name');
const websiteUrlEl=document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

// array for the bookmarks
let bookmarks=[];

// show modal,focus on input 
function showModal(){
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}
// modal event listner
modalShow.addEventListener('click',showModal);
modalClose.addEventListener('click',()=>modal.classList.remove('show-modal'));
window.addEventListener('click',(e)=>(e.target === modal ? modal.classList.remove('show-modal') : false));

// Validate email address 
function validate (nameValue,urlValue){
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if(!nameValue || !urlValue){
        alert('please submit values for both fields');
        return false;
    }
    if (urlValue.match(regex)){
        alert('match');
    }
    if(!urlValue.match(regex)){
        alret ('please provide a valid web address');
        return false;
    }
    // valid
    return true;
}

// build bookmarks DOM
function buildBookmarks(){
    // remove all bookmark element
    bookmarksContainer.textContent='';
    // build items 
    bookmarks.forEach((bookmark)=>{
    const{name,url}=bookmark;
    // item 
    const item=document.createElement('div');
    item.classList.add('item');
    // close icon
    const closeIcon= document.createElement('i');
    closeIcon.classList.add('fas','fa-times');
    closeIcon.setAttribute('title','Delete Bookmark');
    closeIcon.setAttribute('onclick',`deleteBookmark('${url}')`)
// Favicon/link container
    const linkInfo=document.createElement('div');
    linkInfo.classList.add('name');
    // favicon
    const favicon = document.createElement('img');
    favicon.setAttribute('src',`http://s2.googleusercontent.com/s2/favicons?domian=${url}`);
    favicon.setAttribute('alt','favicon');
    // link
    const link = document.createElement('a');
    link.setAttribute('href',`${url}`);
    link.setAttribute('targer','_blank');
    link.textContent = name;
    // append to bookmarks container
    linkInfo.append(favicon,link);
    item.append(closeIcon,linkInfo);
    bookmarksContainer.appendChild(item);
    });
}


// fetch bookmarks from local storage
function fetchBookmarks(){
    // get bookmarks from local storage only if avialable
    if (localStorage.getItem('bookmarks')){
        bookmarks=JSON.parse(localStorage.getItem('bookmarks'));
    }else {
        // create bookmarks array in localStorage
        bookmarks= [
        {
            name: 'gogoume.com',
            url :'https://gogoume.com',
                },
        ];
        localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    }
    console.log(bookmarks);
    buildBookmarks();
}

// delete bookmark
function deleteBookmark(url) {
 bookmarks.forEach((bookmark,i)=>{
    if (bookmark.url=== url){
        bookmarks.splice(i,1);
    } 
 });
  // update bookmarks array in localStorage, repopulate dom
localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
fetchBookmarks();
}

// Handle data from form
function storeBookmark(e){
    e.preventDefault();
    const nameValue =websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('http://','https://')){
        urlValue= `https://${urlValue}`;
    }
    if(!validate(nameValue,urlValue)) {
        return false;
    }
    const bookmark ={
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}
// event listner 
bookmarkForm.addEventListener('submit',storeBookmark);

// on Load, fetch Bookmarks 
fetchBookmarks();