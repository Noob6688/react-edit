import React,{ useEffect, useRef, useState } from 'react'
import { Icon,Pull } from 'zarm'
import Empty from '@/components/Empty'
import BillItem from '@/components/BillItem'
import CustomIcon from '@/components/CustomIcon'
import PopupDate from '@/components/PopupDate'
import PopupType from '@/components/PopupType'
import PopupAddBill from '@/components/PopupAddBill'
import { billList } from '@/api/index'
import { REFRESH_STATE, LOAD_STATE } from '@/config/index'
import './style.less'
import dayjs from 'dayjs'
const Home = () => {
  const [list,setList] = useState([])
  const [currentTime,setCurrentTime] = useState(dayjs().format('YYYY-MM'))
  const [currentType,setCurrentType] = useState({id:'all'})
  const [page,setPage] = useState(1)
  const [totalExpense, setTotalExpense] = useState(0); // 总支出
  const [totalIncome, setTotalIncome] = useState(0); // 总收入
  const [totalPage, setTotalPage] = useState(0); // 分页总数
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal); // 下拉刷新状态
  const [loading, setLoading] = useState(LOAD_STATE.normal); // 上拉加载状态
  
  const monthRef = useRef()
  const typeRef = useRef()
  const addRef = useRef()

  useEffect(() => {
    getBillList() // 初始化
  }, [page, currentType, currentTime])

  const getBillList = async () => {
    const {data,code} = await billList({date:currentTime,type_id:currentType.id,page})
    console.log('data',data);
    if(code==200){
      if(page==1){
        setList(data.list)
      }else{
        setList(list.concat(data.list))
      }
      setRefreshing(REFRESH_STATE.success);
    }
    
    setTotalExpense(data.totalExpense.toFixed(2))
    setTotalIncome(data.totalIncome.toFixed(2))
    setTotalPage(data.totalPage);
  }
  // 请求列表数据
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading);
    if (page != 1) {
      setPage(1);
    } else {
      getBillList();
    };
  };

  const loadData = () => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading);
      setPage(page + 1);
    }
  }
  // 添加账单的弹窗
  const addToggle = () => {
    addRef.current&& addRef.current.show()
  }
  // 打开时间选择
  const openMonth = () => {
    monthRef.current&& monthRef.current.show()
  }
  // 选择月份
  const selectMonth = (item) => {
    console.log('月份',item);
    setCurrentTime(item)
    
  }
  // 打开类型选择
  const openType = () => {
    typeRef.current&& typeRef.current.show()

  }
  // 选择类型
  const selectType = (item) => {
    console.log('类型',item);
    setCurrentType(item)
  }
  return(
    <div className='home'>
      <div className='header'>
        <div className='data-wrap'>
          <span className='expense'>总支出:<b>￥{totalExpense}</b></span>
          <span className='income'>总收入:<b>￥{totalIncome}</b></span>
        </div>
        <div className='type-wrap'>
          <div className='left' onClick={openType}>
            <span className='title'>{currentType.id=='all'?'全部类型':currentType.name}<Icon className='arrow' type="arrow-bottom" /></span>
          </div>
          <div className='right' onClick={openMonth}>
            <span className='time'>{currentTime}<Icon className='arrow' type="arrow-bottom" /></span>
          </div>
        </div>
      </div>
      <div className='content-wrap'>
      {
        list.length ? <Pull
          animationDuration={200}
          stayTime={400}
          refresh={{
            state: refreshing,
            handler: refreshData
          }}
          load={{
            state: loading,
            distance: 200,
            handler: loadData
          }}
        >
          {
            list.map((itx, index) => <BillItem
              item={itx}
              key={index}
            />)
          }
        </Pull> : <Empty />
      }
      </div>
      <div className='add' onClick={addToggle}><CustomIcon type='tianjia' /> </div>
      <PopupDate ref={monthRef} mode="month" onSelect={selectMonth}/>
      <PopupType ref={typeRef} onSelect={selectType}/>
      <PopupAddBill ref={addRef} onReload={refreshData}/>
    </div>
  )
}

export default Home