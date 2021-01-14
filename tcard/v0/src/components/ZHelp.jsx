import React from 'react'// eslint-disable-line no-unused-vars
import {mapClass2Element} from '../hoc/mapClass2Element'
import {addPage, removePage}from '../actions/responsive'
import {setKeyVal} from '../actions/sharedact'
import{HelpApp}from './HelpApp.jsx'// eslint-disable-line no-unused-vars
import {putHelpAns, putHelpQues, delHelp, putVote, fetchHelp}from '../services/fetches'

class Help extends React.Component{
  state={showhelp:true, help:this.props.help, newaid:9000, newq:false, q:'', newqid:8000, p:this.props.cambio.page.name}

  active='mabibi'
 
  componentDidMount=()=>{
    addPage('Help')
    const bhelp = this.makeData()
    this.setState({bhelp})
  }
  
  componentWillUnmount(){
    removePage('Help')
  }

  makeData=()=>{
    const {allhelp}=this.state.help
    const ahelp = this.filterByPageNames(allhelp)
    const bhelp = this.indentData(ahelp.slice())
    return bhelp
  }

  filterByPageNames=(allhelp)=>{
    const{pages}= this.props.responsive
    const fhelp = allhelp
    .filter((a)=>{
      return pages.length==1 ? true : pages.includes(a.pagename)
    })
    .sort((a,b)=>{
      return b.qrank<a.qrank ? -1 : 1
    })
    .map((m)=>{
      return m  
    })
    return fhelp
  }

  indentData = (sdata)=>{
    let bhelp = sdata
    .reduce((acc,rr)=>{
      const r = {...rr}
      r.toggle=true
      let qh = {
        qid:r.qid,
        qrank:r.qrank,
        qrankst: r.qrankst,
        qedit:r.qedit,
        howto:r.howto,
        appid:r.appid,
        pagename:r.pagename,
        qcontributor:r.qcontributor
      }
      let ah = {
        qid: r.qid,
        aid: r.aid,
        arank:r.arank, 
        arankst: r.arankst,
        aedit: r.aedit,
        hereshow:r.hereshow, 
        acontributor:r.acontributor
      }
      if(acc.length==0){
        qh.indent=[ah]
        acc.push(qh)
      }else{
        let lhw = acc.pop()
        if(lhw.qid==r.qid){
          lhw.indent.push(ah)
          acc.push(lhw)
        }else{
          qh.indent = [ah]
          acc.push(lhw)
          acc.push(qh)
        }
      }
      return acc
    },[])  
    const bshelp=bhelp.map((b)=>{
      if(b.indent.length>1){
        const sorted = b.indent
        .sort((a,b)=>{
          return a.arank<b.arank
        })
        b.indent=sorted
      }
      return b
    })
    return bshelp     
  }

  handleVote=(id,up, vtype)=>{
    const maxvotes =2
    const isup = up ? 1 : -1
    const{allhelp}=this.state.help
    const idtype = vtype=='qrank' ? 'qid' : 'aid'
    const qa = vtype=='qrank' ? 'q' : 'a'
    const st3 = vtype+'st'
    const ahupd= allhelp
    .map((m)=>{
      if (m[idtype]==id){
        let t = Math.abs(m[st3] + isup)
        if(t<=maxvotes){
          m[st3] = m[st3] + isup
          m[vtype] = m[vtype] + isup
          putVote({vtype, idtype, qa, id, rank:m[vtype]})
        }
      }
      return m
    })
    this.setState({allhelp:ahupd})
  }

  

  handleAddDelHelp=(ed)=>(e)=>{
    console.log('ed: ', ed)
    let {newaid, newqid, help}=this.state
    let {allhelp}=help
    switch (ed.do) {
      case 'addans':
        const a= allhelp.filter((aa)=>ed.m.qid==aa.qid)[0]
        let ahh = {
          appid: a.appid,
          acontributor:'',
          qcontributor:a.qcontributor,
          aedit: true,
          hereshow:'blank', 
          aid:newaid++,
          qid:a.qid,
          howto: a.howto,
          keywords:a.keywords, 
          pagename: a.pagename,
          qrank: a.qrank,
          qrankst: a.qrankst,
          arank:0, 
          arankst:0,
          stats: 'answered'
        }
        
        allhelp.push(ahh)
        this.setState({allhelp:allhelp, newaid:newaid})
        break;
      case 'newQ':
        console.log('routes ', this.props.help.routes)
        this.setState({newq:true})
        break
      case 'changeq' :
        this.setState({q:e.target.value}) 
        break 
      case 'selectp':
        this.setState({p:e.target.value}) 
        break 
      case 'submitnewq':
        e.preventDefault()
        console.log('this.state.q, this.state.p: ', this.state.q, this.state.p)
        let qhh = {
          appid: this.props.help.appid,
          acontributor:'',
          qcontributor:'',
          aedit: false,
          qedit: false,
          hereshow:'', 
          aid:newaid++,
          qid:newqid++,
          howto: this.state.q,
          keywords:[], 
          pagename: this.state.p,
          qrank: 0,
          qrankst: 0,
          arank:0, 
          arankst:0,
          stats: 'open'
        }
        allhelp.push(qhh)
        this.setState({allhelp:allhelp, newqid:newqid, newaid:newaid, newq:false, p:'', q:''})
        putHelpQues({qid:qhh.qid, howto:qhh.howto, appid:qhh.appid, pagename:qhh.pagename, qcontributor:qhh.qcontributor, qrank:qhh.qrank})
        .then(()=>fetchHelp('pay'))
        .then((res)=>{
          const allhelp = res.results.map((m)=>{
            m.qrankst=0
            m.arankst=0
            m.qedit=false
            m.aedit=false
            return m
          })
          setKeyVal({allhelp})
          this.setState({help:this.props.help})
        })          
        break;
      default:  
    }
  }

  handleEditHelp=(ed)=>(e)=>{
    const id = ed.d=='q' ? 'qid' : 'aid'
    const edit = ed.d=='q' ? 'qedit' : 'aedit'
    let {help}=this.state
    let {allhelp}=help
    let {m}=ed
    const ahupd= allhelp.map((a)=>{
      if(ed.m[id]==a[id]){
        switch (ed.do) {
          case 'input':
            a[edit]=true
            break;
          case 'clearans':
            const numans = allhelp.filter((a)=>a.qid==ed.m.qid).length
            if (numans>1){
              help.allhelp=allhelp.filter((a)=>a.aid!=ed.m.aid)
              this.setState({help} )
            }else{
              const idx = allhelp.findIndex((a)=>a.aid==ed.m.aid)
              let ch = allhelp[idx]
              ch = {...ch, hereshow:null, arank:null, acontributor:null}
              allhelp[idx]=ch
              help.allhelp=allhelp
              this.setState({help} )              
            }
            delHelp(ed.m[id], 'a')
            break;
          case 'clearques':
            const newh = allhelp.filter((a)=>a.qid!=ed.m.qid)
            help.allhelp=newh
            this.setState({help} )
            delHelp(ed.m[id],'q')
            break;  
          case 'changeq':
            a.howto=e.target.value 
            break; 
            case 'changeans':
            a.hereshow=e.target.value 
            break; 
          case 'selectp':
            a.pagename=e.target.value 
            this.setState({p:e.target.value})
            break; 
          case 'submita':
            e.preventDefault()
            putHelpAns({aid:a.aid, qid:a.qid, hereshow:a.hereshow, arank:a.arank, acontributor:a.acontributor})
            .then((res)=>console.log('res: ', res))
            a[edit]=false 
            break; 
          case 'submitq':
            e.preventDefault()
            putHelpQues({qid:m.qid, howto:m.howto, appid:m.appid, pagename:m.pagename, qcontributor:m.qcontributor, qrank:m.qrank})
            a[edit]=false 
            break; 
          default :
             break;
        }  
      }
      return a
    })
    this.setState({allhelp:ahupd})
  }
   

  render=()=>{
    const bhelp = this.makeData()
    return(
      <div>
      <HelpApp bhelp={bhelp} 
      xvote={this.handleVote} 
      editHelp={this.handleEditHelp}
      addDelHelp={this.handleAddDelHelp}
      help={this.props.help}
      p={this.state.p}/>
      <i onClick={this.handleAddDelHelp({do:'newQ', pages:this.props.responsive.pages})} className="material-icons">add</i>
      {this.state.newq &&
      <form onSubmit={this.handleAddDelHelp({do:'submitnewq'})}>
        <select value={this.state.p} onChange={this.handleAddDelHelp({do:'selectp',})}>
        {this.props.help.routes.map((r)=>{
          return (<option value={r.page}>{r.page}</option> )
        })}
        </select>
        <div>How to...</div>
        <textarea name="d" id="" cols="40" rows="4" value={this.state.q} onChange={this.handleAddDelHelp({do:'changeq'})}/>
        <input type="submit" value="Submit" />
      </form>
      }
      </div>
    )
  }
}

Help = mapClass2Element(Help)

export {Help}
