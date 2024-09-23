import { lemonSqueezyApiInstance } from "@/utils/axios";

export const dynamic = "force-dynamic";

export async function POST(req) {
    try {
        console.log("process.env.LEMON_SQUEEZY_API_KEY", process.env.LEMON_SQUEEZY_API_KEY)
        const reqData = await req.json();

        if (!reqData.variantId)
            return Response.json({ message: "productid is required" }, { status: 400 });

        const response = await lemonSqueezyApiInstance.post("/checkouts", {
            data: {
                type: "checkouts",
                attributes: {
                    checkout_data:{
                        custom: {
                            user_id: "123",
                            // transactionId: reqData?.transactionId,
                        },
                    },
                },
                relationships: {
                    store: {
                        data: {
                            type: "stores",
                            id: process.env.LEMON_SQUEEZY_STORE_ID.toString(),
                        }
                    },
                    variant: {
                        data: {
                            type: "variants",
                            id: reqData.variantId.toString(),
                        },
                    },
                },
            },
        });
        const checkoutUrl = response.data.data.attributes.url;
        return Response.json({checkoutUrl});
    }
    catch (error) {
        return Response.json(error, { status: 500 });

    }
}