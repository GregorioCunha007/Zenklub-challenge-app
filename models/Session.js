
function Session (data){
    this.professionalId = data.professionalId;
    this.professionalName = data.professionalName;
    this.startTime = data.startTime;
    this.userId = data.userId;  
    this.day = data.day;
}

module.exports = Session;