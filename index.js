const DataSource = require('./DataSource.js');

let data = new DataSource();
console.log(data.getRepayments());
function processRepaymentsList(repaymentsList){
    //get list to process
    // loop through list
        //update repayment per individual repayment entry

    //write to file
        let uploadedRepaymentsList = data.getRepaymentUploads();
}

function individualRepayment(repaymentId, repaymentAmount, customer, season){
    //check if season is set
        //update repayment entry to match 
    //else if season not set
        //get a list of all pending repayments for the customer
        //loop through each and update accordingly
}

module.exports = individualRepayment;