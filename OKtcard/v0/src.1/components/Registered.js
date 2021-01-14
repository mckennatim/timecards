import React from 'react'// eslint-disable-line no-unused-vars
import {parseQuery} from '../utilities/wfuncs'
import {ls, cfg} from '../utilities/getCfg'
import {mapClass2Element} from '../hoc/mapClass2Element'
import {fetchCoids, fetchCtoken} from '../../../../common/v0/src/services/fetches'
import { setTcEmail} from '../actions/jobacts';

class Registered extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cos: [], 
      token:'',
      renderwhat:'nothing',
      message:''
    }
  }
  componentDidMount() {
    const query= this.props.cambio.page.params.query;
    var mobj = parseQuery(query)
    if (mobj.message){
      const message = decodeURI(mobj.message) + ' Check with your employer to see if you can access this app. Or start your own ' 
      this.setState({renderwhat: 'message', message: message})
    }else{
      setTcEmail({tcemail:mobj.email})
      fetchCoids(mobj)
      .then((res)=>{
        if(res.qmessage){
          this.setState({renderwhat: 'message', message: res.qmessage})
        }
        if(res.coid &&  res.coid.length==1){
          this.getCtoken(mobj.token,res.coid[0])
        }else{
          this.setState({renderwhat: 'coids', cos:res.coid, token:mobj.token})
        }
      })   
    }
  }

  clickCoid=(e)=>{
    const idx =e.target.getAttribute('idx')
    const co = this.state.cos[idx]
    this.getCtoken(this.state.token,co)
  }

  getCtoken=(token,co)=>{
    fetchCtoken(token,co)
      .then((res)=>{
        ls.setItem({email: res.binfo.emailid, token:res.token})
        location.replace('#oktcard')
      })
  }  

  renderNothing=()=>{
    return (
      <h1>nothing</h1>
    )
  }
  renderCoids=()=>{
    return(
      <div style={style.he}>
        <h4>You Are Registered  </h4>
        <span>You are registered on this app for multiple businesses. Select which on you want to be logged in at. This app will remeber your last business selection. To switch later, just <a href={cfg.url.authqry}>register</a> again then select another business</span>
        <h4>Select a business/org/entity </h4>
        <ul style={style.myli.ul}>
          {this.state.cos.map((co,i)=>(
            <li style={style.myli.li} key={i} idx={i} onClick={this.clickCoid}>{co.coid} as {co.role} </li>
          ))}
        </ul>
      </div>
    )
  }
  renderMessage=()=>{
    return(
      <div>
        <h1>message</h1>"
        <span>{this.state.message} <a href="https://timecards.sitebuilt.net">here</a> </span>
      </div>
    )
  }
  selectRender=(renderwhat)=>{
    switch (renderwhat) {
      case 'message':
        return this.renderMessage()
      case 'coids':
        return this.renderCoids()
      case 'nothing':
        return this.renderNothing()
      default:
        return (<h4>default</h4>);
    }
  }
  render() {
    const{renderwhat}=this.state 
    const renderthis = this.selectRender(renderwhat)
    return (
      <div >
        {renderthis}
      </div>      
      );
  }
}

Registered =  mapClass2Element(Registered)
 
export {Registered }

const style = {
  he:{
    margin: '2px 10px 10px 10px',
    height:'70px',
    yw:{
      padding: '1px 1px 10px 1px'
    },
    yr:{
      width: '45px',
      background: 'silver'
    },
    wk:{
      width:'36px',
      background: 'whitesmoke'
    },
    img:{
      
      float:'right',
      width: '30px'
    },
    act:{
      float: 'right'
    },
    get:{
      float:'left'
    },
    but:{
      ac:{
        margin: '4px',
        padding: '4px'
      },
      ia:{
        margin: '4px',
        padding: '4px'
      },
      al:{
        margin: '4px',
        padding: '4px'
      }
    },
  },
  myli :{
    od:{
      overflow:'hidden',
      width: '100%',
      border: '1px solid #ccc'
    },
    ul:{
      textAlign: 'left',
      listStyleType: 'none',
      paddingLeft: '12px'
    },
    li:{
      background: '#99CCCC',
      padding: '6px',
      overflow: 'hidden',
      border: 'solid 1px black'
    },
    idx:{
      float: 'left',
      width: '7%',
      padding: '5px'
    },
    icon:{
      fontSize: '18px'
    },
    ck:{
      transform: 'scale(1.5)',
      msTransform: 'scale(1.5)',
      WebkitTransform: 'scale(1.5)',
      padding: '10px',
      border: '2px solid black'
    },
    job:{
      padding: '3px',
      width: '50%',
      float: 'left',
      background: '#99CCCC'
    },
    cat:{
      padding: '3px',
      width: '20%',
      float: 'left',
      background: '#99CCCC'
  
    },
    act:{
      width: '10%',
      float: 'right',
      background: '#99CCCC'
  
    }
  }
}

/*

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
*/