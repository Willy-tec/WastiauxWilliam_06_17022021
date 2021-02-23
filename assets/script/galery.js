let data = {
    isDefine : false,
    array : null

};
let requestURL = "../script/FishEyeDataFR.json";
let artisteId = document.getElementsByTagName("body")[0].getAttribute("data-id");

fetch(requestURL).then(function (reponse) {
        return reponse.json()
    }).then(function (jsonData) {
        console.log(jsonData);
        data.isDefine= true;
        data.array = jsonData;
        fillGallery(data.array.media)
    })
    .catch(function (error) {
        console.log("There is an error in loading JSON file: " + error)
    })


// Création du menu déroulant "Order By" ########################################

let orderBox = document.getElementsByClassName("order_select")[0];

console.log(orderBox)
//let rect = orderBox.parentElement.offsetTop
//console.log("h: "+rect)

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

const fillGallery = function (data) {
    let galleryArray = [];
    galleryNode.innerHTML="";
    data.forEach(element => {
        if (element.photographerId == artisteId) {
            // console.log(element)
            galleryArray.push(element)
        }
    });

   // console.log(galleryArray);
    console.log(OrderBy(order, galleryArray));

    galleryArray.forEach(elt => {
        galleryNode.appendChild(fabricNode(elt))
    })
}

const makeImgNode = function ( path) {
    let imgNode = document.createElement("img");
    imgNode.src = "../image/Mimi/" + path;
    imgNode.style.width = "100%";
  //  imgNode.style.height = "100%";
    imgNode.alt = makeAltText("Image", path);
    imgNode.className = "gallery_frame_element";
    return imgNode;
}

const makeVidNode = function (path) {
    let vidNode = document.createElement("video");
    let srcNode = document.createElement("source");
    srcNode.src = "../image/Mimi/" + path;
    srcNode.setAttribute("type", "video/mp4");
    vidNode.style.width = "100%";
//    vidNode.setAttribute("controls", "");
    vidNode.appendChild(srcNode);
    vidNode.className = "gallery_frame_element";
 //   vidNode.setAttribute("aria-label") = makeAltText("Video", path);
    return vidNode;
}

const fabricNode = function (media) {
    let mediaNode = document.createElement("div");
    mediaNode.className= "gallery_frame";
    if (media.image) mediaNode.appendChild(makeImgNode(media.image))
    else if (media.video) mediaNode.appendChild(makeVidNode(media.video))

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