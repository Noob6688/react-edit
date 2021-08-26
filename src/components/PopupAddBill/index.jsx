import React,{forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react'
import { Icon, Popup,Keyboard,Input,Toast } from 'zarm'
import PropsType from 'prop-types'
import cx from 'classnames'
import dayjs from 'dayjs'
import PopupDate from '../PopupDate'
import CustomIcon from '../CustomIcon'
import {typeMap} from '@/config/index'
import { billTypes,billUpdate,billAdd } from '@/api/index'

import './style.less'
import { async } from 'regenerator-runtime'

const PopupAddBill = forwardRef(({detail={},onReload},ref)=>{
  const [show,setShow] = useState()
  const [payType,setPayType] = useState('expense')
  const [date,setDate] = useState(new Date())
  const [amount,setAmount] = useState('')
  const [currentType,setCurrentType] = useState({})
  const [expense,setExpense] = useState([])
  const [income,setIncome] = useState([])
  const [showRemark,setShowRemark] = useState(false)
  const [remark, setRemark] = useState(''); // 备注
  const dayRef = useRef()
  // 查询类型
  useEffect( async ()=>{
    const { data } = await billTypes()
    setExpense(data.filter(itx=>itx.type==1))
    setIncome(data.filter(itx=>itx.type==2))
    
  },[])
  // 回显数据
  useEffect(()=>{
    if (detail.id) {
      setPayType(detail.pay_type == 1 ? 'expense' : 'income')
      setCurrentType({
        id: detail.type_id,
        name: detail.type_name
      })
      setRemark(detail.remark)
      setAmount(detail.amount)
      setDate(dayjs(Number(detail.date)).$d)
    }
  },[detail])
  const changeType = (type) => {
    setPayType(type)
  }

  const selectDay = (v) => {
    setDate(v)
  }
  const openDate = () => {
    dayRef.current&&dayRef.current.show()
  }
  const handleMoney = (val) => {
    val = String(val)
    console.log(val);
    if(val == 'delete'){
      if(amount.length==0) return;
      let _amount = amount.slice(0,amount.length - 1)
      setAmount(_amount)
      return;
    }
    if(val == 'ok'){
      AddBill()
      return;
    }
    if(val == '.'&&amount.includes('.')) return;
    if(val != '.'&&amount.includes('.')&&amount&&amount.split('.')[1].length >= 2) return;
    setAmount(amount+val)
  } 
  const AddBill = async () => {
    if(!amount){
      Toast.show('请输入金额')
      return;
    }
    const params = {
      amount:Number(amount).toFixed(2),
      type_id:currentType.id,
      type_name:currentType.name,
      date:dayjs(date).unix() * 1000,
      pay_type:payType=='expense' ? 1:2,
      remark:remark
    }
    console.log('----',detail);
    if(detail.id){
      params.id = detail.id
      const res = await billUpdate(params)
      Toast.show('修改成功')
    }else{
      const res = await billAdd(params)
      setAmount('');
      setPayType('expense');
      setCurrentType(expense[0]);
      setDate(new Date());
      setRemark('');
      Toast.show('添加成功');
    }
    setShow(false);
    if (onReload) onReload();
  }
  useImperativeHandle(ref, ()=>({
    show(){
      setShow(true)
    },
    close(){
      setShow(false)
    }
  }))

  return(
    <Popup visible={show} direction='bottom' onMaskClick={()=>setShow(false)} mountContainer={()=>document.body}>
      <div className='add-wrap'>
        <header className='header'>
          <span className='close' onClick={()=>setShow(false)}><Icon type='wrong'/></span>
        </header>
        <div className='filter'>
          <div className='type'>
            <span className={cx({'expense':true,'active':payType=='expense'})} onClick={()=>setPayType('expense')}>支出</span>
            <span className={cx({'income':true,'active':payType=='income'})} onClick={()=>setPayType('income')}>收入</span>
          </div>
          <div className='time'>
            <span onClick={openDate}>{dayjs(date).format('MM-DD')}<Icon className='arrow' type='arrow-bottom'/></span>
          </div>
        </div>
        <div className='money'>
          <span className='sufix'>￥</span>
          <span className={cx('amount')}>{amount}</span>
        </div>
        <div className='type-wrap'>
          <div className='type-body'>
            {
              (payType == 'expense'? expense : income).map(item=>(
                <div className='type-item' onClick={()=>setCurrentType(item)} key={item.id}>
                  <span className={cx({'iconfont-wrap':true,'expense':payType=='expense','income':payType=='income','active':currentType.id==item.id})}>
                    <CustomIcon type={typeMap[item.id].icon} className='iconfont'/>
                  </span>
                  <span>{item.name}</span>
                </div>
              ))
            }
          </div>
        </div>
        <div className='remark'>
          {
            showRemark ? <Input 
              autoHeight
              showLength
              maxLength={50}
              type="text"
              rows={3}
              value={remark}
              placeholder="请输入备注信息"
              onChange={(val) => setRemark(val)}
              onBlur={() => setShowRemark(false)}/>
              : <span onClick={()=>setShowRemark(true)}>{remark || '添加备注'}</span>
          }
        </div>
        <Keyboard type="price" onKeyClick={(value) => handleMoney(value)}/>
      </div>
      <PopupDate ref={dayRef} onSelect={selectDay}/>
    </Popup>
  )
})

PopupAddBill.propTypes = {
  detail:PropsType.object,
  onReload:PropsType.func
}
export default PopupAddBill
