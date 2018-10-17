// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener("DOMContentLoaded",init)
  function init(){
    const form = document.querySelector("#new-quote-form")
    form.addEventListener("submit", handleSubmit)
    getQuotes()
  }

  function handleSubmit(event){
    event.preventDefault()
    const quote = event.target[0].value
    const author = event.target[1].value
    event.target[0].value = ""
    event.target[1].value = ""
    const data = {
      quote: quote,
      author: author,
      likes: 1
    }
    postQuote(data).then(res=>res.json()).then((quote)=>showQuote(quote))
  }

  function postQuote(data){
    const options = {
      method: "POST",
      body:JSON.stringify(data),
      headers:{
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }
    return fetch('http://localhost:3000/quotes',options)
  }

  function getQuotes(){
    fetch('http://localhost:3000/quotes')
    .then(res=>res.json())
    .then(quotes=>quotes.forEach((quote)=>showQuote(quote)))
  }

  function showQuote(quote){
    const quoteList = document.querySelector("#quote-list")
    const li = document.createElement("li")
    li.className = 'quote-card'
    li.id = `quote-${quote.id}`
    li.innerHTML =
    `<blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success' data-id=${quote.id} data-likes=${quote.likes}>Likes: <span>${quote.likes}</span></button>
    <button class='btn-danger' data-id=${quote.id}>Delete</button>
    </blockquote>`
    li.addEventListener("click", handleClick)
    quoteList.append(li)
  }

  function handleClick(event){
    // event.preventDefault()
    const id = event.target.dataset.id
    if (event.target.className==='btn-danger'){
      deleteQuote(id)
      document.querySelector(`#quote-${id}`).remove()

    }
    if (event.target.className==='btn-success'){
      const id = event.target.dataset.id
      const likes = parseInt(event.target.dataset.likes)+1
      event.target.dataset.likes = likes
      event.target.querySelector('span').innerText = likes
      updateLikes(id, likes).then(res => res.json()).then(console.log)
    }
  }

  function updateLikes(id, likes){
    console.log(id, likes)
    const options = {
      method: "PATCH",
      body:JSON.stringify({likes:likes}),
      headers:{
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }
    return fetch(`http://localhost:3000/quotes/${id}`,options)
  }

  function deleteQuote(id){
    const options = {
      method: "DELETE",
      headers:{
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }
    return fetch(`http://localhost:3000/quotes/${id}`,options)
  }
