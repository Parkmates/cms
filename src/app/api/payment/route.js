// const midtransClient = require("midtrans-client");
const TransactionModels = require("@/db/models/transaction");
const Midtrans = require("midtrans-client");
// Create Snap API instance
let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

async function POST(req) {
  const { trxId, type, amount } = await req.json();
  try {
    if (type === "booking") {
      let parameter = {
        transaction_details: {
          order_id: `Booking-${trxId}-${new Date().getTime()}`,
          gross_amount: amount,
        },
        item_details: {
          name: "Booking Fee",
          price: amount,
          quantity: 1,
        },
      };

      const url = await snap.createTransaction(parameter);
      await TransactionModels.updatePaymentUrl({
        id: trxId,
        url: url.redirect_url,
      });
      // console.log(url);

      return Response.json({ paymentUrl: url });
      // return Response.json({ id: trxId });
    } else if (type === "payment") {
      let parameter = {
        transaction_details: {
          order_id: `Payment-${trxId}-${new Date().getTime()}`,
          gross_amount: amount,
        },
        item_details: {
          name: "Payment Fee",
          price: amount,
          quantity: 1,
        },
      };

      const url = await snap.createTransaction(parameter);
      // console.log(url);

      return Response.json({ paymentUrl: url });
    }
  } catch (error) {
    console.log(error);
    return Response.json({ msg: error.message });
  }
}

module.exports = { POST };
