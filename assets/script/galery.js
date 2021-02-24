let data = {
    isDefine : false,
    array : null,
    galleryArray : [],
    position : 0

};
let requestURL = "../script/FishEyeDataFR.json";
let artisteId = document.getElementsByTagName("body")[0].getAttribute("data-id");

fetch(requestURL).then(function (reponse) {
        return reponse.json()
    }).then(function (jsonData) {
        data.isDefine= true;
        data.array = jsonData;
        fillGallery(data.array.media)
    })
    .catch(function (error) {
        console.log("There is an error in loading JSON file: " + error)
    })


// Création du menu déroulant "Order By" ########################################

let orderBox = document.getElementsByClassName("order_select")[0];


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
    orderList.style.top = (rect.y+window.scrollY) + "px";
    orderList.style.left = rect.x + "px";
})

orderList.addEventListener("click", (evt) => {
    /*     console.log(evt.target.tagName); */
    if (evt.target.nodeName == "LI") {
        orderList.style.display = "none";
        orderButtonText.innerText = evt.target.innerText;
        order = orderArray.indexOf(evt.target.innerText);
        if(data.isDefine)fillGallery(data.array.media);
    }
})


window.onresize = function (evt) {
    let rect = orderButton.getBoundingClientRect()
    orderList.style.top = rect.y + "px";
    orderList.style.left = rect.x + "px";
}


// remplissage de la gallerie ###########################################################################


let galleryNode = document.getElementsByClassName("gallery")[0];


const fillGallery = function (dataToFill) {
    data.galleryArray = [];
    galleryNode.innerHTML="";
    dataToFill.forEach(element => {
        if (element.photographerId == artisteId) {
            // console.log(element)
            data.galleryArray.push(element)
        }
    });

    OrderBy(order, data.galleryArray);

    data.galleryArray.forEach(elt => {
        galleryNode.appendChild(fabricNode(elt))
    })
}

const makeImgNode = function ( path, id) {
    let imgNode = document.createElement("img");

    imgNode.src = "../image/Mimi/" + path;
   // imgNode.style.width = "100%";
  //  imgNode.style.height = "100%";
    imgNode.alt = makeAltText("Image", path);
    imgNode.className = "gallery_frame_element";
    imgNode.setAttribute("data-id", id);
    return imgNode;
}
const findPosition = function(evt){
    let ind = 0;
    let array = data.galleryArray;
    let indArray = array.map(elt => elt.id)
    data.position = indArray.indexOf(parseInt(evt.target.getAttribute("data-id"),10))
    openLightBox()
    
}
const makeVidNode = function (path, id) {
    let vidNode = document.createElement("video");
    let srcNode = document.createElement("source");
    srcNode.src = "../image/Mimi/" + path;
    srcNode.setAttribute("type", "video/mp4");
    vidNode.style.width = "100%";
    vidNode.setAttribute("data-id", id);
//    vidNode.setAttribute("controls", "");
    vidNode.appendChild(srcNode);
    vidNode.className = "gallery_frame_element";
 //   vidNode.setAttribute("aria-label") = makeAltText("Video", path);
    return vidNode;
}

const fabricNode = function (media) {
    let mediaNode = document.createElement("div");
    mediaNode.className= "gallery_frame";
    let clickableNode = document.createElement("a")
    if (media.image) clickableNode.appendChild(makeImgNode(media.image, media.id))
    else if (media.video) clickableNode.appendChild(makeVidNode(media.video, media.id))

    
    clickableNode.href="javascript:void(0)";
    clickableNode.onclick = findPosition;

    mediaNode.appendChild(clickableNode)
    mediaNode.appendChild(makeDescriptionNode(media))

    return mediaNode;
}

const OrderBy = function (nbOrder, tableau) {

    switch (nbOrder) {
        case 0:
            tableau.sort(function (x, y) {
                return  y.likes - x.likes
            });
            break;
        case 1:
            tableau.sort(function (x, y) {
                return x.date - y.date
            });
            break;
        case 2:
            tableau.sort(function (x, y) {
                return x.image == y.image ? 0 : x.image > y.image ? 1 : -1
            });
            break;
    }

}

const makeAltText = function(type, path){
    let str = findTitle(path);
    return type + " tagué "+ str.tag + ", nommé " + str.title ;
}

const findTitle = function(str){
    this.tag = "";
    this.title = "";
    let representation = str.split(".")[0];
    representation = representation.split("_");
    this.tag = representation.shift();
    this.title = representation.join(" ");
    return this;
}

const makeDescriptionNode = function(media){
    let descriptionNode = document.createElement("div");
    let titreNode = document.createElement("p");
    titreNode.textContent = findTitle(media.image||media.video).title;
    let prixNode = document.createElement("p");
    prixNode.textContent = media.price+"€";
    let likeNode = document.createElement("p");
    likeNode.textContent = media.likes+ "♥";
    let blankNode = document.createElement("p");
    blankNode.className = "gallery_frame_element_description_blank"
    descriptionNode.appendChild(titreNode);
    descriptionNode.appendChild(blankNode);
    descriptionNode.appendChild(prixNode);
    descriptionNode.appendChild(likeNode);
    descriptionNode.className = "gallery_frame_element_description"
    return descriptionNode;
}

const openLightBox = function(){

    let lightBox = document.getElementById("lightbox");
    setImgLightBox();
    lightBox.style.display= "flex";
    
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
const closeEventListener = function(){
    let lightBox = document.getElementById("lightbox");
    let crossButton = lightBox.querySelector(".lightbox_frame_right_cross");
    let leftButton = lightBox.querySelector(".lightbox_frame_left_arrow");
    let rightButton = lightBox.querySelector(".lightbox_frame_right_arrow");

    lightBox.style.display= "none";
    crossButton.removeEventListener("click", this);
    rightButton.removeEventListener("click", clickRightLightBox);
    leftButton.removeEventListener("click", clickLeftLightBox);
    document.removeEventListener("keyup", keyListener)
}
const setImgLightBox = function(){
    let lightBox = document.getElementById("lightbox");
    let nodeLightBox = lightBox.querySelector(".lightbox_frame_principal");
    nodeLightBox.innerHTML= "";
  //  if(data.galleryArray[data.position].image)imgLightBox.src = "../image/Mimi/"+data.galleryArray[data.position].image;
    nodeLightBox.appendChild(fabricLightBoxNode(data.galleryArray[data.position]))
    nodeLightBox.appendChild(fabricLightBoxTitle(data.galleryArray[data.position].image||data.galleryArray[data.position].video))
}
 const keyListener = function(e){
    e.preventDefault();
    switch(e.key){
        case "ArrowLeft" : clickLeftLightBox(); break;
        case "ArrowRight": clickRightLightBox(); break;
        case "Escape" : closeEventListener(); break;
        default : break;
    }

} 
const clickLeftLightBox = function(){
    let maxVal = data.galleryArray.length-1;
    if(data.position==0) data.position = maxVal;
    else data.position -= 1;
    document.querySelector(".lightbox_frame_left_arrow").focus()
    setImgLightBox();
}
const clickRightLightBox = function(){
    let maxVal = data.galleryArray.length-1;
    if(data.position==maxVal) data.position = 0;
    else data.position += 1;
    document.querySelector(".lightbox_frame_right_arrow").focus()
    setImgLightBox();
}

const fabricLightBoxNode = function(elt){
    let frame = document.querySelector(".lightbox_frame_principal");
    let mediaNode = null;
    let str = findTitle(elt.image||elt.video)
    if(elt.image){
        mediaNode = document.createElement("img");
        mediaNode.src = "../image/Mimi/"+elt.image;
        mediaNode.className = "lightbox_frame_principal_media";
        mediaNode.alt = "photo de " + str.title;
    }
    else if(elt.video){
        mediaNode = document.createElement("video");
        mediaNode.src = "../image/Mimi/"+elt.video;
        mediaNode.setAttribute("controls","");
        mediaNode.className = "lightbox_frame_principal_media";
    };
    return mediaNode;
}
const fabricLightBoxTitle = function(str){
    let paragraphe= document.createElement("p");
    paragraphe.className="lightbox_frame_principal_title";
    paragraphe.textContent = findTitle(str).title;
    return paragraphe;
}