
"use client"
import { lemonSqueezyApiInstance } from '@/utils/axios';
import axios from 'axios';
import parse from 'html-react-parser';
import React, { useEffect, useState } from 'react'

export default function payment() {
  const [products, setProducts] = useState([])
  const fetchVariants = async (productId) => {
    console.log(productId)

    try {
      const response = await lemonSqueezyApiInstance.get(`https://api.lemonsqueezy.com/v1/products/${productId}/relationships/variants`);
      return response.data.data;
      console.log(response.data.data);
      // This will give you the array of variants
    } catch (error) {
      console.error("Error fetching variants:", error);
      return []; // Return an empty array if there's an error
    }
  };
  const buyProduct = async (productId) => {
    try {
      const response = await lemonSqueezyApiInstance.get(`/products/${productId}/relationships/variants`);
      console.log(response.data.data[0].id);
      
      // here call a post method to save all the transaction requried data to transactions table.
      // get the transactionId from the response

      // const transactionReqBody = {
      //   user_id: 1234,
      //   product_id: 1111,
      //   amount: 2000,
      //   status: '1',
      // }

      // const response = await axios.post("/api/transactions",transactionReqBody);
      // console.log(response.data);



      const purchaseReqBody = {
        variantId: response.data.data[0].id,
      }
      const purchaseResponse = await axios.post("/api/purchaseProduct", purchaseReqBody);
      console.log(purchaseResponse);

      window.open(purchaseResponse.data.checkoutUrl, "_blank");


    }
    catch (error) {
      console.error(error);
      alert("Failed to buy product #1");
    }
  }
  const allProducts = async () => {
    try {
      const response = await axios.get("/api/lemonsqueezy-products");
      setProducts(response.data.data);
      console.log(response.data.data);
    }
    catch (error) {
      console.error(error);
      alert("Failed to buy product #1");
    }
  }

  return (
    <div >
      <button onClick={allProducts} className='btn bg-green-400 px-3 py-1 text-white my-5'> see all products</button>
      <div className='flex gap-5 '>
        {
          products?.map((item) => {
            return (
              <div className='flex flex-col gap-2 bg-gray-200 p-5 rounded-lg'>
                <p>{item.id}</p>
                <p>{item.attributes?.name}</p>
                <p>{parse(item.attributes?.description)}</p>
                <button onClick={() => buyProduct(item.id)} className='btn bg-green-700 px-2 py-1 text-white rounded-lg '>Buy</button>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
