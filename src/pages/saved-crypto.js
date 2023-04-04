import {useEffect, useState} from "react";
import axios from "axios";
import {useGetUserID} from '../hooks/useGetUserID';
import { useCookies } from 'react-cookie';

export const SavedCrypto = () => {
  const [crypto, setCrypto] = useState([])
  const [savedCrypto, setSavedCrypto] = useState([])
  const [results, setResults] = useState([])
  const [cookies, _] = useCookies(["access_token"])

  const userID = useGetUserID()

  useEffect(() => {

    const cryptoSet = async () => {
        try {
        const res = await fetch("https://api.coincap.io/v2/assets?limit=30")
        const data = await res.json();
        setCrypto(data.data)
        } catch (err) {
          console.error(err)
        }
    } 

    const resultsSet = async () => {
      try {
      const result = await axios.get(`http://localhost:5000/profile/faveCrypto/${userID}`)
      setSavedCrypto(result.data.value)
      setResults(crypto.filter(item => savedCrypto.includes(item.name)))
      } catch (err){
        console.error(err)
      }
    }
    cryptoSet()
    resultsSet()
  }, [crypto])

  const deleteCrypto = async (coinName) => {
    try {
      const response =  await axios.put("http://localhost:5000/profile/delete", {
            coinName,
            userID,
        }, {headers: {authorization: cookies.access_token}});
      } catch (err){
          console.error(err)
      }
}
  
  return (
      <section className='w-full mx-auto text-xs text-center'>
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
      <th className='px-2'>Remove</th>
    </tr>
   </thead>
    <tbody>
    {results.length ? (results.map((coin)=>(
      <tr key={coin.id}>
      <td className='hover:text-indigo-500'><a href={coin.explorer} rel="noreferrer" target="_blank">{coin.symbol}</a></td>
      <td>{coin.name}</td>
      <td>$ {Number(coin.priceUsd).toFixed(2)}</td>
      <td>$ {Number(coin.volumeUsd24Hr).toFixed(2)}</td>
      <td>$ {Number(coin.marketCapUsd).toFixed(2)}</td>
      <td>{Number(coin.changePercent24Hr).toFixed(2)} %</td>
      <td><button className='bg-indigo-500 text-white px-2 rounded-md hover:bg-indigo-300'
      onClick={()=>deleteCrypto(coin.name)}
      >-</button></td>
    </tr>
    ))): (null)}
    </tbody>
    </table>
  </div>
  </section>
  )
}