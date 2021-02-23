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
    linkNode.href ="assets/html/galery.html#" + id;

    let imgNode = document.createElement("img");
    imgNode.src = "assets/image/ID_Photos/" + img;
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
        liNode.appendChild(link);
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
    console.log(userArray)
}

const fillPageWithPhotographByTag = function(data, tag){
    clearUserArray();
    let frame = document.getElementById("frame");
    data["photographers"].forEach(elt => {
        if(elt.tags.indexOf(tag)!=-1) userArray.push(photographFrame(elt.portrait, elt.id, elt.name, elt.country, elt.tagline, elt.price, elt.tags))
    });
    userArray.forEach(x => frame.appendChild(x));
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
}

window.addEventListener("popstate", (evt)=>{
    console.log(window.location.hash.slice(1))
    if(data != null) fillPageWithPhotographByTag(data, window.location.hash.slice(1) )
})

window.onscroll = function(){
    console.log(document.documentElement.scrollTop);
    if(document.documentElement.scrollTop > 10) banner_link.classList.remove("hide");
    else banner_link.classList.add("hide")
}

banner_link.addEventListener("click",(evt)=>{
    evt.preventDefault();
    document.documentElement.scrollTop = 0;

})