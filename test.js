// const individualRepayment = require('./index');
const DataSource = require('./DataSource.js');

let data = new DataSource();

test('Correct season balance is returned', () => {
    const customerId = 1;
    const seasonId = 180;
    const seasonBalance = data.seasonBalance(customerId, seasonId);

    expect(seasonBalance).toEqual(5600);
});


test('customer payment with season entered', () => {
    const customerId = 1;
    const seasonId = 180;
    const amount = 500;
    const customerBalance = data.updateRepayment(customerId);

    expect(customerBalance).toEqual(5700);
});

test('customer payment without season entered', () => {
    const customerId = 2;
    const seasonId = 170;
    const amount = 300;
    const customerBalance = data.updateRepayment(customerId);
    const seasonBalance = data.seasonBalance(customerId, seasonId);

    expect(customerBalance).toEqual(seasonBalance);
});

test('Repayment records updated', () => {
    const customerId = 2;
    const seasonId = 170;
    const amount = 300;
    const output = [
        { RepaymentID: 1, CustomerID: 1, SeasonID: 180, Amount: 500 },
        { RepaymentID: 2, CustomerID: 2, SeasonID: 170, Amount: 200 },
        { RepaymentID: 3, CustomerID: 2, SeasonID: 180, Amount: 100 }
    ];
    const repayments = data.getRepayments(customerId);

    expect(repayments).toEqual(output);
});
