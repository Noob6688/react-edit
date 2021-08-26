import React, { useEffect, useState } from 'react'
import { Cell,Button,Modal,Input } from 'zarm'
import { useHistory } from 'react-router-dom'
import { userInfo,editUserInfo } from '@/api/index'
import './style.less'

const User = () => {
  const [user, setUser] = useState({})
  const [show,setShow] = useState(false)
  const [signature,setSignature] = useState('')
  const history = useHistory()
  useEffect(async () => {
    const data = await getUser()
    setUser(data)
    setSignature(data.signature)
  }, [])

  const logout = () => {
    window.localStorage.removeItem('token')
    history.push('/login')
  }
  const getUser = async () => {
    const { data } = await userInfo()
    return data
  }
   // 个性签名弹窗确认
  const confirmSig = async () => {
    const { data } = await editUserInfo({
      signature,
      avatar:user.avatar
    });
    const _data = await getUser()
    setUser(_data);
    setSignature(_data.signature)
    setShow(false);
    Toast.show('修改成功');
  } ;
  return (
    <div className='user'>
      <div className='head'>
        <div className='info'>
          <span>昵称：{user.username}</span>
          <span onClick={()=>setShow(true)}>
            <img src="//s.yezgea02.com/1615973630132/geqian.png" alt="" />
            <b>{user.signature || '暂无签名'}</b>
          </span>
        </div>
        <img className='avatar' src={user.avatar} alt="" />
      </div>

      <div className='content'>
        <Cell
          hasArrow
          title='用户信息修改'
          onClick={() => history.push('/userinfo')}
          icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615974766264/gxqm.png" alt="" />} />
        <Cell
          hasArrow
          title='重置密码'
          onClick={() => history.push('/account')}
          icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615974766264/zhaq.png" alt="" />} />
        <Cell
          hasArrow
          title="关于我线上部署"
          onClick={() => history.push('/about')}
          icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615975178434/lianxi.png" alt="" />}
        />
      </div>
      <Button className='logout' block theme='danger' onClick={logout} >退出登录</Button>
      <Modal
        visible={show}
        title="标题"
        closable
        onCancel={() => setShow(false)}
        footer={
          <Button block theme="primary" onClick={confirmSig}>
            确认
          </Button>
        }
      >
        <Input
          autoHeight
          showLength
          maxLength={50}
          type="text"
          rows={3}
          value={signature}
          placeholder="请输入备注信息"
          onChange={(val) => setSignature(val)}
        />
      </Modal>
    </div>
  )
}

export default User