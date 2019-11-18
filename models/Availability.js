
function Availability (data){
    this._id = undefined; 
    this.weekDay = data.weekDay;
    this.startTime = data.startTime;
    this.endTime = data.endTime;

    this.equals = function(other){
        return this._id == other._id;
    }    

    this.setId = function(id){
        this._id = id;
    }

    return this; 
}

module.exports = Availability;