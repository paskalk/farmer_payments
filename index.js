const express = require('express');
const app = express();
const DataSource = require('./DataSource.js');


let data = new DataSource();

// console.log(data.getRepaymentUploads());




//Pull all notifications
app.get("/repayments", function(req, res){
    //return repayments in database
    const fileData = require('./data.json');
    console.log(keysToLower(fileData['RepaymentUploads']));
    data.processRepaymentsList(keysToLower(fileData['RepaymentUploads']));
});


//Mark notifications as read
app.post("/api/updateNotification", function(req, res){
    // console.log(req.body);
    var query = {
        text: 'Update tbnotifications set read = true, readon = $1  where notificationid =$2',
        values: [new Date(), req.body['notificationid']],
    }
    insertToDatabase(query, res);
});


function keysToLower(obj){
    return JSON.parse(JSON.stringify(obj)
        .replace(/"([^"]+)":/g, ($0, key) => {
            return '"' + key.toString().toLowerCase() + '":'
        }));
}

// console.log(keysToLower({'lo':1}));

console.log('Running on port ' + 3000);
app.listen(3000);


