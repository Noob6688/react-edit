import React,{ useState } from 'react'
import PropTypes from 'prop-types'
import { TabBar } from 'zarm'
import { useHistory,useLocation } from 'react-router-dom'
import CustomIcon from '../CustomIcon'

import './style.less'

const NavBar = ({showNav}) => {
  const [activeKey,setActiveKey] = useState(useLocation().pathname)
  const history = useHistory()

  const changeTab = (path) => {
    setActiveKey(path)
    history.push(path)
  }

  return(
    <TabBar visible={showNav} className='tab' activeKey={activeKey} onChange={changeTab}>
      <TabBar.Item itemKey='/' title='账单' icon={<CustomIcon type='zhangdan' />}>
      </TabBar.Item>
      <TabBar.Item itemKey='/data' title='统计' icon={<CustomIcon type='tongji' />}>
      </TabBar.Item>
      <TabBar.Item itemKey='/user' title='我的' icon={<CustomIcon type='wode' />}>
      </TabBar.Item>
    </TabBar>
  )
}

NavBar.propTypes = {
  showNav: PropTypes.bool
}

export default NavBar