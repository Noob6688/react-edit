import React, { useEffect, useState } from 'react'
import { Switch, Route, BrowserRouter,useLocation } from 'react-router-dom'
import { ConfigProvider } from 'zarm'
import zhCN from 'zarm/lib/config-provider/locale/zh_CN'
// import 'zarm/dist/zarm.css'

import routes from './router'
import NavBar from './components/Nav'

function App() {
  const location = useLocation()
  const { pathname } = location
  const needNav = ['/','/data','/user']
  const [showNav,setShowNav] = useState(false)
  useEffect(()=>{
    setShowNav(needNav.includes(pathname))
  },[pathname])
  return (
    <div>
      <ConfigProvider primaryColor={'#007fff'} locale={zhCN}>
        <Switch>
          {
            routes.map(item => (
              <Route exact key={item.path} path={item.path}>
                <item.component />
              </Route>
            ))
          }
        </Switch>
      </ConfigProvider>
      <NavBar showNav={showNav} />
    </div>
  )
}

export default App
