// It might be a good idea to addeve event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener("DOMContentLoaded", () => {
  const quoteUrl = "http://localhost:3000/quotes";

  const List = document.querySelector("#quote-list");
  const blockQuote = document.querySelector("#blockquote");
  const mB = document.querySelector("#mb-0");
  const blockQuoteFooter = document.querySelector("#blockquote-footer");

  const newQuote = document.querySelector("#new-quote");
  const newAuthor = document.querySelector("#author");
  const quoteForm = document.querySelector("#new-quote-form");

  fetchquote();

  function fetchquote() {
    fetch(quoteUrl)
      .then(res => res.json())
      .then(quotes => quotes.forEach(showQuotes));
  }

  function showQuotes(quote) {
    const newLi = document.createElement("li");
    let quoteLikes = quote.likes;
    let quoteId = quote.id;

    newLi.className = "quote-card";
    newLi.innerHTML = `<blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'><span>Likes:${quoteLikes}</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>`;
    const appIt = List.append(newLi);

    const btnSus = document.querySelector(".btn-success");
    btnSus.addEventListener("click", addLikes);


    function addLikes() {
      let newLike = quoteLikes + 1;
      quoteLikes = newLike;
      btnSus.innerText = `Likes:${quoteLikes} `;
      fetch(`${quoteUrl}/${quoteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          likes: quoteLikes
        })
      });
    }

    const btnDang = newLi.querySelector(".btn-danger");

    btnDang.addEventListener("click", buttonDelete);

    function buttonDelete(event) {
      event.preventDefault();
      newLi.parentNode.remove(appIt);
      removeQuote(`${quote.id}`);
    }
    function removeQuote(id) {
      fetch(`${quoteUrl}/${id}`, { method: "DELETE" });
    }
  }
  quoteForm.addEventListener("submit", addQuotes);

  function addQuotes(event) {
    event.preventDefault();
    let newQuotes = newQuote.value;
    let newAuthors = newAuthor.value;

    let data = {
      quote: newQuotes,
      author: newAuthors,
      likes: 0
    };
    fetch(quoteUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(showQuotes);
  }
});
