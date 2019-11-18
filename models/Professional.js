const Availability = require('./Availability.js');

function Professional(data){
    this.id = data.id;
    this.name = data.email;
    this.availabilities = [];

    this.addAvailability = function(availability){
        // Only add if it doenst exist already
        if(!this.availabilities.find(a => a.equals(availability))) this.availabilities.push(availability);
        return this;
    }
    
    this.deleteAvailability = function(_id){
        // The _id of Availability also is the index position in the array
        this.availabilities.splice(_id, 1);
        return this;
    }

    this.updateAvailability = function(_id, data){
        this.availabilities[_id].weekDay = data.weekDay;
        this.availabilities[_id].startTime = data.startTime;
        this.availabilities[_id].endTime = data.endTime;
        return this;
    }

    this.getAvailability = function(_id){
        return this.availabilities[_id];
    }
}

module.exports = Professional; 