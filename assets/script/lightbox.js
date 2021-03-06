/**
 * listener invoquer lors du clic sur les images de la gallerie permettant d'afficher la lightbox
 * @param {event} evt 
 */
function frameClickListener(evt){

  let node = evt.target;
  while(node.className!="gallery_frame") node = node.parentNode;

  document.querySelector(".lightbox").style.display = "flex";
  setImgToPrint(node.style.order);

  window.addEventListener("keydown", keyListener);

  document.documentElement.style.overflowY = "hidden";
}

/**
 * Définir l'image que l'on affiche, et désactiver l'affichage des images restantes
 * @param {number} index 
 */
function setImgToPrint(index){
  let lightGallery = document.querySelectorAll(".lightbox_frame_principal_media");
  let mediaId = virtualJSON.media[index].id;
  lightGallery.forEach(el => {
    if(el.dataset.id == mediaId) el.style.display = "block";
    else el.style.display = "none";
  });
}
/**
 * Listener invoqué lors de la fermeture de la lightbox
 */
function closeEventListener(){
  document.querySelector(".lightbox").style.display = "none";
  window.removeEventListener("keydown", keyListener);
  document.documentElement.style.overflowY = "auto";
  document.querySelector("a").focus();
}
/**
 * Définir la cible de la précédente image dans la lightbox
 */
function clickLeftLightBox (){
  let find = findIndex();
  find.index -=1;
  if(find.index<0) find.index = find.max;
  setImgToPrint(find.index);
}
/**
 * Définir la cible de la précédente image dans la lightbox
 */
function clickRightLightBox(){
  let find = findIndex();
  find.index +=1;
  if(find.index>find.max) find.index = 0;
  setImgToPrint(find.index);
}
/**
 * Définir et renvoyer un objet contenant l'index de l'image actuellement affiché par la lightbox, le maximum que l'index peut atteindre, et l'identifiant du media concerné
 * @returns {object} 
 */
function findIndex(){
  let lightbox = document.querySelectorAll(".lightbox_frame_principal_media");
  let max = lightbox.length-1;
  let mediaId;
  let idArray = virtualJSON.media.map(el => el.id);
  lightbox.forEach(el => {
    if(el.style.display == "block") mediaId = el.dataset.id;
  });
  let index = idArray.indexOf( parseInt(mediaId,10));
  return {index, max, mediaId};
}

let index=0;
/**
 * Definir l'element a cibler lors de la tabulation. Si c'est une vidéo, permettre le focus sur le contenu de la vidéo.
 * @param {event} e 
 */
function setFocus(e){
  let node,
    array = [],
    dom = document.querySelector("#lightbox");
  /**
   * Bloquer le comportement par défaut des touches
   */
  e.preventDefault();
  /**
   * Trouver l'index, et vérifier si le contenu est une vidéo
   */
  let find = findIndex();
  let vidNode = virtualJSON.media.find(el => el.id == find.mediaId);
  /**
   * Faire un tableau contenant les inputs que l'on peut tabuler
   */
  array.push(dom.querySelector(".lightbox_frame_left_arrow").parentNode);
  if(vidNode.video) array.push(dom.querySelector(`[data-id="${find.mediaId}"] video`));
  array.push(dom.querySelector(".lightbox_frame_right_arrow").parentNode);
  array.push(dom.querySelector(".lightbox_frame_right_cross").parentNode);
  /**
   * Ne surtout pas dépasser la valeur maximale de l'index => Remise a zéro.
   */
  if(index>array.length-1) index = 0;
  /**
   * Définir le focus sur la cible approprié, puis incrémenté l'index
   */
  node = array[index];
  node.focus();
  index++;
  /**
   * Pour chaque élément, effacer la classe "focus"
   */
  array.forEach(el=>{
    if(el.classList.contains("focus"))el.classList.remove("focus");
  });
  /**
   * Ajouter la classe focus sur l'element cibler
   */
  node.classList.add("focus");
}

/**
 * Listener invoqué lors de l'appuie sur une touche. Gère l'affichage grâce au fleche du clavier, la tabulation, et la touche échappe
 * @param {event} e 
 */
function keyListener(e){
  switch(e.key){
  case "ArrowLeft": clickLeftLightBox(); break;
  case "ArrowRight": clickRightLightBox(); break;
  case "Escape": closeEventListener(); break;
  case "Tab": setFocus(e); break;
  default : break;
  }
}
