console.clear()

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
    linkNode.href = "#" + id;

    let imgNode = document.createElement("img");
    imgNode.src = "/assets/image/ID_Photos/" + img;
    imgNode.alt = "Photo de " + img;
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

let requestURL = "assets/script/FishEyeDataFR.json";
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = "json";
request.send();

request.onload = function () {
    let data = request.response;
    let frame = document.getElementById("frame");
    let userArray = [];
    data["photographers"].forEach(elt => {
        userArray.push(photographFrame(elt.portrait, elt.id, elt.name, elt.country, elt.tagline, elt.price, elt.tags))
    });
    userArray.forEach(x => frame.appendChild(x));
    let banner_tag = document.getElementsByClassName("banner_nav")[0];
    banner_tag.appendChild(makeTaglistNode(makeTagList(data), "banner_nav_list"));
}