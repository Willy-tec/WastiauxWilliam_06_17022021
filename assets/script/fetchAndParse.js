let requestURL = "../script/FishEyeDataFR.json"; // adresse du fichier json
let virtualJSON = {};
/**
 *  Gère l'affichage de la page gallerie
 */

fetch(requestURL)
  .then(function (reponse) {
    /**
     * récupérer les valeur sous forme de JSON. Ceci est le fichier JSON fourni par OpenClassRoom(ocr).
     */
    return reponse.json();
  })
  .then(function (jsonData) {
    /**
     * Récupéré l'identifiant de l'artiste dans la barre d'adresse
     */
    let artisteId = getUrlParam().artisteId;
    /**
     * Définir l'artiste dans la variable générale virtualJSON, puis remplir les info de contact
     */
    virtualJSON.artiste = selectArtiste(artisteId, jsonData);
    fillContact(virtualJSON.artiste);
    /**
     * Création de la liste des média liés à l'artiste
     */
    virtualJSON.media = selectMedia(virtualJSON.artiste.id, jsonData);

    let gallery = document.querySelector(".gallery");
    let lightbox = document.querySelector(".lightbox_frame_principal");
    /**
     * Remplir la gallerie et la lightbox avec les nodes retourné par la fabric
     */
    virtualJSON.media.forEach((el) => {
      let fabric = new Fabric(virtualJSON.artiste, el);
      gallery.innerHTML += fabric.render("gallery");
      lightbox.innerHTML += fabric.render("lightbox");
    });
    /**
     * Définir le titre de la page avec le nom de l'artiste
     */
    document.title = `Gallerie de ${virtualJSON.artiste.name}`;
    /**
     * Mettre a jour l'encart en bas de page contenant le tarif, et le nombre total de like
     */
    updatePriceBox(virtualJSON.artiste);
    setLikeBox(virtualJSON.media);
    /**
     * Ajout d'un eventlistener sur chaque image de la gallerie
     */
    gallery
      .querySelectorAll("a")
      .forEach((el) => el.addEventListener("click", frameClickListener));
    /**
     * Effectuer un 1er tri. Si l'adresse ne contient pas de hash lié au tri, un tri par défaut est réalisé sur "popularité"
     */
    orderBy(getUrlParam().hash, virtualJSON);
    /**
     * eventlistener pour écouter les modifications de la barre d'adresse(dans le cas d'un tri par exemple)
     */
    window.addEventListener("popstate", () => {
      orderBy(getUrlParam().hash, virtualJSON);
    });
    /**
     * Attribuer un listener sur chaque petit coeur affiché sous les photos
     */
    setLikeListener();
  })
  .catch(function (error) {
    /**
     * Dans le cas d'une erreur dans la page, le message ci dessous sera affiché avec l'erreur en complément
     */
    console.log("There is an error in loading JSON file: " + error);
  });

/**
 * Trouver le bon artiste dans le fichier JSON fourni par OCR, et renvoyer un nouvel objet Artiste
 * @param {string} id
 * @param {Object} json
 * @returns {object} new Artiste()
 */
function selectArtiste(id, json) {
  let artiste = json.photographers.find((el) => el.id == id);
  if (!artiste) throw new Error("Numéro d'artiste non trouvé");
  return new Artiste(artiste);
}

/**
 * Faire le tri parmi la liste de media fourni dans le fichier JSON d'ocr, puis renvoyer un tableau contenant la liste des médias de l'artiste uniquement, sous forme d'objet Media
 * @param {string} artisteId
 * @param {object} json
 * @returns {array[]}
 */
function selectMedia(artisteId, json) {
  return json.media
    .filter((el) => el.photographerId == artisteId)
    .map((el) => new Media(el));
}

/**
 * Remplir la fiche info des artistes que l'on voit en début de page dans la gallerie
 * @param {object} artiste
 */
function fillContact(artiste) {
  let infoNode = document.getElementById("contact_info");
  document.querySelector(".modal_dialog_title_name").textContent = artiste.name;
  infoNode.querySelector(".contact_info_name").textContent = artiste.name;
  infoNode.querySelector(".contact_info_country").textContent =
    artiste.city + ", " + artiste.country;
  infoNode.querySelector(".contact_info_quote").textContent = artiste.tagline;
  document.querySelector(".contact_img").src =
    "../image/image_vignette/ID_Photos/" + artiste.portrait;
  document.querySelector(".contact_img").alt = "Photo de " + artiste.name;
  infoNode.appendChild(makeListTag(artiste, "contact_info_list"));
}

/**
 * Création et récupération d'une liste des tags associé a l'artiste
 * @param {object} artiste
 * @param {*} classTitle
 * @returns {HTMLElement}
 */
function makeListTag(artiste, classTitle) {
  let ul = document.createElement("ul");
  ul.className = classTitle;
  let tabInd = 3;
  artiste.tags.forEach((el) => {
    ul.innerHTML += `<li><a href="../../?tag=${el}" tabindex="${tabInd}">#${el}</a></li>`;
    tabInd++;
  });
  return ul;
}

/**
 * Afficher le prix dans l'encart en bas de page
 * @param {object} artiste
 */
function updatePriceBox(artiste) {
  document.querySelector(".heartPrice_price").textContent =
    artiste.price + "€ / jour";
}

/**
 * Comptabiliser le nombre de like de chaque photo, puis le définir dans la section approprié de l'encart en bas de page
 * @param {object} media
 */
function setLikeBox(media) {
  let sum = 0;
  media.forEach((el) => (sum += el.likes));
  document.querySelector(".heartPrice_heart").textContent = sum + " ♥";
}

/**
 * Lire l'adresse, puis récupérer le champ artisteID et le hash
 * @returns {object}
 * @throws Error("Tag artisteId incorrecte")
 */
function getUrlParam() {
  let param = new URLSearchParams(window.document.location);
  let search;
  if (param.has("search")) {
    search = new URLSearchParams(window.document.location.search);
    if (search.has("artisteId")) this.artisteId = search.get("artisteId");
    else throw new Error("Tag artisteId incorrecte");
  }
  if (param.has("hash")) this.hash = window.document.location.hash;
  return this;
}

/**
 * Eventlistener sur le défilement afin de regler l'affichage de la bannière qui permet de remonter la page
 */
window.onscroll = function () {
  let banner_link = document.querySelector("#banner_link");
  if (
    document.documentElement.scrollTop >
    document.querySelector("#main").offsetTop
  )
    banner_link.classList.remove("hide");
  else banner_link.classList.add("hide");
};
