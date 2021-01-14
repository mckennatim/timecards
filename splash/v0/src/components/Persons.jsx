import React from 'react'// eslint-disable-line no-unused-vars
var moment = require('moment');
import {router} from '../app'
import {mapClass2Element} from '../hoc/mapClass2Element'
import {fetchPersons, postPersons, fetchSettings} from '../services/fetches'
import{adjWdprtDn, padWk} from  '../../../../common/v0/src/utilities/reroo'
import { setEdit, setKeyVal} from '../actions/personacts';


class Persons extends React.Component{
  Persons='mabibi sufvhs'
  state={
    notpersons: [{person: 'duck', id: 99, effective:'2018-01-01T14:12'}],
    wk: moment().week(),
    filt: 'all',
    dfilt: 'all',
    yr: moment().format('YYYY'),
    dddMMDD:'',
    firstday:3
  }

  dwk=null

  componentDidMount(){
    this.getSettings()
    this.getPersons()
    this.dwk = document.getElementById("wk")
    console.log('moment().format("YYY-MM-DD): ', moment().format("YYYY-MM-DD"))
  }  

  getSettings=()=>{
    fetchSettings()     
      .then((res)=>{
        if (res.qmessage){
          window.alert(res.qmessage)
        }else{
          this.setState({firstday: res.firstday},()=>{
            setKeyVal({coid: res.coid, qmessage:res.qmessage, task:'persons'})
          })
        }
      })

  }
  getPersons=()=>{
    fetchPersons()
    .then((res)=>{
      const isPartner = res.binfo.role=='partner' ? true : false
      setKeyVal({role:res.binfo.role, emailid:res.binfo.emailid, isPartner:isPartner})
      this.setState({persons: res.persons},()=>{})
    })    
  }
 
  
  getCurrent=(persons)=>{
    const cdate = moment().format('YYYY-MM-DD')
    const cperson = persons
      .filter((person)=>person.rate>0 && person.effective && person.effective<=cdate && person.active )
      .reduce((t,p)=>{
        const  oeid =t.slice(-1)[0].emailid
        if(oeid != p.emailid){
          t.push(p)
        }
        return t
      },[{emailid:'dog'}])
    return cperson.slice(1)
  }  

  filtAct = ()=>setKeyVal({filt:'active'});
  filtInAct = ()=>setKeyVal({filt:'inactive'});
  filtAll = ()=>setKeyVal({filt:'all'});

  dfiltCurrent = ()=>setKeyVal({dfilt:'current'});
  dfiltFuture = ()=>setKeyVal({dfilt:'future'});
  dfiltHistory = ()=>setKeyVal({dfilt:'history'});
  dfiltAll = ()=>setKeyVal({dfilt:'all'});
  
  
  fact = (person)=>person.active==true
  finact = (person)=>person.active==false
  fall = ()=>true

  afilt = (person)=>{
    switch (this.props.eperson.filt) {
      case 'all':
        return this.fall(person) 
      case 'active':
        return this.fact(person) 
      case 'inactive':
        return this.finact(person) 
      default:
        return this.fall()
    }
  }

  efilt = (person)=>{
    person.effective = person.effective ? person.effective.split('T')[0] : null
    const cdate = moment().format("YYYY-MM-DD")
    switch (this.props.eperson.dfilt) {
      case 'all':
        return true 
      case 'current':
        return true
      case 'history':
        return person.effective && person.effective<=cdate
      case 'future':
        return person.effective && person.effective>cdate
      default:
        return this.fall()
    }
  }

  cfilt = (persons)=>{
    if(this.props.eperson.dfilt=='current') {
      persons = this.getCurrent(persons)
    }
    return persons
  }

  getwk = ()=>{
    this.alterPersonsYdate(this.state.wk)  
  }
  buzz=()=>{
    console.log('buzz()')
    window.navigator.vibrate(100)
  }
  getwk0 = ()=>{
    this.alterPersonsYdate(0)  
  }

  alterPersonsYdate = (wk)=>{
    fetchPersons(wk)
    .then((res)=>{
      const dddMMDD = this.alterDddMMDD(this.state.wk) 
      this.setState({persons: res.persons, dddMMDD},()=>{})

    })
  }

  alterDddMMDD=(wk)=>{
    let wdprt = `${this.state.yr}-W${padWk(wk)}-${this.state.firstday}`
    wdprt = adjWdprtDn(this.state.firstday, wdprt)
    return moment(wdprt).format("ddd MM/DD")
  }

  sav2wk = ()=>{
    this.buzz()
    console.log('save2week')
    let wk = this.state.wk
    if(wk===undefined || wk==0){
      window.alert('please select a week')
      return
    } 
    const persons = this.state.persons
      .filter((j)=>j.active)
      .map((j)=>{return {person: j.person, category: j.category,   active: j.active*1, idx: j.idx, week:wk}})
    postPersons(persons, wk)
      .then(()=>{
        console.log('done saving')
      })
  }

  editPerson=(j)=>{
    console.log('j: ', j)
    setEdit(j)
    setKeyVal({update:true})
    // router.navigate('/addperson?idx='+j.idx);
    router.navigate('/addperson');
  }
  chwk=(e)=>{
    let val =e.target.value
    if(val>0 && val<=52){
      const dddMMDD = this.alterDddMMDD(val) 
      this.setState({wk:val, dddMMDD},()=>console.log('this.state: ', this.state))
    }
  }
  chyr=(e)=>{
    let val =e.target.value
    if(val>2017 && val<=2051){
      console.log('val: ', val)
      this.setState({yr:val})
    }
  }

  setStatBkg=()=>{
    let sta ={...style.he.but}
    let ac = {...sta.ac}
    let ia = {...sta.ia}
    let al = {...sta.al}
    let cu = {...sta.cu}
    let fu = {...sta.fu}
    let hi = {...sta.hi}
    let da = {...sta.da}
    const norm = 'whitesmoke'
    const hili = '#99CCCC'
    const st = this.props.eperson.filt
    switch(st){
      case 'all':
        al.background = hili
        ia.background = norm
        ac.background = norm
      break;
      case 'active':
        al.background = norm
        ia.background = norm
        ac.background = hili
      break;
      case 'inactive':
        al.background = norm
        ia.background = hili
        ac.background = norm
      break;
    }
    const dst = this.props.eperson.dfilt
    switch(dst){
      case 'all':
        da.background = hili
        cu.background = norm
        fu.background = norm
        hi.background = norm
      break;
      case 'current':
        da.background = norm
        fu.background = norm
        hi.background = norm
        cu.background = hili
      break;
      case 'future':
        hi.background = norm
        da.background = norm
        fu.background = hili
        cu.background = norm
      break;
      case 'history':
        da.background = norm
        hi.background = hili
        cu.background = norm
        fu.background = norm
      break;
    }
    sta.ac =ac
    sta.ia =ia
    sta.al =al 
    sta.cu =cu 
    sta.fu =fu 
    sta.hi =hi 
    sta.da =da 
    return sta
  }

  getQuery=()=>{
    const params = this.props.cambio.page.params
    if(params && params.query =='rerender'){
      location.replace('#persons')
      setTimeout(()=>{
        this.getPersons()
      },300)     
      
    }
  }

  renderPersons=()=>{
    let {persons}=this.state
    persons = this.cfilt(persons)
    const rpersons = persons
      .filter((cperson)=>this.afilt(cperson))
      .filter((dperson)=>this.efilt(dperson))
      .map((aperson, i)=>{
        let date = aperson.effective ? aperson.effective.split('T')[0] : '' 
        let active = aperson.active ? (<span>&#10004;</span>) : 'no'
        let sthoh = aperson.sthoh ? (<span>&#10004;</span>) : 'no'
        let stblind = aperson.stblind ? (<span>&#10004;</span>) : 'no'
        let w4exempt = aperson.w4exempt ? (<span>&#10004;</span>) : 'no'
        let student = aperson.student ? (<span>&#10004;</span>) : 'no'
        
        return (
        <li  key={i} style={style.myli.li}>
          <div style={style.myli.idx}>
            <span style={style.myli.idxsp} onClick={this.editPerson.bind(null, aperson)}><i style={style.myli.icon} className="material-icons">edit</i></span>   
          </div>
          <div style={style.myli.person}> 
            <span>
              {aperson.emailid}<br/>
             <span>{aperson.firstmid} {aperson.lastname}</span> <br/>
              {aperson.street}<br/>
              {aperson.city}, {aperson.st} {aperson.zip}<br/>
              role: {aperson.role}<br/>
              effective: {date}<br/>
              active: {active}<br/>
              rate: ${aperson.rate}
            </span>
          </div>
          <div style={style.myli.cat}>
            <span>  
            {aperson.ssn}<br/>
            allowances<br/>
            fed:{aperson.w4allow}, state:{aperson.stallow} <br/>
            fadd:{aperson.w4add}, stadd:{aperson.stadd} <br/>
            hoh:{sthoh}, blind:{stblind}<br/>
            marital:{aperson.marital}<br/>
            w4exempt: {w4exempt}<br/>
            student: {student}<br/>
            </span>
          </div>
        </li >)
    })
    return(
      <ul style={style.myli.ul}>
        {rpersons}
      </ul>     
    )
  }

  render(){
    if (this.state.persons){
      this.getQuery()
      const actstyle = this.setStatBkg()
      const rndrdpersons = this.renderPersons()
      return(
        <div >
          <div style={style.he}>
            <div> 
                <button style={actstyle.ac} onClick={this.filtAct}>active</button>
                <button style={actstyle.ia} onClick={this.filtInAct}>inact</button>
                <button style={actstyle.al} onClick={this.filtAll}>all</button>
                <br/>
                <span>
                  dates:
                  <button style={actstyle.cu} onClick={this.dfiltCurrent}>current</button>
                  <button style={actstyle.fu} onClick={this.dfiltFuture}>future</button>
                  <button style={actstyle.hi} onClick={this.dfiltHistory}>history</button>
                  <button style={actstyle.da} onClick={this.dfiltAll}>all</button>

                </span>
            </div>
          </div>
          <div style={style.myli.od}> 
            {rndrdpersons}
          </div>
        </div>
      )
    }else{
      return(
        <div>
          <a href="home" data-navigo>maybe you need to register</a>
          {this.props.eperson.qmessage}
        </div>
        )
    }
  }
}
Persons = mapClass2Element(Persons)

export {Persons}

const style = {
  btn:{

  },
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
      },
      cu:{
        margin: '4px',
        padding: '4px'
      },
      fu:{
        margin: '4px',
        padding: '4px'
      },
      hi:{
        margin: '4px',
        padding: '4px'
      },     
      da:{
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
      padding: '2px',
      overflow: 'hidden',
      border: 'solid 1px black'
    },
    idx:{
      float: 'left',
      width: '5%',
      padding: '4px'
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
    person:{
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
