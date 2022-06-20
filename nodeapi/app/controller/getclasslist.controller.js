const { encryptPayload } = require('../middleware/payloadHandler');
const { encrypt } = require('../middleware/passwordHandler');
const ClassList = require('../models/getclasslist.model')

exports.ClassList = (req, res) => {
    ClassList.getClassList(req.body, (err, data) =>{
        if(err){
            if (err.kind == "failed"){
                res.status(401).send({message: err.message || 'Errors found while retrieving data'});
            } else {
             res.status(500).send({message: err.message || 'Errors found while retrieving data'});
             }
        }else{
            console.log("success");
        res.send(encryptPayload(data));
        }
    });
}

exports.ClassMembers = (req, res) => {
    ClassList.getClassMembers(req.body, (err, data) =>{
        if(err){
            if (err.kind == "failed"){
                res.status(401).send({message: err.message || 'Errors found while retrieving data'});
            } else {
             res.status(500).send({message: err.message || 'Errors found while retrieving data'});
             }
        }else{
            console.log("success");
        res.send(encryptPayload(data));
        }
    });
}

exports.GroupList = (req, res) => {
    ClassList.getGroupList(req.body, (err, data) =>{
        if(err){
            if (err.kind == "failed"){
                res.status(401).send({message: err.message || 'Errors found while retrieving data'});
            } else {
             res.status(500).send({message: err.message || 'Errors found while retrieving data'});
             }
        }else{
            console.log("success");
        res.send(encryptPayload(data));
        }
    });
}

exports.CreateGroup = (req, res) => {
    ClassList.createGroup(req.body, (err, data) =>{
        if(err){
            if (err.kind == "failed"){
                res.status(401).send({message: err.message || 'Errors found while retrieving data'});
            } else {
             res.status(500).send({message: err.message || 'Errors found while retrieving data'});
             }
        }else{
            console.log("success");
        res.send(encryptPayload(data));
        }
    });
}

exports.SavedMessages = (req, res) => {
    ClassList.getSavedMessages(req.body, (err, data) =>{
        if(err){
            if (err.kind == "failed"){
                res.status(401).send({message: err.message || 'Errors found while retrieving data'});
            } else {
             res.status(500).send({message: err.message || 'Errors found while retrieving data'});
             }
        }else{
            console.log("success");
        res.send(encryptPayload(data));
        }
    });
}


exports.SaveMessage = (req, res) => {
    ClassList.saveMessage(req.body, (err, data) =>{
        if(err){
            if (err.kind == "failed"){
                res.status(401).send({message: err.message || 'Errors found while retrieving data'});
            } else {
             res.status(500).send({message: err.message || 'Errors found while retrieving data'});
             }
        }else{
            console.log("success");
        res.send(encryptPayload(data));
        }
    });
}

exports.StudentClassList = (req, res) => {
    ClassList.studentClassList(req.body, (err, data) =>{
        if(err){
            if (err.kind == "failed"){
                res.status(401).send({message: err.message || 'Errors found while retrieving data'});
            } else {
             res.status(500).send({message: err.message || 'Errors found while retrieving data'});
             }
        }else{
            console.log("success");
        res.send(encryptPayload(data));
        }
    });
}