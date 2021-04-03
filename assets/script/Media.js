/**
 * Classe utilisé pour la création d'un media
 * @class
 */
class Media{
  /**
   * Assigner les données du fichier JSON fourni par ocr définissant un media. Le fichier JSON d'ocr contient un tableau d'artiste, et un tableau de media. Obj représente un seul de ces média.
   * Effectuer quelques modifications pour avoir un nom correcte, un texte alternatif, et un format de date approprié
   * @param {object} obj 
   */
  constructor(obj){
    obj && Object.assign(this, obj);
    this.findTitle();
    this.findAltText();
    this.formatDate();
  }
  /**
   * Permet de définir le titre approprié du média, en effacant les artefacts(".","_")
   */
  findTitle() {
    let str;
    /**
     * Attribution du texte en fonction du type du media
     */
    if(this.image) str = this.image;
    else if(this.video) str = this.video;
    /**
     * Sectionner le texte selon le "." pour retirer l'extension
     */
    let representation = str.split(".")[0];
    /**
     * Sectionner le texte pour retirer les underscores et séparer les différents mots
     */
    representation = representation.split("_");
    /**
     * Retirer le tag inclu dans le nom de fichier
     */
    representation.shift();
    /**
     * Réassembler les mots restant pour former le titre
     */
    this.title = representation.join(" ");

  }
  /**
   * Définir le texte alternatif de chaque media
   */
  findAltText() {
    let type;
    if(this.image) type = "Image";
    else if(this.video) type = "Vidéo";
    this.altText = type + " tagué " + this.tags + ", nommé " + this.title;
  }
  /**
   * Convertir la date en données au format date plus approprié pour le traitement.
   */
  formatDate(){
    let timeStamp = Date.parse(this.date);
    this.formatedDate= new Date(timeStamp);
  }
}