import React, { useCallback, useRef, useState, useEffect } from 'react'
import { Cell,Input,Button,Checkbox,Toast } from 'zarm'
import cx from 'classnames'
import Captcha from 'react-captcha-code'
import CustomIcon from '@/components/CustomIcon'
import useVerify from '@/usehooks/verify'
import { login,register } from '@/api/index'

import './style.less'

const Login = () => {
  const captchaRef = useRef() // 获取验证码对象
  const [type,setType] = useState('login')
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [code,setCode] = useState('')
  const [checkbox,setCheckbox] = useState(false)
  const [captcha,setCaptcha] = useState('')

  const handleChange = useCallback((captcha)=>{
    setCaptcha(captcha)
  },[])
  useEffect(() => {
    document.title = type == 'login' ? '登录' : '注册';
  }, [type])
  
  const onSubmit = async () => {
    const arrKey = [
      { hint:'用户名不能为空',value:username },
      { hint:'密码不能为空',value:password },
    ]
    // 验证码校验
    const captchaVk = (val) => {
      if(val != captcha){
        return () => {
          Toast.show('验证码不正确')
        }
      }else{
        return null
      }
    }
    const arrKeyr = [
      { hint:'用户名不能为空',value:username },
      { hint:'密码不能为空',value:password },
      { hint:'验证码不能为空',value:code, validator:captchaVk(code) }
    ]
    if(type=='login'){
      // 使用校验hooks
      let vk = useVerify(arrKey)
      if(!vk){
        console.log('验证不通过');
        return;
      }
      const res = await login({username,password})
      if(res.code == 200){
        localStorage.setItem('token',res.data.token)
        location.href = '/';
      }
    }else{
      let vk = useVerify(arrKeyr)
      console.log('vk',vk);
      if(!vk){
        return;
      }
      if(!checkbox){
        Toast.show('请同意《掘掘手札条款》')
        return;
      }
      const res = await register({username,password})
      if(res.code == 200){
        Toast.show(res.msg)
        setType('login')
      }
    }
  }
  return (
    <div className="auth">
      <div className="head">
      </div>
      <div className="tab">
        <span className={cx({'active':type=='login'})} onClick={()=>setType('login')}>登录</span>
        <span className={cx({'active':type=='register'})} onClick={()=>setType('register')}>注册</span>
      </div>
      <div className="form">
        <Cell icon={<CustomIcon type="zhanghao" />}>
          <Input clearable type="text" placeholder="请输入账号" onChange={value => setUsername(value)} />
        </Cell>
        <Cell icon={<CustomIcon type="mima" />}>
          <Input clearable type="password" placeholder="请输入密码" onChange={value => setPassword(value)}/>
        </Cell>
        {
          type == 'register' ? <Cell icon={<CustomIcon type="mima" />}>
          <Input clearable type="password" placeholder="请输入验证码" onChange={value => setCode(value)}/>
          <Captcha ref={captchaRef} charNum={4} onChange={handleChange}></Captcha>
        </Cell> : null
        }
        
        <div className="operation">
          {
            type == 'register' ? <div className="agree">
              <Checkbox checked={checkbox} onChange={(val)=>setCheckbox(val)} />
              <label className="text-light">阅读并同意<a>《掘掘手札条款》</a></label>
            </div> : null
          }
          <Button onClick={onSubmit} block theme="primary">{type == 'login' ? '登录' : '注册'}</Button>
        </div>
      </div>
    </div>
  )
}

export default Login