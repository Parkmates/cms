export async function GET(request) {
  console.log("running cron job");

  return new Response("Cron job is running");
}
