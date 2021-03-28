let contactButton = document.querySelector(".contact_button");
function modalTabulator(){
  this.current = 1;
  this.setFocus=() => this.array[this.current].focus();
  this.next= ()=>{
    this.current++;
    if(this.current>this.array.length-1)this.current = 0;
    this.setFocus();
  };
  this.init = ()=>{
    this.array = document.querySelectorAll(".modal_dialog input, .modal_dialog textarea, .modal_dialog button");
    this.setFocus();
  };
}
let md = new modalTabulator();


contactButton.addEventListener("click", ()=>{
  document.querySelector(".modal_bg").style.display = "block";
  window.addEventListener("keydown", modalKeyListener);
  md.init();
/*   setTimeout(() => {
    md.init();
    console.log(md);
  }, 1); */

});

function modalKeyListener(evt){
//evt.preventDefault();
  if(evt.key=="Tab")evt.preventDefault();
  switch (evt.key) {
  case "Tab": md.next();break;
  default: break;
  }
}

function closeModalListener(e){
  document.querySelector(".modal_bg").style.display = "none";
  window.removeEventListener("keydown", modalKeyListener);
  document.querySelector("a").focus();
 // document.querySelector("a").blur();
  console.log(e)
}


document.querySelector("form").addEventListener("submit", (e)=>{
  e.preventDefault();
  console.log(`
  Prénom: ${md.array[1].value};
  Nom: ${md.array[2].value};
  email: ${md.array[3].value};
  message: ${md.array[4].value}`);
  closeModalListener();
});