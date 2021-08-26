
import { Toast } from "zarm";

const useVerify = (arr) => {
  let t = arr.map(itx=>{
    if(itx.value==''){
      return () => {
        Toast.show(itx.hint)
      }
    }else if(itx.validator){
      if(itx.value==''){
        return () => {
          Toast.show(itx.hint)
        }
      }else{
        return itx.validator
      }
    }else {
      return null
    }
  })
  t = t.filter(item=>item!=null)
  if(t.length>0){
    t[0]()
    return false
  }else{
    return true
  }
}

export default useVerify