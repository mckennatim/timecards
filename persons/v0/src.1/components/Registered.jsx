import React from 'react'// eslint-disable-line no-unused-vars
import {parseQuery} from '../utilities/wfuncs'
import {ls, cfg} from '../utilities/getCfg'
import {mapClass2Element} from '../hoc/mapClass2Element'
import {fetchCoids, fetchCtoken} from '../../../../common/v0/src/services/fetches'
import {setKeyVal} from '../actions/personacts';

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
    console.log('mobj: ', mobj) 
    if (mobj.message){
      const message = decodeURI(mobj.message) + ' Check with your employer to see if you can access this app. Or start your own ' 
      this.setState({renderwhat: 'message', message: message})
    }else{
      fetchCoids(mobj)
      .then((res)=>{
        console.log('res: ', res)
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
    this.getCtoken(this.state.token, co)
  }

  getCtoken=(token,co)=>{
    //console.log('this.props.ejob.task: ', this.props.ejob.task)
    fetchCtoken(token,co)
      .then((res)=>{
        console.log('res: ', res)
        const isPartner = res.role=='partner' ? true : false
        setKeyVal({role:res.role, emailid:res.binfo.emailid, isPartner:isPartner})
        ls.setItem({email: res.binfo.emailid, token:res.token})
        location.replace('#persons')
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
        console.log('rendering message')
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
    const{cos,renderwhat}=this.state 
    console.log('renderwhat: ', renderwhat)
    console.log('cos: ', cos)
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

