const Availability = require('./Availability.js');

function Professional(data){
    this.id = data.id;
    this.name = data.email;
    this.availabilities = {};
    this.availabilityCounter = 0;

    this.addAvailability = function(availability){
        //TODO: Don't add availabilities with the same options
        this.availabilities[this.availabilityCounter] = availability;
        availability.setId(this.availabilityCounter);
        ++this.availabilityCounter;
        return this;
    }
    
    this.deleteAvailability = function(_id){
        // Expensive operation, only doing it because don't want to return undefined positions
        delete this.availabilities[_id];
        return this;
    }

    this.updateAvailability = function(_id, data){
        let availability = this.availabilities[_id];
        availability.weekDay = data.weekDay;
        availability.startTime = data.startTime;
        availability.endTime = data.endTime;
        return this;
    }

    this.getAvailability = function(_id){
        return this.availabilities[_id];
    }
}

module.exports = Professional; 