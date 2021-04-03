/**
 * Ajout des listeners sur chaque petit coeur visibles sous les photos de la gallerie
 */
function setLikeListener(){
  let likeArray = document.querySelectorAll(".gallery_frame_element_description_heart");
  likeArray.forEach(el => el.addEventListener("click", addLike));
}

/**
 * Incrémenté ou décrémenté le like sur la photo ciblé, ainsi que dans l'encart en bas de page affichant le total de like. A noter : Le total n'est pas recalculé selon les likes de chaque photo.
 * @param {event} e 
 */
function addLike(e){
  let node = e.target.parentNode.querySelector("p");
  /**
   * récupéré le nombre de like au format {string} et le convertir en {number}
   */
  let heart = parseInt(document.querySelector(".heartPrice_heart").textContent, 10);
  let mediaId = node.parentNode.parentNode.dataset.id;
  let media = virtualJSON.media.find(el => el.id == mediaId);
  /**
   * Si le like n'est pas actif, on incrémente le nombre puis on défini un dataset "enable" a true
   */
  if(!node.dataset.enable){
    node.textContent = parseInt(node.textContent, 10) +1;
    document.querySelector(".heartPrice_heart").textContent = heart+1+" ♥";
    node.dataset.enable = 1 ;
    media.likes += 1;
  }
  /**
   * Si le like est actif, on décrémente. On défni le dataset "enable" a false
   */
  else if(node.dataset.enable){
    node.textContent = parseInt(node.textContent, 10) -1;
    document.querySelector(".heartPrice_heart").textContent = heart-1+" ♥";
    node.dataset.enable = "" ;
    media.likes -= 1;
  }
}