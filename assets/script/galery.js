let data = {
    isDefine: false,
    array: null,
    galleryArray: [],
    galleryNodeArray: [],
    lightBoxNodeArray: [],
    position: 0,
    orderPositionArray: [],
    artiste: {},
    folderName: "",
    totalLike: 0,
    order: 0, // 0 => popularité, 1 => date, 2 => Titre. Tri des vignettes.
    chrono: Date.now()

};
let requestURL = "../script/FishEyeDataFR.json";
let artisteId = window.location.search.split("=")[1]

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


// Création du menu déroulant "Order By" ########################################

let orderBox = document.getElementsByClassName("order_select")[0];
/* const findArtiste = function () {
    data.array.photographers.forEach(elt => {
        if (elt.id == artisteId) data.artiste = elt;
    })
    console.log(data.chrono-Date.now())
} */


function findArtiste() {
    data.artiste = data.array.photographers.filter(elt =>elt.id == artisteId)[0]
}
function init () {

    findArtiste();
    getFolderName();
    updatePriceBox();
    makeInfoBox()
    fillGallery(data.array.media);
    OrderBy(data.order, data.galleryArray);
    setLikeBox();

}

const makeInfoBox = function () {
    let infoNode = document.getElementById("contact_info");
    document.querySelector(".modal_dialog_title_name").textContent = data.artiste.name
    infoNode.querySelector(".contact_info_name").textContent = data.artiste.name
    infoNode.querySelector(".contact_info_country").textContent = data.artiste.city + ", " + data.artiste.country
    infoNode.querySelector(".contact_info_quote").textContent = data.artiste.tagline
    document.querySelector(".contact_img").src = "../image/image_vignette/ID_Photos/" + data.artiste.portrait;
    document.querySelector(".contact_img").alt = "Photo de " + data.artiste.name;
    infoNode.appendChild(makeTaglistNode(data.artiste.tags));
}

const makeTaglistNode = function (taglist) {
    let taglistNode = document.createElement("ul");
    taglistNode.className = "contact_info_list";
    taglist.forEach(elt => {
        let liNode = document.createElement("li");
        let span = document.createElement("span");
        span.textContent = "#" + elt;
        liNode.appendChild(span);
        taglistNode.appendChild(liNode);
    })
    return taglistNode;
}


let orderButton = document.getElementById("order_button");
let orderList = document.getElementById("order_list");

orderButton.addEventListener("click", (evt) => {
    evt.stopPropagation();
    orderList.style.display = "block";
    let rect = orderButton.getBoundingClientRect()
    orderList.style.top = (rect.y + window.scrollY) + "px";
    orderList.style.left = rect.x + "px";
    document.addEventListener("click", closeOrderList);
})

orderList.addEventListener("click", (evt) => {
    let orderArray = ["Popularité", "Date", "Titre"];
    let orderButtonText = document.getElementById("order_button_text");
    if (evt.target.nodeName == "LI") {
        orderList.style.display = "none";
        orderButtonText.innerText = evt.target.innerText;
        data.order = orderArray.indexOf(evt.target.innerText);
        if (data.isDefine) OrderBy(data.order, data.galleryArray);
    }
    document.removeEventListener("click", closeOrderList)
})

const closeOrderList = function (e) {
    orderList.style.display = "none";
    document.removeEventListener("click", closeOrderList)
}

window.onresize = function (evt) {
    let rect = orderButton.getBoundingClientRect()
    orderList.style.top = rect.y + "px";
    orderList.style.left = rect.x + "px";
}

// remplissage de la gallerie ###########################################################################

const heartListener = function (e) {
    let id = e.target.parentNode.parentNode.getAttribute("data-id");
    if (e.target.classList.contains("active")) {
        e.target.classList.remove("active");
        updateLike(id, -1, e.target);
        updateLikeBox(-1)
    } else {
        e.target.classList.add("active");
        updateLike(id, 1, e.target);
        updateLikeBox(1)
    }
}

const setLikeBox = function () {  // ******************
    data.totalLike = data.array.media.filter(elt => elt.photographerId == artisteId).map(elt => elt.likes).reduce((a, b) => a + b)
    // Cette commande peut paraître un peu compliqué, mais on filtre d'abord les éléments par l'identifiant artiste, ensuite on map un nouveau tableau avec uniquement les valeurs de likes, qu'on additionne ensuite.
    document.querySelector(".heartPrice_heart").textContent = data.totalLike + " ♥";
}

function updateLike(id, value, target) { // mise a jour du compteur de like sous les images.
    let element = data.array.media.filter(elt => elt.id == id)[0]
    element.likes += value;
    target.parentNode.querySelector("p").textContent = element.likes;
}

const updateLikeBox = function (value) { // mise a jour du compteur de like en bas de page.
    data.totalLike += value;
    document.querySelector(".heartPrice_heart").textContent = data.totalLike + " ♥";
}

function updatePriceBox() {
    document.querySelector(".heartPrice_price").textContent = data.artiste.price + "€ / jour";
}

function fillGallery(dataToFill) {
    let galleryNode = document.getElementsByClassName("gallery")[0];
    let lightBoxNode = document.querySelector(".lightbox_frame_principal");

    data.galleryArray = [];
    galleryNode.innerHTML = "";
    lightBoxNode.innerHTML = "";

    data.galleryArray = dataToFill.filter(elt => elt.photographerId == artisteId); // Remplir la gallerie avec les éléments dont l'id correspond a notre artiste.

    data.galleryArray.forEach(elt => {
        let nodeTmp = fabricNode(elt)
        galleryNode.appendChild(nodeTmp);
        data.galleryNodeArray.push(nodeTmp);

        nodeTmp = lightBoxNodeBis(elt)
        lightBoxNode.appendChild(nodeTmp)
        data.lightBoxNodeArray.push(nodeTmp)
    })
    console.log(data.galleryNodeArray)
}

const makeImgNode = function (path, id) {
    let imgNode = document.createElement("img");
    imgNode.src = "../image/image_vignette/" + data.folderName + "/" + path;
    imgNode.alt = makeAltText("Image", path);
    imgNode.className = "gallery_frame_element";
    imgNode.setAttribute("data-id", id);
    return imgNode;
}

const getFolderName = function () {
    let str = data.artiste.name.split(" ")[0];
    data.folderName = str;
}



function imgClickListener(evt) {
    data.position = data.galleryNodeArray.indexOf(evt.target.parentNode.parentNode)
    console.log(evt.target.getAttribute("data-id"))
    openLightBox();
}

const makeVidNode = function (path, id) {
    let vidNode = document.createElement("video");
    let srcNode = document.createElement("source");
    srcNode.src = "../image/image_vignette/" + data.folderName + "/" + path;
    srcNode.setAttribute("type", "video/mp4");
    vidNode.style.width = "100%";
    vidNode.setAttribute("data-id", id);
    vidNode.appendChild(srcNode);
    vidNode.className = "gallery_frame_element";
    return vidNode;
}

const fabricNode = function (media) {
    let mediaNode = document.createElement("div");
    mediaNode.className = "gallery_frame";
    let clickableNode = document.createElement("a")
    if (media.image) clickableNode.appendChild(makeImgNode(media.image, media.id))
    else if (media.video) clickableNode.appendChild(makeVidNode(media.video, media.id))
    clickableNode.href = "javascript:void(0)";
    clickableNode.onclick = imgClickListener;
    clickableNode.style.display = "flex";
    mediaNode.appendChild(clickableNode);

    mediaNode.appendChild(makeDescriptionNode(media))
    return mediaNode;
}

const OrderBy = function (nbOrder, tableau) {
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

const orderByPopularity = function (tab) {
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
}
const findIndex = function(b){
 return data.orderPositionArray.indexOf(b) == -1 ? b : findIndex(b+1)
}
const orderByName = function (tab) {
    let myArray = tab.map(e => findTitle(e.image || e.video).title)
    let myArray2 = [...myArray];
    myArray.sort()
    data.orderPositionArray = myArray2.map(e => myArray.indexOf(e))
    setOrder()
}

const orderByDate = function (tab) {
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
}

const setOrder = function () {
    let galNode = document.querySelectorAll("div.gallery_frame");
    let i = 0;
    galNode.forEach(elt => {
        elt.style.order = data.orderPositionArray[i]
        elt.setAttribute("tabindex", data.orderPositionArray[i] + 10)
        i++;
    })
}

const makeAltText = function (type, path) {
    let str = findTitle(path);
    return type + " tagué " + str.tag + ", nommé " + str.title;
}

const findTitle = function (str) {
    this.tag = "";
    this.title = "";
    let representation = str.split(".")[0];
    representation = representation.split("_");
    this.tag = representation.shift();
    this.title = representation.join(" ");
    return this;
}

const makeDescriptionNode = function (media) {
    let descriptionNode = document.createElement("div");
    let titreNode = document.createElement("p");
    titreNode.textContent = findTitle(media.image || media.video).title;
    let prixNode = document.createElement("p");
    prixNode.textContent = media.price + "€";
    let likeNode = document.createElement("div");
    let textLikeNode = document.createElement("p");
    textLikeNode.textContent = media.likes;
    let heartNode = document.createElement("span");
    heartNode.className = "gallery_frame_element_description_heart"
    heartNode.textContent = "♥"
    heartNode.addEventListener("click", heartListener);
    likeNode.appendChild(textLikeNode);
    likeNode.appendChild(heartNode);
    // likeNode.className = "gallery_frame_element_description"
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

const openLightBox = function () {

    let lightBox = document.getElementById("lightbox");
    setImgLightBox();
    lightBox.style.display = "flex";

    let crossButton = lightBox.querySelector(".lightbox_frame_right_cross");
    let leftButton = lightBox.querySelector(".lightbox_frame_left_arrow");
    let rightButton = lightBox.querySelector(".lightbox_frame_right_arrow");

    leftButton.focus();
    leftButton.blur();

    leftButton.addEventListener("click", clickLeftLightBox);
    document.addEventListener("keyup", keyListener);
    rightButton.addEventListener("click", clickRightLightBox);
    crossButton.addEventListener("click", closeEventListener)

    document.querySelector("html").style.overflowY = "hidden";  // cacher la barre de défilement quand on ouvre la lightbox
}
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
}

const setImgLightBox = function () {
    let lightBox = document.getElementById("lightbox");
    let nodeLightBox = lightBox.querySelector(".lightbox_frame_principal");
    let nodeList = nodeLightBox.querySelectorAll(".lightbox_frame_principal_media")
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
        default:
            break;
    }

}
const clickLeftLightBox = function () {
    let maxVal = data.galleryArray.length - 1;
    let indice = data.orderPositionArray[data.position]
    indice = indice - 1
    if (indice < 0) indice = maxVal;
    data.position = data.orderPositionArray.indexOf(indice)
    document.querySelector(".lightbox_frame_left_arrow").focus()
    setImgLightBox();
}
const clickRightLightBox = function () {

    let maxVal = data.galleryArray.length - 1;
    let indice = data.orderPositionArray[data.position]
    indice = indice + 1
    if (indice > maxVal) indice = 0;
    data.position = data.orderPositionArray.indexOf(indice)

    document.querySelector(".lightbox_frame_right_arrow").focus()
    setImgLightBox();
}

const fabricLightBoxTitle = function (str) {
    let paragraphe = document.createElement("p");
    paragraphe.className = "lightbox_frame_principal_title";
    paragraphe.textContent = findTitle(str).title;
    return paragraphe;
}



//////////////////////////////////////////////////////////

let closeModalButton = document.querySelector(".modal_dialog_crossButton");
let contactButton = document.querySelector(".contact_button")

contactButton.addEventListener("click", () => {
    document.querySelector("div.modal_bg").style.display = "block";
    closeModalButton.addEventListener("click", closeModalButtonListener);
})

const closeModalButtonListener = function () {
    let modalNode = document.querySelector("div.modal_bg")
    modalNode.style.display = "none";
    closeModalButton.removeEventListener("click", closeModalButtonListener)
}

/////////////////////////////////////////////////////////////////

const lightBoxNodeBis = function (elt) {
    let mediaNode = null;
    let divNode = document.createElement("DIV");
    let str = findTitle(elt.image || elt.video)
    if (elt.image) {
        mediaNode = document.createElement("img");
        mediaNode.src = "../image/full-size/" + data.folderName + "/" + elt.image;

        mediaNode.alt = "photo de " + str.title;
    } else if (elt.video) {
        mediaNode = document.createElement("video");
        mediaNode.src = "../image/full-size/" + data.folderName + "/" + elt.video;
        mediaNode.setAttribute("controls", "");
    };

    let paragraphe = document.createElement("p");
    paragraphe.className = "lightbox_frame_principal_title";
    paragraphe.textContent = str.title;
    divNode.appendChild(mediaNode)
    divNode.appendChild(paragraphe)
    divNode.className = "lightbox_frame_principal_media";
    return divNode;

}

const sendLog = function(e){
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

const afficheMessage = function(first, last, mail, message){
    console.log("Prénom: "+ first+"\nNom: "+last+"\nMail: "+mail+"\nMessage: "+message)
}

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.([a-zA-Z0-9-])+$/
const nameRegex = /[0-9]|\s/

const isValidCheck= function(first, last, mail, message){
    let isValidFirst = first.value.length >= 2 && !nameRegex.test(first.value) ? true : erreurMsg("Prénom"),
    isValidLast = last.value.length >= 2  && !nameRegex.test(last.value) ? true : erreurMsg("Nom"),
    isValidMail = mail.value.length >= 2 && emailRegex.test(mail.value)? true : erreurMsg("Mail"),
    isValidMessage = message.value.length >= 5 ? true : erreurMsg("Message")
    return isValidFirst&&isValidLast&&isValidMail&&isValidMessage
}

const erreurMsg = function(champ){
    console.log("Le champ "+champ+" est invalide" );
    return false;
}
