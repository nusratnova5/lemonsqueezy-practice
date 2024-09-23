// export const getProducts = async () => {
//     try {
//       const response = await api.get('/products');
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       return null;
//     }
//   };
import { lemonSqueezyApiInstance } from "@/utils/axios";

export const dynamic = "force-dynamic";


export async function GET() {
    try {
        const response = await lemonSqueezyApiInstance.get(`/products`);
        return Response.json(response.data);
    }
    catch (error) {
        console.error(error);
        return Response.json({ message: "An error occured" }, { status: 500 });
    }
}