let data = {
    isDefine: false,
    array: null,                // Stocke les donné téléchargé du JSON
    galleryArray: [],           //stocke la structure de la gallerie sous forme d'objet
    galleryNodeArray: [],       //stocke la structure de la gallerie sous forme de node
    lightBoxNodeArray: [],      //stocke la structure de la lightbox sous forme d'objet
    position: 0,                // Position du "curseur" permettant de selectionner l'image a afficher dans la lightbox
    orderPositionArray: [],     // Stocke les positions de chaque élément de la gallerie, selon l'ordre de tri choisi
    artiste: {},                // Stocke l'objet representant l'artiste affiché
    folderName: "",             // stocke le repertoire de l'artiste
    totalLike: 0,               // Stocke le total de like qu'on affiche en bas a droite de la page
    order: 0,                   // 0 => popularité, 1 => date, 2 => Titre. Tri des vignettes.
    chrono: Date.now()          // variable utilisé quand on souhaite chronometré l'execution de la page.
};

let requestURL = "../script/FishEyeDataFR.json";        // adresse du fichier json
let artisteId = window.location.search.split("=")[1] // on récupère la valeur transmise en GET

/**
 * Charge les données du fichiers json, et lance la suite du chargement de la page via init()
 */

fetch(requestURL).then(function (reponse) {
    return reponse.json()
}).then(function (jsonData) {
    data.isDefine = true;
    data.array = jsonData;
    init();
  //  console.clear();
})
.catch(function (error) {
    console.log("There is an error in loading JSON file: " + error)
})

/**
 * fonction d'initialisation => execute toutes les fonctions qui dépendent du JSON pour remplir le site
 */
function init () {

    findArtiste();
    setDataGalleryArray()
    getFolderName();
    updatePriceBox();
    makeInfoBox()
    fillGallery(data.array.media);
    OrderBy(data.order, data.galleryArray);
    setLikeBox();

}
/**
 * Fonction pour trouver le bon artiste dans la liste JSON
 */
function findArtiste() {
    data.artiste = data.array.photographers.filter(elt =>elt.id == artisteId)[0]
    if(data.artiste== undefined) throw "artist non-existent or possible mistake in adress bar"
}

/**
 * fonction pour définir notre tableau de media correspondant a notre artiste
 */
function setDataGalleryArray(){
    data.galleryArray = data.array.media.filter(elt => elt.photographerId == artisteId); // Remplir la gallerie avec les éléments dont l'id correspond a notre artiste.
//  if(data.galleryArray.length==0) throw "artist got no media"
// On pourrait mettre une erreur si l'artiste ne mossède aucun media a afficher, cependant l'erreur est non bloquante, et ne casse rien sur le site.
}

/**
  * Trouve le nom du dossier et défini la variable associé dans l'objet data
 */
function getFolderName () {
    let str = data.artiste.name.split(" ")[0];
    data.folderName = str;
}

// Création du menu déroulant "Order By" ########################################
// On défini les listener qui servirons a écouter les évenements, et gerer les clicks.

let orderBox = document.getElementsByClassName("order_select")[0];
let orderButton = document.getElementById("order_button");
let orderList = document.getElementById("order_list");

orderButton.addEventListener("click", (evt) => {
    evt.stopPropagation();
    orderList.style.display = "block";
    let rect = orderButton.getBoundingClientRect()
    orderList.style.top = (rect.y + window.scrollY) + "px";
    orderList.style.left = rect.x + "px";
    document.addEventListener("click", closeOrderList);
    orderButton.setAttribute("aria-expanded", true);
})

// Ajout des listener sur les liste de selection du tri
orderList.querySelectorAll("li").forEach(elt =>{
    elt.addEventListener("click", selectOrderListener);
    elt.addEventListener("keyup", selectOrderByKey)
} );

function selectOrderByKey(e){
    if(e.key=="Enter") selectOrderListener(e)
}

function selectOrderListener(evt){
    let orderArray = ["Popularité", "Date", "Titre"];
    let orderButtonText = document.getElementById("order_button_text");
    orderButton.setAttribute("aria-expanded", false);
    console.log(evt)
    if (evt.target.nodeName == "LI") {
        orderList.style.display = "none";
        orderButtonText.innerText = evt.target.innerText;
        data.order = orderArray.indexOf(evt.target.innerText);
        if (data.isDefine) OrderBy(data.order, data.galleryArray);
    }
    document.removeEventListener("click", closeOrderList)
}

function closeOrderList(e) {
    orderList.style.display = "none";
    document.removeEventListener("click", closeOrderList)
    orderButton.setAttribute("aria-expanded", false);
}

window.onresize = function (evt) {
    let rect = orderButton.getBoundingClientRect()
    orderList.style.top = rect.y + "px";
    orderList.style.left = rect.x + "px";
}

// Fonction pour faire le tri des photo/vidéo

function OrderBy(nbOrder, tableau) {
    switch (nbOrder) {
        case 0:
            orderByPopularity(tableau)
            break;
        case 1:
            orderByDate(tableau)
            break;
        case 2:
            orderByName(tableau)
            break;
        default:
            break;
    }
}

function orderByPopularity(tab) {
    let myArray = tab.map(e => e.likes);
    let myArray2 = [...myArray];
    myArray.sort((a, b) => {
        return b - a
    });
    data.orderPositionArray = []
    myArray2.forEach(e => {
        if(data.orderPositionArray.indexOf(myArray.indexOf(e))== -1) data.orderPositionArray.push(myArray.indexOf(e));
       else {
            let x = myArray.indexOf(e)+1;
            while(data.orderPositionArray.indexOf(x)!=-1) x++;
            data.orderPositionArray.push(x)
       }
    })
    setOrder()
    setTabIndexForGallery()
}

function findIndex(b){
 return data.orderPositionArray.indexOf(b) == -1 ? b : findIndex(b+1)
}

function orderByName(tab) {
    let myArray = tab.map(e => findTitle(e.image || e.video).title)
    let myArray2 = [...myArray];
    myArray.sort()
    data.orderPositionArray = myArray2.map(e => myArray.indexOf(e))
    setOrder()
    setTabIndexForGallery()
}

function orderByDate(tab) {
    let myArray = tab.map(e => new Date(e.date));
    let myArray2 = [...myArray];
    myArray.sort((a, b) => {
        return b - a
    });
    data.orderPositionArray= []
    myArray2.forEach(e => {
       if(data.orderPositionArray.indexOf(myArray.indexOf(e))== -1) data.orderPositionArray.push(myArray.indexOf(e));
       else data.orderPositionArray.push(myArray.indexOf(e)+1);
    })
    setOrder()
    setTabIndexForGallery()
}

//Une fois que l'on a trouver l'ordre dans lequel on classe les media, on défini l'attribue order avec la bonne valeur.
function setOrder() {
    let galNode = document.querySelectorAll("div.gallery_frame");
    let i = 0;
    galNode.forEach(elt => {
        elt.style.order = data.orderPositionArray[i]
        i++;
    })
}

function setTabIndexForGallery(){
    let galNode = document.querySelectorAll("div.gallery_frame");
    let i = 0;
    let index = 0;
    galNode.forEach(elt => {
        index = 10+( data.orderPositionArray[i]*2)
        elt.querySelector("a").setAttribute("tabindex", index)
        elt.querySelector("button").setAttribute("tabindex", index+1)
        i++;
    })
}

// Fonction pour désactiver le tabindex de la gallery
function removeTabIndexForGallery(){
    let galNode = document.querySelectorAll("div.gallery_frame");
    console.log(galNode)
    galNode.forEach(elt => {
        elt.querySelector("a").setAttribute("tabindex", -1);
        elt.querySelector("button").setAttribute("tabindex", -1);
        if(elt.querySelector("video"))elt.querySelector("video").setAttribute("tabindex", -1);
    })
    document.querySelector("#order_button").setAttribute("tabindex", -1);
    document.querySelector(".contact_button").setAttribute("tabindex", -1);
    document.querySelector(".banner a").setAttribute("tabindex", -1)
}

//Fonction pour remplir les informations liée au informations de l'artiste

function makeInfoBox() {
    let infoNode = document.getElementById("contact_info");
    document.querySelector(".modal_dialog_title_name").textContent = data.artiste.name
    infoNode.querySelector(".contact_info_name").textContent = data.artiste.name
    infoNode.querySelector(".contact_info_country").textContent = data.artiste.city + ", " + data.artiste.country
    infoNode.querySelector(".contact_info_quote").textContent = data.artiste.tagline
    document.querySelector(".contact_img").src = "../image/image_vignette/ID_Photos/" + data.artiste.portrait;
    document.querySelector(".contact_img").alt = "Photo de " + data.artiste.name;
    infoNode.appendChild(makeTaglistNode(data.artiste.tags));
}

// fonction pour remplir la liste de tag dans les informations de l'artiste

function makeTaglistNode(taglist) {
    let taglistNode = document.createElement("ul");
    taglistNode.className = "contact_info_list";
    taglist.forEach(elt => {
        let liNode = document.createElement("li");
        let link = document.createElement("a");
        link.textContent = "#" + elt;
        link.href="../../?tag="+elt
        liNode.appendChild(link);
        taglistNode.appendChild(liNode);
    })
    return taglistNode;
}

// fonction pour définir le nombre de like en bas de page

function setLikeBox() {
    data.totalLike = data.array.media
        .filter(elt => elt.photographerId == artisteId) // On filtre les elements correspondant a l'artiste
        .map(elt => elt.likes)  // On fait un nouveau tableau contenant le nombre de like
        .reduce((a, b) => a + b);   // On additione le nombre de like de chaque images.
    document.querySelector(".heartPrice_heart").textContent = data.totalLike + " ♥";
}

function updateLikeBox(value) { // mise a jour du compteur de like en bas de page.
    data.totalLike += value;
    document.querySelector(".heartPrice_heart").textContent = data.totalLike + " ♥";
}

// On defini le tarif de l'artiste en bas de page
function updatePriceBox() {
    document.querySelector(".heartPrice_price").textContent = data.artiste.price + "€ / jour";
}

// Fonction pour les likes sous les images

function updateLike(id, value, target) { // mise a jour du compteur de like sous les images.
    let element = data.array.media.filter(elt => elt.id == id)[0]
    element.likes += value;
    target.parentNode.querySelector("p").textContent = element.likes;
}

///////////////////////////////////////////////////////////////////////////
function heartListener(e) {
    let id = e.target.parentNode.parentNode.getAttribute("data-id");
    if (e.target.classList.contains("active")) {
        e.target.classList.remove("active");
        updateLike(id, -1, e.target);
        updateLikeBox(-1)
    } else {
        e.target.classList.add("active");
        updateLike(id, 1, e.target);
        updateLikeBox(1);
    }
}



// fonction pour remplir la page selon les image que l'on possède. Appelle la fabric, et remplis les nodes dans la page.
function fillGallery() {
    let galleryNode = document.getElementsByClassName("gallery")[0];
    let lightBoxNode = document.querySelector(".lightbox_frame_principal");

    galleryNode.innerHTML = "";
    lightBoxNode.innerHTML = "";

    data.galleryArray.forEach(elt => {
        let nodeTmp = fabricNode(elt)
        galleryNode.appendChild(nodeTmp);
        data.galleryNodeArray.push(nodeTmp);

        nodeTmp = lightBoxNodeFabric(elt)
        lightBoxNode.appendChild(nodeTmp)
        data.lightBoxNodeArray.push(nodeTmp)
    })
}

// fonction "fabric" pour la lightbox

function lightBoxNodeFabric(elt) {
    let mediaNode = null;
    let divNode = document.createElement("DIV");
    let str = findTitle(elt.image || elt.video);

    if (elt.image) mediaNode = lightBoxImgNode(elt, str)
    else if (elt.video) mediaNode = lightBoxVideoNode(elt);

    let paragraphe = document.createElement("p");
    paragraphe.className = "lightbox_frame_principal_title";
    paragraphe.textContent = str.title;
    divNode.appendChild(mediaNode)
    divNode.appendChild(paragraphe)
    divNode.className = "lightbox_frame_principal_media";
    return divNode;

}

function lightBoxImgNode(elt, str){
   let Node = document.createElement("img");
    Node.src = "../image/full-size/" + data.folderName + "/" + elt.image;
    Node.alt = "photo de " + str.title;
    return Node;
}

function lightBoxVideoNode(elt){
    let Node = document.createElement("video");
    Node.src = "../image/full-size/" + data.folderName + "/" + elt.video;
    Node.setAttribute("controls", "");
    return Node;
}

// fonction "fabric" pour la gallerie

function fabricNode(media) {
    let mediaNode = document.createElement("div");
    mediaNode.className = "gallery_frame";
    let clickableNode = document.createElement("a")
    if (media.image) clickableNode.appendChild(makeImgNode(media.image, media.id))
    else if (media.video) clickableNode.appendChild(makeVidNode(media.video, media.id))
    clickableNode.href = "javascript:void(0)";
    clickableNode.onclick = imgClickListener;
    mediaNode.appendChild(clickableNode)
    mediaNode.appendChild(makeDescriptionNode(media))
    return mediaNode;
}

// Fonction listener pour les vignette d'image, lance la lightbox.
function imgClickListener(evt) {
    evt.preventDefault();
    let balise = evt.target
    while(balise.className!="gallery_frame") balise = balise.parentNode
    data.position = data.galleryNodeArray.indexOf(balise)
    openLightBox();
}

// fonction appelé par la fabric pour faire la node image
function makeImgNode(path, id) {
    let imgNode = document.createElement("img");
    imgNode.src = "../image/image_vignette/" + data.folderName + "/" + path;
    imgNode.alt = makeAltText("Image", path);
    imgNode.className = "gallery_frame_element";
    imgNode.setAttribute("data-id", id);
    return imgNode;
}

// fonction appelé par la fabric pour faire la node vidéo
function makeVidNode(path, id) {
    let vidNode = document.createElement("video");
    let srcNode = document.createElement("source");
    let poster = document.createElement("poster")
    vidNode.textContent= "Votre navigateur ne prend pas en charge la vidéo"
    srcNode.src = "../image/image_vignette/" + data.folderName + "/" + path;
    srcNode.setAttribute("type", "video/mp4");
    vidNode.style.width = "100%";
    vidNode.setAttribute("data-id", id);
    vidNode.appendChild(srcNode);
    vidNode.appendChild(poster)
    vidNode.className = "gallery_frame_element";
    return vidNode;
}

// Fonction qui créé une node description, qui sera utilisé par la fabric.
function makeDescriptionNode(media) {
    let descriptionNode = document.createElement("div");
    let titreNode = document.createElement("h3");
    titreNode.textContent = findTitle(media.image || media.video).title;
    let prixNode = document.createElement("p");
    prixNode.textContent = media.price + "€";
    let likeNode = document.createElement("div");
    let textLikeNode = document.createElement("p");
    textLikeNode.textContent = media.likes;
    let heartNode = document.createElement("button");
    heartNode.className = "gallery_frame_element_description_heart"
    heartNode.textContent = "♥"
    heartNode.onclick = heartListener
    likeNode.appendChild(textLikeNode);
    likeNode.appendChild(heartNode);
    let blankNode = document.createElement("p");
    blankNode.className = "gallery_frame_element_description_blank"
    descriptionNode.appendChild(titreNode);
    descriptionNode.appendChild(blankNode);
    descriptionNode.appendChild(prixNode);
    descriptionNode.appendChild(likeNode);
    descriptionNode.className = "gallery_frame_element_description"
    descriptionNode.setAttribute("data-id", media.id)
    return descriptionNode;
}



// Fonction pour "parser" le titre de l'image/vidéo. Retourne un objet contenant le titre et le tag
function findTitle(str) {
    this.tag = "";
    this.title = "";
    let representation = str.split(".")[0];
    representation = representation.split("_");
    this.tag = representation.shift();
    this.title = representation.join(" ");
    return this;
}

function makeAltText(type, path) {
    let str = findTitle(path);
    return type + " tagué " + str.tag + ", nommé " + str.title;
}


//Fonction pour la lightbox

function openLightBox() {

    let lightBox = document.getElementById("lightbox");
    setImgLightBox();
    lightBox.style.display = "flex";

    let crossButton = lightBox.querySelector(".lightbox_frame_right_cross");
    let leftButton = lightBox.querySelector(".lightbox_frame_left_arrow");
    let rightButton = lightBox.querySelector(".lightbox_frame_right_arrow");

    leftButton.focus();     // Petit hack a cause d'un manquement lors de l'affichage de la lightbox.
    leftButton.blur();

   
/*  leftButton.addEventListener("click", clickLeftLightBox);
    rightButton.addEventListener("click", clickRightLightBox);
    crossButton.addEventListener("click", closeEventListener) */

    document.addEventListener("keyup", keyListener);
    document.querySelector("html").style.overflowY = "hidden";  // cacher la barre de défilement quand on ouvre la lightbox

    removeTabIndexForGallery();
}

//Fonction pour séléctionner l'image qu'on affiche: On lui attribue display: block, sinon les autres a "none"
function setImgLightBox() {
    let lightBox = document.getElementById("lightbox");
    let nodeLightBox = lightBox.querySelector(".lightbox_frame_principal");
    let nodeList = nodeLightBox.querySelectorAll(".lightbox_frame_principal_media")
    for (let i = 0; i < nodeList.length; i++) {
        if (i != data.position) nodeList[i].style.display = "none";
        else nodeList[i].style.display = "block";
    }
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
    resetTabIndex()
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
        case " ": togglePlayMedia();
            break;
        case "Backspace": resetMediaPos();
            break;
        default:
            break;
    }

}

function togglePlayMedia(params) {
   let video = data.lightBoxNodeArray[data.position].querySelector("video");
    if(video!=null){
        if(video.paused) video.play()
        else video.pause()
    }
}

function resetMediaPos(){
    let video = data.lightBoxNodeArray[data.position].querySelector("video");
    if(video!=null){
        video.currentTime = 0;
    }
}
// listener pour le click sur les boutons droit et gauche de la lightbox
function clickLeftLightBox() {
    let maxVal = data.galleryArray.length - 1;
    let indice = data.orderPositionArray[data.position]
    indice = indice - 1
    if (indice < 0) indice = maxVal;
    data.position = data.orderPositionArray.indexOf(indice)
    document.querySelector(".lightbox_frame_left_arrow").focus()
    setImgLightBox();
}

function clickRightLightBox() {

    let maxVal = data.galleryArray.length - 1;
    let indice = data.orderPositionArray[data.position]
    indice = indice + 1
    if (indice > maxVal) indice = 0;
    data.position = data.orderPositionArray.indexOf(indice)

    document.querySelector(".lightbox_frame_right_arrow").focus()
    setImgLightBox();
}

function fabricLightBoxTitle(str) {
    let paragraphe = document.createElement("p");
    paragraphe.className = "lightbox_frame_principal_title";
    paragraphe.textContent = findTitle(str).title;
    return paragraphe;
}

//////////////////////////////////////////////////////////
// Affichage et fermeture de la modale.
// On place un listener sur le bouton contact, on l'enleve quand on ferme la modale.
let closeModalButton = document.querySelector(".modal_dialog_crossButton");
let contactButton = document.querySelector(".contact_button")

contactButton.addEventListener("click", () => {
    document.querySelector("div.modal_bg").style.display = "block";
    document.documentElement.style.overflowY = "hidden"
    document.addEventListener("keyup", closeModalButtonByKeyListener);
    closeModalButton.addEventListener("click", closeModalButtonListener);
    setTabIndexForModal();
})

function closeModalButtonByKeyListener(e) {
    if(e.key == "Escape"){
        closeModalButtonListener()
    }
}

function closeModalButtonListener(evt) {
    let modalNode = document.querySelector("div.modal_bg")
    modalNode.style.display = "none";
    document.documentElement.style.overflowY = "auto";
    resetTabIndex()
    closeModalButton.removeEventListener("click", closeModalButtonListener)
}

function setTabIndexForModal(){
    let index = 4
    document.activeElement.tabIndex = 4
    let modal = document.querySelector("form.modal_dialog").querySelectorAll("input, textarea");
    modal.forEach(elt => elt.setAttribute("tabindex", index++))
    removeTabIndexForGallery();
    modal[0].focus();

}

/* function setTabIndexForLightBox(){
    document.activeElement.tabIndex = 1
    document.querySelector(".lightbox_frame_left_arrow").setAttribute("tabindex", 1);
    document.querySelector(".lightbox_frame_right_arrow").setAttribute("tabindex", 2);
    document.querySelector(".lightbox_frame_right_cross").setAttribute("tabindex", 3);
    removeTabIndexForGallery();

} */


function resetTabIndex(){
    setTabIndexForGallery();
    document.querySelector(".banner a").setAttribute("tabindex", 1)
    document.querySelector(".contact_button").setAttribute("tabindex", 2);
    document.querySelector("#order_button").setAttribute("tabindex", 3);
}
/////////////////////////////////////////////////////////////////

// Fonction pour afficher les messages dans la console lorsqu'on click sur contacter
function sendLog(e){
    e.preventDefault()
    let modal = document.getElementsByClassName("modal_dialog")[0]
    let first = modal.querySelector("#FirstName")
    let last = modal.querySelector("#LastName")
    let mail = modal.querySelector("#Email")
    let message = modal.querySelector("#Message")
    if(isValidCheck(first, last, mail, message) ){
        afficheMessage(first.value, last.value, mail.value, message.value);
        first.value = "";
        last.value = "";
        mail.value = "";
        message.value = "";
        closeModalButtonListener();
    }
    else console.log("Veuillez vérifier les info saisie")
    return true
}

function afficheMessage(first, last, mail, message){
    console.log("Prénom: "+ first+"\nNom: "+last+"\nMail: "+mail+"\nMessage: "+message)
}

// Les expression régulière utilisé pour vérifier les informations saisies.
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.([a-zA-Z0-9-])+$/
const nameRegex = /[0-9]|\s/

function isValidCheck(first, last, mail, message){
    let isValidFirst = first.value.length >= 2 && !nameRegex.test(first.value) ? true : erreurMsg("Prénom"),
    isValidLast = last.value.length >= 2  && !nameRegex.test(last.value) ? true : erreurMsg("Nom"),
    isValidMail = mail.value.length >= 2 && emailRegex.test(mail.value)? true : erreurMsg("Mail"),
    isValidMessage = message.value.length >= 5 ? true : erreurMsg("Message")
    return isValidFirst&&isValidLast&&isValidMail&&isValidMessage
}

function erreurMsg(champ){
    console.log("Le champ "+champ+" est invalide" );
    return false;
}

// Listener sur le défilement, afin de montrer/masquer le liens vers le contenu "main"

window.onscroll = function(){
    if(document.documentElement.scrollTop > document.querySelector("#main").offsetTop) banner_link.classList.remove("hide");
    else banner_link.classList.add("hide")
}

let form = document.querySelector("form")
 form.addEventListener("submit", sendLog)

/*   window.addEventListener("keydown", (e)=>{
        if(e.key=="Tab") console.log(document.activeElement    )
    })  */