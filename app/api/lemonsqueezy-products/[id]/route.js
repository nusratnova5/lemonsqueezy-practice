import { lemonSqueezyApiInstance } from "@/utils/axios";
export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
    try {
        const { id } = params;
        const productResponse = await lemonSqueezyApiInstance.get(`/products/${id}/variants`);
        const productData = productResponse.data;
        // const variantId = productData?.data?.relationships?.variants?.data?.[0]?.id;

        return Response.json({productData});
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error fetching product details", error }), { status: 500 });
    }
}