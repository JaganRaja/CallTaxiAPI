var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var taxiModel = new Schema({
    carNumber:String,
    carName:String,
    amountPerHour:Number,
    discountAmount:Number

});

module.exports = mongoose.model("taxi",taxiModel);