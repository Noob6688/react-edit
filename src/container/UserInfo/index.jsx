import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, FilePicker, Input, Toast } from 'zarm'
import axios from 'axios'
import Header from '@/components/Header'
import { editUserInfo,userInfo } from '@/api/index'
import { baseUrl } from '@/config/index'
import './style.less'

const userEdit = () => {
  const [avatar, setAvatar] = useState('')
  const [signature, setSignature] = useState('')

  const history = useHistory()

  useEffect(async () => {
    const data = await getUser()
    setAvatar(data.avatar)
    setSignature(data.signature)
  }, [])
  const getUser = async () => {
    const { data } = await userInfo()
    return data
  }
  // 上传头像
  const handleSelect = (file) => {
    console.log(file);
    if (file && file.file.size > 200 * 1024) {
      Toast.show('上传头像不得超过 200 KB！！')
      return
    }
    let formData = new FormData()
    formData.append('file', file.file)
    const token = localStorage.getItem('token')
    console.log(token);
    axios({
      method: 'post',
      url: `${baseUrl}/api/upload`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? token : null
      }
    }).then(res => {
      console.log('file',res);
      setAvatar(res.data)
    })
  }
  const save = async () => {
    const { data } = await editUserInfo({
      signature,
      avatar: avatar
    });
    Toast.show('修改成功');
    history.goBack()
  }
  return (
    <>
      <Header title='用户信息' />
      <div className='userinfo'>
        <h1>个人资料</h1>
        <div className='item'>
          <div className='title'>头像</div>
          <div className='avatar'>
            <img className='avatar-url' src={avatar} alt="" />
            <div className='desc'>
              <span>支持 jpg、png、jpeg 格式大小 200KB 以内的图片</span>
              <FilePicker className='filePicker' onChange={handleSelect} accept="image/*">
                <Button className='upload' theme='primary' size='xs'>点击上传</Button>
              </FilePicker>
            </div>
          </div>
        </div>
        <div className='item'>
          <div className='title'>个性签名</div>
          <div className='signature'>
            <Input
              clearable
              type="text"
              value={signature}
              placeholder="请输入个性签名"
              onChange={(value) => setSignature(value)} />
          </div>
        </div>
        <Button onClick={save} style={{ marginTop: 50 }} block theme='primary'>保存</Button>
      </div>
    </>
  )
}
export default userEdit