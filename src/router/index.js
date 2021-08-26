import Home from "../container/Home";
import User from "../container/User";
import Data from "../container/Data";
import about from "../container/About/about";
import Login from "../container/Login"
import Detail from "../container/Detail";
import userInfo from "../container/UserInfo";
import Account from "../container/Account";

const routes = [
  {
    path:'/',
    component:Home,
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/user',
    component:User
  },
  {
    path:'/userinfo',
    component:userInfo
  },
  {
    path:'/account',
    component:Account
  },
  {
    path:'/data',
    component:Data
  },
  {
    path:'/about',
    component:about
  },
  {
    path:'/detail',
    component:Detail
  }
]

export default routes