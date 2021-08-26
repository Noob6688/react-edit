import React, { forwardRef, useState,useImperativeHandle } from 'react'
import PropsType from 'prop-types'
import { Popup, DatePicker } from 'zarm'
import dayjs from 'dayjs'

const PopupDate = forwardRef(({ onSelect, mode = 'date' }, ref) => {
  const [show, setShow] = useState(false)
  const [now, setNow] = useState(new Date())

  const choseMonth = (item)=> {
    setShow(false)
    setNow(item)
    if(mode == 'month'){
      onSelect(dayjs(item).format('YYYY-MM'))
    }else if(mode == 'date'){
      onSelect(dayjs(item).format('YYYY-MM-DD'))
    }
  }
  useImperativeHandle(ref, () => ({
    show(){
      setShow(true)
    },
    close(){
      setShow(false)
    }
  }))
  return (
    <Popup visible={show} direction='bottom' onMaskClick={() => setShow(false)} destroy={false} mountContainer={() => document.body}>
      <div>
        <DatePicker visible={show} value={now} mode={mode} onOk={choseMonth} onCancel={()=>setShow(false)} />
      </div>
    </Popup>
  )
})

PopupDate.propTypes = {
  mode:PropsType.string,
  onSelect:PropsType.func
}

export default PopupDate