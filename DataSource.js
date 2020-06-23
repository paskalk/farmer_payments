
class DataSource {

    constructor(){
        this.data = require('./data.json');
        this.data['Repayments'] = [];
    }

    getRepaymentUploads(){
        return this.data['RepaymentUploads'];
    }

    getRepayments(){
        return this.data['Repayments'];
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

}

module.exports = DataSource;
