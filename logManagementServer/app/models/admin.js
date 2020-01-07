let mongoose=require('mongoose');
let Schema=mongoose.Schema;
let admin=Schema({
    email:                              {  type:String,default:"",index:true},
    password:                           {  type:String,default:"" },
    created_at:                         {  type:Date,default:Date.now },
});
module.exports=mongoose.model('admin',admin);


