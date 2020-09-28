require('dotenv').config();
const pool = require('pg').Pool


class DataSource {

    constructor(){
        this.pgConnection = new pool({
            user: process.env.PSQL_USER,
            host: process.env.PSQL_HOST,
            database: process.env.PSQL_DATABASE,
            password: process.env.PSQL_PASSWORD,
            port: 5432,
            // ssl: { rejectUnauthorized: false }
        })
    }

    getRepaymentUploads(){     
        this.executeStatement('select customerid, seasonid, date, amount, processed from repaymentuploads', null,
        repaymentsList => this.processRepaymentsList(repaymentsList));        
    }

    processRepaymentsList(repaymentsList){
        
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
            //if customer in repayment upload list and doesn't have a balance e.g. cust 8
                //insert record
                //update customer summary

            this.executeStatement(
                query,
                filterParams,
                seasonBalancesList => this.processSingleCustomerRepaymentEntries(seasonBalancesList, entry['amount'])
            );
        }
    }

    processSingleCustomerRepaymentEntries(seasonBalancesList, currentAmount){
        
        let seasonsCount = 1;
        let parentId = parseInt(Date.now().toString().substring(4));
        for (let season of seasonBalancesList){
            let amountToPay = 0;
            
            if (currentAmount > 0){
                if (currentAmount > season['balance'] && Math.sign(season['balance']) !== -1 && seasonsCount !== seasonBalancesList.length){
                    this.insertRepaymentRecord(season['customerid'], season['seasonid'], currentAmount, parentId);//60
                    this.insertRepaymentRecord(season['customerid'], season['seasonid'], season['balance'] - currentAmount, parentId);//-40 
                    currentAmount -= season['balance'];
                    amountToPay = season['balance'];
                } else {
                    this.insertRepaymentRecord(season['customerid'], season['seasonid'], currentAmount, parentId);//40
                    amountToPay = currentAmount;
                    currentAmount -= currentAmount;
                }

                //Any money remaining is added to last season
                if (seasonsCount === seasonBalancesList.length){
                    amountToPay += currentAmount;
                } 
                season['totalrepaid'] += amountToPay;
                
                this.updateCustomerSummary(season['customerid'], season['seasonid'], season['totalrepaid']);
                
            }
            
            seasonsCount++;
        }
    }

    updateCustomerSummary(customer, season, amount){
        let query = 'Update customersummaries set totalrepaid = $1 where customerid = $2 and seasonid = $3';

        this.executeInsertStatement(query, [amount, customer, season]);
        
    }

    insertRepaymentRecord(customer, season, amount, parentid){

        let query = 'insert into repayments (customerid, seasonid, amount, parentid) values ($1, $2, $3, $4)';
        this.executeInsertStatement(query, [customer, season, amount, parentid]);
    }

    executeStatement(query, params = null, onSuccessCallback){
        if (params !== null){
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



module.exports = DataSource;
