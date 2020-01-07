const Admin = require('../models/admin.js');
const Logs = require('../models/logs.js');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const Server = require('../models/server.js')
// const ObjectId = require('mongoose').Types.ObjectId;
module.exports = {
loginAdmin: async (request, response) => {
    try {
        const { email, password } = request.body;
        if (!email) return response.status(400).json({ success: 0,message: 'Email is required.' });
        if (email.length < 5) return response.status(400).json({success: 0,message: 'Email should not be less than 5 characters.' });
        if (!password) return response.status(400).json({success: 0, message: 'Password is required.' });
        let isAdmin = await Admin.findOne({ email: email, password: md5(password) });
        if (!isAdmin) return response.status(400).json({ success: 0, message: 'Invalid credentials' });
        let payloadData = {
            id:isAdmin._id,
            exp: Math.floor(Date.now() / 1000) + (60 * 60)
        }
        let createToken = await jwt.sign(payloadData, process.env.JWT_SECRET);
        let data = await Admin.findOne({ email: email, password: md5(password) }).select({ password: 0 })
        data.accessToken = createToken;
        return response.status(200).json({success: 1, message: 'Successfully logged in', data: {email:data.email,created_at:data.created_at,accessToken:createToken} });
    } catch (err) {
        console.log(err);
        return response.status(500).json({success: 0, message: err.message, err: err.message.error });
    }
},

addServer: async(request,response)=>{
    try{
        const { name, uid } = request.body;
        if (!name) return response.status(400).json({ success: 0, message: 'Server name is required.' });
        if (!uid) return response.status(400).json({ success: 0, message: 'uid is required.' });
        let isPresent = await Server.findOne({ $or: [ {name:name,uid:uid}, {name:name}, { uid:uid } ] } );
        if(isPresent) return response.status(400).json({  success: 0, message: 'Server already exists, please enter unique identifiers' });
        let key = md5(name+uid+Date().now)
        let server = new Server({
            name:name,
            uid:uid,
            apiKey:key
        });
        let savedData = await server.save()
        return response.status(200).json({success: 1, message: 'success', data: {apiKey:savedData.apiKey}});
    } catch (err) {
        console.log(err);
        return response.status(500).json({  success: 0, message: err.message, err: err.message.error });
    }
},
enableOrDisableAccess: async(request,response)=>{
    try{
        const { apiKey,provideAccess } = request.body;
        if (!apiKey) return response.status(400).json({ success: 0, message: 'apiKey is required.' });
        if (!provideAccess) return response.status(400).json({ success: 0, message: 'provideAccess is required.' });
        let isPresent = await Server.findOne({ apiKey:apiKey } );
        if(!isPresent) return response.status(400).json({  success: 0, message: 'Invalid Api Key' });
        await Server.updateOne({_id:isPresent._id},{$set:{isActive:provideAccess}})
        let afterUpdate = await Server.findOne({ _id:isPresent._id } ).select({name:1,uid:1,isActive:1});
        return response.status(200).json({success: 1, message: 'Successfully Updated Access',data: afterUpdate});
    } catch (err) {
        console.log(err);
        return response.status(500).json({  success: 0, message: err.message, err: err.message.error });
    }
},
sendLog: async(request,response)=>{
    try{
        const { serverId,time,fromIP,method,requestData,responseData,referer,userAgent,statusCode,status,path,host } = request.body;
        if (!serverId || !serverUid) return response.status(400).json({ success: 0, message: 'apiKey is required.' });
        if (!time || !method || !status) return response.status(400).json({ success: 0, message: 'Invalid loggerObject' });
        let logs = new Logs({
            serverId :serverId,
            serverUid:serverUid,
            time:time,
            fromIP:fromIP,
            method:method,
            requestData:requestData,
            responseData:responseData,
            referer:referer,
            userAgent:userAgent,
            statusCode:statusCode,
            status:status,
            path:path,
            host:host
        })
        let savedLog = await logs.save()
        //if(savedLog) console.log("log saved!")
        return response.status(200).json({success: 1, message: 'Successfully Added Log'});
    }
    catch(err){
        console.log(err);
        return response.status(500).json({ message: err.message, err: err.message.error });
    }
},
getLogs: async(request,response)=>{
    try{
        const { serverId } = request.body;
        const { from, to} = request.query;
        if (!serverId) return response.status(400).json({ success: 0, message: 'apiKey is required.' });
        let criteria = {serverId:serverId};
        if(from && to) criteria.time = {'$gte':  parseInt(from),'$lte': parseInt(to)}
        else if(from) criteria.time = {'$gte':  parseInt(from)};
        else if(to) criteria.time = {'$lte':  parseInt(to)};
        let alllogs = await Logs.find(criteria);        //without pagination
        // let aggreationArray = [
        //     {$match:{serverId:ObjectId(serverId)}},
        //     { $lookup: {from: "servers",
        //                 localField: 'serverId',
        //                 foreignField: '_id',
        //                 as: "serverData"}},
        //     {$unwind: { "path": "$serverData", "preserveNullAndEmptyArrays": true }},
        //     { $sort : { time : 1 } }
        //     ]
        // if(from && to) aggreationArray[0].$match.time = {'$gte':  parseInt(from),'$lte': parseInt(to)}
        // else if(from) aggreationArray[0].$match.time = {'$gte':  parseInt(from)};
        // else if(to) aggreationArray[0].$match.time = {'$lte':  parseInt(to)};
        // let logs = await Logs.aggregate(aggreationArray);
        return response.status(200).json({message: 'Successfully Sent Data', data:alllogs});
    }
    catch(err){
        console.log(err);
        return response.status(500).json({message: err.message, err: err.message.error});
    }
}
}