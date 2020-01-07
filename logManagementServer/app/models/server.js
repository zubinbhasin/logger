let mongoose=require('mongoose');
let Schema=mongoose.Schema;
let server=Schema({
    name:                   { type:String, required:true },
    uid:                    { type:String, required:true },
    isActive:               { type:Boolean, default:true },
    apiKey:                 { type:String, required:true, unique:true}
    },{timestamps: true});
module.exports=mongoose.model('server',server)