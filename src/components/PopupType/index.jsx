import React,{useState,useImperativeHandle, useEffect,forwardRef} from 'react'
import { Popup,Icon } from 'zarm'
import cx from 'classnames'
import { billTypes } from '@/api/index'
import './style.less'

const PopupType = forwardRef(({ onSelect }, ref) => {
  const [show,setShow] = useState(false)
  const [active,setActive] = useState('all')
  const [expense,setExpense] = useState([])
  const [income,setIncome] = useState([])

  useEffect( async ()=>{
    const {data} = await billTypes()
    setExpense(data.filter(itx=>itx.type==1))
    setIncome(data.filter(itx=>itx.type==2))
  },[])

  useImperativeHandle(ref,()=>({
    show(){
      setShow(true)
    },
    close(){
      setShow(false)
    }
  }))
  const choseType = (item) => {
    setActive(item.id)
    setShow(false)
    onSelect(item)
  }
  return(
    <Popup visible={show} direction='bottom' onMaskClick={() => setShow(false)} destroy={false} mountContainer={() => document.body}>
      <div className='popup-type'>
        <div className='header'>
          请选择类型
          <Icon type='wrong' className='cross' onClick={()=>setShow(false)} />
        </div>
        <div className='content'>
          <div onClick={()=> choseType({id:'all'})} className={cx({'all':true,'active':active=='all'})}>全部类型</div>
          <div className='title'>支出</div>
          <div className='expense-wrap'>
            {
              expense.map((itx,index)=> <p key={index} onClick={()=>choseType(itx)} className={cx({'active':itx.id==active})}>{itx.name}</p>)
            }
          </div>
          <div className='title'>收入</div>
          <div className='income-wrap'>
            {
              income.map((itx,index)=> <p key={index} onClick={()=>choseType(itx)} className={cx({'active':itx.id==active})}>{itx.name}</p>)
            }
          </div>
        </div>
      </div>

    </Popup>
  )
})

export default PopupType