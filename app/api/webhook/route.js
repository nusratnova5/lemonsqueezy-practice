// import { lemonSqueezyApiInstance } from "@/utils/axios";

// export const dynamic = "force-dynamic";

// export async function POST(req) {
//     try {
//         const reqData = await req.json();
//         console.log('==============================================================================================================================================webhook', reqData);
//     }
//     catch (error) {
//         console.error(error);
//         Response.json({ message: "An error occured" }, { status: 500 });

//     }
// }
import { pool } from "@/utils/dbConnect";
import crypto from "crypto";

export async function POST(req) {
  try {
    // Catch the event type
    const clonedReq = req.clone();
    const eventType = req.headers.get("X-Event-Name");
    const body = await req.json();

    // Check signature
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SIGNATURE;
    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(
      hmac.update(await clonedReq.text()).digest("hex"),
      "utf8"
    );
    const signature = Buffer.from(req.headers.get("X-Signature") || "", "utf8");

    if (!crypto.timingSafeEqual(digest, signature)) {
      throw new Error("Invalid signature.");
    }

    console.log('body===================================================', body);

    const objectBody = {
      user_name: body?.data?.attributes?.user_name,
      customer_id: body?.data?.attributes?.customer_id,
      order_number: body?.data?.attributes?.order_number,
      order_id: body?.data?.attributes?.first_order_item?.order_id,
      price_id: body?.data?.attributes?.first_order_item?.price_id,
      quantity: body?.data?.attributes?.first_order_item?.quantity,
      product_id: body?.data?.attributes?.first_order_item?.product_id,
      variant_id: body?.data?.attributes?.first_order_item?.variant_id,
      product_name: body?.data?.attributes?.first_order_item?.product_name,
      total: body?.data?.attributes?.total,
      status: body?.data?.attributes?.status,
      store_id: body?.data?.attributes?.store_id,
      created_at: body?.data?.attributes?.created_at,
      updated_at: body?.data?.attributes?.updated_at
    };
console.log('myObject==================================================', objectBody);
try {
  // Insert new transaction into the database
  const newTransaction = await pool.query(
      `INSERT INTO transactions (
          user_name, 
          customer_id, 
          order_number, 
          order_id, 
          price_id, 
          quantity, 
          product_id, 
          variant_id, 
          product_name, 
          total, 
          status, 
          store_id, 
          created_at, 
          updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        objectBody?.user_name, 
        objectBody?.customer_id, 
        objectBody?.order_number, 
        objectBody?.order_id, 
        objectBody?.price_id, 
        objectBody?.quantity, 
        objectBody?.product_id, 
        objectBody?.variant_id, 
        objectBody?.product_name, 
        objectBody?.total, 
        objectBody?.status, 
        objectBody?.store_id, 
        objectBody?.created_at, 
        objectBody?.updated_at
      ]
  );
  
  console.log('New transaction added:', newTransaction.rows[0]);

  return Response.json(newTransaction.rows[0], { status: 201 });
} catch (err) {
  console.error('Database insertion error:', err);
  return Response.json({ message: 'Database insertion error' }, { status: 500 });
}

    // Logic according to event
    if (eventType === "order_created") {
      const userId = body.meta.custom_data.user_id;
      const isSuccessful = body.data.attributes.status === "paid";
    }

    return Response.json({ message: "Webhook received" });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}