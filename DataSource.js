require('dotenv').config();
const pool = require('pg').Pool
const sqlSelect = require('./database.js');

class DataSource {

    constructor(){
        this.pgConnection = new pool({
            user: process.env.PSQL_USER,
            host: process.env.PSQL_HOST,
            database: process.env.PSQL_DATABASE,
            password: process.env.PSQL_PASSWORD,
            port: 5432,
            ssl: false
        })
    }

    getRepayments(){
        return this.executeStatement('select repaymentid, customerid, seasonid, date, amount, parentid from repayments');
        // return this.data['Repayments'];
    }

    updateRepayment(customer, season, amount){
        //add a record for each repayment and create a new id for each

         //update customer summaries( total repaid and total Credit)

         //return balance
    }

    // updateCustomerSummaries(customer, season, amount){
    //     //update total repaid and total Credit
    // }

    seasonBalance(customer, season){
        //return balance left for a particular season i.e credit - repaid
    }


    getRepaymentUploads(callback){     
        this.executeStatement('select customerid, seasonid, date, amount, processed from repaymentuploads limit 3', null,
        repaymentsList => this.processRepaymentsList(repaymentsList));        
    }

    processRepaymentsList(repaymentsList){
        console.log(repaymentsList);
        for (let entry of repaymentsList){
            let query = '';
            let filterParams;
            if (entry['seasonid']){
                query = 'select customerid, seasonid, totalrepaid, totalcredit, totalcredit-totalrepaid as balance, case seasonid when $1 then 1 else 0 end as selectedseason from customersummaries where customerid=$2 and totalrepaid <> totalcredit order by selectedseason desc, seasonid ';
                filterParams = [entry['seasonid'], entry['customerid']];
            } else {
                query = 'select customerid, seasonid, totalrepaid, totalcredit, totalcredit-totalrepaid as balance from customersummaries where customerid=$1 and totalrepaid <> totalcredit order by seasonid ';
                filterParams = [entry['customerid']];
            }

            this.executeStatement(
                query,
                filterParams,
                seasonBalancesList => this.processSingleRepaymentEntries(seasonBalancesList, entry['amount'])
            );
        }
    }

    processSingleRepaymentEntries(seasonBalancesList, balanceAmount){
        // console.log(seasonBalancesList);
        let seasonsCount = 1;
        let parentId = parseInt(Date.now().toString().substring(4));
        for (let season of seasonBalancesList){
            let amountToPay;
            if (balanceAmount > 0){
                if (balanceAmount > season['amount'] && seasonsCount !== seasonBalancesList.length){
                    amountToPay = season['amount'];
                    balanceAmount -= season['amount'];
                } else {
                    amountToPay = balanceAmount;
                    balanceAmount -= season['amount'];
                }
                
                this.insertRepaymentRecord(season['customerid'], season['seasonid'], amountToPay, parentId)

                //Any money remaining is added to last season
                if (seasonsCount === seasonBalancesList.length){
                    amountToPay += balanceAmount;
                } 

                season['totalrepaid'] += amountToPay;
                
                this.updateCustomerSummary(season['customerid'], season['seasonid'], season['totalrepaid']);
            }
            
            seasonsCount++;
        }
    }

    updateCustomerSummary(customer, season, amount){
        let query = 'Update customersummaries set totalrepaid = $1 where customerid = $2 and seasonid = $3';

        console.log('pay skipped: ', amount, season);

        // this.executeInsertStatement(query, [amount, customer, season]);
        
    }

    insertRepaymentRecord(customer, season, amount, parentid){
        console.log('Amount Paid: ', amount, season, customer);

        let query = 'insert into repayments (customerid, seasonid, amount, parentid) values ($1, $2, $3, $4)';
        this.executeInsertStatement(query, [customer, season, amount, parentid]);
    }

    executeStatement(query, params = null, onSuccessCallback){
        if (params !== null){
            // console.log(params);
            this.pgConnection.query(query, params, (err, res) => {
                if (err){
                    console.log(err);
                }
                onSuccessCallback(res['rows']);
            })
        } else {
            this.pgConnection.query(query, (err, res) => {
                if (err){
                    console.log(err);
                }
                onSuccessCallback(res['rows']);
            })
        }
        
    }

    executeInsertStatement(query, params){
        this.pgConnection.query(query, params)
        .then(results => {
            console.log('Records inserted/updated',results.rowCount);
        })
        .catch(e => {
            console.error(e.stack);
            res.end();
        })
    }
}

// let data = new DataSource();
// let temp =  data.getRepaymentUploads();


module.exports = DataSource;
