class Media{
  constructor(obj){
    obj && Object.assign(this, obj);
    this.findTitle();
    this.findAltText();
    this.formatDate();
  }

  findTitle() {
    let str;
    if(this.image) str = this.image;
    else if(this.video) str = this.video;
    let representation = str.split(".")[0];
    representation = representation.split("_");
    representation.shift();
    this.title = representation.join(" ");

  }

  findAltText() {
    let type;
    if(this.image) type = "Image";
    else if(this.video) type = "Vidéo";
    this.altText = type + " tagué " + this.tags + ", nommé " + this.title;
  }

  formatDate(){
    let timeStamp = Date.parse(this.date);
    this.formatedDate= new Date(timeStamp);
  }
}