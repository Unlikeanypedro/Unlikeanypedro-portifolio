import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import Staves from './Staves.jsx'

export default function Layout() {
  return (
    <div className="layout">
      <Staves />
      <Header />
      <main className="content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
