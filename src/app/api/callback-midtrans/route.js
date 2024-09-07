async function POST(req){
    const notif = await req.json()
    console.log(notif.transaction_status)

    return Response.json(notif.transaction_status);
}

module.exports = { POST }