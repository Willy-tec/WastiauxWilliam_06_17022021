let data = {
    isDefine: false,
    array: null,
    galleryArray: [],
    position: 0,
    orderPositionArray : [], 
    artiste : {},
    folderName: ""

};
let requestURL = "../script/FishEyeDataFR.json";
let artisteId = window.location.hash.slice(1)//document.getElementsByTagName("body")[0].getAttribute("data-id");

fetch(requestURL).then(function (reponse) {
        return reponse.json()
    }).then(function (jsonData) {
        data.isDefine = true;
        data.array = jsonData;
        findArtiste();
        getFolderName();
        updatePriceBox();
        fillGallery(data.array.media);
        updateLikeBox();
        makeInfoBox()
        
    })
    .catch(function (error) {
        console.log("There is an error in loading JSON file: " + error)
    })


// Création du menu déroulant "Order By" ########################################

let orderBox = document.getElementsByClassName("order_select")[0];
const findArtiste = function(){
    data.array.photographers.forEach(elt =>{
        if(elt.id == artisteId) data.artiste = elt;
    })
}
const makeInfoBox = function(){

  
    let infoNode = document.getElementById("contact_info");
    console.log(infoNode.querySelector(".contact_info_name"))
    document.querySelector(".modal_dialog_title_name").textContent = data.artiste.name
    infoNode.querySelector(".contact_info_name").textContent = data.artiste.name
    infoNode.querySelector(".contact_info_country").textContent = data.artiste.city+", "+data.artiste.country
    infoNode.querySelector(".contact_info_quote").textContent = data.artiste.tagline
    document.querySelector(".contact_img").src = "../image/ID_Photos/"+data.artiste.portrait;
    document.querySelector(".contact_img").alt = "Photo de "+data.artiste.name;
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

const makeListBoxNode = function () {
    let node = document.createElement("div");
    node.setAttribute("role", "listbox");
    node.setAttribute("aria-activedescendant", "listbox");
    node.setAttribute("aria-labelledby", "listbox");
}

let orderButton = document.getElementById("order_button");
let orderList = document.getElementById("order_list");
let orderButtonText = document.getElementById("order_button_text");
let orderArray = ["Popularité", "Date", "Titre"];
let order = 0; // 0 => popularité, 1 => date, 2 => Titre.

orderButton.addEventListener("click", (evt) => {
    orderList.style.display = "block";
    let rect = orderButton.getBoundingClientRect()
    orderList.style.top = (rect.y + window.scrollY) + "px";
    orderList.style.left = rect.x + "px";
})

orderList.addEventListener("click", (evt) => {
    if (evt.target.nodeName == "LI") {
        orderList.style.display = "none";
        orderButtonText.innerText = evt.target.innerText;
        order = orderArray.indexOf(evt.target.innerText);
        if (data.isDefine) OrderBy(order, data.galleryArray); 
    }
})


window.onresize = function (evt) {
    let rect = orderButton.getBoundingClientRect()
    orderList.style.top = rect.y + "px";
    orderList.style.left = rect.x + "px";
}


// remplissage de la gallerie ###########################################################################

const heartListener = function(e){
    let id = e.target.parentNode.parentNode.getAttribute("data-id");
    if(e.target.classList.contains("active")){
        e.target.classList.remove("active");
        updateLike(id, -1, e.target);
    }
    else {
        e.target.classList.add("active");
        updateLike(id, 1, e.target);
    }
}

const updateLike = function(id, value, target){
    let newLikeValue = 0
    data.array.media.forEach(elt =>{
        if(elt.id == id) {
            elt.likes += value;
            newLikeValue = elt.likes;
        }
    })
    target.parentNode.querySelector("p").textContent = newLikeValue;
    updateLikeBox()
}
const updateLikeBox = function(){
    let totalLike = 0;
    data.array.media.forEach(elt =>{
        if(elt.photographerId == artisteId){

            totalLike+= elt.likes
        }
    })
    document.querySelector(".heartPrice_heart").textContent= totalLike+" ♥";
    
}
const updatePriceBox = function(){
    let pricePerDay = 0;
    data.array.photographers.forEach(elt =>{
        if(elt.id == artisteId) pricePerDay = elt.price;
    })
    document.querySelector(".heartPrice_price").textContent= pricePerDay +"€ / jour";
}
const fillGallery = function (dataToFill) {
    let galleryNode = document.getElementsByClassName("gallery")[0];
    let lightBoxNode = document.querySelector(".lightbox_frame_principal");

    data.galleryArray = [];
    galleryNode.innerHTML = "";
    lightBoxNode.innerHTML = "";
    dataToFill.forEach(element => {                         // Remplir la gallerie avec les éléments dont l'id correspond a notre artiste.
        if (element.photographerId == artisteId) {
            data.galleryArray.push(element)
        }
    });

    data.galleryArray.forEach(elt => {
        galleryNode.appendChild(fabricNode(elt));
        lightBoxNode.appendChild(lightBoxNodeBis(elt))
    })
    OrderBy(order, data.galleryArray)
}

const makeImgNode = function (path, id) {
    let imgNode = document.createElement("img");

    imgNode.src = "../image/"+data.folderName+"/" + path;

    imgNode.alt = makeAltText("Image", path);
    imgNode.className = "gallery_frame_element";
    imgNode.setAttribute("data-id", id);
    return imgNode;
}

const getFolderName = function(){
    let str = data.artiste.name.split(" ")[0];
    console.log(str);
    data.folderName = str;
}

const findPosition = function (evt) {

    let array = data.galleryArray;
    let indArray = array.map(elt => elt.id)
    data.position = indArray.indexOf(parseInt(evt.target.getAttribute("data-id"), 10))
    openLightBox()

}
const makeVidNode = function (path, id) {
    let vidNode = document.createElement("video");
    let srcNode = document.createElement("source");
    srcNode.src = "../image/"+data.folderName+"/" + path;
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
    clickableNode.onclick = findPosition;
    mediaNode.appendChild(clickableNode)
    mediaNode.appendChild(makeDescriptionNode(media))
    return mediaNode;
}

const OrderBy = function (nbOrder, tableau) {
        switch (nbOrder) {
            case 0: orderByPopularity(tableau)
                break;
            case 1: orderByDate(tableau)
                break;
            case 2: orderByName(tableau)
                break;
            default:
                break;
        }
}

const orderByPopularity = function(tab){
    let myArray = tab.map(e =>parseInt(e.likes),10);
    let myArray2 = [...myArray];
    myArray.sort((a , b) => {
        return b - a
    });
    data.orderPositionArray = myArray2.map(e => myArray.indexOf(e))
    setOrder()
}

const orderByName = function(tab){
    let myArray = tab.map(e =>findTitle(e.image || e.video).title)
    let myArray2 = [...myArray];
    myArray.sort()
    data.orderPositionArray = myArray2.map(e => myArray.indexOf(e))
    setOrder()
}

const orderByDate = function(tab){
    let myArray = tab.map(e =>new Date(e.date));
    let myArray2 = [...myArray];
    myArray.sort((a , b)=>{
        return b - a
    });
    data.orderPositionArray = myArray2.map(e => myArray.indexOf(e))
    setOrder()
}

const setOrder = function(){
    let galNode = document.querySelectorAll("div.gallery_frame");
    let i = 0;
    galNode.forEach(elt => {
        elt.style.order = data.orderPositionArray[i]
        elt.setAttribute("tabindex", data.orderPositionArray[i]+10 )
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
    document.removeEventListener("keyup", keyListener)
}
const setImgLightBox = function () {
    let lightBox = document.getElementById("lightbox");
    let nodeLightBox = lightBox.querySelector(".lightbox_frame_principal");
    let nodeList = nodeLightBox.querySelectorAll(".lightbox_frame_principal_media")
    //   nodeLightBox.innerHTML= "";
    //    nodeLightBox.appendChild(fabricLightBoxNode(data.galleryArray[data.position]))
    let indice = data.orderPositionArray[data.position]


    for (let i = 0; i < nodeList.length; i++) {
        if (i != data.position) nodeList[i].style.display = "none";
        else nodeList[i].style.display = "block";
    }
    // nodeLightBox.appendChild(fabricLightBoxTitle(data.galleryArray[data.position].image||data.galleryArray[data.position].video))
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

const fabricLightBoxNode = function (elt) {
    let frame = document.querySelector(".lightbox_frame_principal");
    let mediaNode = null;
    let str = findTitle(elt.image || elt.video)
    if (elt.image) {
        mediaNode = document.createElement("img");
        mediaNode.src = "../image/"+data.folderName+"/" + elt.image;
        mediaNode.className = "lightbox_frame_principal_media";
        mediaNode.alt = "photo de " + str.title;
    } else if (elt.video) {
        mediaNode = document.createElement("video");
        mediaNode.src = "../image/"+data.folderName+"/" + elt.video;
        mediaNode.setAttribute("controls", "");
        mediaNode.className = "lightbox_frame_principal_media";
    };
    return mediaNode;
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
    console.log(modalNode)
    closeModalButton.removeEventListener("click", closeModalButtonListener)
}

/////////////////////////////////////////////////////////////////

const lightBoxNodeBis = function (elt) {
    let mediaNode = null;
    let divNode = document.createElement("DIV");
    let str = findTitle(elt.image || elt.video)
    if (elt.image) {
        mediaNode = document.createElement("img");
        mediaNode.src = "../image/"+data.folderName+"/" + elt.image;

        mediaNode.alt = "photo de " + str.title;
    } else if (elt.video) {
        mediaNode = document.createElement("video");
        mediaNode.src = "../image/"+data.folderName+"/" + elt.video;
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


// Construction du menu info perso

