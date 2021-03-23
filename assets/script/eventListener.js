//////////////////////////////////////////////////////////
// Affichage et fermeture de la modale.
// On place un listener sur le bouton contact, on l'enleve quand on ferme la modale.
let closeModalButton = document.querySelector(".modal_dialog_crossButton");
let contactButton = document.querySelector(".contact_button");

contactButton.addEventListener("click", () => {
  document.querySelector("div.modal_bg").style.display = "block";
  document.documentElement.style.overflowY = "hidden";
  document.addEventListener("keyup", closeModalButtonByKeyListener);
  closeModalButton.addEventListener("click", closeModalButtonListener);
 // setTabIndexForModal();
});

function closeModalButtonByKeyListener(e) {
  if (e.key == "Escape") {
    closeModalButtonListener();
  }
}

function closeModalButtonListener() {
  let modalNode = document.querySelector("div.modal_bg");
  modalNode.style.display = "none";
  document.documentElement.style.overflowY = "auto";
 // resetTabIndex();
  closeModalButton.removeEventListener("click", closeModalButtonListener);
}

function imgClickListener(evt) {
  evt.preventDefault();
  evt.stopPropagation();
  console.log(evt);
  let balise = evt.target;
  while (balise.className != "gallery_frame") balise = balise.parentNode;
  console.log(balise);
  openLightBox();
}



console.log("allo");


function openLightBox() {

  let lightBox = document.getElementById("lightbox");
  setImgLightBox();
  lightBox.style.display = "flex";

  let leftButton = lightBox.querySelector(".lightbox_frame_left_arrow");

  leftButton.focus(); // Petit "hack" a cause d'un manquement lors de l'affichage de la lightbox.
  leftButton.blur();


  /*  leftButton.addEventListener("click", clickLeftLightBox);
  rightButton.addEventListener("click", clickRightLightBox);
  crossButton.addEventListener("click", closeEventListener) */

  document.addEventListener("keyup", keyListener);
  document.querySelector("html").style.overflowY = "hidden"; // cacher la barre de défilement quand on ouvre la lightbox

  //removeTabIndexForGallery();
}

//Fonction pour séléctionner l'image qu'on affiche: On lui attribue display: block, sinon les autres a "none"
function setImgLightBox() {
  let lightBox = document.getElementById("lightbox");
  let nodeLightBox = lightBox.querySelector(".lightbox_frame_principal");
  let nodeList = nodeLightBox.querySelectorAll(".lightbox_frame_principal_media");
  for (let i = 0; i < nodeList.length; i++) {
    if (i != data.position) nodeList[i].style.display = "none";
    else nodeList[i].style.display = "block";
  }
}


const keyListener = function (e) {
  e.preventDefault();
  switch (e.key) {
  case "ArrowLeft":
    clickLeftLightBox();
    break;
  case "ArrowRight":
    clickRightLightBox();
    break;
  case "Escape":
    closeEventListener();
    break;
  case " ":
    togglePlayMedia();
    break;
  case "Backspace":
    resetMediaPos();
    break;
  default:
    break;
  }

};

// listener pour le click sur les boutons droit et gauche de la lightbox
function clickLeftLightBox() {
  let maxVal = data.galleryArray.length - 1;
  let indice = data.orderPositionArray[data.position];
  indice = indice - 1;
  if (indice < 0) indice = maxVal;
  data.position = data.orderPositionArray.indexOf(indice);
  document.querySelector(".lightbox_frame_left_arrow").focus();
  setImgLightBox();
}

function clickRightLightBox() {

  let maxVal = data.galleryArray.length - 1;
  let indice = data.orderPositionArray[data.position];
  indice = indice + 1;
  if (indice > maxVal) indice = 0;
  data.position = data.orderPositionArray.indexOf(indice);

  document.querySelector(".lightbox_frame_right_arrow").focus();
  setImgLightBox();
}

// Listener pour la lightbox
const closeEventListener = function () {
  let lightBox = document.getElementById("lightbox");
  let crossButton = lightBox.querySelector(".lightbox_frame_right_cross");
  let leftButton = lightBox.querySelector(".lightbox_frame_left_arrow");
  let rightButton = lightBox.querySelector(".lightbox_frame_right_arrow");
  lightBox.style.display = "none";
  crossButton.removeEventListener("click", this);
  rightButton.removeEventListener("click", clickRightLightBox);
  leftButton.removeEventListener("click", clickLeftLightBox);
  document.removeEventListener("keyup", keyListener);
  document.querySelector("html").style.overflowY = "auto";
  resetTabIndex();
};