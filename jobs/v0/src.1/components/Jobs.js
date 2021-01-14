import React from 'react'// eslint-disable-line no-unused-vars
var moment = require('moment');
import {router} from '../app'
import {mapClass2Element} from '../hoc/mapClass2Element'
import {fetchJobs, postJobs, fetchSettings, putCk } from '../services/fetches'
import{adjWdprtDn, padWk} from  '../../../../common/v0/src/utilities/reroo'
import { setEdit, setKeyVal} from '../actions/jobacts';


class Jobs extends React.Component{
  Jobs='mabibi sufvhs'
  state={
    jobs: [{job: 'duck', id: 99}],
    wk: moment().week(),
    filt: 'all',
    yr: moment().format('YYYY'),
    dddMMDD:'',
    firstday:3
  }

  dwk=null

  componentDidMount(){
    this.getSettings()
    this.getJobs()
    this.dwk = document.getElementById("wk")
  }  

  getSettings=()=>{
    fetchSettings()     
      .then((res)=>{
        console.log('res: ', res)
        this.setState({firstday: res.firstday},()=>{
          setKeyVal({coid: res.coid, qmessage:res.qmessage, task:'jobs'})
          this.alterJobsYdate(0) 
        })
      })

  }
  getJobs=()=>{
    this.alterJobsYdate(0)
  }

  onChecked=(a)=>{
    console.log('a: ', a)
    const aa = {...a}
    aa.active = !aa.active + 0
    putCk(aa)
    let njobs = this.state.jobs.map((job)=>{
      if (job.id==a.id){
        job.active = !job.active
        let njob ={...job}
        njob.active = job.active + 0
        delete njob.id
        console.log('njob: ', njob)
      }
      return job
    })
    this.setState({jobs:njobs})
  }

  filtAct = ()=>this.setState({filt:'active'});
  filtInAct = ()=>this.setState({filt:'inactive'});
  filtAll = ()=>this.setState({filt:'all'});
  
  
  fact = (job)=>job.active==true
  finact = (job)=>job.active==false
  fall = ()=>true

  fil = (job)=>{
    switch (this.state.filt) {
      case 'all':
        return this.fall(job) 
      case 'active':
        return this.fact(job) 
      case 'inactive':
        return this.finact(job) 
      default:
        return this.fall()
    }
  }
  getwk = ()=>{
    
    this.alterJobsYdate(this.state.wk)  
  }
  buzz=()=>{
    console.log('buzz()')
    window.navigator.vibrate(100)
  }
  getwk0 = ()=>{
    this.alterJobsYdate(0)  
  }

  alterJobsYdate = (wk)=>{
    fetchJobs(wk)
    .then((res)=>{
      const dddMMDD = this.alterDddMMDD(this.state.wk) 
      this.setState({jobs: res.jobs, dddMMDD},()=>{})

    })
  }

  alterDddMMDD=(wk)=>{
    let wdprt = `${this.state.yr}-W${padWk(wk)}-${this.state.firstday}`
    wdprt = adjWdprtDn(this.state.firstday, wdprt)
    return moment(wdprt).format("ddd MM/DD")
  }

  sav2wk = ()=>{
    console.log('save2week')
    let wk = this.state.wk
    if(wk===undefined || wk==0){
      window.alert('please select a week')
      return
    } 
    const jobs = this.state.jobs
      .filter((j)=>j.active)
      .map((j)=>{return {job: j.job, category: j.category,   active: j.active*1, idx: j.idx, week:wk}})
    postJobs(jobs, wk)  
  }
  // sav = () =>{
  //   const jobs = this.state.jobs.map((j)=>{return {job: j.job, category: j.category,   active: j.active*1, idx: j.idx, week:0, coid:j.coid}})
  //   postJobs(jobs, 0)
  // }

  editJob=(j)=>{
    console.log('j: ', j)
    let jo = {job:j.job, active:j.active, idx:j.idx, week:0}
    let ar = []
    this.state.jobs
      .filter((job)=>job.idx==j.idx)
      .map((ji)=>ar.push(ji.category))
    jo.categories = ar.join(', ')
    setEdit(jo)
    setKeyVal({update:true, clearjc:false})
    // router.navigate('/addjob?idx='+j.idx);
    router.navigate('/addjob');
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
    const norm = 'whitesmoke'
    const hili = '#99CCCC'
    const st = this.state.filt
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
    sta.ac =ac
    sta.ia =ia
    sta.al =al 
    return sta
  }

  getQuery=()=>{
    const params = this.props.cambio.page.params
    if(params && params.query =='rerender'){
      location.replace('#jobs')
      setTimeout(()=>{
        this.getJobs()
      },300)     
      
    }
    
  }

  handleOnFocus=()=>{
    //console.log('got focus')
  }  
  render(){
    this.getQuery()
    const{jobs,wk, dddMMDD}=this.state
    const actstyle = this.setStatBkg()
    if (jobs){

      return(
        <div >
          <div style={style.he}>
            <div style={style.he.yw}>
              <input type="number" defaultValue="2018" style={style.he.yr} onChange={this.chyr}/> 
              wk 
              <input type="number" value={wk} onChange={this.chwk} style={style.he.wk}/> 
              starting on {dddMMDD}
              <img style={style.he.img} src="icons/job-search.png" alt="jobs" onClick={this.getwk0} onKeyDown={this.buzz()}/>
            </div>
            <div> 
              <div style={style.he.get}>
                <button onClick={this.getwk} onKeyDown={this.buzz()} >getwk</button>
                <button onClick={this.sav2wk} onKeyDown={this.buzz()} >sav2wk</button>
              </div>
              <div style={style.he.act}>
              {/*
                <button onClick={this.sav}> <i className="material-icons">save</i> </button>

              */} 
                <button style={actstyle.ac} onClick={this.filtAct}>active</button>
                <button style={actstyle.ia} onClick={this.filtInAct}>inact</button>
                <button style={actstyle.al} onClick={this.filtAll}>all</button>
              </div>
            </div>
          </div>
          <div style={style.myli.od}> 
            <ul style={style.myli.ul}>
            {jobs
              .filter((ajob)=>this.fil(ajob))
              .map((ajob)=>{
              return (
              <li  key={ajob.id} style={style.myli.li}>
                <div style={style.myli.idx}>
                  <span style={style.myli.idxsp} onClick={this.editJob.bind(null, ajob)}><i style={style.myli.icon} className="material-icons">edit</i></span>   
                </div>
                <div style={style.myli.job}> 
                   {ajob.job} 
                </div>
                <div style={style.myli.cat}>
                  {ajob.category}</div>
                <div style={style.myli.act}>
                  <input style={style.myli.ck} type="checkbox" checked= {ajob.active} onChange={this.onChecked.bind(null, ajob)}></input>
                  </div>
              </li >)
            })}
            </ul>
          </div>
        </div>
      )
    }else{
      return(
        <div>
          <a href="home" data-navigo>maybe you need to register</a>
          {this.props.ejob.qmessage}
        </div>
        )
    }
  }
}
Jobs = mapClass2Element(Jobs)

export {Jobs}

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
