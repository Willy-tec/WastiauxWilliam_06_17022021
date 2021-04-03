/**
 * Classe fabric qui retourne une node formaté selon les données transmise, et selon les critères : destination galerie ou lightbox. Format du média : image ou vidéo.
 * @class
 */
class Fabric {
  /**
   * Initialise les valeurs de la fabric avec les données transmises issu du fichier json d'openclass room
   * @param {object} artiste 
   * @param {object} media 
   */
  constructor(artiste, media) {
    this.artiste = artiste;
    this.media = media;
  }
  /**
   * Permet de définir la destination possible: "gallery" ou "lightbox"
   * @param {string} destination 
   * @throws Error("Mauvais tag img/vid")
   * @returns {HTMLElement}
   */
  render(destination) {
    if (destination == "gallery") {
      if (this.media.image) return this.renderImg();
      else if (this.media.video) return this.renderVid();
      else throw Error("Mauvais tag img/vid");
    } else if (destination == "lightbox") {
      if (this.media.image) return this.renderImgLightbox();
      else if (this.media.video) return this.renderVidLightbox();
      else throw Error("Mauvais tag img/vid");
    }
  }
  /**
   * Création de la node html qui contient tout les éléments pour afficher l'image dans la galerie correctement.
   * @function
   * @returns {HTMLElement}
   */
  renderImg() {
    let str = `<div class="gallery_frame" data-id=${this.media.id}>
    <a href="javascript:void(0)" tabindex="0" >
      <img src="../image/image_vignette/${this.artiste.folderName}/${this.media.image}" alt="${this.media.altText}" class="gallery_frame_element" data-id="${this.media.id}">
    </a>
    <div class="gallery_frame_element_description" data-id="${this.media.id}">
      <h3>${this.media.title}</h3>
      <p class="gallery_frame_element_description_blank"></p>
      <p>${this.media.price}€</p>
      <div>
        <p>${this.media.likes}</p>
        <button class="gallery_frame_element_description_heart" tabindex="0">♥</button>
      </div>
    </div>
  </div>`;
    return str;
  }
  /**
   * Création de la node html qui contient tout les éléments pour afficher la vidéo dans la galerie correctement.
   * @function
   * @returns {HTMLElement}
   */
  renderVid() {
    let str = `<div class="gallery_frame" data-id=${this.media.id}>
  <a href="javascript:void(0)" tabindex="0">
    <video style="width: 100%;" data-id="${this.media.id}" class="gallery_frame_element">Votre navigateur ne prend pas en charge la vidéo
      <source src="../image/image_vignette/${this.artiste.folderName}/${this.media.video}" type="video/mp4">
      <poster></poster>
    </video>
  </a>
  <div class="gallery_frame_element_description" data-id="${this.media.id}">
    <h3>${this.media.title}</h3>
    <p class="gallery_frame_element_description_blank"></p>
    <p>${this.media.price}€</p>
    <div>
      <p>${this.media.likes}</p>
      <button class="gallery_frame_element_description_heart" tabindex="0">♥</button>
    </div>
  </div>
</div>`;
    return str;
  }
  /**
   * Création de la node html qui contient tout les éléments pour afficher l'image dans la lightbox correctement.
   * @function
   * @returns {HTMLElement}
   */
  renderImgLightbox() {
    let str = `<div class="lightbox_frame_principal_media" data-id=${this.media.id} style="display: none;">
    <img src="../image/full-size/${this.artiste.folderName}/${this.media.image}" alt="${this.media.altText}">
    <p class="lightbox_frame_principal_title">${this.media.title}</p>
  </div>`;
    return str;
  }
  /**
   * Création de la node html qui contient tout les éléments pour afficher la vidéo dans la lightbox correctement.
   * @function
   * @returns {HTMLElement}
   */
  renderVidLightbox() {
    let str = `<div class="lightbox_frame_principal_media" data-id=${this.media.id} style="display: none;">
      <video src="../image/full-size/${this.artiste.folderName}/${this.media.video}" controls=""></video>
      <p class="lightbox_frame_principal_title">${this.media.title}</p>
    </div>`;
    return str;
  }
}