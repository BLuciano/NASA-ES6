"use strict";

let ApiUrl = "https://images-api.nasa.gov/search?q=";
let btn = document.getElementById('search-btn');
let messages = document.getElementById("msg");
let dataWrap = document.getElementById('results');
let overlay = document.getElementById("overlay");
let nextBtn = document.getElementsByClassName('next')[0];
let prevBtn = document.getElementsByClassName('prev')[0];
let nextUrl = "";
let prevUrl = "";

overlay.addEventListener('click', (e) =>{
  overlay.style.display = "none"
})

//Calls getData on button click with user search or default value
btn.addEventListener('click', (e) => {
  let query = document.getElementById("query").value;
  if(query === "") query = "star";
  document.getElementById("query").value = "";
  btn.innerText = "searching...";
  dataWrap.innerHTML = "";
  query === "" ? getData('stars') : getData(ApiUrl + query);
});

//Listeners for previous and next button
nextBtn.addEventListener('click', (e) =>{
  btn.innerText = "searching...";
  dataWrap.innerHTML = "";
  window.scrollTo(0,0);
  getData(nextUrl);
});
prevBtn.addEventListener('click', (e) =>{
  btn.innerText = "searching...";
  dataWrap.innerHTML = "";
  window.scrollTo(0,0);
  getData(prevUrl);
});

//gets data from NASA API.
function getData(url){
  messages.innerText = "";
  prevUrl = "";
  nextUrl = "";
  prevBtn.style.display = "none";
  nextBtn.style.display = "none";

  fetch(url)
    .then(res =>{
      return res.status === 200 ? res.json() : res.status === 400 ? "400Error" : "500Error";
    })
    .then(JRes =>{
        if(JRes === "400Error"){
          messages.innerText = "Sorry! The are no results for this search.";
        }
        else if(JRes === "500Error"){
          messages.innerHTML = "Error retrieving information from the server. Please try again later."
        } else {
          displayData(JRes);
        }
    })
}

// Displays the fetched data to user if any
function displayData(JsonData){
  let data = JsonData.collection.items;
  let links = JsonData.collection.links;

  data.forEach(x =>{
    //Only displays the results with image type
    if(x.data[0].media_type === "image"){
      let {title, description : desc} = x.data[0];
      let src = x.links[0].href;
      let article = document.createElement("article");
      let articleAtt = document.createAttribute("class");
      articleAtt.value = "single-result";
      article.setAttributeNode(articleAtt);

      article.innerHTML =
        `<img src="${src}">` +
        `<h3 class="title">${title}</h3></article>`;

      article.addEventListener("click", () =>{
        overlay.innerHTML =
          `<img src="${src}">` +
          `<h3 class="title">${title}</h3></article>` +
          `<p class="desc">${desc}</p>`;

        overlay.style.display = 'block';
      });

      dataWrap.append(article);
    }
  });

  if(dataWrap.innerHTML === ""){
    messages.innerText = "Sorry! The are no results for this search.";
  } else {
    displayNavigation(links);
  }
  btn.innerText = "search";
}

function displayNavigation(links){
  if(links && links.length > 0){
    links.forEach(x =>{
      if(x.rel === "prev"){
        prevUrl = x.href;
        prevBtn.style.display = "inline-block";
      } else {
        nextUrl = x.href;
        nextBtn.style.display = "inline-block";
      }
    });
  }
}
