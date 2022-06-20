let express = require('express');
let router = express.Router();

    const classlist = require('../controller/getclasslist.controller');
    
    router.post('/classlist', classlist.ClassList);
    router.post('/classmembers', classlist.ClassMembers);
    router.post('/creategroup', classlist.CreateGroup);
    router.post('/grouplist', classlist.GroupList);
    router.post('/savedmessages', classlist.SavedMessages);
    router.post('/savemessage', classlist.SaveMessage);
    router.post('/studentclasslist', classlist.StudentClassList);

module.exports = router;
