let requestURL = "../script/FishEyeDataFR.json"; // adresse du fichier json
let virtualJSON = {};
/**
 * Charge les données du fichiers json, et lance la suite du chargement de la page via init()
 */
fetch(requestURL).then(function (reponse) {
  return reponse.json();
})
  .then(function (jsonData) {
    let artisteId = getUrlParam().artisteId;
    virtualJSON.artiste = selectArtiste(artisteId, jsonData);  //new Artiste(artisteObj);
    fillContact(virtualJSON.artiste);
    virtualJSON.media = selectMedia(virtualJSON.artiste.id, jsonData);
    let gallery = document.querySelector(".gallery");
    let lightbox = document.querySelector(".lightbox_frame_principal");
    virtualJSON.media.forEach(el =>{
      let fabric = new Fabric(virtualJSON.artiste, el);
      gallery.innerHTML += fabric.render("gallery");
      lightbox.innerHTML += fabric.render("lightbox");
    });
    updatePriceBox(virtualJSON.artiste);
    setLikeBox(virtualJSON.media);
    gallery.querySelectorAll("a").forEach(el => el.addEventListener("click", frameClickListener));
    console.log(virtualJSON);
    //jsonData.media.filter(elt=>elt.photographerId == artisteId).forEach(el => gallery.innerHTML += renderNode(el));

    orderBy(getUrlParam().hash, virtualJSON);
    window.addEventListener("popstate", ()=>{
      orderBy(getUrlParam().hash, virtualJSON);
    });

    setLikeListener();

    setTabIndexGallery();

  })
  .catch(function (error) {
    console.log("There is an error in loading JSON file: " + error);
  });

function selectArtiste(id, json){
  let artiste = json.photographers.find(el => el.id == id);
  if(!artiste) throw new Error("Numéro d'artiste non trouvé");
  return new Artiste(artiste);
}

function selectMedia(artisteId, json){
  return json.media.filter(el => el.photographerId == artisteId).map(el => new Media(el));
}

function fillContact(artiste){
  let infoNode = document.getElementById("contact_info");
  document.querySelector(".modal_dialog_title_name").textContent = artiste.name;
  infoNode.querySelector(".contact_info_name").textContent = artiste.name;
  infoNode.querySelector(".contact_info_country").textContent = artiste.city + ", " + artiste.country;
  infoNode.querySelector(".contact_info_quote").textContent = artiste.tagline;
  document.querySelector(".contact_img").src = "../image/image_vignette/ID_Photos/" + artiste.portrait;
  document.querySelector(".contact_img").alt = "Photo de " + artiste.name;
  infoNode.appendChild(makeListTag(artiste, "contact_info_list"));
}

function makeListTag(artiste, classTitle){
  let ul = document.createElement("ul");
  ul.className = classTitle;
  artiste.tags.forEach(el =>{
    ul.innerHTML += `<li><a href="../../?tag=${el}">#${el}</a></li>`;
  });
  return ul;
}

function updatePriceBox(artiste) {
  document.querySelector(".heartPrice_price").textContent = artiste.price + "€ / jour";
}

function setLikeBox(media){
  let sum= 0;
  media.forEach(el => sum+=el.likes);
  document.querySelector(".heartPrice_heart").textContent = sum + " ♥";
}



function getUrlParam(){
  let param = new URLSearchParams(window.document.location);
  let search;
  if(param.has("search")){
    search = new URLSearchParams(window.document.location.search);
    if(search.has("artisteId")) this.artisteId = search.get("artisteId");
    else throw new Error("Tag artisteId incorrecte");
  }
  if(param.has("hash")) this.hash = window.document.location.hash;
  return this;
}

