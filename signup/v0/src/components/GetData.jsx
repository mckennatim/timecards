import React from 'react'// eslint-disable-line no-unused-vars
import {mapClass2Element} from '../hoc/mapClass2Element'
import {fetchCoData, deleteCoData} from '../services/fetches'
class GetData extends React.Component{
  
  active='mabibi'
  componentDidMount(){
    const {codata} =this.props.newco
    console.log('codata: ', codata)
    
  }  
  getData=()=>{
    const {mobj, codata}=this.props.newco
    console.log('mobj: ', mobj)
    console.log('codata: ', codata)
    console.log(mobj,codata)
    fetchCoData(mobj,codata).then((res)=>{
      console.log('res: ', res)
      window.alert(res.message)
    })
  }

  deleteData=()=>{
    const tf = window.confirm('There is no way to undo this. Do you really want to delete all your data from our servers? ')
    if(tf){
      const {mobj, codata}=this.props.newco
      console.log('all is deleted')
      deleteCoData(mobj,codata).then((res)=>{
        console.log('res: ', res)
        window.alert(res.message)
      })
    }
  }

  render(){
    if (this.props.newco.codata){
      const {codata}=this.props.newco
      return(
        <div style={style.outer}>
          <h3> Get Your Data</h3>
          <p>You can get a copy of your data most anytime. Periodically you can grab a copy. If you stop using JobCost-PayTime we will keep your data for 90 days after your registration expires. </p> 
          <button onClick={this.getData}>GET DATA for {codata.coid}</button><br/><br/>

          <a href=""></a>
          <p>If you are a partner in your business you have the power to completely wipe all your data from our servers. We strongly recommend that you first get your data. We hate to lose you but you can always open a new account.  </p>
          <button onClick={this.deleteData}>DELETE ALL COMPANY DATA</button><br/><br/>
          <p style ={style.p.small}>the small print: We will keep a copy of your email address and a count of the number of demos you have run and the number of companies you have started on the system. Right now, we haven't written any software for reloading your data after you have downloaded a copy. There are some tech issues around data security that we would need to work through to do that. First we would develop a way to upload particular bulk data.</p>
        </div>
      )
    }else{
      return(
        <div>
          <p>no coid selected</p>
        </div>
      )
    }

  }
}
GetData = mapClass2Element(GetData)

export {GetData}

const style = {
  outer:{
    overflow:'hidden',
    padding: '4px',
    margin: '2px 10px 10px 10px'
  },
  p: {
    small:{
      fontSize: 'smaller'
    }
  } 
}