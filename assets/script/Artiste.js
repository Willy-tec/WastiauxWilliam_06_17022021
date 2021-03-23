class Artiste{
  constructor(obj){
    obj && Object.assign(this, obj);
    this.getFolderName();
    
  }
  getFolderName(){
    this.folderName = this.name.split(" ")[0];
  }
}