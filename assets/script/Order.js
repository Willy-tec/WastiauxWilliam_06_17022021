let orderButton = document.getElementById("order_button");
let orderDropDiv = document.querySelector(".order-drop");
let orderList = document.querySelector(".order_list");

orderDropDiv.addEventListener("mouseenter", ()=>{
  orderButton.setAttribute("aria-expanded", true);
  orderList.style.display = "block";
  addOrderListListener();
});

orderDropDiv.addEventListener("mouseleave", (ev)=>{
  orderButton.setAttribute("aria-expanded", false);
  orderList.style.display = "none";
  removeOrderListListener(ev);
});

orderButton.addEventListener("click", ()=>{
  orderList.style.display = "block";
  orderList.querySelector("a").focus();
  addOrderListListener();
});


const clickListenerOrderList = (ev)=>{
  orderList.style.display = "none";
  removeOrderListListener(ev);
};

window.onclick = (ev)=>{
  if(!ev.target.id.match("order_button") && orderList.style.display == "block" ){
    clickListenerOrderList(ev);
  }
};

const addOrderListListener = ()=>{
  let orderListLink = orderList.querySelectorAll("a");
  orderListLink.forEach(el => el.addEventListener("click", clickListenerOrderList ));
  orderListLink[orderListLink.length-1].addEventListener("blur", clickListenerOrderList); 
};

const removeOrderListListener = (e)=>{
  let orderListLink = orderList.querySelectorAll("a");
  orderListLink.forEach(el => el.removeEventListener("click", clickListenerOrderList ));
  orderListLink[orderListLink.length-1].removeEventListener("blur", clickListenerOrderList);
  if(e.type === "blur") orderButton.focus();
  //if(e.type === "")
  //console.log(e);
};

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
    let nbTab = OrderArr.indexOf(parseInt(el.getAttribute("data-id")));
    el.style.order = nbTab;
    //el.tabIndex = -1;
    el.querySelector("a").tabIndex =   nbTab*2 + 20;
    el.querySelector("button").tabIndex =  nbTab*2 + 21;
  });
}

