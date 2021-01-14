import React from 'react'// eslint-disable-line no-unused-vars
var moment = require('moment');
// import {router} from '../app'
import {mapClass2Element} from '../hoc/mapClass2Element'
// import {fetchPay, postPay, fetchSettings, fetchRates, postJobRates, postJournal} from '../services/fetches'
import {fetchPay, fetchRates, fetchState, fetchAccrued, postJournal, postJobRates, postPayStub, fetchPayStubs} from '../services/fetches'
// import{adjWdprtDn, padWk} from  '../../../../common/v0/src/utilities/reroo'
// import { setEdit, setKeyVal} from '../actions/personacts';
import { setKeyVal} from '../actions/personacts';
import {makeHref,drnd} from '../utilities/getCfg'
// import Checkbox from '@material-ui/core/Checkbox';// eslint-disable-line no-unused-vars
import jsPDF from 'jspdf'
require('jspdf-autotable');
// console.log('jsPDF: ', jsPDF)
import {ls} from '../utilities/getCfg'
import {addPage, removePage}from '../actions/responsive'


class Pay extends React.Component{
  Pay='mabibi sufvhs'
  state={
    notpersons: [{person: 'duck', id: 99, effective:'2018-01-01T14:12'}],
    wk: moment().week(),
    yr: moment().format('YYYY'),
    dddMMDD:'',
    firstday: ls.getKey('firstday'),
    waiting: true,
    pshow:'topay'
  }

  dwk=null

  componentWillUnmount(){
    removePage('Pay')
  }

  componentDidMount(){
    addPage('Pay')
    //this.getSettings()
    //this.getRates()
    this.getAccrued()
    // this.dwk = document.getElementById("wk")
    // console.log('moment().format("YYY-MM-DD): ', moment().format("YYYY-MM-DD"))
  }  

  // getSettings=()=>{
  //   fetchSettings()     
  //     .then((res)=>{
  //       if (res.qmessage){
  //         console.log('res.qmessage: ', res.qmessage)
  //         this.setState({qmessage:res.qmessage})
  //        // window.alert(res.qmessage)
  //       }else{
  //         console.log('res: ', res)
  //         console.log('JSON.parse(res.ot): ', JSON.parse(res.ot))
  //         // this.setState({firstday: res.firstday},()=>{
  //         //   setKeyVal({coid: res.coid, qmessage:res.qmessage, task:'pay',ot:JSON.parse(res.ot), firstday:res.firstday, wcrate:res.wcrate, stuirate:res.stuirate})
  //         // })
  //         this.setState({cosr:res, firstday: res.firstday},()=>{
  //           setKeyVal({coid: res.coid, qmessage:res.qmessage, task:'pay', ot:{}, firstday:res.firstday, wcrate:res.wcrate, stuirate:res.stuirate})
  //           console.log('this.state: ', this.state)
  //         })
  //       }
  //     })
  // }
  getAccrued=()=>{
    fetchAccrued()
    .then((res)=>{
      console.log('res: ', res)
      if(!res.qmessage){
        this.setState({accrued:res}, ()=>{
          this.getPay()
          console.log(this.lookupAccrued('mckenn.tim@gmail.com', 'a2010-S'))
        })
      }else{
        this.setState({waiting:false, qmessage:res.qmessage})
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

  getRates=()=>{
    fetchRates()     
      .then((res)=>{
        if (res.qmessage){
          console.log(res.qmessage)
        }else{
          this.setState({rates:res},()=>this.calcGross())
        }
      })
  }  

  calcPaydate = (wprt)=>{
    const{firstday}=this.state
    let wdprt = wprt+'-'+firstday
    if (firstday!=1 && wdprt.slice(-1)>=firstday){
      wdprt= moment(wdprt).subtract(7, "days").format("YYYY-[W]WW-E")
    }
    let paydate = moment(wdprt).add(7, "days").format("YYYY-MM-DD")
    return paydate
  }
 
  calcGross =() =>{
    const {persons, rates} = this.state
    const{cosr}=rates
    let{otrate, sarate, surate}=cosr
    otrate = otrate<1 ? 1 : otrate
    sarate = sarate<1 ? 1 :sarate
    surate =surate<1 ? 1 : surate
    const np = persons.map((p)=>{
      p.paydate=this.calcPaydate(p.wprt)
      let hrs = p.hrs
      const hrsarr = JSON.parse(p.hrsarr)
      let saot=0, suot=0 ,mfot=0, reg=0, aot=0, gross=0,grossAP=0, regot={}
      if(p.wtype!='1099'){
        let mfhrs = hrsarr.slice(0,5).reduce((t,h)=>t+h,0)
        let sah = hrsarr[5]
        let suh = hrsarr[6]
        if(sah>0){
          if(cosr.sarate>1){
            saot = (sarate-1)*sah*p.rate
          }else{
            mfhrs = mfhrs+sah
          }
        }
        if(suh>0){
          if(surate>1){
            suot = (surate-1)*suh*p.rate
          }else{
            mfhrs = mfhrs+suh
          }
        }
        if(otrate>1 && mfhrs>40 ){
          mfot = (otrate-1)*(mfhrs-40)*p.rate
        }
        reg = hrs*p.rate
        aot = saot+suot+mfot
        gross=drnd(reg+aot)
        if (p.weeklybase && p.weeklybase>0){
          if (gross > p.weeklybase && p.wtype=='base'){
            grossAP = gross - p.weeklybase
            gross = p.weeklybase
          }
        }
        let mff = mfhrs<=40 ? 1 : ((p.rate*mfhrs+(mfhrs-40)*p.rate*(otrate-1))/mfhrs)/p.rate
        let saf = saot>0 ? sarate : mff
        let suf = suot>0 ? surate :mff
        let mfperhr = drnd(mfhrs<=40 ? p.rate : (p.rate*mfhrs+(mfhrs-40)*p.rate*(otrate-1))/mfhrs)
        let saperhr = drnd(saf*p.rate)
        let superhr = drnd(suf*p.rate)
        regot = {reg, mfot, gross, grossAP: grossAP, ot:aot, saot:saot, suot:suot, mff:mff, saf:saf, suf:suf, mfrate:mfperhr, sarate:saperhr, surate:superhr}
      }else{
        reg = drnd(hrs*p.rate)
        gross = reg
        let hrrate = drnd(reg/hrs)
        regot = {reg:reg, mfot:mfot, gross:gross, grossAP, ot:0, saot:0, suot:0, mff:1, saf:1, suf:1, mfrate:hrrate, sarate:hrrate, surate:hrrate}
      }
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
        if(p.wtype!='1099'){
          if(p.healthemp>0){
            hded = p.healthemp*12.0/50
          }
          if(p.k401emp>0){
            kded = p.k401emp*12.0/50
          }
          //p.ded = {gross:drnd(p.regot.gross), healthded:drnd(hded), k401ded:drnd(kded), taxablegross:drnd(taxablegross) }
          p.ded = {healthded:drnd(hded), k401ded:drnd(kded), }
        }else{
          p.ded = {healthded:drnd(hded), k401ded:drnd(kded) }
        }
        return p
      })
      this.setState({persons:dedpers},()=>this.calcWh())
  }

  getStateRates=(st)=>{
    fetchState(st)
    .then((res)=>{
      console.log('res: ', res)
    })
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
    const calcStateTax = (p, ss, media)=>{
      const{ssYtd, mediYtd}=p.accrued
      let{strates}=this.state.rates
      if (strates.st!=p.st){
        strates=this.getStateRates(p.st)
      }
      switch(p.st) {
        case "MA":
          let sttax, statetaxable=p.regot.gross, stateded=0
          if(p.student || p.regot.gross<strates.nowhbelow){
            sttax=0
          }else{
            stateded = ssYtd + mediYtd >= strates.ficasub ? 0 : ss+media
            const hoh = p.sthoh ? strates.hohded : 0
            const blind = p.stblind ? strates.blided : 0
            const allow = p.stallow ? p.stallow : 1 
            statetaxable = p.regot.gross - stateded
            const subj2tax = statetaxable - strates.allow*allow -hoh - blind
            sttax = subj2tax*strates.rate + p.stadd
            // console.log('p.staddtax: ', p.stadd)
            sttax = sttax>0 ? sttax : 0
          }
          return {sttax, statetaxable, stateded}
        case "MD":
          console.log('We arent quite set up for '+p.st)
          return {sttax:0, statetaxable:0, stateded:0}
        default:  
          console.log('We arent set up for '+p.st)
          return 0
      }
    } 
    const {persons, rates} = this.state
    const{fedr,fedwh,cosr} =rates
    const whp = persons.map((p)=>{
      const hrsYtd = this.lookupHrs(p.emailid)
      const regYtd = this.lookupAccrued(p.emailid, 'a6011-reg')
      if(p.wtype!='1099'){
        const ssYtd = this.lookupAccrued(p.emailid, 'a6036-SS')
        const mediYtd = this.lookupAccrued(p.emailid, 'a6037-medi')
        const stYtd = this.lookupAccrued(p.emailid, 'a2060-stWh')
        const fedYtd = this.lookupAccrued(p.emailid, 'a2050-fedWh')
        const netYtd = this.lookupAccrued(p.emailid, 'a6032-net')
        const otYtd = this.lookupAccrued(p.emailid, 'a6012-ot')
        const grossYtd = regYtd + otYtd
        const k401Ytd = this.lookupAccrued(p.emailid, 'a6023-401K')
        const healthYtd = this.lookupAccrued(p.emailid, 'a6024-health')
        const coHealthYtd = this.lookupAccrued(p.emailid, 'a6024-health')
        const co401kYtd = this.lookupAccrued(p.emailid, 'a6023-401K')
        const holidayYtd = this.lookupAccrued(p.emailid, 'a2130-holiday')
        const vacationYtd = this.lookupAccrued(p.emailid, 'a2140-vacation')
        const personalYtd = this.lookupAccrued(p.emailid, 'a2150-personal')
        const ptoYtd = this.lookupAccrued(p.emailid, 'a2160-PTO')
        const grossAPYtd = this.lookupAccrued(p.emailid, 'a2200-grossAP')
        p.accrued = {hrsYtd, stYtd, fedYtd, ssYtd, mediYtd, netYtd, regYtd, otYtd, grossYtd, k401Ytd, healthYtd, holidayYtd, vacationYtd, personalYtd, ptoYtd, grossAPYtd, coHealthYtd, co401kYtd}
        const fedded = drnd(p.ded.healthded + p.ded.k401ded)
        const fedtaxable = p.regot.gross - fedded
        const ficaded = drnd(p.ded.healthded*cosr.healthFICAded + p.ded.k401ded*cosr.retireFICAded)
        const ficataxable = p.regot.gross - ficaded
        const subj2wh = p.w4exempt ? 0 : fedtaxable-(fedr.allow*p.w4allow)
        let ss = p.regot.gross+ grossYtd> fedr.ssbase ? 0 : drnd(ficataxable*fedr.ssw)
        let medi = drnd(ficataxable*fedr.mediw)
        const addmedtaxable = p.regot.gross + grossYtd > fedr.mediexcess ? grossYtd-fedr.mediexcess : 0
        const meda = drnd(addmedtaxable*fedr.mediadd)
        const media = medi+meda
        const singmar = p.marital=='married' ? 'married' : 'single'
        const fedtax = drnd(lookupFedTax(fedwh, singmar, 'weekly', subj2wh, p.w4add))
        const {sttax, statetaxable, stateded} =  calcStateTax(p, ss, media)
        const net = drnd(p.regot.gross- p.ded.healthded - p.ded.k401ded - fedtax-ss -media - sttax)
        p.wh={gross:p.regot.gross, fedtaxable, ficataxable, statetaxable, ficaded, ss, medi, addmedtaxable, meda, fedded, fedtax, stateded, sttax, net}
      }else{
        p.wh={gross:p.regot.gross, net:p.regot.gross}
        p.accrued={hrsYtd, grossYtd:regYtd, netYtd:regYtd}
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
        const{grossYtd}=p.accrued
        const{ gross, grossAP}=p.regot
        let{ficataxable}=p.wh
        const ss = p.regot.gross+ grossYtd> fedr.ssbase ? 0 : drnd(ficataxable*fedr.sse)
        const medi = drnd(ficataxable*fedr.medie)//no employer match for additional
        let health = p.healthco>0 ? drnd(p.healthco*12.0/50) : 0
        let k401 = p.k401co>0 ? drnd(p.k401co*12.0/50) : 0
        let vaca = p.vacation>0 ? drnd(p.vacation/250*p.hrs*p.rate) : 0
        let holi = p.holiday>0 ? drnd(p.holiday/250*p.hrs*p.rate) : 0
        let pers = p.personal>0 ? drnd(p.personal/250*p.hrs*p.rate) : 0
        let pto = p.pto>0 && pers==0 && holi==0 && vaca==0  ? drnd(p.pto/250*p.hrs*p.rate) : 0
        let suta = drnd(cosr.stuirate*gross)
        let comp = drnd(cosr.wcrate*gross)
        let futa = grossYtd > fedr.futa4first ? 0 : drnd(fedr.futa*gross)
        let tburden = drnd(ss+medi+health+k401+vaca+holi+pers+suta+comp+futa)
        let bpercent = (tburden+gross+grossAP)/(gross+grossAP)
        p.burden={gross,ss,medi,health,k401,vaca,holi,pers,pto,suta,futa,comp,tburden, bpercent}
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
      let burperc = 1
      if(p.burden &&  p.burden.bpercent){
        burperc = p.burden.bpercent
      }
      let ratarr = new Array(7).fill(drnd(mfrate*burperc*10)/10)
      ratarr[5]=drnd(sarate*+burperc*10)/10
      ratarr[6]=drnd(surate*burperc*10)/10
      np.ratearr = ratarr
      np.emailid=p.emailid
      np.wprt=p.wprt
      np.paydate=p.paydate
      p.jcrates = np
      return p
    })
    this.setState({persons:coper, topay:coper, showcurrent:true, waiting:false}, ()=>{
      console.log('this.state: ', this.state)
    })
  }

  lookupAccrued=(emailid, account)=>{
    const{accrued}=this.state
    const found = accrued.find((a)=>{
      return a.someid == emailid && a.account == account
    })
    //console.log('found: ', found)
    return found ? found.credit-found.debit : 0
  }

  lookupHrs=(emailid)=>{
    const{accrued}=this.state
    const found = accrued.find((a)=>{
      return a.someid == emailid && a.account == 'a5010-COGS'
    })
    console.log('found: ', found)
    let thrs =  found ? found.hrs : 0
    const found2 = accrued.find((a)=>{
      return a.someid == emailid && a.account == 'a6000-labor'
    }) 
    let thrs2 =  found2 ? found2.hrs : 0  
    thrs = thrs+thrs2 
    return thrs
  }

  calcC=()=>{
    console.log('this.state: ', this.state)
    const {persons} = this.state
    persons.map((p)=>{
      let{hrsarr}=p
      hrsarr= JSON.parse(hrsarr)
      const{gross,grossAP, mff, saf, suf}=p.regot
      const burden = p.burden ? p.burden.tburden : 0
      const tcost = gross + grossAP + burden
      p.burden ? console.log('p.burden.bpercent: ', p.burden.bpercent, tcost/(gross+grossAP)) : console.log('no burden')
      console.log('p.regot: ', p.regot)
      console.log('hrsarr: ', hrsarr)
      console.log('gross+AP ', gross+grossAP, 'tcost: ', tcost, 'mff ', mff, 'saf ', saf, 'suf ', suf, 'bp ', burden/tcost)
    })    
  }


  paySelected = ()=>{
    this.apply2gl() //calls setAsPaid()->createPayPdf()->(p)->postPayStub()
    this.setAsPaid()
    this.getAccrued()
  }

  setAsPaid=()=>{
    const nstate = {...this.state}
    const perpa= nstate.topay.map((p)=>{
      const np = {...p}
      if (np.check){
        np.status='paid'
      }
      return np
    })
    this.setState({persons:perpa,topay:perpa},()=>{
      this.createPayPdf()
      console.log('this.state: ', this.state)
    })   
  }

  apply2gl=()=>{
    const{topay}=this.state
    
    topay
      .filter((p)=>p.check)
      .map((p)=>{
        let journal = [] 
        let blentry={account:'', wdprt:p.wprt, someid:p.emailid, job:'', cat:'', date:p.paydate, somenum: 0, debit:0, credit:0}
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
          if(p.wh.ss>0){
            e ={...blentry}
            e.cat='worker'
            e.account ='a2010-SS'
            e.credit=p.wh.ss
            journal.push(e)
          }
          if(p.wh.medi>0){
            e ={...blentry}
            e.cat='worker'
            e.account ='a2020-medi'
            e.credit=p.wh.medi
            journal.push(e)
          }
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
          if (p.burden.k401>0 || p.ded.k401ded>0){
            e ={...blentry}
            e.account ='a2110-401K'
            e.credit=p.burden.k401 + p.ded.k401ded
            journal.push(e)
          }
          if (p.burden.health>0 || p.ded.healthded>0){
            e ={...blentry}
            e.account ='a2120-health'
            e.credit=p.burden.health + p.ded.healthded
            journal.push(e)
          }
          // if (p.ded.k401ded>0){
          //   e ={...blentry}
          //   e.account ='a2110-401K'
          //   e.debit=p.ded.k401ded
          //   journal.push(e)
          // }
          // if (p.ded.healthded>0){
          //   e ={...blentry}
          //   e.account ='a2120-health'
          //   e.debit=p.ded.healthded
          //   journal.push(e)
          // }          
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
        }
      /*THESE ENTRIES UNBALANCE THE LEDGER balanced by postJobRates   reg+ot=gross+grossAP*/
        e ={...blentry}
        e.account ='a6011-reg'
        e.credit=p.regot.reg
        journal.push(e)
        if(p.regot.ot>0){
          e ={...blentry}
          e.account ='a6012-ot'
          e.credit=p.regot.ot
          journal.push(e)
        }
        if (p.burden){
          if (p.burden.ss>0 || p.burden.medi>0 ){
            e ={...blentry}
            e.cat='co'
            e.account ='a6021-FICA'
            e.credit=p.burden.ss+p.burden.medi
            journal.push(e)
          }
          if (p.burden.futa>0 || p.burden.suta>0 || p.burden.comp>0){
            e ={...blentry}
            e.account ='a6022-insurance'
            e.credit=p.burden.futa + p.burden.suta + p.burden.comp
            journal.push(e)
          }
          if (p.burden.k401>0){
            e ={...blentry}
            e.account ='a6023-401K'
            e.credit=p.burden.k401
            journal.push(e)
          }
          if (p.burden.health>0){
            e ={...blentry}
            e.account ='a6024-health'
            e.credit=p.burden.health
            journal.push(e)
          }
          if (p.burden.holi>0 || p.burden.vaca>0 || p.burden.pers>0 ){
            e ={...blentry}
            e.account ='a6025-PTO'
            e.credit=p.burden.holi + p.burden.vaca + p.burden.pers
            journal.push(e)
          }
        }
        /* wages expense  */
        e ={...blentry}
        e.account ='a6030-wages'
        e.debit=p.wh.gross
        journal.push(e)
        if(p.wtype=='1099'){
          e ={...blentry}
          e.account ='a6031-1099'
          e.credit=p.wh.net
          journal.push(e)
        }else{
          e ={...blentry}
          e.account ='a6032-net'
          e.credit=p.wh.net
          journal.push(e)
        }
        if (p.wh.fedtax>0){
          e ={...blentry}
          e.account ='a6033-fed'
          e.credit=p.wh.fedtax
          journal.push(e)
        }        
        if (p.wh.sttax>0){
          e ={...blentry}
          e.account ='a6034-state'
          e.credit=p.wh.sttax
          journal.push(e)
        }        
        if (p.wh.ss>0){
          e ={...blentry}
          e.account ='a6036-SS'
          e.credit=p.wh.ss
          journal.push(e)
        }        
        if (p.wh.medi>0){
          e ={...blentry}
          e.account ='a6037-medi'
          e.credit=p.wh.medi
          journal.push(e)
        }        
        if (p.wh.meda>0){
          e ={...blentry}
          e.account ='a6038-meda'
          e.credit=p.wh.meda
          journal.push(e)
        } 
        if (p.ded.healthded>0 || p.ded.k401ded>0){
          e ={...blentry}
          e.account ='a6039-dedu'
          e.credit=p.ded.healthded + p.ded.k401ded
          journal.push(e)
        }
        if(p.wtype!='1099') {
          e ={...blentry}
          e.account ='a6040-fedWages'
          e.debit=p.regot.gross
          journal.push(e)
          e ={...blentry}
          e.account ='a6041-fedTaxable'
          e.credit=p.wh.fedtaxable
          journal.push(e)
          if (p.wh.fedded>0){
            e ={...blentry}
            e.account ='a6042-fedDed'
            e.credit=p.wh.fedded
            journal.push(e)
          }          
          e ={...blentry}
          e.account ='a6050-stateWages'
          e.debit=p.regot.gross
          journal.push(e)
          e ={...blentry}
          e.account ='a6051-stateTaxable'
          e.credit=p.wh.statetaxable
          journal.push(e)
          if (p.wh.stateded>0){
            e ={...blentry}
            e.account ='a6052-stateDed'
            e.credit=p.wh.stateded
            journal.push(e)
          }          
          e ={...blentry}
          e.account ='a6060-FICAwages'
          e.debit=p.regot.gross
          journal.push(e)
          e ={...blentry}
          e.account ='a6061-FICAtaxable'
          e.credit=p.wh.ficataxable
          journal.push(e)
          if (p.wh.stateded>0){
            e ={...blentry}
            e.account ='a6062-FICAded'
            e.credit=p.wh.ficaded
            journal.push(e)
          }          
          if (p.wh.addmedtaxable>0){
            e ={...blentry}
            e.account ='a6042-fedDed'
            e.debit=p.wh.addmedtaxable
            journal.push(e)
            e ={...blentry}
            e.account ='a6042-fedDed'
            e.credit=p.wh.addmedtaxable
            journal.push(e)
          }          
        }  
        console.log('journal: ', journal) 
        postJobRates(p.jcrates)
        .then(()=>{
          postJournal({journal, emailid:p.emailid, paydate:p.paydate})
          .then((res)=>{
            console.log('res: ', res)
            const tribal = res.tribal[0]
            tribal.date =tribal.date.split('T')[0]
            console.log(tribal)
            const roundingerror = drnd(tribal.debit-tribal.credit)
            console.log('tribal.debit: ', tribal.debit, )
            console.log('roundingerror: ', roundingerror)
            const trbastr = `Trial Balance for ${tribal.someid} on ${tribal.date} is debit: \$${tribal.debit}, credit: \$${tribal.credit}, rounding error:\$${roundingerror}. If more than +/-$1.00 then there is a problem`
            console.log('trbastr: ', trbastr)
            if(Math.abs(roundingerror)>1){
              window.alert(trbastr)
            }
            console.log('this.state: ', this.state)
            // this.setAsPaid()
            // this.getAccrued()
          })               
        })
      })
  }

  inWords=(dec)=>{
    const lookup = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
    const teens = ['', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
    const str = dec.toFixed(2)
    const arr = str.split('.')
    const cents = arr[1]
    const dolls = arr[0].split("").map((d)=>parseInt(d))
    const len = dolls.length
    let isteens=false
    let dolstr = dolls.reduce((s,d,i)=>{
      let pos = len-i
      switch(pos){
        case 4:
          return s + lookup[d] + ' thousand '
        case 3:
          return s + lookup[d] + ' hundred '  
        case 2:
          if(d==1){isteens=true} 
          if(d==0){s=s.slice(0,-1)}
          return s + tens[d]+ ' '
        case 1:
          if (isteens){
            s=s.slice(0,-1)
            return s + teens[d]
          } else if(d==0){
            s=s.slice(0,-1)
            return s
          }else {
            return s + lookup[d]
          }
        default:
          return s  
      }
    },"")
    dolstr= dolstr.replace(/^[a-z]/, (c)=>c.toUpperCase())+' dollars and ' +cents+'/100'
    console.log('dolstr: ', dolstr)
    return dolstr
  }

  createPayPdf=()=>{
    console.log('increatepay.pdf: ')
    let doc = new jsPDF({
      orientation:'p', 
      unit: 'pt', 
      format: 'letter'
    });
    const pt = (n)=>Math.round(n*72)
    const{topay}=this.state
    // console.log('topay: ', topay)
    let cnt=-1
    topay
      .map((p)=>{
        // console.log('p: ', p)
        if(p.check){
          this.inWords(p.wh.net)
          cnt+=1
          let regotc, regotd
          const{gross}=p.regot
          const{hrsYtd, grossYtd}=p.accrued
          if (p.wtype!='1099'){
            const{reg, grossAP, ot}=p.regot
            const{regYtd, otYtd, grossAPYtd}=p.accrued
            regotc = ["", "current", "YTD"];
            regotd = [
              ["rate", p.rate.toFixed(2), ""],
              ["hours", p.hrs.toFixed(2),(p.hrs+hrsYtd).toFixed(2)],
              ["regular", reg.toFixed(2), (reg+regYtd).toFixed(2)],
              ["overtime", ot.toFixed(2), (ot+otYtd).toFixed(2)],
              ["gross payable", grossAP.toFixed(2), (grossAP+grossAPYtd).toFixed(2)],
              ["gross", gross.toFixed(2), (gross+grossYtd).toFixed(2)]
            ];
          }else{
            regotc = ["", "current", "YTD"];
            regotd=[
              ["rate", p.rate.toFixed(2), ""],
              ["hours", p.hrs.toFixed(2),(p.hrs+hrsYtd).toFixed(2)],
              ["gross", gross.toFixed(2), (gross+grossYtd).toFixed(2)]
            ]
            console.log('p.regot: ', p.regot)
            console.log('p.accrued: ', p.accrued)
          } 
          let whc = ["Taxes", "current", "YTD"];
          let whd  
          const{netYtd}=p.accrued
          if (p.wtype!='1099'){
            const{ssYtd, mediYtd, fedYtd, stYtd}=p.accrued
            whd = [
              ["ssi", p.wh.ss.toFixed(2),(p.wh.ss+ ssYtd).toFixed(2)],
              ["medicare", p.wh.medi.toFixed(2), (p.wh.medi+mediYtd).toFixed(2)],
              ["fed wh", p.wh.fedtax.toFixed(2), (p.wh.fedtax+fedYtd).toFixed(2)],
              ["st wh", p.wh.sttax.toFixed(2), (p.wh.sttax+stYtd).toFixed(2)],
              ["netpay", p.wh.net.toFixed(2), (p.wh.net+netYtd).toFixed(2)]
            ];
          }else {
            whd = [
              ["taxes wh",0,0],
              ["netpay", p.wh.net.toFixed(2), (p.wh.net+netYtd).toFixed(2)]
            ];
          }
          let dedc, dedd
          if (p.ded && p.wtype!='1099' &&(p.ded.healthded>0 || p.ded.k401ded>0)){
            const{healthded, k401ded}=p.ded
            const{healthYtd, k401Ytd}=p.accrued
            dedc =["Deductions","","YTD"]
            dedd =[
              ["health", healthded.toFixed(2), (healthYtd+healthded).toFixed(2)],
              ["401k", k401ded.toFixed(2), (k401ded+k401Ytd).toFixed(2)]
            ]
          }
          let contribc, contribd
          if(p.ded && p.wtype!='1099' &&(p.burden.health>0 || p.burden.k401>0)){
            const{coHealthYtd, co401kYtd}=p.accrued
            const{health, k401} =  p.burden
            contribc =["Co.Contrib.","","YTD"]
            contribd=[
              ["health", health.toFixed(2), (coHealthYtd+health).toFixed(2)],
              ["401k", k401.toFixed(2), (k401+co401kYtd).toFixed(2)]
            ]
          }
          let benc, bend, isben=false
          if(p.wtype!='1099'){
            const{holidayYtd, personalYtd, vacationYtd}=p.accrued
            const{holi, vaca, pers} = p.burden
            if(holidayYtd!=0 || personalYtd!=0 || vacationYtd!=0 || holi!=0 || vaca!=0 || pers!=0){
              isben=true
              benc= ["Benefit Hrs Accrued", "cur.", "bal."]
              bend=[
                ["holiday", (holi/p.rate).toFixed(1), ((holi+holidayYtd)/p.rate).toFixed(1)],
                ["vacation", (vaca/p.rate).toFixed(1), ((vaca+vacationYtd)/p.rate).toFixed(1)],
                ["personal", (pers/p.rate).toFixed(1), ((pers+personalYtd)/p.rate).toFixed(1)]
              ]
            }
          }
          const ckdate = moment(p.paydate).format("MM/DD/YY")
          if(cnt>0){doc.addPage()}
          doc.setFontSize(16)
          doc.text(ckdate, pt(6.85), pt(.9))
          doc.text(`${p.firstmid} ${p.lastname}`, pt(1.5), pt(1.4))
          doc.text(`\$${p.wh.net}`, pt(6.85), pt(1.4))
          doc.text(this.inWords(p.wh.net), 100, 138)
          doc.setFontSize(12)
          doc.text(`for ${p.wprt}`, 60, 194)
          doc.text(`${p.firstmid} ${p.lastname}`, 50, 270)
          doc.text(`for ${p.wprt}`, 50, 282)
          doc.autoTable(regotc, regotd,{
            startY: 288, 
            showHeader: 'firstPage',
            margin: {right: 107},
            tableWidth: 200,
            theme: 'grid',
            styles:{
              halign:'right'
            }
          });
          // doc.setPage(1 + doc.internal.getCurrentPageInfo().pageNumber - doc.autoTable.previous.pageCount);
          doc.autoTable(whc, whd,{
            // startY: doc.autoTable.previous.finalY, 
            startY:288,
            showHeader: 'firstPage',
            margin: {left: 307},
            tableWidth: 200,
            theme: 'grid',
            styles:{
              halign:'right'
            }
          });
          if (p.ded && p.wtype!='1099' &&(p.ded.healthded>0 || p.ded.k401ded>0)){
            doc.autoTable(dedc, dedd,{
              // startY: doc.autoTable.previous.finalY, 
              startY:540,
              showHeader: 'firstPage',
              margin: {right: 107},
              tableWidth: 200,
              theme: 'grid',
              styles:{
                halign:'right'
              }
            });            
          }
          if(p.ded && p.wtype!='1099' &&(p.burden.health>0 || p.burden.k401>0)){
            doc.autoTable(contribc, contribd,{
              startY: doc.autoTable.previous.finalY, 
              showHeader: 'firstPage',
              margin: {right: 107},
              tableWidth: 200,
              theme: 'grid',
              styles:{
                halign:'right'
              }
            });           
          }
          if(isben){
            doc.autoTable(benc, bend,{
              startY:540, 
              showHeader: 'firstPage',
              margin: {left: 307},
              tableWidth: 200,
              theme: 'grid',
              styles:{
                halign:'right'
              }
            });           
          }
          let paystub= {coid: p.coid, email:p.emailid, week:p.wprt, stub:JSON.stringify(p)}
          console.log('paystub: ', paystub)
          postPayStub(paystub)
        }
    })
    doc.autoPrint()
    const disdate = moment().format('YYYY-MM-DD')
    doc.save(`pay${disdate}.pdf`)
  }

  switchShow=(e)=>{
    const pshow = e.target.value
    if(pshow=='topay'){
      this.setState({persons:this.state.topay, showcurrent:true, pshow:pshow},()=>{
        console.log('this.state: ', this.state)
      })
    }else{
      fetchPayStubs()
      .then((res)=>{
        const stubs = res.map((r)=>JSON.parse(r.stub))
        console.log('stubs: ', stubs)
        this.setState({persons:stubs, showcurrent:false, pshow:pshow},()=>{
          console.log('this.state: ', this.state)})
      })
    }
    
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
    const persons=nstate.topay.slice()
    persons[idx].check=e.target.checked
    this.setState({topay:persons})
  }

  handleCheckAll = (e) =>{
    let nstate = {...this.state}
    const npersons= nstate.topay.slice()
    const ckper = npersons.map((p)=>{
      p.check=e.target.checked
      return p
    })
    this.setState({topay:ckper, checkall:e.target.checked}, ()=>console.log('this.state: ', this.state))
  }

  renderRegOt = (p)=>{
    if(p.regot){
      const{reg, gross, grossAP, ot}=p.regot
      const{hrsYtd, regYtd, otYtd, grossYtd, grossAPYtd}=p.accrued
      return(
        <table style={style.table.table}><tbody>
        <tr style={style.table.tr}>
          <td style={style.table.thtd}></td>
          <th style={style.table.thtd}>current</th>
          <th style={style.table.thtd}>YTD</th>
        </tr>
        <tr style={style.table.tr}>
          <td style={style.table.thtd}>hrs.</td>
          <th style={style.table.thtd}>{p.hrs.toFixed(2)}</th>
          <td style={style.table.thtd}>{(p.hrs+hrsYtd).toFixed(2)}</td>
        </tr>
        {p.wtype!='1099' &&
        <tr style={style.table.tr}>
          <td style={style.table.thtd}>reg.</td>
          <td style={style.table.thtd}>{reg.toFixed(2)}</td>
          <td style={style.table.thtd}>{(reg+regYtd).toFixed(2)}</td>
        </tr>
        }
        {p.wtype!='1099' &&
        <tr style={style.table.tr}>
          <td style={style.table.thtd}>o.t.</td>
          <td style={style.table.thtd}>{ot.toFixed(2)}</td>
          <td style={style.table.thtd}>{(ot+otYtd).toFixed(2)}</td>
        </tr>
        }  
        {(grossAP>0 || grossAPYtd>0) && 
        <tr style={style.table.tr}>
          <td style={style.table.thtd}>APgross</td>
          <td style={style.table.thtd}>{grossAP.toFixed(2)}</td>
          <td style={style.table.thtd}>{(grossAP+grossAPYtd).toFixed(2)}</td>
        </tr>
        }
        <tr style={style.table.tr}>
          <th style={style.table.thtd}>gross</th>
          <th style={style.table.thtd}>{gross.toFixed(2)}</th>
          <th style={style.table.thtd}>{(gross+grossYtd).toFixed(2)}</th>
        </tr>
        </tbody></table>  
      )
    }
  }
  renderDed = (p)=>{
    if(p.ded && p.wtype!='1099' &&(p.ded.healthded>0 || p.ded.k401ded>0)){
      const{healthded, k401ded}=p.ded
      const{healthYtd, k401Ytd}=p.accrued
      const tid = 'ded'+p.id
      return (
        <table id={tid} style={style.table.table}><tbody>
        <tr>
          <th style={style.table.col2} >Deductions</th>
          <th> </th>
          <th>YTD</th>
        </tr>  
        <tr style={style.table.tr}>
          <td style={style.table.thtd}>health</td>
          <td style={style.table.thtd}>{healthded.toFixed(2)}</td>
          <td style={style.table.thtd}>{(healthded+healthYtd).toFixed(2)}</td>
        </tr>
        <tr style={style.table.tr}>
          <td style={style.table.thtd}>401K</td>
          <td style={style.table.thtd}>{k401ded.toFixed(2)}</td>
          <td style={style.table.thtd}>{(k401ded+k401Ytd).toFixed(2)}</td>
        </tr>
        </tbody></table>  
      )
    }
  }

  renderWh = (p)=>{
    if(p.wh && p.wtype!='1099'){
      const{ssYtd, mediYtd, fedYtd, stYtd, netYtd}=p.accrued
      return (
        <table style={style.table.table}><tbody>
        <tr>
          <th style={style.table.col2} >Taxes</th>
          <th> </th>
          <th>YTD</th>
        </tr>  
        <tr style={style.table.tr}>
          <td style={style.table.thtd}>ssi</td>
          <td style={style.table.thtd}>{p.wh.ss.toFixed(2)}</td>
          <td style={style.table.thtd}>{(p.wh.ss+ ssYtd).toFixed(2)}</td>
        </tr>
        <tr style={style.table.tr}>
          <td style={style.table.thtd}>medicare</td>
          <td style={style.table.thtd}>{p.wh.medi.toFixed(2)}</td>
          <td style={style.table.thtd}>{(p.wh.medi+mediYtd).toFixed(2)}</td>
        </tr>
        <tr style={style.table.tr}>
          <td style={style.table.thtd}>fed wh</td>
          <td style={style.table.thtd}>{p.wh.fedtax.toFixed(2)}</td>
          <td style={style.table.thtd}>{(p.wh.fedtax+fedYtd).toFixed(2)}</td>
        </tr>
        <tr style={style.table.tr}>
          <td style={style.table.thtd}>state wh</td>
          <td style={style.table.thtd}>{p.wh.sttax.toFixed(2)}</td>
          <td style={style.table.thtd}>{(p.wh.sttax+stYtd).toFixed(2)}</td>
        </tr>
        <tr style={style.table.tr}>
          <th style={style.table.thtd}>net pay</th>
          <th style={style.table.thtd}>{p.wh.net.toFixed(2)}</th>
          <th style={style.table.thtd}>{(p.wh.net+netYtd).toFixed(2)}</th>
        </tr>
        </tbody></table>  
      )
    }
  }

  renderBen = (p)=>{
    if(p.wtype!='1099'){
      const{holidayYtd, personalYtd, vacationYtd, ptoYtd}=p.accrued
      const{holi, vaca, pers, pto} = p.burden
      if(holidayYtd!=0 || personalYtd!=0 || vacationYtd!=0 || ptoYtd!=0 || holi!=0 || vaca!=0 || pers!=0 || pto!=0){
        const tid = 'ben'+p.id
        return (
          <table id={tid} style={style.table.table}><tbody>
          <tr>
            <th style={style.table.col2} colSpan="2">Benefit Hrs Accrued</th>
            <th>bal</th>
          </tr>  
          <tr style={style.table.tr}>
            <td style={style.table.thtd}>holiday</td>
            <td style={style.table.thtd}>{(holi/p.rate).toFixed(1)}</td>
            <td style={style.table.thtd}>{((holi+holidayYtd)/p.rate).toFixed(1)}</td>
          </tr>
          <tr style={style.table.tr}>
            <td style={style.table.thtd}>vacation</td>
            <td style={style.table.thtd}>{(vaca/p.rate).toFixed(1)}</td>
            <td style={style.table.thtd}>{((vaca+vacationYtd)/p.rate).toFixed(1)}</td>
          </tr>
          <tr style={style.table.tr}>
            <td style={style.table.thtd}>personal</td>
            <td style={style.table.thtd}>{(pers/p.rate).toFixed(1)}</td>
            <td style={style.table.thtd}>{((pers+personalYtd)/p.rate).toFixed(1)}</td>
          </tr>
          </tbody></table>  
        )
      }
    }
  }
  renderContrib = (p)=>{
    if(p.ded && p.wtype!='1099' &&(p.burden.health>0 || p.burden.k401>0)){
      const{coHealthYtd, co401kYtd}=p.accrued
      const{health, k401} =  p.burden
      return (
        <table style={style.table.table}><tbody>
        <tr>
          <th style={style.table.col2} >Co. Contrib</th>
          <th> </th>
          <th>YTD</th>
        </tr>  
        <tr style={style.table.tr}>
          <td style={style.table.thtd}>health</td>
          <td style={style.table.thtd}>{health.toFixed(2)}</td>
          <td style={style.table.thtd}>{(health+coHealthYtd).toFixed(2)}</td>
        </tr>
        <tr style={style.table.tr}>
          <td style={style.table.thtd}>401K</td>
          <td style={style.table.thtd}>{k401.toFixed(2)}</td>
          <td style={style.table.thtd}>{(k401+co401kYtd).toFixed(2)}</td>
        </tr>
        </tbody></table>  
      )
    }
  }

  changeBkg=()=>{
    let pcss = {...style.myli.li}
    this.state.showcurrent ? pcss.background='#99CCCC' : pcss.background='#BEBEBE'
    return pcss
  }

  renderPay=()=>{
    console.log('this.state: ', this.state)
    const{persons, showcurrent}=this.state
    const pcss = this.changeBkg()
    console.log('pcss: ', pcss)
    console.log('persons: ', persons)
    const rpersons = persons
      .map((aperson, i)=>{
        if((showcurrent && aperson.status=='approved')||(!showcurrent && aperson.status=='paid')){
          const regot = this.renderRegOt(aperson)
          const wh = this.renderWh(aperson)
          const dedu = this.renderDed(aperson)
          const ben = this.renderBen(aperson)
          const contrib = this.renderContrib(aperson)
          const lid = 'li'+i
          return (
          <li id={lid} key={i} style={pcss}>
            <div style={style.myli.person}> 
            {showcurrent &&
            <input style={style.ckbox} type="checkbox" checked={aperson.check} onChange={this.handleCheck(i)}/> 
            }
            <span><br/>
              {aperson.wprt}<br/>
              {aperson.paydate}<br/>
              {aperson.emailid}<br/>
              <span>{aperson.firstmid} {aperson.lastname}</span> <br/>
              {aperson.street}<br/>
              {aperson.city}, {aperson.st} {aperson.zip}<br/>
              worker type: {aperson.wtype}
            </span>
            </div>
            <div style={style.myli.cat}>
              <span>  
              rate: ${aperson.rate}/hr<br/>
               {regot}
              {dedu}
              {wh}
              {ben}
              {contrib}
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
    console.log('this.state: ', this.state)
    const{waiting}=this.state
    if(!waiting){
      const{persons, pshow, showcurrent}=this.state
      if (persons){
        //this.getQuery()
        // const actstyle = this.setStatBkg()
        const rndrdpersons = this.renderPay()
        return(
          <div >
            <div style={style.he}>
            <span>
                <input checked={pshow=='topay'} id='t' type="radio" name='pshow' value='topay' 
                  onChange={this.switchShow} />
                <label htmlFor="t">ready to pay  </label>
              </span>   
              <span>
                <input checked={pshow=='stubs'} id='s' type="radio" name='pshow' value='stubs' 
                  onChange={this.switchShow}/>
                <label htmlFor="s">paid stubs (recent) </label>
              </span>
              {showcurrent &&
              <div> 
                  <span >
                    {/* <input style={style.ckbox} type="checkbox" checked={this.state.checkall} onChange={this.handleCheckAll}/>  */}
                    <button style={style.he.but.hi} onClick={this.paySelected}>Pay Selected (select only one week)</button>
                  </span>
              </div>
              }
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
    }else{
      return(
        <div style={style.he}>
          <h1>THINKING</h1>
        </div>
      )
    }
  }
}
Pay = mapClass2Element(Pay)

export {Pay}

let style = {
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
      float: 'left'
      //background: '#yellow'
    },
    cat:{
      padding: '2px',
      width: '36%',
      float: 'left'
      //background: '#99CCCC'
  
    },
    act:{
      width: '10%',
      float: 'right'
      //background: '#99CCCC'
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


// const MD = {
//   progress:[
//     {excess:2885, add: .0025}, 
//     {excess:3365, add: .005},
//     {excess:4327, add: .0075},
//     {excess:5769, add: .01}
//   ],
//   local:[
//     {locality: 'Delaware', rate:.032, progressive:false},
//     {locality: "Allegany County", rate:.0305, progressive:true} ,
//     {locality: "Anne Arundel County", rate:.0250, progressive:true} ,
//     {locality: "Baltimore City", rate:.0320, progressive:true} ,
//     {locality: "Baltimore County", rate:.0283, progressive:true} ,
//     {locality: "Calvert County", rate:.0300, progressive:true} ,
//     {locality: "Caroline County", rate:.0273, progressive:true} ,
//     {locality: "Carroll County", rate:.0303, progressive:true} ,
//     {locality: "Cecil County", rate:.0280, progressive:true} ,
//     {locality: "Charles County", rate:.0303, progressive:true} ,
//     {locality: "Dorchester County", rate:.0262, progressive:true} ,
//     {locality: "Frederick County", rate:.0296, progressive:true} ,
//     {locality: "Garrett County", rate:.0265, progressive:true} ,
//     {locality: "Harford County", rate:.0306, progressive:true} ,
//     {locality: "Howard County", rate:.0320, progressive:true} ,
//     {locality: "Kent County", rate:.0285, progressive:true} ,
//     {locality: "Montgomery County", rate:.0320, progressive:true} ,
//     {locality: "Prince George's County", rate:.0320, progressive:true} ,
//     {locality: "Queen Anne's County", rate:.0320, progressive:true} ,
//     {locality: "St. Mary's County", rate:.0300, progressive:true} ,
//     {locality: "Somerset County", rate:.0320, progressive:true} ,
//     {locality: "Talbot County", rate:.0240, progressive:true} ,
//     {locality: "Washington County", rate:.0280, progressive:true} ,
//     {locality: "Wicomico County", rate:.0320, progressive:true} ,
//     {locality: "Worcester County", rate:.0175, progressive:true} ,
//     {locality: "Nonresidents", rate:.0175, progressive:true}     
//   ]
// }

// console.log('JSON.stringify(MD): ', JSON.stringify(MD))