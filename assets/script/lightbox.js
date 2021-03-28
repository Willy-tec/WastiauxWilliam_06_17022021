function frameClickListener(evt){

  let node = evt.target;
  while(node.className!="gallery_frame") node = node.parentNode;

  document.querySelector(".lightbox").style.display = "flex";
  setImgToPrint(node.style.order);

  window.addEventListener("keydown", keyListener);

  document.documentElement.style.overflowY = "hidden";
}


function setImgToPrint(index){
  let lightGallery = document.querySelectorAll(".lightbox_frame_principal_media");
  let mediaId = virtualJSON.media[index].id;
  lightGallery.forEach(el => {
    if(el.dataset.id == mediaId) el.style.display = "block";
    else el.style.display = "none";
  });
}

function closeEventListener(){
  document.querySelector(".lightbox").style.display = "none";
  window.removeEventListener("keydown", keyListener);
  document.documentElement.style.overflowY = "auto";
  document.querySelector("a").focus();
}

function clickLeftLightBox (){
  
  let find = findIndex();
  find.index -=1;
  if(find.index<0) find.index = find.max;
  setImgToPrint(find.index);
}

function clickRightLightBox(){

  let find = findIndex();
  find.index +=1;
  if(find.index>find.max) find.index = 0;
  setImgToPrint(find.index);
}

function findIndex(){
  let lightbox = document.querySelectorAll(".lightbox_frame_principal_media");
  let max = lightbox.length-1;
  let mediaId;
  let idArray = virtualJSON.media.map(el => el.id);
  lightbox.forEach(el => {
    if(el.style.display == "block") mediaId = el.dataset.id;
  });
  let index = idArray.indexOf( parseInt(mediaId,10));
  return {index, max, mediaId};
}

let index=0, oldNode={};

function setFocus(e){
  let node,
    array = [],
    dom = document.querySelector("#lightbox");

  e.preventDefault();

  let find = findIndex();
  let vidNode = virtualJSON.media.find(el => el.id == find.mediaId);

  array.push(dom.querySelector(".lightbox_frame_left_arrow").parentNode);
  if(vidNode.video) array.push(dom.querySelector(`[data-id="${find.mediaId}"] video`));
  array.push(dom.querySelector(".lightbox_frame_right_arrow").parentNode);
  array.push(dom.querySelector(".lightbox_frame_right_cross").parentNode);

  node= array[index];
  node.focus();
  index++;
  if(index>array.length-1) index = 0;
  node.classList.add("focus");
  if(oldNode.classList) oldNode.classList.remove("focus");
  oldNode = node;
}


function keyListener(e){
  
  //e.stopPropagation();
  switch(e.key){
  case "ArrowLeft": clickLeftLightBox(); break;
  case "ArrowRight": clickRightLightBox(); break;
  case "Escape": closeEventListener(); break;
  case "Tab": setFocus(e); break;
  case " ": readPauseMedia(e); break;
  default : break;
  }
}
function readPauseMedia(e){
  console.log("space");

  let find = findIndex();
  let vidNode = virtualJSON.media.find(el => el.id == find.mediaId);
  if(vidNode.video)console.log("vidéo spo")
}
