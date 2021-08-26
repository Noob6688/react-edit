import axios from '@/utils/axios'

// 登录
export const login = (params) => {
  return axios.post('/api/user/login',params)
}

// 注册
export const register = (params) => {
  return axios.post('/api/user/register',params)
}

// 用户信息
export const userInfo = () => {
  return axios.get('/api/user/userinfo')
}
// 用户信息革新
export const editUserInfo = (params) => {
  return axios.post('/api/user/editUserInfo',params)
}
// 设置密码
export const setPassword = (params) => {
  return axios.post('/api/user/setPassword',params)
}

// 获取账单类型
export const billTypes = (params) => {
  return axios.get('/api/bill/type')
}

// 账单列表
export const billList = (params) => {
  return axios.get('/api/bill/list',{params})
}

// 删除账单
export const billDelete = (params) => {
  return axios.post('/api/bill/delete',params)
}
// 账单详情
export const billDetail = (params) => {
  return axios.get('/api/bill/detail',{params})
}
// 账单更新
export const billUpdate = (params) => {
  return axios.post('/api/bill/update',params)
}
// 账单新增
export const billAdd = (params) => {
  return axios.post('/api/bill/add',params)
}
// 账单图标数据
export const billData = (params) => {
  return axios.get('/api/bill/data',{params})
}