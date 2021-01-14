import React from 'react';
import {router} from '../app'
import {mapClass2Element} from '../hoc/mapClass2Element'
import Form from 'muicss/lib/react/form';// eslint-disable-line 
import Input from 'muicss/lib/react/input';// eslint-disable-line 
import Button from 'muicss/lib/react/button';// eslint-disable-line 
import {pStyle} from '../styles'
import { putJob, deleteJob } from '../services/fetches';
import {setKeyVal} from '../actions/jobacts';


const style = {
  ...pStyle, outer: {...pStyle.outer, background: '#CCCCCC'}
}
//pStyle.outer.background='#C4A265'

class AddJob extends React.Component {
  state = {ejob:this.props.ejob, newup:'update'}

  componentDidMount() {
    this.setState({ejob:this.props.ejob})
  }

  updateJob=(e)=>{
    e.preventDefault()
    console.log('this.props.ejob.curjob: ', this.props.ejob.curjob)
    const cs=this.props.ejob.curjob.categories.replace(/\s/g, "").split(',')
    const curjob = {...this.props.ejob.curjob}
    delete curjob.categories
    curjob.week=0
    const newjcarr = cs.map((c)=>{
      const ncurjob = {...curjob}
      ncurjob.category=c
      return ncurjob
    })
    console.log('newjcarr: ', newjcarr)
      putJob(newjcarr)
    router.navigate('/jobs?rerender');
  }
  jobChanged =(e)=>{
    let curjob= this.props.ejob.curjob
    curjob.job = e.target.value
    curjob.idx = 0
    curjob.active = 0
    curjob.week=0
    this.props.xmitChange({curjob:curjob});
  }
  catChanged =(e)=>{
    let curjob= this.props.ejob.curjob
    curjob.categories = e.target.value
    this.props.xmitChange({curjob:curjob});
  }
  delJob=()=>{
    deleteJob(this.props.ejob.curjob.job)
    router.navigate('/jobs?rerender');
  }

  render() { 
    const{curjob, update, clearjc}=this.props.ejob
    if(clearjc){
      setKeyVal({clearjc:false}) 
      const e = {target: {value:''}}
      this.jobChanged(e)
      this.catChanged(e)
    }
    const newup = update ? 'udpate' : 'new'
    return (
      <div style={style.outer}>
      <Form>
        <legend>Add or Update Job</legend>
        <Input placeholder="Job" value={curjob.job} onChange={this.jobChanged}/>
        <Input placeholder="Categories- comma separated or null" value={curjob.categories} onChange={this.catChanged}/>
        <Button variant="raised" onClick={this.updateJob}>{newup}</Button>
        <Button onClick={this.delJob}>delete</Button>
      </Form>

      </div>
      );
  }
}

let chHOC = (Comp) =>{// eslint-disable-line no-unused-vars
  return class PP extends React.Component {
    constructor (props){
      super(props);
    }
    state={}
    static getDerivedStateFromProps(props, state){// eslint-disable-line no-unused-vars
      return {props}
    }
    handleXmitChange=(curjob)=>{
      let nstate  ={...this.state}
      let nprops = {...nstate.props}
      let nejob = {...nprops.ejob}
      nejob.curjob = curjob
      nprops.ejob = nejob
      this.setState({props:nprops})
    }
    render() {
      return (
        <Comp {...this.props} {...this.state} xmitChange={this.handleXmitChange}/>
      )
    }
  }  
}

AddJob = mapClass2Element(chHOC(AddJob))


export {AddJob}