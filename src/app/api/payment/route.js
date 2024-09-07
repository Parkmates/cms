// const midtransClient = require("midtrans-client");
const Midtrans = require('midtrans-client');
// Create Snap API instance
let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: "SB-Mid-server-_twRyfjOKtn1sy_TU0m1SJJh",
  clientKey: "SB-Mid-client-s68Dh9ROaQnw5Ft9",
});

async function POST(req) {
  try {
    let parameter = {
      transaction_details: {
        order_id: "test-transaction-5",
        gross_amount: 200000,
      },
      item_details: {
        name: 'Booking Fee',
        price: 200000,
        quantity: 1
      },
    };

    const url = await snap.createTransaction(parameter);
    console.log(url);

    return Response.json({ url: url });
  } catch (error) {
    console.log(error);
    return Response.json({ msg: error.message });
  }
}

module.exports = { POST };
