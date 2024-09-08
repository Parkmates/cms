// const midtransClient = require("midtrans-client");
const Midtrans = require("midtrans-client");
// Create Snap API instance
let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: "SB-Mid-server-_twRyfjOKtn1sy_TU0m1SJJh",
  clientKey: "SB-Mid-client-s68Dh9ROaQnw5Ft9",
});

async function POST(req) {
  const { trxId, type, amount } = await req.json();
  try {
    if (type === "booking") {
      let parameter = {
        transaction_details: {
          order_id: `Booking-${trxId}`,
          gross_amount: amount,
        },
        item_details: {
          name: "Booking Fee",
          price: amount,
          quantity: 1,
        },
      };

      const url = await snap.createTransaction(parameter);
      // console.log(url);

      return Response.json({ paymentUrl: url });
      // return Response.json({ id: trxId });
    }
  } catch (error) {
    console.log(error);
    return Response.json({ msg: error.message });
  }
}

module.exports = { POST };
