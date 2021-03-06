/**
 * Permettre la gestion du menu pour le tri des média. Attention au notion d'acessibilité.
 */
let orderButton = document.getElementById("order_button");
let orderDropDiv = document.querySelector(".order-drop");
let orderList = document.querySelector(".order_list");
/**
 * Ajout d'un listener sur le bouton de tri lorsque la souris "rentre" pour définir l'attribut "aria-expanded" a true
 * afficher la liste, et ajouter le listener sur celle ci
 */
orderDropDiv.addEventListener("mouseenter", ()=>{
  orderButton.setAttribute("aria-expanded", true);
  orderList.style.display = "block";
  addOrderListListener();
});
/**
 * Ajout du listener lorsque la souris quitte la zone du bouton tri. Défnir l'attribut "aria-expanded" a false
 */
orderDropDiv.addEventListener("mouseleave", (ev)=>{
  orderButton.setAttribute("aria-expanded", false);
  orderList.style.display = "none";
  removeOrderListListener(ev);
});
/**
 * Ajout du listener en cas de clic => Focus du 1er élément. A noter : ce listener est déclancher lors de la navigation par tabulation
 */
orderButton.addEventListener("click", ()=>{
  orderList.style.display = "block";
  orderList.querySelector("a").focus();
  addOrderListListener();
});

/**
 * Listener pour effacer l'affichage de la liste
 * @param {event} ev 
 */
const clickListenerOrderList = (ev)=>{
  orderList.style.display = "none";
  removeOrderListListener(ev);
};

/**
 * Listener sur la fenetre global pour effacer la liste dans le cas ou l'on a tabuler, puis repris la souris et cliquer en dehors de la liste de tri
 * @param {event} ev 
 */
window.onclick = (ev)=>{
  if(!ev.target.id.match("order_button") && orderList.style.display == "block" ){
    clickListenerOrderList(ev);
  }
};
/**
 * Ajout d'un listener sur chaque élément de la liste de tri (pour la navigation au clavier principalement)
 */
const addOrderListListener = ()=>{
  let orderListLink = orderList.querySelectorAll("a");
  orderListLink.forEach(el => el.addEventListener("click", clickListenerOrderList ));
  orderListLink[orderListLink.length-1].addEventListener("blur", clickListenerOrderList); 
};
/**
 * Suppresion des listener lorsque la liste s'efface afin de ne pas créé de problèmes
 * @param {event} e 
 */
const removeOrderListListener = (e)=>{
  let orderListLink = orderList.querySelectorAll("a");
  orderListLink.forEach(el => el.removeEventListener("click", clickListenerOrderList ));
  orderListLink[orderListLink.length-1].removeEventListener("blur", clickListenerOrderList);
  /**
   * Si l'evenement provient d'un blur, cad dans le cas présent, on tabule après le dernier element de la liste de tri, et on sort du menu de tri => on défni le focus sur le bouton tri
   */
  if(e.type === "blur") orderButton.focus();
};
/**
 * Faire le tri des éléments de la gallerie selon le hash indiqué en barre d'adresse. Switch sur la fonction approprié
 * @param {string} hash 
 * @param {object} virtualJSON 
 */
function orderBy(hash, virtualJSON){
  switch(hash){
  default: case "#Popularity": orderByPopularity(virtualJSON); document.querySelector("#order_button_text").textContent = "Popularité"; break;
  case "#Date": orderByDate(virtualJSON); document.querySelector("#order_button_text").textContent = "Date"; break;
  case "#Title": orderByTitle(virtualJSON); document.querySelector("#order_button_text").textContent = "Titre"; break;
  }
} 
/**
 * Faire le tri sur la liste de média "json" selon le critère "popularité"
 * @param {object} json 
 */
function orderByPopularity(json){
  json.media.sort((a, b)=>{
    return a.likes>b.likes? -1 : 1;
  });
  setOrder(json);
}
/**
 * Faire le tri sur la liste de média "json" selon le critère "date"
 * @param {object} json 
 */
function orderByDate(json){
  json.media.sort((a, b)=>{
    return a.formatedDate > b.formatedDate? -1 : 1;
  });
  setOrder(json);
}
/**
 * Faire le tri sur la liste de média "json" selon le critère "Titre"
 * @param {object} json 
 */
function orderByTitle(json){
  json.media.sort((a, b)=>{
    return a.title.toLowerCase() > b.title.toLowerCase()?1:-1;
  });
  setOrder(json);
}
/**
 * Définir l'ordre de chaque élément de la gallerie grâce a sa balise "order", ainsi que sa balise "tabindex"
 * @param {object} json 
 */
function setOrder(json){
  let gallery = document.querySelectorAll(".gallery_frame");
  let OrderArr = json.media.map(el => el.id);
  gallery.forEach(el =>{
    let nbTab = OrderArr.indexOf(parseInt(el.getAttribute("data-id")));
    el.style.order = nbTab;
    el.querySelector("a").tabIndex =   nbTab*2 + 20;
    el.querySelector("button").tabIndex =  nbTab*2 + 21;
  });
}

