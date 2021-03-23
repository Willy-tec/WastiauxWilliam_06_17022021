function orderBy(hash, virtualJSON){

  switch(hash){
  default: case "#Popularity": orderByPopularity(virtualJSON); document.querySelector("#order_button_text").textContent = "Popularité"; break;
  case "#Date": orderByDate(virtualJSON); document.querySelector("#order_button_text").textContent = "Date"; break;
  case "#Title": orderByTitle(virtualJSON); document.querySelector("#order_button_text").textContent = "Titre"; break;

  }
} 

function orderByPopularity(json){

  json.media.sort((a, b)=>{
    return a.likes>b.likes? -1 : 1;
  });
  setOrder(json);
}

function orderByDate(json){
  json.media.sort((a, b)=>{
    return a.formatedDate > b.formatedDate? -1 : 1;
  });
  setOrder(json);
}
function orderByTitle(json){
  json.media.sort((a, b)=>{
    return a.title.toLowerCase() > b.title.toLowerCase()?1:-1;
  });
  setOrder(json);
}

function setOrder(json){
  let gallery = document.querySelectorAll(".gallery_frame");
  let OrderArr = json.media.map(el => el.id);
  gallery.forEach(el =>{
    el.style.order = OrderArr.indexOf(parseInt(el.getAttribute("data-id")));
  });
}

