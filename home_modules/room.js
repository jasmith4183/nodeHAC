class Room{
    constructor(newRoom){
    this.name =newRoom.name;
    this.description = '';
    this.widgets = '';
    this.background = '';
    this.devices = findByRoom(this.name);
    
    }
    
}

module.exports Room