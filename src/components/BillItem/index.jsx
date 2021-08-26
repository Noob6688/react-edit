import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import PropsType from 'prop-types'
import CustomIcon from '../CustomIcon'
import { Cell } from 'zarm'
import { typeMap } from '@/config'


import './style.less'

const BillItem = ({item}) => {
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const history = useHistory()
  
  useEffect(() => {
    const _income = item.bills.filter(i=>i.pay_type==2).reduce((cur,itx)=>{
      cur += Number(itx.amount)
      return cur
    }, 0)
    const _expense = item.bills.filter(i=>i.pay_type==1).reduce((cur,itx)=>{
      cur += Number(itx.amount)
      return cur
    }, 0)
    
    
    setIncome(_income)
    setExpense(_expense)
    
  }, [item.bills])

  const goToDetail = (itx) => {
    history.push(`/detail?id=${itx.id}`)
  }
 
  return (
    <div className='item'>
      <div className='header-date'>
        <div className='date'>{item.date}</div>
        <div className='money'>
          <span>
            <img src="//s.yezgea02.com/1615953405599/zhi%402x.png" alt="支" />
            <span>￥{expense.toFixed(2)}</span>
          </span>
          <span>
            <img src="//s.yezgea02.com/1615953405599/shou%402x.png" alt="收" />
            <span>￥{income.toFixed(2)}</span>
          </span>
        </div>
      </div>
      {
        item && item.bills.sort((a, b) => b.date - a.data).map(itx => (
          <Cell 
          className='bill' 
          key={itx.id} 
          onClick={() => goToDetail(itx)} 
          title={<><CustomIcon className='item-icon' type={typeMap[itx.type_id].icon} /> <span>{itx.type_name}</span></>}
          description={<span style={{color: itx.pay_type == 2 ? 'red' : '#39be77'}}>{`${itx.pay_type == 1 ? '-' : '+'}${itx.amount}`}</span>}
          help={<div>{dayjs(Number(itx.date)).format('HH:mm')} {itx.remark ? `| ${itx.remark}` : ''}</div>}
          >
          </Cell>
        ))
      }
    </div>
  )
}
BillItem.propTypes = {
  item:PropsType.object
}
export default BillItem