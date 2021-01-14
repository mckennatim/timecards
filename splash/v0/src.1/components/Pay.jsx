import React from 'react'// eslint-disable-line no-unused-vars
var moment = require('moment');
import {router} from '../app'
import {mapClass2Element} from '../hoc/mapClass2Element'
import {fetchPay, postPay, fetchSettings, fetchRates} from '../services/fetches'
import{adjWdprtDn, padWk} from  '../../../../common/v0/src/utilities/reroo'
import { setEdit, setKeyVal} from '../actions/personacts';


class Pay extends React.Component{
  Pay='mabibi sufvhs'
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
    //this.getRates()
    this.getPay()
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
            setKeyVal({coid: res.coid, qmessage:res.qmessage, task:'pay',ot:JSON.parse(res.ot), firstday:res.firstday, wcrate:res.wcrate, stuirate:res.stuirate})
          })
        }
      })
  }

  getRates=()=>{
    fetchRates()     
      .then((res)=>{
        if (res.qmessage){
          window.alert(res.qmessage)
        }else{
          console.log('res: ', res)
          this.setState({rates:res},()=>this.calcGross())
        }
      })
  }

  getPay=()=>{
    fetchPay()
    .then((res)=>{
      const isPartner = res.binfo.role=='partner' ? true : false
      setKeyVal({role:res.binfo.role, emailid:res.binfo.emailid, isPartner:isPartner})
      this.setState({persons: res.persons},()=>this.getRates())
    })    
  }
 
  calcGross =() =>{
    const {ot} = this.props.eperson
    const {persons} = this.state
    const np = persons.map((p,i)=>{
      let hrs = p.hrs
      const hrsarr = JSON.parse(p.hrsarr)
      let mfhrs = hrsarr.slice(0,5).reduce((t,h)=>t+h,0)
      let sah = hrsarr[5]
      let suh = hrsarr[6]
      let saot=0, suot=0 ,mfot=0, reg=0, aot=0, gross=0
      if(sah>0){
        if(ot.sa>1){
          saot = (ot.sa-1)*sah*p.rate
        }else{
          mfhrs = mfhrs+sah
        }
      }
      if(suh>0){
        if(ot.su>1){
          suot = (ot.su-1)*suh*p.rate
        }else{
          mfhrs = mfhrs+suh
        }
      }
      if(ot.over40>1 && mfhrs>40 ){
        mfot = (ot.over40-1)*(mfhrs-40)*p.rate
      }
      reg = hrs*p.rate
      aot = saot+suot+mfot
      gross=reg+aot
      let mff = 1.5 - (20/mfhrs)
      let saf = saot>0 ? ot.sa : mff
      let suf = suot>0 ? ot.su :mff
      const regot = {reg:reg, mfot:mfot, gross:gross, saot:saot, suot:suot, mff:mff, saf:saf, suf:suf}
      return {...p, regot}
    })
    this.setState({persons:np},()=>this.calcWh())
  } 
  
  calcWh=()=>{
    const lookupFedTax=(fedwh, singmar,period, subj2wh, w4add)=>{
      let tax = 0
      if(subj2wh>0){
        const lkup = fedwh
          .filter((wh)=>wh.singmar==singmar && subj2wh>wh.over && subj2wh<wh.notover)
        tax+=lkup[0].perc*subj2wh + w4add
      }
      return tax
    }
    const calcStateTax = (p, strates, ssmed)=>{
      let sttax, stSubj2tax
      if(p.student || p.regot.gross<strates.nowhbelow){
        sttax=0
      }else{
        const hoh = p.sthoh ? strates.hohded : 0
        const blind = p.stblind ? strates.blided : 0
        stSubj2tax = p.regot.gross - strates.allow*p.stallow -hoh - blind - ssmed
        sttax = stSubj2tax*strates.rate + p.stadd
      }
      return sttax  
    }    
    const {persons, rates} = this.state
    const{fedr,fedwh, strates} =rates
    const whp = persons.map((p,i)=>{
      const{gross}=p.regot
      const subj2wh = p.w4exempt ? 0 : gross-(fedr.allow*p.w4allow)
      const ss = gross*fedr.sse
      const medi = gross*fedr.medie
      const singmar = p.marital=='married' ? 'married' : 'single'
      const fedtax = lookupFedTax(fedwh, singmar, 'weekly', subj2wh, p.w4add)
      const sttax =  calcStateTax(p, strates, ss+medi)
      const net = gross-fedtax-ss -medi - sttax
      p.wh={gross:gross, ss:ss, medi:medi, fedtax:fedtax, sttax:sttax, net:net}
      return p
    })
    this.setState({persons:whp},()=>console.log('this.state: ', this.state))
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
    this.alterPayYdate(this.state.wk)  
  }
  buzz=()=>{
    console.log('buzz()')
    window.navigator.vibrate(100)
  }
  getwk0 = ()=>{
    this.alterPayYdate(0)  
  }

  alterPayYdate = (wk)=>{
    fetchPay(wk)
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
    postPay(persons, wk)
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
        this.getPay()
      },300)     
      
    }
  }

  renderRegOt = (p)=>{
    if(p.regot){
      const{reg, gross}=p.regot
      const ot = p.regot.mfot+p.regot.saot+p.regot.suot
      return(
        <table style={style.table.table}><tbody>
        <tr style={style.table.tr}>
          <td style={style.table.thtd}>reg.</td>
          <td style={style.table.thtd}>{reg.toFixed(2)}</td>
        </tr>
        <tr style={style.table.tr}>
          <td style={style.table.thtd}>o.t.</td>
          <td style={style.table.thtd}>{ot.toFixed(2)}</td>
        </tr>
        <tr style={style.table.tr}>
          <th style={style.table.thtd}>gross</th>
          <th style={style.table.thtd}>{gross.toFixed(2)}</th>
        </tr>
        </tbody></table>  
      )
    }
  }

  renderWh = (p)=>{
    if(p.wh){

      return (
        <table style={style.table.table}><tbody>
        <tr><th colSpan="2">deductions</th></tr>  
        <tr style={style.table.tr}>
          <td style={style.table.thtd}>ssi</td>
          <td style={style.table.thtd}>{p.wh.ss.toFixed(2)}</td>
        </tr>
        <tr style={style.table.tr}>
          <td style={style.table.thtd}>medicare</td>
          <td style={style.table.thtd}>{p.wh.medi.toFixed(2)}</td>
        </tr>
        <tr style={style.table.tr}>
          <td style={style.table.thtd}>fed wh</td>
          <td style={style.table.thtd}>{p.wh.fedtax.toFixed(2)}</td>
        </tr>
        <tr style={style.table.tr}>
          <td style={style.table.thtd}>state wh</td>
          <td style={style.table.thtd}>{p.wh.sttax.toFixed(2)}</td>
        </tr>
        <tr style={style.table.tr}>
          <th style={style.table.thtd}>net pay</th>
          <th style={style.table.thtd}>{p.wh.net.toFixed(2)}</th>
        </tr>
        </tbody></table>  
      )
    }
  }

  renderPay=()=>{
    let {persons}=this.state
    const rpersons = persons
      .map((aperson, i)=>{
        const regot = this.renderRegOt(aperson)
        const wh = this.renderWh(aperson)
        return (
        <li  key={i} style={style.myli.li}>
          <div style={style.myli.idx}>
            <span style={style.myli.idxsp} onClick={this.editPerson.bind(null, aperson)}><i style={style.myli.icon} className="material-icons">edit</i></span>   
          </div>
          <div style={style.myli.person}> 
            <span>
              {aperson.wprt}<br/>
             <span>{aperson.firstmid} {aperson.lastname}</span> <br/>
              {aperson.street}<br/>
              {aperson.city}, {aperson.st} {aperson.zip}<br/>
            </span>
          </div>
          <div style={style.myli.cat}>
            <span>  
            
            ${aperson.rate} x {aperson.hrs}hrs<br/>
            {regot}
            {wh}
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
      const rndrdpersons = this.renderPay()
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
Pay = mapClass2Element(Pay)

export {Pay}

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
    person:{
      padding: '3px',
      width: '50%',
      float: 'left',
      background: '#99CCCC'
    },
    cat:{
      padding: '2px',
      width: '36%',
      float: 'left',
      background: '#99CCCC'
  
    },
    act:{
      width: '10%',
      float: 'right',
      background: '#99CCCC'
  
    }
  },
  table:{
    div:{
      float:'right',
      background: 'white',
      width: '130px'
    },
    table:{
      borderCollapse: 'collapse',
      width: '100%'
    },
    tr:{
      padding: '0px',
      margin: '0px'
    },
    thtd:{
      padding: '0px',
      margin: '0px',
      textAlign:'right'
    }
  }
}

