import React from 'react'// eslint-disable-line no-unused-vars
var moment = require('moment');
// import {router} from '../app'
import {mapClass2Element} from '../hoc/mapClass2Element'
// import {fetchPay, postPay, fetchSettings, fetchRates, postJobRates, postJournal} from '../services/fetches'
import {fetchPay, fetchSettings, fetchRates, postJobRates, postJournal} from '../services/fetches'
// import{adjWdprtDn, padWk} from  '../../../../common/v0/src/utilities/reroo'
// import { setEdit, setKeyVal} from '../actions/personacts';
import { setKeyVal} from '../actions/personacts';
import {makeHref,drnd} from '../utilities/getCfg'
import Checkbox from '@material-ui/core/Checkbox';// eslint-disable-line no-unused-vars

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
    // this.dwk = document.getElementById("wk")
    // console.log('moment().format("YYY-MM-DD): ', moment().format("YYYY-MM-DD"))
  }  

  getSettings=()=>{
    fetchSettings()     
      .then((res)=>{
        if (res.qmessage){
          console.log('res.qmessage: ', res.qmessage)
          this.setState({qmessage:res.qmessage})
         // window.alert(res.qmessage)
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
    const np = persons.map((p)=>{
      let hrs = p.hrs
      const hrsarr = JSON.parse(p.hrsarr)
      let mfhrs = hrsarr.slice(0,5).reduce((t,h)=>t+h,0)
      let sah = hrsarr[5]
      let suh = hrsarr[6]
      let saot=0, suot=0 ,mfot=0, reg=0, aot=0, gross=0,grossAP=0
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
      if (p.weeklybase && p.weeklybase>0){
        if (gross > p.weeklybase){
          grossAP = gross - p.weeklybase
          gross = p.weeklybase
        }
      }
      let mff = mfhrs>30 ? 1.5 - (20/mfhrs) : 1
      let saf = saot>0 ? ot.sa : mff
      let suf = suot>0 ? ot.su :mff
      let mfrate = drnd(mff*p.rate)
      let sarate = drnd(saf*p.rate)
      let surate = drnd(suf*p.rate)
      const regot = {reg:reg, mfot:mfot, gross:gross, grossAP: grossAP, saot:saot, suot:suot, mff:mff, saf:saf, suf:suf, mfrate, sarate, surate}
      return {...p, regot}
    })
    this.setState({persons:np},()=>this.calcDeductions())
  } 

  calcDeductions =()=>{
    const{persons} = this.state
    const dedpers = persons
      // .filter((p)=>p.wtype!='1099')
      .map((p)=>{
        let hded=0
        let kded=0
        if(p.healthemp>0){
          hded = p.healthemp*12.0/50
        }
        if(p.k401emp>0){
          kded = p.k401emp*12.0/50
        }
        const taxablegross = p.regot.gross - hded - kded
        p.ded = {gross:drnd(p.regot.gross), healthded:drnd(hded), k401ded:drnd(kded), taxablegross:drnd(taxablegross) }
        // console.log('p.ded: ', p.ded)
        return p
      })
      this.setState({persons:dedpers},()=>this.calcWh())
  }
  
  calcWh=()=>{
    const lookupFedTax=(fedwh, singmar,period, subj2wh, w4add)=>{
      let tax = 0
      if(subj2wh>0){
        const lkup = fedwh
          .filter((wh)=>wh.singmar==singmar && subj2wh>wh.over && subj2wh<wh.notover)
        tax+=lkup[0].perc*subj2wh + w4add
        tax = tax>0 ? tax : 0
      }
      return tax
    }
    const calcStateTax = (p, strates, ssmed)=>{
      let sttax, stSubj2tax
      if(p.student || p.ded.taxablegross<strates.nowhbelow){
        sttax=0
      }else{
        const hoh = p.sthoh ? strates.hohded : 0
        const blind = p.stblind ? strates.blided : 0
        const allow = p.stallow ? p.stallow : 1 
        stSubj2tax = p.ded.taxablegross - strates.allow*allow -hoh - blind - ssmed
        sttax = stSubj2tax*strates.rate + p.staddtax
        sttax = sttax>0 ? sttax : 0
      }
      return sttax  
    } 
    const {persons, rates} = this.state
    const{fedr,fedwh, strates} =rates
    const whp = persons.map((p)=>{
      if(p.wtype!='1099'){
        const{taxablegross, gross}=p.ded
        const subj2wh = p.w4exempt ? 0 : taxablegross-(fedr.allow*p.w4allow)
        const ss = taxablegross*fedr.ssw
        const medi = taxablegross*fedr.mediw
        const meda = 0
        const singmar = p.marital=='married' ? 'married' : 'single'
        const fedtax = lookupFedTax(fedwh, singmar, 'weekly', subj2wh, p.w4add)
        const sttax =  calcStateTax(p, strates, ss+medi)
        const net = gross-fedtax-ss -medi - sttax
        p.wh={gross:gross, taxablegross:taxablegross, ss:drnd(ss), medi:drnd(medi), meda:drnd(meda), fedtax:drnd(fedtax), sttax:drnd(sttax), net:drnd(net)}
      }
      return p
    })
    this.setState({persons:whp},()=>this.calcBurden())
  }

  calcBurden=()=>{
    const {persons, rates} = this.state
    const{fedr, cosr} =rates
    const burper = persons.map((p)=>{
      if(p.wtype!='1099'){
        const{ gross}=p.ded
        const ss = drnd(gross*fedr.sse)
        const medi = drnd(gross*fedr.medie)
        let health = p.healthco>0 ? drnd(p.healthco*12.0/50) : 0
        let k401 = p.k401co>0 ? drnd(p.k401co*12.0/50) : 0
        let vaca = p.vacation>0 ? drnd(p.vacation/250*gross) : 0
        let holi = p.holiday>0 ? drnd(p.holiday/250*gross) : 0
        let pers = p.personal>0 ? drnd(p.personal/250*gross) : 0
        let suta = drnd(cosr.stuirate*gross)
        let comp = drnd(cosr.wcrate*gross)
        let futa = drnd(fedr.futa*gross)
        let tburden = drnd(ss+medi+health+k401+vaca+holi+pers+suta+comp+futa)
        let bpercent = drnd(tburden/gross*10)/10
        p.burden={gross,ss,medi,health,k401,vaca,holi,pers,suta,futa,comp,tburden, bpercent}
      }
      return p
    })
    this.setState({persons:burper},()=>this.calcCostPerHrPerDay())
  }

  calcCostPerHrPerDay = ()=>{
    const {persons} = this.state
    const coper = persons.map((p)=>{
      let np = {}
      const {sarate, surate, mfrate} =p.regot
      let burperc = 0
      if(p.burden &&  p.burden.bpercent){
        burperc = p.burden.bpercent
      }
      let ratarr = new Array(7).fill(drnd(mfrate*(1+burperc)))
      ratarr[5]=drnd(sarate*(1+burperc))
      ratarr[6]=drnd(surate*(1+burperc))
      np.ratearr = ratarr
      np.emailid=p.emailid
      np.wprt=p.wprt
      p.jcrates = np
      return p
    })
    this.setState({persons:coper},()=>console.log('this.state: ', this.state))
    
  }

  paySelected = ()=>{
    const{persons}=this.state
    const jper = persons
      .filter((p)=>p.check)
      .map((p)=>{
        return p.jcrates
      })
    postJobRates(jper)
    this.setAsPaid()
    this.apply2gl()
  }

  setAsPaid=()=>{
    const nstate = {...this.state}
    const perpa= nstate.persons.map((p)=>{
      const np = {...p}
      if (np.check){
        console.log('in pcheck')
        np.status='paid'
      }
      return np
    })
    this.setState({persons:perpa},()=>console.log('this.state: ', this.state))   
  }

  apply2gl=()=>{
    const{persons}=this.state
    let journal = [] 
    persons
      .filter((p)=>p.check)
      .map((p)=>{
        let blentry={account:'', wdprt:p.wprt, someid:p.emailid, job:'', cat:'', date:moment().format('YYYY-MM-DD'), somenum: 0, debit:0, credit:0}
        let e ={...blentry}
        e.account ='a6010-gross'
        e.debit=p.regot.gross
        journal.push(e)
        let net = p.regot.gross
        
        if (p.regot.grossAP && p.regot.grossAP>0){
          e ={...blentry}
          e.account ='a2200-grossAP'
          e.credit=p.regot.grossAP
          journal.push(e)

          e ={...blentry}
          e.account ='a6010-gross'
          e.debit=p.regot.grossAP
          journal.push(e)
        }
        if (p.wh){
          e ={...blentry}
          e.cat='worker'
          e.account ='a2010-SS'
          e.credit=p.wh.ss
          journal.push(e)

          e ={...blentry}
          e.cat='worker'
          e.account ='a2020-medi'
          e.credit=p.wh.medi
          journal.push(e)
          if (p.wh.meda>0){
            e ={...blentry}
            e.cat='worker'
            e.account ='a2020-meda'
            e.credit=p.wh.meda
            journal.push(e)
          }

          if (p.wh.fedtax>0){
            e ={...blentry}
            e.cat='worker'
            e.account ='a2050-fedWh'
            e.credit=p.wh.fedtax
            journal.push(e)
          }
          if (p.wh.sttax>0){
            e ={...blentry}
            e.cat='worker'
            e.account ='a2060-stWh'
            e.credit=p.wh.sttax
            journal.push(e)  
          }
          net = p.wh.net
        }
        e ={...blentry}
        e.account ='a1010-cash'
        e.credit=net
        journal.push(e)
        if (p.burden){
          e ={...blentry}
          e.account ='a6020-burden'
          e.debit=p.burden.tburden
          journal.push(e)

          if (p.burden.ss>0){
            e ={...blentry}
            e.cat='co'
            e.account ='a2010-SS'
            e.credit=p.burden.ss
            journal.push(e)
          }
          if (p.burden.medi>0){
            e ={...blentry}
            e.cat='co'
            e.account ='a2020-medi'
            e.credit=p.burden.medi
            journal.push(e)
          }
          if (p.burden.futa>0){
            e ={...blentry}
            e.account ='a2080-FUTA'
            e.credit=p.burden.futa
            journal.push(e)
          }
          if (p.burden.suta>0){
            e ={...blentry}
            e.account ='a2090-SUTA'
            e.credit=p.burden.suta
            journal.push(e)
          }
          if (p.burden.comp>0){
            e ={...blentry}
            e.account ='a2100-comp'
            e.credit=p.burden.comp
            journal.push(e)
          }
          if (p.burden.k401>0){
            e ={...blentry}
            e.account ='a2110-401K'
            e.credit=p.burden.k401
            journal.push(e)
          }
          if (p.burden.health>0){
            e ={...blentry}
            e.account ='a2120-health'
            e.credit=p.burden.health
            journal.push(e)
          }
          if (p.burden.holi>0){
            e ={...blentry}
            e.account ='a2130-holiday'
            e.credit=p.burden.holi
            journal.push(e)
          }
          if (p.burden.vaca>0){
            e ={...blentry}
            e.account ='a2140-vacation'
            e.credit=p.burden.vaca
            journal.push(e)
          }
          if (p.burden.pers>0){
            e ={...blentry}
            e.account ='a2150-personal'
            e.credit=p.burden.pers
            journal.push(e)
          }
          e ={...blentry}
          e.account ='a6020-burden'
          e.credit=p.burden.tburden
          journal.push(e)

          e ={...blentry}
          e.account ='a6010-gross'
          e.credit=p.regot.gross
          journal.push(e)
        }
      })
    // const perpa= persons.map((p)=>{
    //   const np = {...p}
    //   if (np.check){
    //     console.log('in pcheck')
    //     np.status='paid'
    //   }
    //   return np
    // })
    // console.log('perpa: ', perpa)
    // this.setState({persons:perpa},()=>console.log('this.state: ', this.state)) 
    postJournal(journal)    
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

  // filtAct = ()=>setKeyVal({filt:'active'});
  // filtInAct = ()=>setKeyVal({filt:'inactive'});
  // filtAll = ()=>setKeyVal({filt:'all'});

  // dfiltCurrent = ()=>setKeyVal({dfilt:'current'});
  // dfiltFuture = ()=>setKeyVal({dfilt:'future'});
  // dfiltHistory = ()=>setKeyVal({dfilt:'history'});
  // dfiltAll = ()=>setKeyVal({dfilt:'all'});
  
  
  // fact = (person)=>person.active==true
  // finact = (person)=>person.active==false
  // fall = ()=>true

  // afilt = (person)=>{
  //   switch (this.props.eperson.filt) {
  //     case 'all':
  //       return this.fall(person) 
  //     case 'active':
  //       return this.fact(person) 
  //     case 'inactive':
  //       return this.finact(person) 
  //     default:
  //       return this.fall()
  //   }
  // }

  // efilt = (person)=>{
  //   person.effective = person.effective ? person.effective.split('T')[0] : null
  //   const cdate = moment().format("YYYY-MM-DD")
  //   switch (this.props.eperson.dfilt) {
  //     case 'all':
  //       return true 
  //     case 'current':
  //       return true
  //     case 'history':
  //       return person.effective && person.effective<=cdate
  //     case 'future':
  //       return person.effective && person.effective>cdate
  //     default:
  //       return this.fall()
  //   }
  // }

  // cfilt = (persons)=>{
  //   if(this.props.eperson.dfilt=='current') {
  //     persons = this.getCurrent(persons)
  //   }
  //   return persons
  // }

  // getwk = ()=>{
  //   this.alterPayYdate(this.state.wk)  
  // }
  // buzz=()=>{
  //   console.log('buzz()')
  //   window.navigator.vibrate(100)
  // }
  // getwk0 = ()=>{
  //   this.alterPayYdate(0)  
  // }

  // alterPayYdate = (wk)=>{
  //   fetchPay(wk)
  //   .then((res)=>{
  //     const dddMMDD = this.alterDddMMDD(this.state.wk) 
  //     this.setState({persons: res.persons, dddMMDD},()=>{})

  //   })
  // }

  // alterDddMMDD=(wk)=>{
  //   let wdprt = `${this.state.yr}-W${padWk(wk)}-${this.state.firstday}`
  //   wdprt = adjWdprtDn(this.state.firstday, wdprt)
  //   return moment(wdprt).format("ddd MM/DD")
  // }

  // sav2wk = ()=>{
  //   this.buzz()
  //   console.log('save2week')
  //   let wk = this.state.wk
  //   if(wk===undefined || wk==0){
  //     window.alert('please select a week')
  //     return
  //   } 
  //   const persons = this.state.persons
  //     .filter((j)=>j.active)
  //     .map((j)=>{return {person: j.person, category: j.category,   active: j.active*1, idx: j.idx, week:wk}})
  //   postPay(persons, wk)
  //     .then(()=>{
  //       console.log('done saving')
  //     })
  // }

  // editPerson=(j)=>{
  //   console.log('j: ', j)
  //   setEdit(j)
  //   setKeyVal({update:true})
  //   // router.navigate('/addperson?idx='+j.idx);
  //   router.navigate('/addperson');
  // }
  // chwk=(e)=>{
  //   let val =e.target.value
  //   if(val>0 && val<=52){
  //     const dddMMDD = this.alterDddMMDD(val) 
  //     this.setState({wk:val, dddMMDD},()=>console.log('this.state: ', this.state))
  //   }
  // }
  // chyr=(e)=>{
  //   let val =e.target.value
  //   if(val>2017 && val<=2051){
  //     console.log('val: ', val)
  //     this.setState({yr:val})
  //   }
  // }

  // setStatBkg=()=>{
  //   let sta ={...style.he.but}
  //   let ac = {...sta.ac}
  //   let ia = {...sta.ia}
  //   let al = {...sta.al}
  //   let cu = {...sta.cu}
  //   let fu = {...sta.fu}
  //   let hi = {...sta.hi}
  //   let da = {...sta.da}
  //   const norm = 'whitesmoke'
  //   const hili = '#99CCCC'
  //   const st = this.props.eperson.filt
  //   switch(st){
  //     case 'all':
  //       al.background = hili
  //       ia.background = norm
  //       ac.background = norm
  //     break;
  //     case 'active':
  //       al.background = norm
  //       ia.background = norm
  //       ac.background = hili
  //     break;
  //     case 'inactive':
  //       al.background = norm
  //       ia.background = hili
  //       ac.background = norm
  //     break;
  //   }
  //   const dst = this.props.eperson.dfilt
  //   switch(dst){
  //     case 'all':
  //       da.background = hili
  //       cu.background = norm
  //       fu.background = norm
  //       hi.background = norm
  //     break;
  //     case 'current':
  //       da.background = norm
  //       fu.background = norm
  //       hi.background = norm
  //       cu.background = hili
  //     break;
  //     case 'future':
  //       hi.background = norm
  //       da.background = norm
  //       fu.background = hili
  //       cu.background = norm
  //     break;
  //     case 'history':
  //       da.background = norm
  //       hi.background = hili
  //       cu.background = norm
  //       fu.background = norm
  //     break;
  //   }
  //   sta.ac =ac
  //   sta.ia =ia
  //   sta.al =al 
  //   sta.cu =cu 
  //   sta.fu =fu 
  //   sta.hi =hi 
  //   sta.da =da 
  //   return sta
  // }

  getQuery=()=>{
    const params = this.props.cambio.page.params
    if(params && params.query =='rerender'){
      location.replace('#persons')
      setTimeout(()=>{
        this.getPay()
      },300)     
      
    }
  }

  handleCheck = idx => e =>{
    let nstate = {...this.state}
    const persons=nstate.persons.slice()
    persons[idx].check=e.target.checked
    console.log('persons: ', persons)
    this.setState({persons}, ()=>console.log('this.state: ', this.state))
  }

  handleCheckAll = (e) =>{
    let nstate = {...this.state}
    const npersons= nstate.persons.slice()
    const ckper = npersons.map((p)=>{
      p.check=e.target.checked
      return p
    })
    this.setState({persons:ckper, checkall:e.target.checked}, ()=>console.log('this.state: ', this.state))
  }

  renderRegOt = (p)=>{
    if(p.regot){
      const{reg, gross, grossAP}=p.regot
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
        {grossAP>0 && 
        <tr style={style.table.tr}>
          <td style={style.table.thtd}>APgross</td>
          <td style={style.table.thtd}>{grossAP.toFixed(2)}</td>
        </tr>
        }
        <tr style={style.table.tr}>
          <th style={style.table.thtd}>gross</th>
          <th style={style.table.thtd}>{gross.toFixed(2)}</th>
        </tr>
        </tbody></table>  
      )
    }
  }
  renderDed = (p)=>{
    if(p.ded && (p.ded.healthded>0 || p.ded.k401ded>0)){

      return (
        <table style={style.table.table}><tbody>
        <tr><th style={style.table.col2} colSpan="2">Deductions</th></tr>  
        <tr style={style.table.tr}>
          <td style={style.table.thtd}>health</td>
          <td style={style.table.thtd}>{p.ded.healthded.toFixed(2)}</td>
        </tr>
        <tr style={style.table.tr}>
          <td style={style.table.thtd}>401K</td>
          <td style={style.table.thtd}>{p.ded.k401ded.toFixed(2)}</td>
        </tr>
        <tr style={style.table.tr}>
          <th style={style.table.thtd}>taxable</th>
          <th style={style.table.thtd}>{p.ded.taxablegross.toFixed(2)}</th>
        </tr>
        </tbody></table>  
      )
    }
  }

  renderWh = (p)=>{
    if(p.wh){

      return (
        <table style={style.table.table}><tbody>
        <tr><th style={style.table.col2} colSpan="2">Taxes</th></tr>  
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
    console.log('re-rendering pay')
    let {persons}=this.state
    const rpersons = persons
      .map((aperson, i)=>{
        if(aperson.status=='approved'){
          const regot = this.renderRegOt(aperson)
          const wh = this.renderWh(aperson)
          const dedu = this.renderDed(aperson)
          return (
          <li  key={i} style={style.myli.li}>
            <div style={style.myli.person}> 
            <input style={style.ckbox} type="checkbox" checked={aperson.check} onChange={this.handleCheck(i)}/> 
              <span><br/>
              {aperson.wprt}<br/>
              {aperson.emailid}<br/>
               <span>{aperson.firstmid} {aperson.lastname}</span> <br/>
                {aperson.street}<br/>
                {aperson.city}, {aperson.st} {aperson.zip}<br/>
                worker type: {aperson.wtype}
              </span>
            </div>
            <div style={style.myli.cat}>
              <span>  
              ${aperson.rate} x {aperson.hrs}hrs<br/>
              {regot}
              {dedu}
              {wh}
              </span>
            </div>
          </li >)
        }
    })
    return(
      <ul style={style.myli.ul}>
        {rpersons}
      </ul>     
    )
  }

  render(){
    const{persons }=this.state
    if (persons){
      this.getQuery()
      // const actstyle = this.setStatBkg()
      const rndrdpersons = this.renderPay()
      return(
        <div >
          <div style={style.he}>
            <div> 
                {/* <button style={actstyle.ac} onClick={this.filtAct}>active</button>
                <button style={actstyle.ia} onClick={this.filtInAct}>inact</button>
                <button style={actstyle.al} onClick={this.filtAll}>all</button>
                <br/> */}
                <span >
                  <input style={style.ckbox} type="checkbox" checked={this.state.checkall} onChange={this.handleCheckAll}/> 
                  {/* <button style={actstyle.cu} onClick={this.dfiltCurrent}>current</button>
                  <button style={actstyle.fu} onClick={this.dfiltFuture}>future</button> */}
                  <button style={style.he.but.hi} onClick={this.paySelected}>Pay Selected</button>
                  {/* <button style={actstyle.da} onClick={this.dfiltAll}>all</button> */}

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
        <div style={style.he}>
          <p>Message from server: {this.state.qmessage}. </p><br/> <p> The link below will take you home where you will be asked to re-register. This will take you to a list of apps you can use in your company. If you are registered in more than one company, you can choose your company first. <a href={makeHref(location.hostname, 'signup', '#urapps')} >HOME</a></p> 
          
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
    overflow:'hidden',
    margin: '2px 10px 10px 10px',
    padding: '4px',
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
    },
    col2:{
      textAlign:'left'
    }
  },
  ckbox:{
    MozTransform: 'scale(1.2)',
    msTransform: 'scale(1.5)',
    WebkitTransform: 'scale(1.8)',
    OTransform: 'scale(1.5)',
    padding: '10px',
    margin: '10px'
  }
}

