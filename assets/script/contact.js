let contactButton = document.querySelector(".contact_button");
/**
 * Classe permettant le suivi des tabulations au sein de la modal Contact
 * @class
 */
function modalTabulator(){
  this.current = 0;
  /**
   * Défini le focus sur la cible du tableau visé par this.current
   * @function
   */
  this.setFocus= ()=> this.array[this.current].focus();
  /**
   * Incrémente la valeur de this.current, qui représente l'index a cibler par le focus
   * @function
   */
  this.next= ()=>{
    this.current++;
    if(this.current>this.array.length-1)this.current = 0;
    this.setFocus();
  };
  /**
   * Initialise le tableau contenant les inputs a cibler lors de la tabulation
   * @function
   */
  this.init = ()=>{
    this.array = document.querySelectorAll(".modal_dialog input, .modal_dialog textarea, .modal_dialog button");
    this.setFocus();
  };
}
let md = new modalTabulator();

/**
 * Affiche la modale Contact lors du click sur le bouton "contact"
 * @function
 * @listens cLick
 * @fires modalKeyListener
 */
contactButton.addEventListener("click", ()=>{
  document.querySelector(".modal_bg").style.display = "block";
  window.addEventListener("keydown", modalKeyListener);
  md.init();
});

/**
 * Listener qui permet de choisir l'action approprié selon la touche "tabulation", ou "escape"
 * (Empêche le fonctionement par défaut de la touche "tabulation")
 * @function
 * @param {event} evt 
 * @listens keyEvent
 */
function modalKeyListener(evt){
  if(evt.key=="Tab")evt.preventDefault();
  switch (evt.key) {
  case "Tab": md.next();break;
  case "Escape": closeModalListener(); break;
  default: break;
  }
}
/**
 * Listener que l'on actionne lorsque l'on veut fermer la modale contact
 * @param {event} e 
 */
function closeModalListener(e){
  document.querySelector(".modal_bg").style.display = "none";
  window.removeEventListener("keydown", modalKeyListener);
  document.querySelector("a").focus();
 // document.querySelector("a").blur();
  console.log(e)
}

/**
 * Ecouter le formulaire et renvoyer les info de contact, ainsi que le message dans la console de votre navigateur
 */
document.querySelector("form").addEventListener("submit", (e)=>{
  e.preventDefault();
  console.log(`
  Prénom: ${md.array[1].value};
  Nom: ${md.array[2].value};
  email: ${md.array[3].value};
  message: ${md.array[4].value}`);
  closeModalListener();
});