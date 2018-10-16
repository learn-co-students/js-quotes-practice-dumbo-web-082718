document.addEventListener('DOMContentLoaded', () => {
  const quoteList = document.querySelector('#quote-list');
  const form = document.querySelector('#new-quote-form')
  form.addEventListener('submit', (e) => handleSubmit(e))
  fetch('http://localhost:3000/quotes')
    .then(res => res.json())
    .then(json => json.forEach(quote => showSingleQuote(quote)));

  function handleSubmit(e) {
    e.preventDefault()
    createNewQuote(e.target.quote.value, e.target.author.value)
    e.target.quote.value = ''
    e.target.author.value = ''
  }

  function createNewQuote(quote, author) {
    let data = {quote, author}
    fetch('http://localhost:3000/quotes', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(res => res.json())
      .then(json => showSingleQuote(json))
  }

  function deleteQuote(e) {
    fetch(`http://localhost:3000/quotes/${e.target.value}`, {
      method: "DELETE",
      headers: {
         "Content-Type": "application/json"
      }
    })
    e.target.parentNode.parentNode.remove()
  }

  function likeQuote(e) {
    let likeAmount = parseInt(e.target.lastChild.innerText)
    fetch(`http://localhost:3000/quotes/${e.target.value}`, {
      method: "PATCH",
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify({likes: ++likeAmount})
    })
    e.target.lastChild.innerText = likeAmount
  }

  function showSingleQuote(quote) {
    const li = document.createElement('li');
    li.id = `quote-${quote.id}`
    li.className = 'quote-card';

    const blockquote = document.createElement('blockquote');
    blockquote.className = 'blockquote';

    const p = document.createElement('p');
    p.className = 'mb-0'
    p.id = `quote-quote-${quote.id}`
    p.innerText = quote.quote;

    const footer = document.createElement('footer')
    footer.className = 'blockquote-footer';
    footer.id = `quote-author-${quote.id}`
    footer.innerText = quote.author;
    footer.innerHTML += `<br>`

    const like = document.createElement('button')
    like.className = 'btn btn-success';
    like.value = quote.id
    like.innerHTML = `Likes: <span>${quote.likes ? quote.likes : 0}</span>`
    like.addEventListener('click', (e) => likeQuote(e));

    const editButton = document.createElement('button');
    editButton.className = 'btn btn-info';
    editButton.innerText = 'Edit'
    editButton.value = quote.id;
    editButton.addEventListener('click', () => {
      editForm.hidden ? editForm.hidden = false : editForm.hidden = true
    });

    const editForm = document.createElement('form');
    editForm.value = quote.id
    editForm.innerHTML = `
        <div class="form-group">
          <label for="new-quote">Edit Quote</label>
          <input type="text" class="form-control" name="quote" id="edit-quote-${quote.id}" value="${quote.quote}">
        </div>
        <div class="form-group">
          <label for="Author">Author</label>
          <input type="text" class="form-control" name="author" id="edit-author-${quote.author}" value="${quote.author}">
        </div>
        <button type="submit" class="btn btn-primary">Submit Changes</button>
        `;
    editForm.addEventListener('submit', (e) => editQuote(e))
    editForm.hidden = true

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger';
    deleteButton.innerText = 'Delete'
    deleteButton.value = quote.id;
    deleteButton.addEventListener('click', (e) => deleteQuote(e))

    blockquote.append(p, footer, like, editButton, deleteButton, editForm)
    li.append(blockquote)
    quoteList.append(li)
  }

  function editQuote(e) {
    e.preventDefault(e);
    let data = {quote: e.target.quote.value, author: e.target.author.value}
    fetch(`http://localhost:3000/quotes/${e.target.value}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
         "Content-Type": "application/json"
      }
    })
      .then(() => {
        document.querySelector(`#quote-quote-${e.target.value}`).innerText = e.target.quote.value
        document.querySelector(`#quote-author-${e.target.value}`).innerText = e.target.author.value
      })
    e.target.hidden = true;
  }
});
