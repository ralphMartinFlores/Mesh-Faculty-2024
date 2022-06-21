const sql = require('./db.model');
const {encrypt, pw_check} = require('../middleware/passwordHandler')
const {generateToken} = require('../middleware/auth')

const ClassList = function(classlist) {

}

ClassList.getClassList = (data, result) => {
    try {
        let selectQuery = 'SELECT *, (SELECT COUNT(studnum_fld) FROM enrolledsubj_tbl WHERE enrolledsubj_tbl.classcode_fld = classes_tbl.classcode_fld) AS slots_fld FROM classes_tbl WHERE email_fld = ? AND ay_fld= ? AND sem_fld= ? GROUP BY classcode_fld;'
        let query = sql.format(selectQuery,[`${data.email_fld}`, `${data.ay}`, `${data.sem}`])

        sql.query(query, async (err, res)=>{
            if(err){
                result(err, null);
                return;
            }

            if(res.length) {
                console.log(res)
                result(null, {data: res, status: "success", message: "User Login Successfully"});
                return;
            }else{
                result({kind: "failed"}, null);
            }
        })
    } catch (error) {
        result(erro, null)
        return
    }
}

ClassList.getClassMembers = (data, result) => {
    try {
        let selectQuery = 'SELECT  (SELECT learningtype_fld FROM accounts_tbl WHERE studnum_fld = students_tbl.studnum_fld) as learningtype_fld, (SELECT block_fld FROM accounts_tbl WHERE studnum_fld = students_tbl.studnum_fld) as block_fld, studnum_fld, fname_fld, lname_fld, mname_fld, email_fld, extname_fld, sex_fld, dept_fld, program_fld, contactnum_fld, profilepic_fld FROM enrolledsubj_tbl LEFT JOIN students_tbl USING (studnum_fld) LEFT JOIN accounts_tbl USING(studnum_fld) WHERE classcode_fld=? AND enrolledsubj_tbl.ay_fld=? AND enrolledsubj_tbl.sem_fld=? AND isenrolled_fld = 2 ORDER BY lname_fld'
        let query = sql.format(selectQuery,[`${data.cc}`, `${data.ay}`, `${data.sem}`])

        sql.query(query, async (err, res)=>{
            if(err){
                result(err, null);
                return;
            }

            if(res.length) {
                result(null, {data: res, status: "success", message: "User Login Successfully"});
                return;
            }else{
                result(null, {data: query, status: "success", message: "User Login Successfully"});
            }
        })
    } catch (error) {
        result(erro, null)
        return
    }
}

ClassList.getGroupList = (data, result) => {
    try {
        let selectQuery = 'SELECT * FROM groups_tbl WHERE classcode_fld = ? AND participants_fld LIKE ? AND isdeleted_fld = ?'
        let query = sql.format(selectQuery,[`${data.classcode}`, `%${data.id}%`, `0`])

        sql.query(query, async (err, res)=>{
            if(err){
                result(err, null);
                return;
            }
            if(res.length) {
                result(null, {data: res, status: "success", message: "Successfully Retrived Groups"});
                return;
            }else{
                result(null, {data: res, status: "success", message: "No Record"});
            }
        })
    } catch (error) {
        result(erro, null)
        return
    }
}

ClassList.createGroup = (data, result) => {
    try {
        let selectQuery = 'INSERT INTO groups_tbl (groupname_fld, classcode_fld, participants_fld, roomid_fld) VALUES (?, ?, ?, ?)';
        let query = sql.format(selectQuery,[`${data.groupname_fld}`, `${data.classcode_fld}`, `${data.participants_fld}`, `${data.roomid_fld}`])

        sql.query(query, async (err, res)=>{
            if(err){
                result(err, null);
                return;
            }

            result(null, {status: "success", message: "New Group Chat Created"});
            return;
        })
    } catch (error) {
        result(erro, null)
        return
    }
}

ClassList.getSavedMessages = (data, result) => {
    try {
        let selectQuery = 'SELECT sender_fld, content_fld, datetime_fld FROM groupmessage_tbl WHERE groupid_fld = ?';
        let query = sql.format(selectQuery,[`${data.gid}`])
        console.log(query)

        sql.query(query, async (err, res)=>{
            if(err){
                result(err, null);
                return;
            }

            if(res.length) {
                console.log(res)
                result(null, {data: res, status: "success", message: "Successfully Retrived Messages"});
                return;
            }else{
                result(null, {data: res, status: "success", message: "No Record"});
            }
        })
    } catch (error) {
        result(erro, null)
        return
    }
}


ClassList.saveMessage = (data, result) => {
    try {
        let selectQuery = 'INSERT INTO groupmessage_tbl (groupid_fld, sender_fld, content_fld, datetime_fld) VALUES (?, ?, ?, ?)';
        let query = sql.format(selectQuery,[`${data.gid}`, `${data.sender}`, `${data.content}`, `${data.dt}`])

        sql.query(query, async (err, res)=>{
            if(err){
                result(err, null);
                return;
            }

            result(null, {status: "success", message: "New Message Saved!"});
            return;
        })
    } catch (error) {
        result(erro, null)
        return
    }
}

ClassList.studentClassList = (data, result) => {
    try {
        let selectQuery = 'SELECT * FROM ?? LEFT JOIN classes_tbl USING (classcode_fld) WHERE studnum_fld = ? AND enrolledsubj_tbl.ay_fld = ? AND enrolledsubj_tbl.sem_fld = ?;'
        let query = sql.format(selectQuery,['enrolledsubj_tbl', `${data.studnum_fld}`, `${data.ay}`, `${data.sem}`])
        console.log(query)

        sql.query(query, async (err, res)=>{
            if(err){
                result(err, null);
                return;
            }

            if(res.length) {
                console.log(res)
                result(null, {data: res, status: "success", message: "User Login Successfully"});
                return;
            }else{
                result({kind: "failed"}, null);
            }
        })
    } catch (error) {
        result(erro, null)
        return
    }
}


module.exports = ClassList