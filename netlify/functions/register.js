const fs = require("fs");
const path = require("path");

exports.handler = async (event, context) => {
    if(event.httpMethod !== "POST"){
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    let body;
    try{
        body = JSON.parse(event.body);
    } catch(e){
        return { statusCode: 400, body: JSON.stringify({ success:false, message:"Invalid JSON" }) };
    }

    const { wallet, telegram, txHash } = body;
    if(!wallet || !telegram){
        return { statusCode: 400, body: JSON.stringify({ success:false, message:"Wallet and Telegram are required" }) };
    }

    // JSON file path (u funkciji se kreira /tmp folder za Netlify)
    const filePath = path.join("/tmp", "registrations.json");
    let all = [];

    try {
        if(fs.existsSync(filePath)){
            const existing = fs.readFileSync(filePath, "utf8");
            all = JSON.parse(existing);
        }
    } catch(err){ console.error(err); }

    all.push({ wallet, telegram, txHash, timestamp: new Date().toISOString() });

    try{
        fs.writeFileSync(filePath, JSON.stringify(all, null, 2));
    } catch(err){
        console.error(err);
    }

    return { statusCode: 200, body: JSON.stringify({ success:true, message:"Registered successfully!" }) };
};
