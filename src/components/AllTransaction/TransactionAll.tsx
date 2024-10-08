import { useEffect, useState } from 'react'
import { GetAllTransaction, Transaction } from './service/GetAllTransaction'
import { FaCopy, FaEye } from 'react-icons/fa'
import { Button, Input } from '@nextui-org/react'
import { Pagination } from '@nextui-org/react'
import { useStateTransaction } from '../../setting/store/stateTransaction'
import { convertUTCToLocal, formatTxnFee } from './service/TransactionService'

function TransactionAll() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [copiedHash, setCopiedHash] = useState<number | null>(null)
  const [copiedFrom, setCopiedFrom] = useState<number | null>(null)
  const [copiedTo, setCopiedTo] = useState<number | null>(null)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterAddress, setFilterAddress] = useState<string>('')
  const [showInput, setShowInput] = useState<boolean>(false)
  const [transactionDetail, setTransactionDetail] = useState<Transaction | null>(null)

  const { countTs } = useStateTransaction()

  const copyToClipboardHash = (index: number) => {
    const hash = transactions[index].transactionHash
    navigator.clipboard.writeText(hash)
    setCopiedHash(index)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  const copyToClipboardFrom = (index: number) => {
    const from = transactions[index].from
    navigator.clipboard.writeText(from)
    setCopiedFrom(index)
    setTimeout(() => setCopiedFrom(null), 2000)
  }

  const copyToClipboardTo = (index: number) => {
    const to = transactions[index].to
    navigator.clipboard.writeText(to)
    setCopiedTo(index)
    setTimeout(() => setCopiedTo(null), 2000)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterAddress(String(event.target.value))
    setCurrentPage(1)
  }
  const showDetailTransaction = (index: number) => {
    setShowInput(true)
    setTransactionDetail(transactions[index])
    console.log(transactions[index])
    console.log(index)
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const result = await GetAllTransaction({ pageNumber: currentPage, limitNumber: 10, address: filterAddress })
        setTransactions(result.data)
        setTotalPage(result.meta.lastPage)
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
        setTransactions([])
      } finally {
        console.log('Done')
      }
    }
    fetchTransactions()
  }, [currentPage, countTs, filterAddress])

  return (
    <div className='container mx-auto my-4 rounded-lg'>
      <div className='flex items-center gap-2 py-3 w-3/4'>
        <Input
          type='text'
          placeholder='Enter publicAddress here to search'
          value={filterAddress}
          onChange={handleInputChange}
        />
      </div>
      <table className='table-auto w-full text-left border-collapse border border-gray-300 rounded-lg overflow-hidden'>
        <thead>
          <tr className='bg-[rgb(51,139,238)]'>
            <th className='border px-4 py-2'>Transaction Hash</th>
            <th className='border px-4 py-2'>Method</th>
            <th className='border px-4 py-2'>Block</th>
            <th className='border px-2 py-2'>Time</th>
            <th className='border px-4 py-2'>From</th>
            <th className='border px-4 py-2'>To</th>

            <th className='border px-4 py-2'>Txn Fee</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn, index) => (
            <tr key={index} className='hover:bg-gray-100 bg-[rgb(255,251,242)]'>
              <td className='border px-2 py-2'>
                <div className='flex items-center justify-between'>
                  <button onClick={() => showDetailTransaction(index)}>
                    <FaEye className='text-blue-500 hover:text-blue-400 cursor-pointer' />
                  </button>
                  <a href={`https://bscscan.com/tx/${txn.transactionHash}`} target='_blank' rel='noopener noreferrer'>
                    {txn.transactionHash.slice(0, 9)}..
                  </a>
                  <button
                    onClick={() => copyToClipboardHash(index)}
                    className={`ml-2 ${copiedHash === index ? 'text-green-500' : 'text-blue-500'} hover:text-blue-700`}
                    title='Copy transaction hash'
                  >
                    <FaCopy />
                  </button>
                </div>
              </td>
              <td className='border px-4 py-2'>{txn.method}</td>
              <td className='border px-4 py-2'>{txn.block}</td>
              <td className='border px-2 py-2'>{convertUTCToLocal(txn.timestamp, 7)}</td>
              <td className='border px-4 py-2'>
                <div>
                  <a target='_blank' rel='noopener noreferrer'>
                    {txn.from.slice(0, 6)}...{txn.from.slice(-4)}
                  </a>
                  <button
                    onClick={() => copyToClipboardFrom(index)}
                    className={`ml-2 ${copiedFrom === index ? 'text-green-500' : 'text-blue-500'} hover:text-blue-700`}
                    title='Copy from address'
                  >
                    <FaCopy />
                  </button>
                </div>
              </td>
              <td className='border px-4 py-2'>
                <div>
                  <a target='_blank' rel='noopener noreferrer'>
                    {txn.to.slice(0, 6)}...{txn.to.slice(-4)}
                  </a>
                  <button
                    onClick={() => copyToClipboardTo(index)}
                    className={`ml-2 ${copiedTo === index ? 'text-green-500' : 'text-blue-500'} hover:text-blue-700`}
                    title='Copy from address'
                  >
                    <FaCopy />
                  </button>
                </div>
              </td>

              <td className='border px-4 py-2'>{formatTxnFee(txn.gasUsed, txn.gasPrice).slice(0, 9)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showInput && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20'>
          <div className='bg-white p-10 rounded-lg shadow-lg w-96 max-w-full'>
            <div className='mb-6'>
              <h4 className='text-lg font-semibold mb-4'>Transaction Details</h4>
              <p className='mb-2'>
                <span className='font-semibold'>Gas Used: </span>
                {transactionDetail?.gasUsed}
              </p>
              <p className='mb-2'>
                <span className='font-semibold'>Gas Price: </span>
                {transactionDetail?.gasPrice}
              </p>
              {transactionDetail?.method.slice(0, 3) === 'NFT' ? (
                // Nội dung hiển thị khi điều kiện đúng
                <p className='mb-2'>
                  <span className='font-semibold'>NFT Transfer with ID: </span>
                  {transactionDetail?.tokenTransfer}
                </p>
              ) : (
                // Nội dung hiển thị khi điều kiện sai
                <p className='mb-2'>
                  <span className='font-semibold'>Token Transfer: </span>
                  {transactionDetail?.tokenTransfer}
                </p>
              )}
            </div>
            <div className='flex justify-end space-x-6'>
              <Button
                onClick={() => setShowInput(false)}
                className='px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-700'
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      <Pagination
        className='pt-6 pb-6 '
        loop
        showControls
        color='success'
        total={totalPage}
        initialPage={1}
        onChange={(page) => setCurrentPage(page)}
      />
    </div>
  )
}
export default TransactionAll
