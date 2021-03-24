function setLikeListener(){
  let likeArray = document.querySelectorAll(".gallery_frame_element_description_heart");
  likeArray.forEach(el => el.addEventListener("click", addLike));
}


function addLike(e){
  let node = e.target.parentNode.querySelector("p");
  let heart = parseInt(document.querySelector(".heartPrice_heart").textContent, 10);
  let mediaId = node.parentNode.parentNode.dataset.id;
  let media = virtualJSON.media.find(el => el.id == mediaId);


  if(!node.dataset.enable){
    node.textContent = parseInt(node.textContent, 10) +1;
    document.querySelector(".heartPrice_heart").textContent = heart+1;
    node.dataset.enable = 1 ;
    media.likes += 1;
    
  }
  else if(node.dataset.enable){
    node.textContent = parseInt(node.textContent, 10) -1;
    document.querySelector(".heartPrice_heart").textContent = heart-1;
    node.dataset.enable = "" ;
    media.likes -= 1;
  }
}