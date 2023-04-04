import React, {useState, useEffect} from 'react'
import axios from "axios";
import {useGetUserID} from '../hooks/useGetUserID';
import { useCookies } from 'react-cookie';

const style = {
  limitButton: `bg-indigo-500 text-white p-1 mx-1 mt-1 rounded-sm hover:bg-indigo-300 cursor-pointer disabled:bg-gray-300`
}

export const Home = () => {
  const userID = useGetUserID();
  const [crypto, setCrypto] = useState([])
  const [savedCrypto, setSavedCrypto] = useState([])
  const [cookies, _] = useCookies(["access_token"])
  const [limit, setLimit] = useState(50)

  useEffect(() => {
    const crypto = async () => {
      try{
      const res = await fetch(`https://api.coincap.io/v2/assets?limit=${limit}`)
      const data = await res.json();
      setCrypto(data.data)
    } catch(err){
        console.error(err)
      }     
    }

    const getSavedCrypto = async () => {
      try {
      const result = await axios.get(`http://localhost:5000/profile/faveCrypto/${userID}`)
      setSavedCrypto(result.data.value)
      } catch (err) {
        console.error(err)
      }
    }
    crypto();
    if (cookies.access_token) {getSavedCrypto()}
  }, [savedCrypto, limit])

  const saveCrypto = async (coinName) => {
    try {
      const response =  await axios.put("http://localhost:5000/profile", {
            coinName,
            userID,
        }, {headers: {authorization: cookies.access_token}});
      } catch (err){
          console.error(err)
      }
}

const isCryptoSaved = (id) => savedCrypto.includes(id)

const updateLimit = (number) => {
  setLimit(number)
}
  
  return (
    <section className='w-full mx-auto text-xs text-center'>
      <div>
       <button className={style.limitButton} onClick={()=>updateLimit(10)}>10</button>
       <button className={style.limitButton} onClick={()=>updateLimit(25)}>25</button>
       <button className={style.limitButton} onClick={()=>updateLimit(50)}>50</button>
       <button className={style.limitButton} onClick={()=>updateLimit(100)}>100</button>
      </div>
    <div className='mt-4'>
      <table className='m-auto border border-indigo-500'>
      <thead className='h-8'>
      <tr className='bg-indigo-500 text-white'>
        <th>Symbol</th>
        <th>Name</th>
        <th className='px-2'>Price</th>
        <th className='px-2'>Volume (24H)</th>
        <th className='px-2'>Mcap</th>
        <th>24HR change</th>
        <th className='px-2'>Save</th>
      </tr>
     </thead>
      <tbody>
      {crypto.map((coin,i)=>(
        <tr key={coin.id}>
        <td className='hover:text-indigo-500'><a href={coin.explorer} rel="noreferrer" target="_blank">{coin.symbol}</a></td>
        <td>{coin.name}</td>
        <td>$ {Number(coin.priceUsd).toFixed(2)}</td>
        <td>$ {Number(coin.volumeUsd24Hr).toFixed(2)}</td>
        <td>$ {Number(coin.marketCapUsd).toFixed(2)}</td>
        <td>{Number(coin.changePercent24Hr).toFixed(2)} %</td>
        <td><button
        type="button"
        disabled={isCryptoSaved(coin.name) ||!cookies.access_token}
        onClick={()=>saveCrypto(coin.name)} 
        className='bg-indigo-500 text-white px-2 rounded-md hover:bg-indigo-300 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed'
        >+</button>
        </td>
      </tr>))}
      </tbody>
      </table>
    </div>
    </section>
  )
}
