import React from 'react'

class JobCost extends React.Component {
  state={showjobs:false, showon:null, hrsleft:0}



  showJobs = ()=>{
    console.log('this.props.jobs: ', this.props.jobs)
    let sh = this.state.showjobs ? false : true
    this.setState({showjobs:sh})
  }

  add4day=(e)=>{
    this.setState({hrsleft:drnd(e.target.value)})
  }

  inpKey =(e)=>{
    console.log('event: ', e.keyCode)
    if(e.keyCode==13){
      const val = drnd(e.target.value)
      const idx = e.target.parentElement.getAttribute('ix')
      const nj ={...this.props.jobs[idx]}
      nj.hrs=val
      const njcost = this.modifyJcost(nj) 
      this.props.jcChanges({cmd:'jcost', jcost:njcost})
      this.setState({showjobs:false, showon:null})
    }
  }

  modifyJcost =(nj)=>{
    const njcost = this.props.jcost.slice()
    const idx = njcost.findIndex((j)=>j.job+j.cat==nj.job+nj.category)
    if(idx>-1){
      const nejcost = {...njcost[idx]}
      nejcost.hrs=Math.round((nejcost.hrs+nj.hrs)*100)/100
      njcost[idx]=nejcost
    }else{
      njcost.push({job:nj.job, cat:nj.category, hrs:nj.hrs})
    }
    return njcost
  }
  
  addSome=(e)=>{
    this.setState({hrsleft: drnd(this.props.puhrs-this.props.jchrs)})
    console.log('adding: ', e.target.getAttribute('ix'))
    this.setState({showon:e.target.getAttribute('ix')})
  }

  deleteJcost =()=>{
    this.props.jcChanges({cmd:'jcost', jcost:[]})
  }
  clearPunch =()=>{
    this.props.jcChanges({cmd:'clpu'})
  }

  renderInput = ()=>{
    return(
      <input style={style.jchr} type="number" value={drnd(this.state.hrsleft)} onChange={this.add4day} step=".25" onKeyUp={this.inpKey}/>
    )
  }
  renderList =()=>{
    const aninput =this.renderInput()
    if(this.props.jobs.length==0){
      this.props.jobs.push({job:'yo boss - no job list', category:'for this week'})
    }
    if(this.state.showjobs){
      const jl = this.props.jobs.map((j,i)=>{
        if(i==this.state.showon){
          return (
            <li style={style.jclst.li2} key={i}>
            <span >
            {j.job} : {j.category}
            </span> 
            <span ix={i}> {aninput}</span>
            </li>
          )
        }else {
          return (
            <li  style={style.jclst.li} key={i}>
            <span ix={i} style={style.jclst.jcspan} 
            onClick={this.addSome}>
              {j.job} : 
              <span ix={i} onClick={this.addSome} style={style.jclst.cat}>
                {j.category}
              </span>
            </span> 

            </li>
          )
        }
      })
      return(
        <ul style={style.jclst.ul} >{jl}</ul>
      )
    }
  }

  renderJcost =(jcost)=>{
    
    const hili = this.alterHili()

    return(
    <div >
    <table style={style.table.table}><tbody>
    <tr style={style.table.tr}>
      <th style={style.table.thtd}>job : category</th>
      <th style={hili}>
        <span >{drnd(this.props.jchrs)}</span>
      </th>
    </tr>
    {jcost.map((jc, i)=>{
      return(
      <tr key={i} style={style.table.tr}>
        <td style={style.table.thtd}>
          <span>{jc.job} : </span>
          <span style={style.table.cat}>{jc.cat}</span>
        </td>
        <td style={style.table.thtd}>{drnd(jc.hrs)}</td>
      </tr>
      )
    })}    
    </tbody></table>
    </div>
    )
  }

  render() {
    const {showjobs}=this.state// eslint-disable-line no-unused-vars
    const {jchrs, jcost, puhrs, wdprt}= this.props 
    const jcosts = this.renderJcost(jcost)
    const jlist = this.renderList()
    return ( 
      <div style={style.jcbox} >
        {jcosts}
        <div style={style.clear.div}>
          <button style={style.clear.add} onClick={this.showJobs}>toggle job</button>
          <button wdprt={wdprt} onClick={this.clearPunch}>clear punchlist</button>
          <button onClick={this.deleteJcost}>clear jobcosts</button>
        </div>
        <div style={style.calc.div}>
          <span style={style.clear.unal}>
          Unallocated Hours: {drnd(puhrs)} - {drnd(jchrs)} = {drnd(puhrs-jchrs)}
          </span>
        </div>
        <div>
          {jlist}
        </div>
        

      </div>
    );
  }

  alterHili=()=>{
    const nstyle = {...style}
    const nhili ={...nstyle.hili}
    nstyle.hili = nhili
    if (drnd(this.props.puhrs-this.props.jchrs)==0){
      nstyle.hili.background = '#9eea9d'
    }
    if (this.props.puhrs==0 && this.props.jchrs==0){
      nstyle.hili.background = 'white'
    }
    return nstyle.hili
  }
}
 
export {JobCost};

const style={
  jclst:{
    li2:{
      background: 'white'
    },
    li:{
      textAlign:'left'
    },
    ul:{
      overfow: 'hidden',
      listStyle: 'none',
      float: 'left',
      background: 'silver'
    },
    i:{
      display: 'inline-flex',
      verticalAlign: 'middle',
      fontSize: '20px'
    },
    ispan:{
      textAlign: 'right'
    },
    jcspan: {
      textAlign:'left'
    },
    cat:{
      background: '#efeded'
    }

  },
  hili:{
    background: '#efe869',
    padding: '0px',
    margin: '0px',
    textAlign: 'right',
    border: '1px solid'
  },
  jcbox:{
    overfow: 'hidden',
    float: 'left',
    border: '1px solid green',
    background: 'white'
  },
  jc:{
    float: 'right',
    width: '300px',
    background: 'silver'
  },
  jchr:{
    width: '50px'
  },
  clear:{
    div:{
      background: 'grey',
      float:'left'
    },
    add:{
  
    },
    unal:{
      padding:'2px',
      border: '1px solid'
    }  
  },
  calc:{
    div:{
      background: 'white',
      float:'right'
    },
    span:{

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
      textAlign: 'right'
    },
    cat:{
      background: '#efeded'
    }
  }
}

const drnd=(n)=>{
  return Math.round(n*100)/100
}