import { useAccount, useDisconnect } from 'wagmi'
import { useUser } from '../../setting/store/user'
import Footer from '../footer/Footer'
import './LayoutDefault.css'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
function LayoutDefault() {
  const { clear } = useUser()
  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  const handleLogout = () => {
    clear() // Xóa token và các thông tin khác
    disconnect() // Ngắt kết nối tài khoản
  }

  useEffect(() => {
    // Lắng nghe sự kiện khi tài khoản MetaMask thay đổi
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // Người dùng ngắt kết nối ví
        handleLogout()
      } else if (accounts[0] !== address) {
        // Nếu tài khoản thay đổi, tự động đăng xuất
        handleLogout()
      }
    }

    // Thêm sự kiện lắng nghe vào window.ethereum
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
    }

    // Cleanup sự kiện khi component bị unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  }, [address, disconnect])
  return (
    <div className='flex flex-col min-h-screen'>
      <header className='header pb-4'>
        <div className='header-logo flex items-center'>
          <Link to='/' className='flex'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='220'
              height='50'
              fill='currentColor'
              className='pl-3 pt-3'
              viewBox='0 0 184 41'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M10.5497 0H38.4507C39.1165 0 39.7315 0.356142 40.0635 0.933924L48.1922 15.0798C48.6137 15.8134 48.4885 16.7393 47.8872 17.3342L25.5127 39.4708C24.7879 40.1879 23.622 40.1879 22.8972 39.4708L0.552922 17.3641C-0.0623286 16.7554 -0.177538 15.8025 0.274888 15.0643L8.96384 0.888538C9.30224 0.336459 9.90273 0 10.5497 0ZM34.8482 6.31565V10.2848H26.9003V13.0367C32.4824 13.3308 36.6704 14.5386 36.7015 15.9863L36.7013 19.0044C36.6702 20.4521 32.4824 21.6599 26.9003 21.954V28.7075H21.6228V21.954C16.0407 21.6599 11.8527 20.4521 11.8217 19.0044L11.8218 15.9863C11.8529 14.5386 16.0407 13.3308 21.6228 13.0367V10.2848H13.6749V6.31565H34.8482ZM24.2616 19.8806C30.2186 19.8806 35.1977 18.8593 36.4162 17.4954C35.3829 16.3388 31.6453 15.4285 26.9003 15.1785V18.0598C26.0499 18.1046 25.167 18.1282 24.2616 18.1282C23.3561 18.1282 22.4733 18.1046 21.6228 18.0598V15.1785C16.8778 15.4285 13.1402 16.3388 12.1069 17.4954C13.3254 18.8593 18.3045 19.8806 24.2616 19.8806Z'
                fill='#009393'
              />
            </svg>
          </Link>
        </div>

        <div className='pt-4'>
          <ul className='header-menu'>
            <li>
              <NavLink className='text-2xl font-extrabold font-mono' to='/'>
                Home
              </NavLink>
            </li>
            <li className='header-menu-item'>
              <NavLink className='text-2xl font-extrabold font-mono' to='/history'>
                History
              </NavLink>
            </li>
            <li>
              <button className='fill-white text-blue-100 text-2xl font-extrabold font-mono' onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </header>
      <main className='main flex-1'>
        <Outlet />
      </main>

      <footer className='footer'>
        <Footer />
      </footer>
    </div>
  )
}
export default LayoutDefault
