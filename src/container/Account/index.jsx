import React from 'react'
import { Button, Cell, Input, Toast } from 'zarm'
import { createForm } from 'rc-form'
import { useHistory } from 'react-router-dom'
import Header from '@/components/Header'
import { setPassword } from '@/api/index'
import './style.less'
const Account = (props) => {
  const { getFieldProps, getFieldError } = props.form
  const history = useHistory()
  const submit = () => {
    props.form.validateFields( async (error, value)=>{
      if(!error){
        
        if(value.newpass !== value.newpass2){
          Toast.show('两次密码不一致')
          return;
        }else{
          console.log('验证通过');
          const res = await setPassword({...value})
          Toast.show(res.msg)
          history.goBack()
        }
      }else{
        console.log('验证失败');
      }
      
    })
  }
  return (
    <div>
      <Header title='重置密码' />
      <div className='account'>
        <div className='from'>
          <Cell title='原密吗'>
            <Input
              clearable
              type='password'
              placeholder='请输入原密码' {...getFieldProps('oldpass', { rules: [{ required: true }] })} />
          </Cell>
          <Cell title='新密吗'>
            <Input
              clearable
              type='password'
              placeholder='请输入原密码' {...getFieldProps('newpass', { rules: [{ required: true }] })} />
          </Cell>
          <Cell title='确认密吗'>
            <Input
              clearable
              type='password'
              placeholder='请输入原密码' {...getFieldProps('newpass2', { rules: [{ required: true }] })} />
          </Cell>
        </div>
        <Button className='btn' block theme='primary' onClick={submit}>提交</Button>
      </div>
    </div>
  )
}
export default createForm()(Account)