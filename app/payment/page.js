
"use client"
import { lemonSqueezyApiInstance } from '@/utils/axios';
import axios from 'axios';
import parse from 'html-react-parser';
import React, { useEffect, useState } from 'react'
import TransactionTable from '../components/transaction-table/TransactionTable';

export default function payment() {
  const [products, setProducts] = useState([])
  const buyProduct = async (productId) => {
    try {
      const variantsReqBody = {
        productId: productId ,
      }
      const fetchVariantsResponse = await axios.post("/api/fetch-variants", variantsReqBody);
      // return fetchVariantsResponse.data.data;
      console.log(fetchVariantsResponse.data.data[0].id);

      const purchaseReqBody = {
        variantId: fetchVariantsResponse.data.data[0].id,
      }
      const purchaseResponse = await axios.post("/api/purchase-product", purchaseReqBody);
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
      // console.log(response.data.data);
    }
    catch (error) {
      console.error(error);
      alert("Failed to buy product #1");
    }
  }
  useEffect(() => {
    allProducts();
  }, []);

  return (
    <div className='w-3/4 mx-auto mt-10 flex flex-col justify-center' >
      <div className='flex gap-5 mx-auto '>
        {
          products?.map((item) => {
            return (
              <div className='flex flex-col w-full gap-2 bg-gray-200 p-5 rounded-lg'>
                <p className='text-xs'>{item.id}</p>
                <p className='font-bold mt-3'>{item.attributes?.name}</p>
                <p className='mb-3'>{parse(item.attributes?.description)}</p>
                <button onClick={() => buyProduct(item.id)} className='btn bg-green-700 px-2 py-1 mt-auto text-white rounded-lg '>Buy</button>
              </div>
            )
          })
        }
      </div>
      <TransactionTable/>
    </div>
  )
}
