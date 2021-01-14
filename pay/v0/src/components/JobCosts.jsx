import React from 'react'// eslint-disable-line no-unused-vars
import {mapClass2Element} from '../hoc/mapClass2Element'
var moment = require('moment');

import{fetchJobCosts, fetchBids, putBid} from '../services/fetches'
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';// eslint-disable-line no-unused-vars
import FormControl from '@material-ui/core/FormControl';// eslint-disable-line no-unused-vars
import Select from '@material-ui/core/Select';// eslint-disable-line no-unused-vars
import MenuItem from '@material-ui/core/MenuItem';// eslint-disable-line no-unused-vars
import ExpansionPanel from '@material-ui/core/ExpansionPanel';// eslint-disable-line no-unused-vars
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';// eslint-disable-line no-unused-vars
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';// eslint-disable-line no-unused-vars
import FormHelperText from '@material-ui/core/FormHelperText';// eslint-disable-line no-unused-vars
import Typography from '@material-ui/core/Typography';// eslint-disable-line no-unused-vars
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';// eslint-disable-line no-unused-vars
import TextField from '@material-ui/core/TextField';// eslint-disable-line no-unused-vars

import {drnd} from '../utilities/getCfg'
import {addPage, removePage}from '../actions/responsive'


const styles = theme => ({
  root:{
    width:'100%'
  },
  troot: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 300,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});


class JobCosts extends React.Component{
  bljob={pcompl:'', bidlab:'', job:'', cost:'', earned:'', wipadj:''}
  state={year:'', showalljobs:true, curjob:this.bljob, showe:false}

  active='mabibi'
 
  componentDidMount=()=>{
    addPage('JobCosts')
    const cyr = moment().format('YYYY')*1
    const yrarr =[]
    for(var i =-4; i <= 2; i++){
      yrarr.push(cyr+i)
    }
    fetchBids()
    .then((res)=>{
      this.setState({yrarr, year:cyr, bids:res}, this.getReport(cyr))
    })
  }  

  componentWillUnmount(){
    removePage('JobCosts')
  }

  getReport=(year)=>{
    console.log('yr', year)
    fetchJobCosts(year)
      .then((json)=>{
        if(json.qmessage){
          console.log('json.qmessage: ', json.qmessage)
        }else{
          const{results}=json
          this.setState({byjob:results[0],byjobcat:results[1],byworker:results[2],byday: results[3]},()=>{console.log('this.state: ', this.state)})
        }
      })    
  }

  handleYearChange=(e)=>{
    console.log('e.target.name: ', e.target.name)
    const val = e.target.value
    this.setState({year: e.target.value}, this.getReport(val))
  }

  clickCaret = ()=>{
    //console.log('clicked caret')
    this.setState({showalljobs:true})
  }

  selectJob=(m,i)=>()=>{
    const {bids} = this.state
    const bid = bids.filter((b)=>b.job==m.job)
    const bidlab = bid.length==0 ? '' : bid[0].labor
    const curjob = {...this.state.curjob}
    curjob.job=m.job
    curjob.cost=m.cost
    curjob.bidlab = bidlab
    curjob.pcompl = ''
    curjob.earned=''
    curjob.wipadj=''
    this.setState({showalljobs:false, idx:i, curjob:curjob})
  }

  txtChanged = field => e =>{
    const {curjob}=this.state
    curjob[field]=e.target.value
    this.setState({curjob})
  }

  catchReturn=(e)=>{
    if(e.key=='Enter'){
      const {curjob}=this.state
      curjob.earned = (curjob.pcompl*curjob.bidlab*.01).toFixed(2)
      curjob.wipadj = (curjob.earned - curjob.cost).toFixed(2)
      const winlose = curjob.wipadj>0
      const wltext = winlose ? 'ahead of the bid' : 'behind the bid'
      const bid={job:curjob.job, labor:curjob.bidlab}
      putBid({bid:bid})
      .then((res)=>{
        console.log('res: ', res)
      })
      this.setState({showe:true, curjob, winlose, wltext})
    }
  }

  renderByJob=()=>{
    // const { classes } = this.props;
    const{byjob, showalljobs}=this.state
    if(byjob && showalljobs){
      return(
        <ul style={style.list.ul}>
          {byjob.map((m, i)=>{
            return (
            <li style={style.list.li} key={i}>
              <div onClick={this.selectJob(m,i)}>{m.job}   
                <div style={style.list.rt}>
                  cost.: {m.cost.toFixed(2)} <br/> 
                  hours: {m.hrs.toFixed(1)} <br/> 
                  cost/hr: {drnd(m.hrcost)}
                </div> 
              </div> 
            </li>
            )
          })}
        </ul>
      )
    }else if(byjob && !showalljobs) {
      const { classes } = this.props;
      const{curjob, showe, wltext, winlose}=this.state
      return(
        <div>
          <i className="material-icons" onClick={this.clickCaret} >keyboard_arrow_up</i><br/>
          <TextField
            id="standard-name"
            label="Job"
            className={classes.textField}
            value={curjob.job}
            InputProps={{
              readOnly: true,
            }}
            margin="dense"
          /> 
          <TextField
            id="standard-name"
            label="Cost"
            className={classes.textField}
            value={curjob.cost}
            InputProps={{
              readOnly: true,
            }}
            margin="dense"
          />          
          <TextField
            id="standard-name"
            label="Bid LaborTot"
            className={classes.textField}
            value={curjob.bidlab}
            onChange={this.txtChanged('bidlab')}
            helperText='edit here to change bid'
            margin="dense"
          /> 
          <TextField
            id="standard-name"
            label="% Complete"
            className={classes.textField}
            value={curjob.pcompl}
            onChange={this.txtChanged('pcompl')}
            onKeyPress={this.catchReturn}
            helperText='best guess'
            margin="dense"
          /> 
          {showe &&
          <TextField
            id="standard-name"
            label="Earned"
            className={classes.textField}
            value={curjob.earned}
            InputProps={{
              readOnly: true,
            }}
            margin="dense"
          /> 
          } 
          {showe && 
          <TextField
            id="standard-name"
            error={!winlose}
            label="WIP Adj."
            className={classes.textField}
            value={curjob.wipadj}
            InputProps={{
              readOnly: true,
            }}
            helperText={wltext}
            margin="dense"
          /> 
          }
        </div>
      )
    }else{
      return(
        <div>no data</div>
      )
    }
  }  

  renderByJobCat=()=>{
    // const { classes } = this.props;
    const{byjobcat}=this.state
    if(byjobcat){
      return(
        <ul style={style.list.ul}>
          {byjobcat.map((m, i)=>{
            const jobcat = m.job+ (m.cat==undefined ? '': '-'+ m.cat)
            return (
            <li style={style.list.li} key={i}>
              <div onClick={this.selectJob(m,i)}>{jobcat}   
                <div style={style.list.rt}>
                  cost.: {m.cost.toFixed(2)} <br/> 
                  hours: {m.hrs.toFixed(1)} <br/> 
                  cost/hr: {drnd(m.hrcost)}
                </div> 
              </div> 
            </li>
            )
          })}
        </ul>
      )
    }else{
      return(
        <div>no data</div>
      )
    }
  } 

  renderByWorker=()=>{
    // const { classes } = this.props;
    const{byjobcat, byworker}=this.state
    if(byjobcat){
      return(
        <ul style={style.list.ul}>
          {byjobcat.map((m, i)=>{
            const jobcat = m.job+ (m.cat==undefined || m.cat=='' ? '': '-'+ m.cat)
            return (
            <li style={style.list.li} key={i} >
              <div onClick={this.selectJob(m,i)} style={style.list.job}>
                {jobcat}   
                <div style={style.list.rt}>
                  cost.: {m.cost.toFixed(2)} <br/> 
                  hours: {m.hrs.toFixed(1)} <br/> 
                  cost/hr: {drnd(m.hrcost)}
                </div> 
              </div> 
              <div>
                {byworker
                .filter((w)=>{
                  const wjobcat = w.job+ (w.cat==undefined || w.cat=='' ? '': '-'+ w.cat)
                  return jobcat==wjobcat
                })
                .map((a,i)=>{
                  return(
                    <div key={i}  style={style.list.wkr}>
                      {a.someid}
                      <div  style={style.list.rt}>
                        hours: {a.hrs.toFixed(1)} <br/> 
                        cost.: {a.cost.toFixed(2)} <br/> 
                        cost/hr: {drnd(a.hrcost)}
                      </div>
                    </div>
                  )
                })
                }
              </div>
            </li>
            )
          })}
        </ul>
      )
    }else{
      return(
        <div>no data</div>
      )
    }
  } 
  
  renderByDay=()=>{
    const{byjobcat, byday}=this.state
    if(byjobcat){ 
      return(
        <ul style={style.list.ul}>
          {byjobcat.map((m, i)=>{
            const jobcat = m.job+ (m.cat==undefined || m.cat=='' ? '': '-'+ m.cat)
            return (
            <li style={style.list.li} key={i} >
              <div onClick={this.selectJob(m,i)} style={style.list.job}>
                <b>{jobcat}</b>   
                <div style={style.list.rt}>
                  cost.: {m.cost.toFixed(2)} <br/> 
                  cost/hr: {drnd(m.hrcost)}<br/>
                  hours: {m.hrs.toFixed(1)}  
                  
                </div> 
              </div> 
              <div>
                {byday
                .filter((w)=>{
                  const wjobcat = w.job+ (w.cat==undefined || w.cat=='' ? '': '-'+ w.cat)
                  return jobcat==wjobcat
                })
                .reduce((acc,d)=>{
                  let last, lastdate
                  if (acc.length>0){
                    last = acc[acc.length-1]
                    lastdate= last.wdprt
                  }
                  const ddate = d.wdprt

                  const empl = d.employee.split('@')[0]
                  const payload = {employee:empl, hrs:d.hrs}
                  // console.log('lastdate, ddate: ', lastdate, ddate)
                  if(lastdate==ddate){
                    last.ddd.push(payload)
                    acc.pop()
                    acc.push(last)
                    return acc
                  }else{
                    const newd = {wdprt:ddate, ddd:[payload]}
                    // console.log('newd: ', newd)
                    acc.push(newd)
                    return acc
                  }
                },[])
                .map((b,i)=>{
                  // const sdate = moment(b.wdprt).format("YYYY-[W]WW-E")
                  const tdate = moment(b.wdprt).format("dddd MMM DD YYYY")
                  return(
                    <div key={i}>
                      <span><b>{tdate}</b></span> <br/>
                      {b.ddd.map((dd,j)=>{
                        return(
                          <div key={j}>
                            {dd.employee} <span style={style.list.rt}>{dd.hrs}</span>
                          </div>
                        )
                      })}
                    </div>
                  )
                })
              } 
              <br/>
              </div>
            </li>
            )
          })}  
        </ul>
      )
    }else{
      return(
        <div>no data</div>
      )
    }   
  }
   
  render=()=>{
    const { classes } = this.props;
    const{yrarr, year}=this.state
    const rbyjob =this.renderByJob() 
    const rbyjobcat =this.renderByJobCat() 
    const rbyworker =this.renderByWorker() 
    const rbyday =this.renderByDay() 
    if (yrarr){
      return(
        <div style={style.outer}>
          <h4> Reports on Job Costs </h4>
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
          <div className={classes.root}>
          <ExpansionPanel >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>By Job</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                {rbyjob}
                
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>By Category</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {rbyjobcat}
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>By Worker</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {rbyworker}
            </ExpansionPanelDetails>
          </ExpansionPanel>  
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>By Day</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {rbyday}
            </ExpansionPanelDetails>
          </ExpansionPanel> 
          </div>        
        </div>
      )
    }else{
      return(
        <div>
          <h1>THINKING</h1>
        </div>
      )
    }
  }
}
JobCosts = withStyles(styles)(JobCosts)
JobCosts = mapClass2Element(JobCosts)

export {JobCosts}

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
      //display: 'flex',
      //flexDirection: 'column'
    },
    li:{
      overflow:'hidden',
      paddingTop: '8px',
      borderBottom: '1px solid',
      width: '270px',
      //flex:1
    },
    rt:{
      float:'right',
      textAlign:'right'
    },
    job:{
      height:'80px'
    },
    wkr:{
      height:'60px'
    }
  }
}