function frameClickListener(evt){

  let node = evt.target;
  while(node.className!="gallery_frame") node = node.parentNode;

  document.querySelector(".lightbox").style.display = "flex";
  setImgToPrint(node.style.order);

  window.addEventListener("keyup",keyListener);

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
  window.removeEventListener("keyup", keyListener);
  document.documentElement.style.overflowY = "auto";
}

function clickLeftLightBox (){
  
  let find = findIndex();
  find.index -=1;
  if(find.index<0) find.index = find.max;
  setImgToPrint(find.index);
}

function clickRightLightBox(){
  console.log("quoiii")
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
  return {index, max};
}
function keyListener(e){
  switch(e.key){
  case "ArrowLeft": clickLeftLightBox(); break;
  case " ": case "ArrowRight": clickRightLightBox(); break;
  case "Escape": closeEventListener(); break;
  default : break;
  }
}