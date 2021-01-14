import React from 'react'// eslint-disable-line no-unused-vars
import {pStyle} from '../styles'
import {parseQuery} from '../utilities/wfuncs'
import {cfg, ls} from '../utilities/getCfg'
import {mStyle} from '../styles'
import { setTcEmail} from '../actions/jobacts';


const style = {
  ...pStyle, outer: {...pStyle.outer, background: '#FF9966'}
}
pStyle.outer.background='#C4A265'

function Registered(props){
  const onSuccess = () =>{
    console.log('registered success: ')
  }
  const hitButton=()=>{
    console.log('in hitButton')
    setTcEmail({tcemail:mobj.email})
    //switchPage({name: 'TimeCard', params: null})
    location.replace('#tcard')
  }

  var em ='NOT'
  var regstr = 'dog'
  const query= props.cambio.page.params.query;
  var mobj = parseQuery(query)
  console.log(mobj);
  
  if (mobj!=undefined) {
    if(Object.keys(mobj).find((x)=>x=='message')){
      console.log('ie message');
      regstr=decodeURI(mobj.message)
    }else{
      if(mobj.email){
        console.log('hay mobj')
        em = mobj.email
      }else {
        em = ls.getKey('email')
        if(!em){
          em = '--no not really'
        }
      }
      regstr ='want to register as somebody else'
      ls.setItem(mobj)
      onSuccess()
    }
  }else{
    regstr = 'so register already'
  }
  return(
    <div style={style.outer} >
      <h4>You Be Registered {em} </h4>
      <a style={mStyle.a} href={cfg.url.authqry}>{regstr}</a>
      <span></span>
      <button onClick={hitButton}>go to tcard</button>
    </div>
    )
}

export {Registered}
