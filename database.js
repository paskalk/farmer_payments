require('dotenv').config();
const pool = require('pg').Pool

const conn = new pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: 5432,
    ssl: false
  })

  var insertToDatabase = function(req, res){
    // console.log(req);
    conn.query(req['text'], req['values'])
    .then(results => {
        res.end(JSON.stringify(results.rowCount));
    })
    .catch(e => {
        console.error(e.stack);
        res.end();
        // res.end(JSON.stringify(e.detail));
    })
}

var executePostsgresQuery  = function(req, res){
    conn.query(req, (error, results) => {
        if (error) {
            console.log(error);
        }
        // res.header("Access-Control-Allow-Origin", "*");
        // console.log(req);
        return results.rows;//res.json(results.rows);
    })
}

module.exports = executePostsgresQuery;