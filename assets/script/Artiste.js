/**
 * Classe utilisé pour la création d'un nouvel artiste
 * @class
 */

class Artiste{

  /**
   * Assigne la variable représentant les données de l'artiste issu du fichier json transmis par OpenClassRoom
   * @param {Object} obj 
   */
  constructor(obj){
    obj && Object.assign(this, obj);
    this.getFolderName();
  }

  /**
   * Assignation du répertoire selon le nom de l'artiste
   * @function
   */
  getFolderName(){
    this.folderName = this.name.split(" ")[0];
  }
}