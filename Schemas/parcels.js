const Joi = require('joi');
const mongoose = require('mongoose');

//Setting up a schema
const parcelSchema = new mongoose.Schema({
    parcelItem : {
        type:String,
        required:true,
        max:30
    },
    parcelWeight : {
        type:String,
        required:true,
        max:10
    },
    From: {
        type:String,
        required:true,
    },
    To: {
        type:String,
        required:true,
    },
    Status: {
        type:String,
        default: ""
    }
})

//Validating the data from request body
exports.validation = (data) =>{
    const schema = Joi.object({
        parcelItem: Joi.string().required(),
        parcelWeight: Joi.string().required(),
        From : Joi.string().required(),
        To:Joi.string().required(),
        Status:Joi.string()
    });
    return schema.validate(data);
}

module.exports.parcelSchema = mongoose.model('parcels',parcelSchema);