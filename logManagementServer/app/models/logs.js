let mongoose=require('mongoose');
let Schema=mongoose.Schema;
let logs=Schema({
    serverId:               {type:Schema.Types.ObjectId,ref:'server',required:true},
    serverUid:              {type:String,required:true},
    time:                   {type:Number,required:true},
    fromIP:                 {type:String},
    method:                 {type:String, enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']},
    requestData:            {type:Object},
    responseData:           {type:String},
    referer:                {type:String},
    userAgent:              {type:String},
    statusCode:             {type:Number},
    status:                 {type:String},
    path:                   {type:String},
    host:                   {type:String},
},{timestamps: true})
module.exports=mongoose.model('logs',logs)