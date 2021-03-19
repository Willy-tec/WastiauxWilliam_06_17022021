console.clear()

let data = null;
let userArray = [];
let banner_link = document.getElementById("banner_link");

const photographFrame = function (img, id, nick, localization, quote, price, taglist) {

    let photographNode = makeNode("article", "frame_photograph");

    photographNode.appendChild(makeLinkNode(id, img, nick));

    photographNode.appendChild(makeNode("p", "frame_photograph_localization", localization));
    photographNode.appendChild(makeNode("p", "frame_photograph_quote", quote));
    photographNode.appendChild(makeNode("p", "frame_photograph_price", price + "€/jour"));
    photographNode.appendChild(makeTaglistNode(taglist, "frame_photograph_taglist"));
    photographNode.setAttribute("data-id", id)
    return photographNode;
}

const makeNode = function (type, className, content) {
    let balise = document.createElement(type);
    balise.className = className;
    if (content) balise.innerText = content;
    return balise;
}

const makeLinkNode = function (id, img, nick) {

    let linkNode = document.createElement("a");
    linkNode.className = "frame_photograph_link"
    linkNode.href ="assets/html/galery.html?artisteId=" + id;
    linkNode.setAttribute("aria-label", "Photo représentant "+ nick)

    let imgNode = document.createElement("img");
    imgNode.src = "assets/image/image_vignette/ID_Photos/" + img;
    imgNode.alt = "Photo de " + nick;
    imgNode.className = "frame_photograph_link_img";

    let nameNode = makeNode("h2", "frame_photograph_link_name", nick)
    linkNode.appendChild(imgNode);
    linkNode.appendChild(nameNode);

    return linkNode;
}

const makeTaglistNode = function (taglist, className) {
    let taglistNode = document.createElement("ul");
    taglistNode.className = className;
    taglist.forEach(elt => {
        let liNode = document.createElement("li");
        let link = document.createElement("a");
        link.href = "#" + elt;
        link.textContent = "#" + elt;
        link.setAttribute("aria-label", elt)
        liNode.appendChild(link);
        liNode.addEventListener("click", tagListListener)
        taglistNode.appendChild(liNode);
    })
    return taglistNode;
}

const makeTagList = function (data) {
    let tagArray = [];
    data.photographers.forEach(x => {
        x.tags.forEach(elt => {
            if (tagArray.indexOf(elt) == -1) tagArray.push(elt);
        })
    })
    return tagArray;
};

const fillPageWithPhotograph = function(data){
    let frame = document.getElementById("frame");
    data["photographers"].forEach(elt => {
        userArray.push(photographFrame(elt.portrait, elt.id, elt.name, elt.country, elt.tagline, elt.price, elt.tags))
    });
    userArray.forEach(x => frame.appendChild(x));
    let banner_tag = document.getElementsByClassName("banner_nav")[0];
    banner_tag.appendChild(makeTaglistNode(makeTagList(data), "banner_nav_list"));
}

const clearUserArray = function(){
    console.clear();
    userArray.forEach(x =>{
       document.getElementById("frame").removeChild(x);
    } )
    userArray = [];
}

let requestURL = "assets/script/FishEyeDataFR.json";
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = "json";
request.send();


request.onload = function () {
    data = request.response;
    fillPageWithPhotograph(data);
    verifyAdressForTag();

}


window.onscroll = function(){
    if(document.documentElement.scrollTop > 10) banner_link.classList.remove("hide");
    else banner_link.classList.add("hide")
}


//////////////////////////////////////////////////////////////////////////////////////////
// tag ////////////////////////////////////


const tagListListener = function(e){
    e.preventDefault();
/*     window.document.location.search="tag="+ e.target.hash.slice(1)       Si on veut afficher les tags séléctionner dans la barre d'adresse, on peut utiliser cette méthode, mais ça nécéssite de recharger la page
*/

    hideNotSelectedArtiste(e.target.hash.slice(1));
    toggleTagInTaskBar(e.target.hash.slice(1)); 
}

const hideNotSelectedArtiste = function(tag){
    showAllArtist()
    let artistContent = document.querySelectorAll("#frame article");
    let filterArray = makeTagArraySelectingArtiste(tag);
    let id = 0
    for(let item of artistContent){
       id = parseInt(item.getAttribute("data-id"),10)
       if(filterArray.indexOf(id)!=-1) item.style.display = "none"
    }
}

const showAllArtist = function(){
    let artistContent = document.querySelectorAll("#frame article");
    for(let item of artistContent){
        item.style.display = "flex";
    }
}
const makeTagArraySelectingArtiste = function(tag){
    let filterArtiste = []
    if(data){
        filterArtiste = data.photographers.map(elt =>{
            if(elt.tags.indexOf(tag)==-1) return elt.id;
            else return null
        })
    }
    return filterArtiste;
}
const toggleTagInTaskBar = function(tag){

    let tagList = document.querySelector("ul.banner_nav_list");
    let tagNode = tagList.getElementsByTagName("a")
    for(let item of tagNode){
        if(item.hash == "#"+tag) {
            nodeSelect = item
        }
    };
    for(let item of tagNode){
        if(item.classList.contains("active")&& item != nodeSelect) {
            item.classList.remove("active");
        }
    };
    if(nodeSelect.classList.contains("active")){
        nodeSelect.classList.remove("active");
        showAllArtist()
    }
    else nodeSelect.classList.add("active")
}

function verifyAdressForTag(){
    let tag = window.document.location.search
    if(!tag) return
    tag = tag.replace("?", "")
    tag = tag.split("=")
    if(tag.length<=2) tag = tag[1]
    hideNotSelectedArtiste(tag)
}