var counter = 0;

function Availability (data){
    this._id = counter++; 
    this.weekDay = data.weekDay;
    this.startTime = data.startTime;
    this.endTime = data.endTime;

    this.equals = function(other){
        return this._id == other._id;
    }    
    return this; 
}

module.exports = Availability;