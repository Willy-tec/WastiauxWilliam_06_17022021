class Fabric {
  constructor(artiste, media) {
    this.artiste = artiste;
    this.media = media;
  }
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

  renderImgLightbox() {
    let str = `<div class="lightbox_frame_principal_media" data-id=${this.media.id} style="display: none;">
    <img src="../image/full-size/${this.artiste.folderName}/${this.media.image}" alt="${this.media.altText}">
    <p class="lightbox_frame_principal_title">${this.media.title}</p>
  </div>`;
    return str;
  }

  renderVidLightbox() {
    let str = `<div class="lightbox_frame_principal_media" data-id=${this.media.id} style="display: none;">
      <video src="../image/full-size/${this.artiste.folderName}/${this.media.video}" controls=""></video>
      <p class="lightbox_frame_principal_title">${this.media.title}</p>
    </div>`;
    return str;
  }
}