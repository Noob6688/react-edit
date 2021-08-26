import React, { useEffect, useRef, useState } from 'react'
import { Icon, Progress } from 'zarm'
import cx from 'classnames'
import dayjs from 'dayjs'
import CustomIcon from '@/components/CustomIcon'
import PopupDate from '@/components/PopupDate'
import { billData } from '@/api/index'
import { typeMap } from '@/config/index'

import './style.less'
const Data = () => {
  const dateRef = useRef()
  const [currentMont, setCurrentMont] = useState(dayjs().format('YYYY-MM'))
  const [totalType, setTotalType] = useState('expense')
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTottalExpense] = useState(0)
  const [incomeData, setIncomeData] = useState([])
  const [expenseData, setExpenseData] = useState([])
  const [pieType, setPieType] = useState('expense')

  let proportionChart = null; // 用于存放 echart 初始化返回的实例

  useEffect(async () => {
    const { data } = await billData({ date: currentMont })

    setTottalExpense(data.total_expense)
    setTotalIncome(data.total_income)

    const expense_data = data.total_data.filter(itx => itx.pay_type == 1).sort((a, b) => b.number - a.number)
    const income_data = data.total_data.filter(itx => itx.pay_type == 2).sort((a, b) => b.number - a.number)
    setExpenseData(expense_data)
    setIncomeData(income_data)
    setPieChart(pieType == 'expense' ? expense_data : income_data);
    return () => {
      proportionChart.dispose()
    }
  }, [currentMont])
  const selectMonth = (item) => {
    setCurrentMont(item)
  }
  const openDate = () => {
    dateRef.current && dateRef.current.show()
  }
  const changeTotalType = (val) => {
    setTotalType(val)

  }
  // 切换饼图收支类型
  const changePieType = (type) => {
    setPieType(type);
    // 重绘饼图
    setPieChart(type == 'expense' ? expenseData : incomeData);
  }
  // 绘制饼图
  const setPieChart = (data) => {
    if (window.echarts) {
      proportionChart = echarts.init(document.getElementById('proportion'))
      console.log('pie',proportionChart);
      proportionChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        // 图例
        legend: {
          data: data.map(item => item.type_name)
        },
        series: [
          {
            name: '支出',
            type: 'pie',
            radius: '55%',
            data: data.map(item => {
              return {
                value: item.number,
                name: item.type_name
              }
            }),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    }
  }
  return (
    <div className='data'>
      <div className='total'>
        <div className='time' onClick={openDate}>
          <span >{currentMont}</span>
          <Icon type='date' className='date' />
        </div>
        <div className='title'>共支出</div>
        <div className='expense'>￥{totalExpense}</div>
        <div className='income'>共收入￥{totalIncome}</div>
      </div>

      <div className='structure'>
        <div className='head'>
          <span className='title'>收支构成</span>
          <div className='tab'>
            <span onClick={() => changeTotalType('expense')} className={cx({ 'expense': true, 'active': totalType == 'expense' })}>支出</span>
            <span onClick={() => changeTotalType('income')} className={cx({ 'income': true, 'active': totalType == 'income' })}>收入</span>
          </div>
        </div>
        <div className='content'>
          {
            (totalType == 'expense' ? expenseData : incomeData).map(item => (
              <div className='item' key={item.type_id}>
                <div className='left'>
                  <div className='type'>
                    <span className={cx({ 'expense': totalType == 'expense', 'income': totalType == 'income' })}>
                      <CustomIcon type={item.type_id ? typeMap[item.type_id].icon : 1} />
                    </span>
                    <span className='name'>{item.type_name}</span>
                  </div>
                  <div className='progress'>￥{Number(item.number).toFixed(2) || 0}</div>
                </div>
                <div className='right'>
                  <div className='percent'>
                    <Progress
                      shape='line'
                      percent={Number((item.number / Number(totalType == 'expense' ? totalExpense : totalIncome)) * 100).toFixed(2)}
                      theme='primary'
                    />
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        <div className='proportion'>
          <div className='head'>
            <span className='title'>收支构成</span>
            <div className='tab'>
              <span onClick={() => changePieType('expense')} className={cx({ 'expense': true, 'active': pieType == 'expense' })}>支出</span>
              <span onClick={() => changePieType('income')} className={cx({ 'income': true, 'active': pieType == 'income' })}>收入</span>
            </div>
          </div>
          <div id="proportion"></div>
        </div>
      </div>


      <PopupDate ref={dateRef} mode='month' onSelect={selectMonth} />
    </div>
  )
}

export default Data