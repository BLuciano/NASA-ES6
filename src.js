"use strict";

let url = "https://images-api.nasa.gov/search?q=";
let btn = document.getElementById('search-btn');
let messages = document.getElementById("msg");
let dataWrap = document.getElementById('results');

//Calls getData on button click with user search or default value
btn.addEventListener('click', (e) => {
  let query = document.getElementById("query").value;
  document.getElementById("query").value = "";
  btn.innerText = "searching...";
  dataWrap.innerHTML = "";
  query === "" ? getData('stars') : getData(query);
});

//gets data from NASA API.
function getData(val){
  messages.innerText = "";

  fetch(url + val)
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
  let results = "";

  data.forEach(x =>{
    //Only displays the results with image type
    if(x.data[0].media_type === "image"){
      let {title, description : desc} = x.data[0];
      let src = x.links[0].href;
      results += "<article class='single-result'>";
      results += `<img src="${src}">`;
      results += `<h3 class='title'>${title}</h3></article>`;
      //results += `<p class='desc'>${desc}</p></article>`;
    }
  });

  if(results === ""){
    messages.innerText = "Sorry! The are no results for this search.";
  } else {
    dataWrap.innerHTML = results;
  }
  btn.innerText = "search";
}
