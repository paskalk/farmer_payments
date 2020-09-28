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

app.get("/repaymentuploads", function(req, res){
    data.getRepaymentUploads();
    return res.json({'status':'success'});
});

app.post("/uploadRepaymentsList", function(req, res){
    const fileData = require('./data.json');
    data.processRepaymentsList(keysToLower(fileData['RepaymentUploads']));
    return res.json({'status':'success'});
});


/*******Helpers*******/
function keysToLower(obj){
    return JSON.parse(JSON.stringify(obj)
        .replace(/"([^"]+)":/g, ($0, key) => {
            return '"' + key.toString().toLowerCase() + '":'
        }));
}


app.listen(8000);


