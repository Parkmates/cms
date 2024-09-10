import TransactionModels from "@/db/models/transaction";
export async function GET(request) {
  console.log("running cron job");

  const { CRON_JOB_KEY } = process.env;
  const key = request.headers.get("CRON_JOB_KEY");

  if (key !== CRON_JOB_KEY) {
    return Response.json(
      {
        msg: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const data = await TransactionModels.checkOutStatusUpdater();
  // return new Response("Cron job is running");
  return Response.json(data);
}
