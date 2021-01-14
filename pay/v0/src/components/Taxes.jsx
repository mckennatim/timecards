import React from 'react'// eslint-disable-line no-unused-vars
import {mapClass2Element} from '../hoc/mapClass2Element'
import {fetchTaxes, postPayment, fetchPayments, fetchStateQtr, fetchEFW2, fetchEFW2ma, fetchW2} from '../services/fetches'
import InputLabel from '@material-ui/core/InputLabel';// eslint-disable-line no-unused-vars
import MenuItem from '@material-ui/core/MenuItem';// eslint-disable-line no-unused-vars
import FormControl from '@material-ui/core/FormControl';// eslint-disable-line no-unused-vars
import Select from '@material-ui/core/Select';// eslint-disable-line no-unused-vars
import ExpansionPanel from '@material-ui/core/ExpansionPanel';// eslint-disable-line no-unused-vars
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';// eslint-disable-line no-unused-vars
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';// eslint-disable-line no-unused-vars
import FormHelperText from '@material-ui/core/FormHelperText';// eslint-disable-line no-unused-vars
//import Typography from '@material-ui/core/Typography';// eslint-disable-line no-unused-vars
//import ExpandMoreIcon from '@material-ui/icons/ExpandMore';// eslint-disable-line no-unused-vars
import Button from '@material-ui/core/Button';// eslint-disable-line no-unused-vars
import TextField from '@material-ui/core/TextField';// eslint-disable-line no-unused-vars
import Table from '@material-ui/core/Table';// eslint-disable-line no-unused-vars 
import TableBody from '@material-ui/core/TableBody';// eslint-disable-line no-unused-vars

import TableCell from '@material-ui/core/TableCell';// eslint-disable-line no-unused-vars
import TableRow from '@material-ui/core/TableRow';// eslint-disable-line no-unused-vars
import Paper from '@material-ui/core/Paper';// eslint-disable-line no-unused-vars
import {drnd} from '../utilities/getCfg'

import { withStyles } from '@material-ui/core/styles';
import {addPage, removePage}from '../actions/responsive'
import jsPDF from 'jspdf'
import w2fed2019 from '../../b64/w2-2019-fed.base64'
import w2state2019 from '../../b64/w2-2019-state.base64'
import w2emp2019 from '../../b64/w2-2019-emprec.base64'
import w2instr1_2019 from '../../b64/w2-2019-instr1.base64'
import w2instr2_2019 from '../../b64/w2-2019-instr2.base64'
import w2instr3_2019 from '../../b64/w2-2019-instr3.base64'
var moment = require('moment');

const styles = theme => ({
  troot: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 300,
  },
  root: {
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});
class Taxes extends React.Component{
  state = {year:"", month:"", quarter:"", curmo:{}, gov:'Fed', qgov:'Fed', mexp:false, qexp:false}
  active='mabibi'
  componentDidMount(){
    addPage('Taxes')
    const cyr = moment().format('YYYY')*1
    const cmo = moment().format('MM')-1
    const cqtr = moment().quarter()-1
    const now= moment().format('MM/DD/YYYY')
    console.log('cyr: ', cyr)
    console.log('cmo: ', cmo-1)
    const yrarr =[]
    for(var i =-4; i <= 2; i++){
      yrarr.push(cyr+i)
    }
    const curmo = {cmo:'', paid:0.000, accrued:0.000}
    this.setState({yrarr, year:cyr, curmo, now, cmo, cqtr}, this.getReport(cyr))
  }
  componentWillUnmount(){
    removePage('Taxes')
  }
  
  getReport=(year)=>{
    console.log(year)
    fetchTaxes(year)
      .then((json)=>{
        console.log('json: ', json)
        const{results, binfo}=json
        this.setState({acctsmo: results[0], numempl: results[1], acctsqtr: results[2], fmobyqtr: results[3], fqtrtot: results[4], smobyqtr: results[5], sqtrtot: results[6], coid:binfo.coid }, (()=>{
          // console.log('this.state: ', this.state)
        }))
      })
  }

  handleYearChange=(e)=>{
    console.log('e.target.name: ', e.target.name)
    const val = e.target.value
    this.setState({year: e.target.value}, this.getReport(val))
  }

  handleQtrChange=(e)=>{
    const selqtr= e.target.value
    const{numempl, cqtr, qgov, year}=this.state
    const qnum = selqtr=='last' ? cqtr : selqtr[1]*1
    if(numempl==undefined) {
      window.alert('select year first or else no records for that year')
    }else{
      this.setState({ qexp:true, quarter:selqtr })  
    }
    const nempyq = numempl[numempl.findIndex((n)=>n.qtr==qnum && n.year==year)]
    console.log('nempyq: ', nempyq) 
    const nemp = nempyq  && nempyq.numempl   

    if(qgov=='Fed' ){
      const{acctsqtr, fqtrtot, fmobyqtr}=this.state

      let d941 = {
        qnum: qnum,
        rows:[], 
        isdata:false
      }
      let trows =[]
      if(nempyq){
        let marr = [0,0,0]
        fmobyqtr
        .filter((f)=>f.qtr==qnum)
        .map((m)=>{
            marr[(m.mo - 3*(qnum-1))-1]=m.paid
        })
        console.log('marr: ', marr)
        const tm = marr.reduce((t,a)=>t+a,0)
        console.log('tm: ', tm)
        const fedtaxable = acctsqtr[acctsqtr.findIndex((a)=>a.account=='a6041-fedTaxable' && a.qtr==qnum )].credit
        const fedwh = acctsqtr[acctsqtr.findIndex((a)=>a.account=='a2050-fedWh' && a.qtr==qnum )].credit
        const sswages = acctsqtr[acctsqtr.findIndex((a)=>a.account=='a6061-FICAtaxable' && a.qtr==qnum )].credit
        const sstax = acctsqtr[acctsqtr.findIndex((a)=>a.account=='a2010-SS' && a.qtr==qnum )].credit
        const sstx = drnd(sswages*.124)
        const mediwages = acctsqtr[acctsqtr.findIndex((a)=>a.account=='a6061-FICAtaxable' && a.qtr==qnum )].credit
        const meditax = acctsqtr[acctsqtr.findIndex((a)=>a.account=='a2020-medi' && a.qtr==qnum )].credit
        const meditx = drnd(mediwages*.029)
        const ficatx = drnd(meditx+sstx)
        const tx = drnd(ficatx+fedwh)
        const correct = drnd(meditax+sstax-(meditx+sstx))
        const tottax= drnd(correct+tx)
        const deposits = fqtrtot[fqtrtot.findIndex((a)=>a.qtr==qnum )].paid
        trows=[
          {ln:'Line 1.', desc:'Number of Employees for Quarter', val:nemp},
          {ln:'Line 2.', desc:'Wages tips & other compensation', val:fedtaxable},
          {ln:'Line 3.', desc:'Fed income tax withheld', val:fedwh},
          {ln:'Line 5a. Col1', desc:'Taxable Social Security Wages', val:sswages},
          {ln:'Line 5a. Col2', desc:'Social Security Tax', val:sstx},
          {ln:'Line 5c. Col1', desc:'Taxable Medicare Wages', val:mediwages},
          {ln:'Line 5c. Col2', desc:'Medicare Tax', val:meditx},
          {ln:'Line 5e.', desc:'Add Fica', val:ficatx},
          {ln:'Line 6.', desc:'Total taxes before adjustm.', val:tx},
          {ln:'Line 7.', desc:'Current qtr adjustm for cents', val:correct},
          {ln:'Line 10,12.', desc:'Total taxes after adjustm.', val:tottax},
          {ln:'Line 13.', desc:'Total deposits for quarter', val:deposits},
          {ln:'Line 16. Month 1', desc:'Month 1 deposit', val:marr[0]},
          {ln:'Line 16. Month 2', desc:'Month 2 deposit', val:marr[1]},
          {ln:'Line 16. Month 3', desc:'Month 3 deposit', val:marr[2]},
          {ln:'Line 16. Total', desc:'Total liability for quarter', val:tottax},
        ]
        d941.rows=trows
        d941.isdata=true
      }
      this.setState({d941})
    }else if(qgov=='State' ){
      fetchStateQtr(year,qnum)
      .then((res)=>{
        if(!res.qmessage){
          console.log('res: ', res)
          this.setState({st:res.st})
        }
      })
      fetchPayments(year)
      .then((res)=>{
        if(!res.qmessage){
          this.setState({txpayments:res.results},()=>{
            const{sqtrtot, year, txpayments}=this.state
            console.log('txpayments: ', txpayments)
            const qpayments =txpayments.filter((f)=>f.gov=='state' && f.qtr==qnum)
            let s941 = {
              qnum: qnum,
              isdata:false,
              rows:[]
            }
            const acidx = sqtrtot.findIndex((a)=>a.qtr==qnum && a.year==year )
            if(acidx>-1){
              const stwh = sqtrtot[sqtrtot.findIndex((a)=>a.qtr==qnum && a.year==year )].accrued
              const stpaid = sqtrtot[sqtrtot.findIndex((a)=>a.qtr==qnum && a.year==year )].paid
              const rows=[
                {ln:'', desc:'Number of Employees for Quarter', val:nemp},
                {ln:'line 1.', desc:'Amount withheld', val:stwh},
                {ln:'line 2.', desc:'Previous payments made', val:stpaid},
                {ln:'line 5.', desc:'Total tax due', val:drnd(stwh-stpaid)},
                {ln:'Reference', desc:'Payments Made this Quarter', val:'Amount'},
              ]
              qpayments.map((q)=>{
                rows.push({
                  ln:'ref: '+q.ref,
                  desc: q.month +': ' + q.paydate,
                  val: q.paid
                })
              })
              s941.rows = rows
              s941.isdata = true
            }
            this.setState({s941})
            console.log('dog ia sss')
          })
        }
      })
      
    }
  }

  handleMonthChange=(e)=>{
    const{fmobyqtr, smobyqtr, gov, year}=this.state
    console.log('smobyqtr: ', smobyqtr)
    console.log('year, year.length: ', year, year.length)
    if(year.length==0) {
      window.alert('select year first')
    }else{
      this.setState({month:e.target.value, mexp:true })  
      let fedstate
      if(gov=='Fed'){
        fedstate =fmobyqtr.slice()
      }else{
        fedstate = smobyqtr.slice()
      }
      let showmox,qmo
      switch (e.target.value) {
        case 'month':
          const{cmo}=this.state
          let curmo={...this.state.curmo}
          console.log('curmo: ', curmo)
          const thmo = fedstate.filter((m)=>{
            console.log('m: ', m, cmo)
            return m.mo==cmo
          })
          console.log('thmo: ', thmo)
          curmo.paid = thmo[0].paid
          curmo.accrued =thmo[0].accrued
          curmo.month = thmo[0].month
          curmo.cmo = thmo[0].mo
          const pay = curmo.accrued-curmo.paid
          let mofo = {...this.state.mofo}
          mofo.ref =''
          mofo.mo= curmo.cmo
          mofo.month = curmo.month
          mofo.pay=pay
          mofo.paydate = this.state.now
          //mofo = {ref: '', mo: curmo.cmo, month: curmo.month, pay:pay, paydate:this.state.now}
          showmox='but'
          if(pay<=0){
            showmox='none'
          }
          this.setState({curmo, mofo, showmox})
          break;
        case 'year':
          this.setState({moarr: fedstate, showmox: 'list'})
          break
        case 'q1':
          qmo=fedstate.filter((q)=>q.qtr==1)
          this.setState({moarr: qmo, showmox: 'list'})
          break
        case 'q2':
          qmo=fedstate.filter((q)=>q.qtr==2)
          this.setState({moarr: qmo, showmox: 'list'})
          console.log('in year')
          break
        case 'q3':
          qmo=fedstate.filter((q)=>q.qtr==3)
          this.setState({moarr: qmo, showmox: 'list'})
          break
        case 'q4':
          qmo=fedstate.filter((q)=>q.qtr==4)
          this.setState({moarr: qmo, showmox: 'list'})
          break
        default:
          break;
      }
    }
  }

  txtChanged = field => e =>{
    console.log('txtChanged')
    console.log('field, e: ', field, e)
    const {mofo}=this.state
    mofo[field]=e.target.value
    this.setState({mofo})
  }

  recordPayment=()=>{
    console.log('this..fmo: ', this.state.fmobyqtr)
    const{rmofo, mofo, acctsmo, gov, fmobyqtr, smobyqtr}=this.state
    console.log('this.state: ', this.state)
    if(!rmofo){
      const {cmo, paid, accrued, month}=this.state.curmo
      const blmofo = {ref: '', mo: cmo, month: month, pay:accrued-paid, paydate:this.state.now}
      this.setState({rmofo:true, mofo:blmofo})
    }else{
      console.log('mofo: ', mofo)
      const curmo= {...this.state.curmo}
      curmo.paid = mofo.pay
      this.setState({curmo})
      const someid=`paid: ${mofo.paydate}`
      const dbpaydate = moment(`${this.state.year}-${mofo.mo.toString().padStart(2,'0')}-01`, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD')
      console.log('dbpaydate: ', dbpaydate, someid)
      const blentry={account:'', wdprt:mofo.ref, someid:someid, job:'fed', cat:'WhTaxPayment', date:dbpaydate, somenum: 0, debit:0, credit:0}
      let fedstate
      if(gov=='Fed'){
        fedstate =fmobyqtr.slice()
      }else{
        fedstate = smobyqtr.slice()
      }
      //const fmobyqtr= this.state.fmobyqtr.slice()
      console.log('fedstate: ', fedstate)
      console.log('fedstate.findIndex((f)=>f.mo==mofo.mo): ', fedstate.findIndex((f)=>f.mo==mofo.mo))
      console.log('mofo: ', mofo)
      fedstate[fedstate.findIndex((f)=>f.mo==mofo.mo)].paid=mofo.pay
      let e
      const thaccts = acctsmo.filter((a)=>{
        return a.mo==curmo.cmo
      })
      console.log('thaccts: ', thaccts)
      // let ttot= 0
      if(gov=='Fed'){
        const journal = thaccts
          .filter((f)=>{
            return f.account=='a2010-SS' || f.account=='a2020-medi' ||f.account=='a2030-meda' || f.account == 'a2050-fedWh'
          })
          .map((m)=>{
            e ={...blentry}
            e.account =m.account
            e.debit=m.credit-m.debit
            //ttot += m.credit-m.debit
            return e
          })
        e ={...blentry}
        e.account ='a1010-cash'
        e.credit=mofo.pay
        journal.push(e)
        postPayment({journal})
        .then((res)=>{
          console.log('res: ', res)
          this.setState({showmox:'none', fmobyqtr:fedstate})
        })
      }else{
        const journal = []
        e ={...blentry}
        e.account ='a1010-cash'
        e.job='state'
        e.credit=mofo.pay
        journal.push(e)
        e ={...blentry}
        e.account ='a2060-stWh'
        e.job='state'
        e.debit=mofo.pay
        journal.push(e)
        postPayment({journal})
        .then(()=>{
          this.setState({showmox:'none', smobyqtr:fedstate})
        })
      }

    }
  }
  selectMo=(field)=>()=>{
    const pay = field.accrued-field.paid
    let curmo ={...this.state.curmo} 
    curmo.paid = field.paid
    curmo.accrued =field.accrued
    curmo.month = field.month
    curmo.cmo = field.mo
    let mofo = {...this.state.mofo}
    mofo = {ref: '', mo: field.mo, month: field.month, pay:pay, paydate:this.state.now}
    let showmox = 'but'
    if(pay<=0){
      showmox='none'
    }
    this.setState({curmo, rmofo:true, showmox, mofo:mofo})
  }

  switchGov=(e)=>{
    this.setState({gov:e.target.value})
  }

  switchQgov=(e)=>{
    this.setState({qgov:e.target.value})
  } 
  
  clickCaret=(xp)=>()=>{
    if(xp=='mexp'){
      this.setState({mexp:false})
    }else{
      this.setState({qexp:false})
    }
  }

  getHelp=(ho)=>()=>{
    const{allhelp}=this.props.help
    console.log('allhelp: ', allhelp)
    console.log('ho: ', ho)
    const rh = allhelp.filter((h)=>h.howto.includes(ho))[0]
    window.alert(`How to ${rh.howto}? \n\nHere's how: \n${rh.hereshow}`)
  }

  getEFW2 = ()=>{
    const{coid,year}= this.state
    fetchEFW2(year)
      .then((url)=>{
        let tempLink = document.createElement('a');
        tempLink.href = url;
        tempLink.setAttribute('download', `${coid}-${year}efw2-fed.zip`);
        tempLink.click();
      })
  }

  getEFW2ma = ()=>{
    const{coid,year}= this.state
    fetchEFW2ma(year)
      .then((url)=>{
        let tempLink = document.createElement('a');
        tempLink.href = url;
        tempLink.setAttribute('download', `${coid}-${year}efw2-ma.zip`);
        tempLink.click();
      })
  }

  notDone =()=>{
    window.alert('coming soon')
  }

  getW2 = ()=>{
    const{year}= this.state
    fetchW2(year)
      .then((results)=>{
        console.log('results: ', results.results)
        console.log('results[0]: ', results[0])
        const co = results.results[0][0]
        const ei = results.results[1]
        const ed = results.results[2]
        console.log('ed: ', ed)
        const numrecs = ed.length
        const doc = new jsPDF({
          orientation:'p', 
          unit: 'pt', 
          format: 'letter'
        });
        doc.setFontStyle("Times Roman")
        doc.setFontSize(11)
        const ca =[200, 60, 350, 480]
        const cb =[38, 80, 220,300]
        const r =[57,81,105,129,153,177,201,225,249,273,309]    
        const conam = `${co.name}\n${co.street}\n${co.city}, ${co.st} ${co.zip}`
        console.log('conam: ', conam)
        ei.map((e,i)=>{
          doc.addImage(w2fed2019, 'JPEG', 0, 0, 620,800);
          doc.text(ca[0], r[0], e.ssn)
          doc.text(ca[1], r[1], co.fedein)
          doc.text(ca[1],r[2], conam)
          doc.text(cb[1],r[10], co.stein)
          doc.text(ca[1],r[6], `${e.firstmid} ${e.lastname}\n${e.street}\n${e.city} ${e.st} ${e.zip}`)
          doc.text(cb[0],r[10], e.st)
          if(numrecs!=i){
            doc.text(ca[2],r[1], ed[i]["a6041-fedTaxable"].toFixed(2))
            doc.text(ca[3],r[1], ed[i]["a2050-fedWh"] != null ? ed[i]["a2050-fedWh"].toFixed(2) : "0")
            doc.text(ca[2],r[2], ed[i]["a6061-FICAtaxable"].toFixed(2))
            doc.text(ca[2],r[3], ed[i]["a6061-FICAtaxable"].toFixed(2))
            doc.text(ca[3],r[2], ed[i]["a6036-SS"].toFixed(2))
            doc.text(ca[3],r[3], ed[i]["a6037-medi"].toFixed(2))
            doc.text(cb[2],r[10], ed[i]["a6050-stateWages"].toFixed(2))
            doc.text(cb[3],r[10], ed[i]["a2060-stWh"] != null ? ed[i]["a2060-stWh"].toFixed(2) : "0")
          }
          doc.addPage("p")
          doc.addImage(w2instr1_2019, 'JPEG', 0, 0, 620,800);

          doc.addPage("p")
          doc.addImage(w2state2019, 'JPEG', 0, 0, 620,800);
          doc.text(ca[0], r[0], e.ssn)
          doc.text(ca[1], r[1], co.fedein)
          doc.text(ca[1],r[2], conam)
          doc.text(cb[1],r[10], co.stein)
          doc.text(ca[1],r[6], `${e.firstmid} ${e.lastname}\n${e.street}\n${e.city} ${e.st} ${e.zip}`)
          doc.text(cb[0],r[10], e.st)
          if(numrecs!=i){
            doc.text(ca[2],r[1], ed[i]["a6041-fedTaxable"].toFixed(2))
            doc.text(ca[3],r[1], ed[i]["a2050-fedWh"] != null ? ed[i]["a2050-fedWh"].toFixed(2) : "0")
            doc.text(ca[2],r[2], ed[i]["a6061-FICAtaxable"].toFixed(2))
            doc.text(ca[2],r[3], ed[i]["a6061-FICAtaxable"].toFixed(2))
            doc.text(ca[3],r[2], ed[i]["a6036-SS"].toFixed(2))
            doc.text(ca[3],r[3], ed[i]["a6037-medi"].toFixed(2))
            doc.text(cb[2],r[10], ed[i]["a6050-stateWages"].toFixed(2))
            doc.text(cb[3],r[10], ed[i]["a2060-stWh"] != null ? ed[i]["a2060-stWh"].toFixed(2) : "0")
          }
          doc.addPage("p")
          doc.addImage(w2instr2_2019, 'JPEG', 0, 0, 620,800);

          doc.addPage("p")
          doc.addImage(w2emp2019, 'JPEG', 0, 0, 620,800);
          doc.text(ca[0], r[0], e.ssn)
          doc.text(ca[1], r[1], co.fedein)
          doc.text(ca[1],r[2], conam)
          doc.text(cb[1],r[10], co.stein)
          doc.text(ca[1],r[6], `${e.firstmid} ${e.lastname}\n${e.street}\n${e.city} ${e.st} ${e.zip}`)
          doc.text(cb[0],r[10], e.st)
          if(numrecs!=i){
            doc.text(ca[2],r[1], ed[i]["a6041-fedTaxable"].toFixed(2))
            doc.text(ca[3],r[1], ed[i]["a2050-fedWh"] != null ? ed[i]["a2050-fedWh"].toFixed(2) : "0")
            doc.text(ca[2],r[2], ed[i]["a6061-FICAtaxable"].toFixed(2))
            doc.text(ca[2],r[3], ed[i]["a6061-FICAtaxable"].toFixed(2))
            doc.text(ca[3],r[2], ed[i]["a6036-SS"].toFixed(2))
            doc.text(ca[3],r[3], ed[i]["a6037-medi"].toFixed(2))
            doc.text(cb[2],r[10], ed[i]["a6050-stateWages"].toFixed(2))
            doc.text(cb[3],r[10], ed[i]["a2060-stWh"] != null ? ed[i]["a2060-stWh"].toFixed(2) : "0")
          }
          doc.addPage("p")
          doc.addImage(w2instr3_2019, 'JPEG', 0, 0, 620,800);          
          if(numrecs!=i) doc.addPage("p")
        })
        doc.save('w2.pdf');
      })
  }

  renderYrEnd = ()=>{
    return(
      <ExpansionPanel>
        <ExpansionPanelSummary>
          <div>
            <h5>W2/W3 End Of Year Reporting</h5>
            <button onClick={this.getEFW2}>Download Fed EFW2 .zip</button><br/>
            link to: 
            <a href="https://www.ssa.gov/bso/bsowelcome.htm">Business Services Online (fed)</a><br/>
            <button onClick={this.getEFW2ma}>Download State EFW2 .zip</button><br/>
            link to: 
            <a href="https://mtc.dor.state.ma.us/mtc/">Mass Connect</a><br/>
            <button onClick={this.getW2}>W2 for employees (pdf's)</button><br/>
          </div>
        </ExpansionPanelSummary>
      </ExpansionPanel>
    )
  }
  
  renderMoFo = ()=>{
    const { classes } = this.props;
    const {mofo}=this.state
    return(
      <div>
        <TextField
          id="standard-name"
          label="Reference #"
          className={classes.textField}
          value={mofo.ref}
          onChange={this.txtChanged('ref')}
          margin="dense"
        /> 
        <TextField
          id="standard-name"
          label="Month"
          className={classes.textField}
          value={mofo.month}
          InputProps={{
            readOnly: true,
          }}
          margin="dense"
        /> 
        <TextField
          id="standard-name"
          label="Amount"
          className={classes.textField}
          value={mofo.pay}
          InputProps={{
            readOnly: true,
          }}
          margin="dense"
        />
        <TextField
          id="standard-name"
          label="Pay Date"
          className={classes.textField}
          value={mofo.paydate}
          onChange={this.txtChanged('paydate')}
          margin="dense"
        />
    </div>
    )
  }

  renderMoX=()=>{
    const { classes } = this.props;
    const{rmofo, showmox}=this.state
    if(showmox=='but'){
      return(
        <div>
           <Button 
             color="primary" 
             className={classes.button} 
             onClick={this.recordPayment}>
           Record Payment
           </Button>
           {rmofo && this.renderMoFo()}
       </div>       
     )
    }else if(showmox=='list'){
      const{moarr}=this.state
      return(
        <ul style={style.list.ul}>
          {moarr.map((m, i)=>{
            return (
            <li style={style.list.li} key={i}>
              <div onClick={this.selectMo(m,i)}>{m.month}   
                <div style={style.list.rt}>
                  accr.: {m.accrued.toFixed(2)} <br/> paid: {m.paid.toFixed(2)} <br/> 
                </div> 
              </div> 
            </li>
            )
          })}
        </ul>
      )
    }else{
      return(
        <div>nothing owed for this month</div>
      )
    }
  }

  renderQox=()=>{
    const { classes } = this.props;
    const{qgov}=this.state
    if(qgov=="Fed" && this.state.d941){
      const{d941}=this.state
      const{rows, isdata, qnum}=d941
     return(
        <div>
          <h4>{qgov} 941 Data for Quarter {qnum}</h4>
          {!isdata  && <p> no data for this quarter</p>}
          <Paper className={classes.troot}>
            <Table className={classes.table}>
              <TableBody>
                {rows.map((row,i)=> {
                  return (
                    <TableRow key={i}>
                      <TableCell >
                        {row.ln}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.desc}
                      </TableCell>
                      <TableCell numeric>{row.val}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </div>
      )
    }else if(qgov=="State" && this.state.s941){
      const{s941, st}=this.state
      console.log('s941: ', s941)
      //const{qnumemp,qemp,qtot, qpmt}= st
      console.log('st: ', st)
      if(st && s941 && s941.isdata && st.qnumemp.length>0){
        const{qnumemp,qemp, qtot }=st
        console.log('qnumemp: ', qnumemp)
        const nekeys = Object.keys(qnumemp[0])
        const emkeys = Object.keys(qemp[0])
        console.log('s941: ', s941)
        const{isdata, rows, qnum}=s941
        return(
          <div>
            <h4>{qgov} 941 Data for Quarter {qnum}</h4>
            {!isdata  && <p> no data for this quarter</p>}
            <Paper className={classes.troot}>
              <Table className={classes.table}>
                <TableBody>
                  {rows.map((row,i)=> {
                    return (
                      <TableRow key={i}>
                        <TableCell >
                          {row.ln}
                        </TableCell>
                        <TableCell>
                          {row.desc}
                        </TableCell>
                        <TableCell numeric>{row.val}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <h4>Number of paychecks by month per employee </h4>
              <Table className={classes.table}>
                <TableBody>
                  <TableRow>  
                    {nekeys.map((h,i)=>
                    <TableCell style={{fontWeight:'bold'}} key={i}>
                      {h}
                    </TableCell>
                    )}
                  </TableRow>
                  {qnumemp.map((row,i)=> {
                    return (
                      <TableRow key={i}>
                        <TableCell >
                          {row[nekeys[0]]}
                        </TableCell>
                        <TableCell>
                          {row[nekeys[1]]}
                        </TableCell>
                        <TableCell>
                          {row[nekeys[2]]}
                        </TableCell>
                        <TableCell>
                          {row[nekeys[3]]}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody> 
              </Table>  
              <h4>Employees earnings </h4>
              <Table className={classes.table}>
                <TableBody>
                  <TableRow>  
                    {emkeys.map((h,i)=>
                    <TableCell style={{fontWeight:'bold'}} key={i}>
                      {h}
                    </TableCell>
                    )}
                  </TableRow>
                  {qemp.map((row,i)=> {
                    return (
                      <TableRow key={i}>
                        <TableCell >
                          {row[emkeys[0]]}
                        </TableCell>
                        <TableCell>
                          {row[emkeys[1]]}
                        </TableCell>
                        <TableCell>
                          {row[emkeys[2]]}
                        </TableCell>
                        <TableCell>
                          {row[emkeys[3]]}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                    <TableRow >
                    <TableCell component="th" scope="row">
                        wh-paid=${qtot[0]["a2060-stWh-paid"]} Totals:
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {qtot[0]["a6050-stateWages"]}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {qtot[0]["a6051-stateTaxable"]}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {qtot[0]["a2060-stWh"]}
                      </TableCell>
                    </TableRow>

                </TableBody> 
              </Table> 
            </Paper>          
          </div>
        )
      }else{
        return(<h4>no data available</h4> )
      }
    }else{
      return(
        <h4>something has gon awry</h4>
      )
    }

  }

  render(){
    const { classes } = this.props;
    const{yrarr, year, gov, qgov, mexp, qexp}=this.state
    const mox = this.renderMoX()
    const qox = this.renderQox()
    if (yrarr){
      return(
        <div style={style.outer}>
          <h4> Reports on Witholding and Tax Liabilities </h4>
          <form >
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-simple">Year</InputLabel>
            <Select
              value={year}
              onChange={this.handleYearChange}
              inputProps={{
                name: 'year',
                id: 'age-simple',
              }}
            > 
              {yrarr.map((yr,i)=>
                <MenuItem key={i} value={yr}>{yr}</MenuItem>
                )}
            </Select>
          </FormControl>
          </form>
          <ExpansionPanel expanded={mexp}>
            <ExpansionPanelSummary>
              <div>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-simple">Monthly {gov}  </InputLabel>
                <Select
                  value={this.state.month}
                  onChange={this.handleMonthChange}
                  inputProps={{
                    name: 'month',
                    id: 'age-simple',
                  }}
                > 
                  <MenuItem value={'month'}>{'last month'}</MenuItem>
                  <MenuItem value={'year'}>{'this year'}</MenuItem>
                  <MenuItem value={'q1'}>{'quarter 1'}</MenuItem>
                  <MenuItem value={'q2'}>{'quarter 2'}</MenuItem>
                  <MenuItem value={'q3'}>{'quarter 3'}</MenuItem>
                  <MenuItem value={'q4'}>{'quarter 4'}</MenuItem>
                </Select>
                <FormHelperText>Paid/Accrued</FormHelperText>
              </FormControl>
                <div style={{float:'right'}}>
                  <span>
                    <input checked={gov=='Fed'} id='f' type="radio" name='gov' value='Fed' 
                      onChange={this.switchGov} />
                    <label htmlFor="f">fed  </label>
                  </span>   
                  <span>
                    <input checked={gov=='State'} id='s' type="radio" name='gov' value='State' 
                      onChange={this.switchGov}/>
                    <label htmlFor="s">state </label>
                  </span>
                </div>

              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div>
              <i className="material-icons" onClick={this.clickCaret('mexp')} >keyboard_arrow_up</i>
                <div style={style.info.div}>
                  <span onClick={this.getHelp('make monthly payments')} style={style.info.span}>&#9432;</span>
                </div>
                <div>
                  Month: {this.state.curmo.month} <br/>
                  Accr.: {drnd(this.state.curmo.accrued)} <br/>
                  Paid: {drnd(this.state.curmo.paid)} 
                </div>

                {mox}
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={qexp}>
            <ExpansionPanelSummary>
            <div>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-simple">Quarterly {qgov}  </InputLabel>
                <Select
                  value={this.state.quarter}
                  onChange={this.handleQtrChange}
                  inputProps={{
                    name: 'quarter',
                    id: 'age-simple',
                  }}
                > 
                  <MenuItem value={'last'}>{'last quarter'}</MenuItem>
                  <MenuItem value={'q1'}>{'quarter 1'}</MenuItem>
                  <MenuItem value={'q2'}>{'quarter 2'}</MenuItem>
                  <MenuItem value={'q3'}>{'quarter 3'}</MenuItem>
                  <MenuItem value={'q4'}>{'quarter 4'}</MenuItem>
                </Select>
                <FormHelperText>Paid/Accrued</FormHelperText>
              </FormControl>
                <div style={{float:'right'}}>
                  <span>
                    <input checked={qgov=='Fed'} id='f' type="radio" name='qgov' value='Fed' 
                      onChange={this.switchQgov} />
                    <label htmlFor="f">fed  </label>
                  </span>   
                  <span>
                    <input checked={qgov=='State'} id='s' type="radio" name='qgov' value='State' 
                      onChange={this.switchQgov}/>
                    <label htmlFor="s">state </label>
                  </span>
                </div>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
            <div>
              <i className="material-icons" onClick={this.clickCaret('qexp')} >keyboard_arrow_up</i>
              {qox}
            </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          {this.renderYrEnd()}
        </div>
      )
    }else{
      return(
        <div>
          <h2>huh duh</h2>
        </div>
      )
    }
  }
}
Taxes = withStyles(styles)(Taxes)
Taxes = mapClass2Element(Taxes)

export {Taxes}

const style = {
  outer:{
    overflow:'hidden',
    padding: '4px',
    margin: '2px 10px 10px 10px',
    background: '#99CCFF'
  },
  he:{
    overflow:'hidden',
    margin: '2px 10px 10px 10px',
   padding: '4px',
    background: '#C4A265'
  },
  list:{
    ul:{ 
      listStyleType: 'none',
      display: 'flex',
      flexDirection: 'column'
    },
    li:{
      height:'40px',
      paddingTop: '8px',
      borderBottom: '1px solid',
      width: '170px',
      flex:1
    },
    rt:{
      float:'right',
      textAlign:'right'
    }
  },
  info:{
    div:{
      float:'right',
      textAlign:'right'
    },
    span:{
      fontSize: '200%',
      color: 'orange'
    }
  }

}