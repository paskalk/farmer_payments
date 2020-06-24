const express = require('express');
const app = express();
const DataSource = require('./DataSource.js');
var bodyParser = require('body-parser');
var cors = require('cors');
const fileUpload = require('express-fileupload');

app.use(fileUpload());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.options('*', cors());

let data = new DataSource();

app.get('/', function(request, response){
    response.sendFile(__dirname +'/index.html');
});

app.get("/repayments", function(req, res){
    query = 'select repaymentid, customerid, seasonid, date, amount,parentid from repayments';

    data.executeStatement(query, null, result => {
        return res.json(result);
    });
});

app.get("/customersummaries", function(req, res){
    query = 'select customerid, seasonid, totalrepaid, totalcredit, totalcredit-totalrepaid as balance from customersummaries where totalrepaid <> totalcredit order by customerid, seasonid ';

    data.executeStatement(query, null, result => {
        return res.json(result);
    });
});

app.post("/uploadRepaymentsList", function(req, res){
    console.log(req.body.dateTime);
    console.log(req.body['files']);

    // let x = (req.body.file);
    // x = x.replace(/\n/g,'');
    // x = x.replace(/\t/g,'');
    // console.log(x);
    // 

    
    //     //return repayments in database
    // const fileData = require('./data.json');
    //     // console.log(keysToLower(fileData['RepaymentUploads']));
    // data.processRepaymentsList(keysToLower(fileData['RepaymentUploads']));
});


/*******Helpers*******/
function keysToLower(obj){
    return JSON.parse(JSON.stringify(obj)
        .replace(/"([^"]+)":/g, ($0, key) => {
            return '"' + key.toString().toLowerCase() + '":'
        }));
}

console.log('Running on port ' + 8000);
app.listen(8000);


