let content = $('.content');
let post = $('.content__post');
let postInp = $('.post-inp');
let postBtn = $('.post-btn');
let list = $('.newPosts');
let image = $('.add__modal-inp')

let editItemId = null;
let pageCount = 1;
let page = 1;
let searchText = '';

let likes = 0
let thisPostLike

$('.search').on('input', function(e){
    searchText = e.target.value;
    page = 1;
    render()
})



//ROBIT ++++++++++++++++++++  LIKES 
$('body').on('click', '.btn-like', function(event){
    thisPostLike = event.target.parentNode.id;
    let likesCount = event.target.id
    console.log(likesCount)
    likesCount++
    let obj1 = {
        likes: likesCount
    }
    fetch(`http://localhost:8000/posts/${thisPostLike}`, {
        method: "PATCH",
        body: JSON.stringify(obj1),
        headers: {
            "Content-type": 'application/json'
        }
    })
        .then(() =>  render())
})

postBtn.on('click', function(){
    if (!postInp.val().trim()) {
        alert('Заполните поле')
        return 
    }
    let newPost = {
        post: postInp.val(),
        likes: 0,
        image: image.val()
    }
    postNewPost(newPost)
    postInp.val('')
})

function postNewPost(newPost) {
    fetch('http://localhost:8000/posts', {
        method: 'POST',
        body: JSON.stringify(newPost),
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
        .then(() => render())
}
    
async function render() {
    let res = await fetch(`http://localhost:8000/posts?_page=${page}&_limit=3&q=${searchText}`)
    let data = await res.json()
    list.html('')
    getPagination()
    data.forEach(item => {
        list.append(`
        <div class = "dynamic-div">
            <li class="dynamic_post" id=${item.id} style="color: white;">
                ${item.post} <br><br>
                <div class="dynamic-img"><img src="${item.image}"/></div>
                <br><br>
                <button style="margin-right: 10px" id="${item.likes}" class="btn-dynamic btn-like">Like</button><span style="color: white; font-size" class="likes">${item.likes}</span>
                <button class="btn-dynamic btn-comment">Comment</button>
                <button  class="btn-dynamic btn-delete">Delete</button>
                <button  class="btn-dynamic btn-edit">Edit</button>
            </li>
        </div>
        `)
    });
}

// ROBIT ++++++++++++++++++++ BTN DELETE
$('body').on('click', '.btn-delete', function (event) {
    let id = event.target.parentNode.id
    fetch(`http://localhost:8000/posts/${id}`, {
        method: 'DELETE'
    })
        .then(() => render())
})


// ROBIT ++++++++++++++++++++ BTN EDIT
$('body').on('click', '.btn-edit', function(event){
    editItemId = event.target.parentNode.id;
    
    fetch(`http://localhost:8000/posts/${editItemId}`)
        .then(res => res.json())
        .then(data => {
            $('.modal-inp').val(data.post);
            $('.modal-url').val(data.image)
            $('.modal__block').css('display', 'block');
        })
})

// ROBIT ++++++++++++++++++++  SAVE EDIT
$('#modal-save').on('click', function(e){
    let obj = {
        post: $('.modal-inp').val(),
        image: $('.modal-url').val()
    }
    fetch(`http://localhost:8000/posts/${editItemId}`, {
        method: "PUT",
        body: JSON.stringify(obj),
        headers: {
            "Content-type": 'application/json'
        }
    })
        .then(() => {
            render()
            $('.modal__block').css('display', 'none');
        })
})


// ROBIT ++++++++++++++++++++  EXTI EDIT
$('.modal_exit').on('click', function(){
    $('.modal__block').css('display', 'none')
})

function getPagination(){
    fetch(`http://localhost:8000/posts?q=${searchText}`)
        .then(res => res.json())
        .then(data => {
            pageCount = Math.ceil(data.length / 3)
            $('.pagination-page').remove();
            for(let i = pageCount; i >= 1; i--){
                $('.previous-btn').after(`
                    <span class="pagination-page">
                        <a href="#">${i}</a>
                    </span>
                `)
            }
        })
}

$('.next-btn').on('click', function(){
    if(page >= pageCount) return
    page++;
    render()
})

$('.previous-btn').on('click', function(){
    if(page <= 1) return
    page--;
    render()
})

$('body').on('click', '.pagination-page', function(e){
    page = e.target.innerText;
    render()
})

render()



// ADDING IMG ROBIT +++++++++
$('.post-btn_img').on('click', function(event){
    let id2 = event.target.parentNode.id
    // $('#nameModal').val('')
    $('.add__modal-block').css('display', 'block')
})

$('#add__modal-save').on('click', function(){
    $('.add__modal-block').css('display', 'none')
})
$('.modal_close-btn').on('click', function(){
    $('.add__modal-block').css('display', 'none')
})

