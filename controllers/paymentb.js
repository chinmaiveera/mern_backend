var braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: 'tcdv2yhj3qf55b2d',
    publicKey: 'wtfk76f8wqymbfdy',
    privateKey: 'ac4bf3928b3e6c6e9dc6d9b246299f05'
});
exports.getToken = (req, res) => {
    gateway.clientToken.generate({}, function (err, response) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(response);
        }
    });
};

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;

    let amountFromTheClient = req.body.amount;
    gateway.transaction.sale(
        {
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,

            options: {
                submitForSettlement: true
            }
        },
        function (err, result) {
            if (err) {
                res.status(500).json(error);
            } else {
                res.json(result);
            }
        }
    );
};