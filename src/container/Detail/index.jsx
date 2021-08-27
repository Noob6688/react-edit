import React, { useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import qs from 'query-string'
import { Modal, Toast } from 'zarm'
import dayjs from 'dayjs'
import { useHistory, useLocation } from 'react-router-dom'
import { billDelete, billDetail } from '@/api/index'
import { typeMap } from '@/config/index'
import CustomIcon from '@/components/CustomIcon'
import PopupAddBill from '@/components/PopupAddBill'
import Header from '@/components/Header'

import './style.less'

const Detail = () => {
  const [detail, setDetail] = useState({})
  const addRef = useRef()
  const location = useLocation()
  const history = useHistory()
  const { id } = qs.parse(location.search)
  const getData = async () => {
    const { data } = await billDetail({ id })
    setDetail(data)

  }
  useEffect(() => {
    getData()
  }, [])

  const deleteDetail = () => {
    Modal.confirm({
      title: '删除',
      content: '确认删除账单',
      onOk: async () => {
        const { data } = await billDelete({ id })
        Toast.show('删除成功')
        history.goBack()
      }
    })
  }
  const openModal = () => {
    addRef && addRef.current.show()
  }

  return (
    <div>
      <Header title='账单详情' />
      <div className='detail'>
        <div className='card'>
          <div className='type'>
            <span className={cx({ 'expense': detail.pay_type == 1, 'income': detail.pay_type == 2 })}>
              <CustomIcon className='iconfont' type={detail.type_id ? typeMap[detail.type_id].icon : 1} />
            </span>
            <span>{detail.type_name || ''}</span>
          </div>
          {
            detail.pay_type == 1
              ? <div className={cx('amount', 'expense')}>{detail.amount}</div>
              : <div className={cx('amount', 'income')}>{detail.amount}</div>
          }
          <div className='info'>
            <div className='time'>
              <span>记录时间</span>
              <span>{dayjs(Number(detail.date)).format('YYYY-MM-DD HH:mm')}</span>
            </div>
            <div className='remark'>
              <span>备注</span>
              <span>{detail.remark || '-'}</span>
            </div>
          </div>
          <div className='operation'>
            <span onClick={deleteDetail}><CustomIcon type='shanchu' />删除</span>
            <span onClick={openModal}><CustomIcon type='tianjia' />编辑</span>
          </div>
        </div>
      </div>
      <PopupAddBill ref={addRef} detail={detail} onReload={getData} />
    </div>
  )
}

export default Detail