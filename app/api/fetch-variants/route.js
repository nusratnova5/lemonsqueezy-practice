import { lemonSqueezyApiInstance } from "@/utils/axios";

export async function POST(req) {
      try {
        const reqData = await req.json();
        const productId = reqData.productId;
        console.log(productId)

        const response = await lemonSqueezyApiInstance.get(`/products/${productId}/relationships/variants`);
        
        // Return the data using Response.json()
        return Response.json(response.data, { status: 200 });
      } catch (error) {
        console.error("Error fetching variants:", error);
        return Response.json({ message: "An error occurred" }, { status: 500 });
      }
}