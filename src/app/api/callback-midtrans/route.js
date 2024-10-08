const TransactionModels = require("@/db/models/transaction");

async function POST(req) {
  const notif = await req.json();
  const [type, id, time] = notif.order_id.split("-");
  console.log(notif.transaction_status);
  if (type === "Booking") {
    if (notif.transaction_status === "settlement") {
      const status = "bookingPaymentSuccess";
      const bookTime = notif.transaction_time;
      const update = await TransactionModels.updateStatus({
        id,
        type: status,
        bookAt: bookTime,
      });

      return Response.json(status);
    } else if (notif.transaction_status === "failed") {
      const status = "failed";
      const update = await TransactionModels.updateStatus({ id, type: status });

      return Response.json(update);
    } else if (notif.transaction_status === "expire") {
      const status = "expire";
      const update = await TransactionModels.updateStatus({ id, type: status });

      return Response.json(update);
    } else {
      console.log(notif.transaction_status);
      return Response.json(notif.transaction_status);
    }
  } else if (type === "Payment") {
    if (notif.transaction_status === "settlement") {
      const status = "paymentSuccess";
      const payTime = notif.transaction_time;
      const update = await TransactionModels.updateStatus({
        id,
        type: status,
        amount: notif.gross_amount,
        paymentAt: payTime,
      });

      return Response.json(update);
    } else if (notif.transaction_status === "failed") {
      const status = "failed";
      const update = await TransactionModels.updateStatus({ id, type: status });

      return Response.json(update);
    } else {
      console.log(notif.transaction_status);
      return Response.json(notif.transaction_status);
    }
  }
}

module.exports = { POST };
