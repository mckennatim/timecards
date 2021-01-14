var moment = require('moment');
import {ls, cfg} from '../utilities/getCfg'
import {geta} from '../utilities/wfuncs'

const fetchSubmitted =()=>{
  const lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/payroll/submitted'
    let options= {headers: {'Authorization': 'Bearer '+ lsh['token']}}
  
    console.log('in fetch geta')
    return(
      fetch(url, options)
        .then((response)=>response.json())
        .then((json)=>{
          if(json.message){
            return {qmessage: json.message}
          }else{
            return json
          }
        })
        .catch((e)=>{
          return {qmessage: e.message}
        })
      )         
  }else{
    let p2 =Promise.resolve({qmessage:'you dont exist! '})
    return p2
  }  
}
const fetchWhoTcard=(wkstat)=>{
  const lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/payroll/tcard/'+wkstat.wprt+'/'+wkstat.emailid
    let options= {
      headers: {'Authorization': 'Bearer '+ lsh['token']}
    }
    return(
      fetch(url, options)
        .then((response)=>response.json())
        .then((json)=>{
          if(json.message){
            return {qmessage: json.message}
          }else{
            const processed= processDb4app(json)
            processed.emailid=wkstat.emailid
            return processed
          }
        })
        .catch((e)=>{
          return {qmessage: e.message}
        })
      )         
  }else{
    let p2 =Promise.resolve({qmessage:'you dont exist! '})
    return p2
  }
}
const fetchTcard=(wk)=>{
  const lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/tcard/week/'+wk
    let options= {headers: {'Authorization': 'Bearer '+ lsh['token']}}
    return(
      fetch(url, options)
        .then((response)=>response.json())
        .then((json)=>{
          if(json.message){
            return {qmessage: json.message}
          }else{
            const processed= processDb4app(json)
            return processed
          }
        })
        .catch((e)=>{
          return {qmessage: e.message}
        })
      )         
  }else{
    let p2 =Promise.resolve({qmessage:'you dont exist! '})
    return p2
  }
}
const putTcardWk=(wkstat)=>{
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/tcard/updstat'
    let options= {
      headers: {'Authorization': 'Bearer '+ lsh['token'],
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({wkstat})
    }  
    return(
      fetch(url, options)
        .then((response)=>response.json())
    )        
  }else{
    let p2 =Promise.resolve({qmessage:'you dont exist! '})
    return p2
  }
}
const putTcardJc=(aday)=>{
  const tday = adjDay4db(cfg.firstday, aday)
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/tcard/updjc'
    let options= {
      headers: {'Authorization': 'Bearer '+ lsh['token'],
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({tday:tday})
    }  
    return(
      fetch(url, options)
        .then((response)=>response.json())
    )        
  }else{
    let p2 =Promise.resolve({qmessage:'you dont exist! '})
    return p2
  }
}
const putTcardPu=(aday)=>{
  const tday = adjDay4db(cfg.firstday, aday)
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/tcard/updpu'
    let options= {
      headers: {'Authorization': 'Bearer '+ lsh['token'],
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({tday:tday})
    }  
    return(
      fetch(url, options)
        .then((response)=>response.json())
    )        
  }else{
    let p2 =Promise.resolve({qmessage:'you dont exist! '})
    return p2
  }
}

const putTcard=(aday)=>{
  const tday = adjDay4db(cfg.firstday, aday)
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/tcard/update'
    let options= {
      headers: {'Authorization': 'Bearer '+ lsh['token'],
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({tday:tday})
    }  
    return(
      fetch(url, options)
        .then((response)=>response.json())
    )        
  }else{
    let p2 =Promise.resolve({qmessage:'you dont exist! '})
    return p2
  }
}

const delTcardPu=(aday)=>{
  const tday = adjDay4db(cfg.firstday, aday)
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/tcard/del'
    let options= {
      headers: {'Authorization': 'Bearer '+ lsh['token'],
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({tday:tday})
    }  
    return(
      fetch(url, options)
        .then((response)=>response.json())
    )        
  }else{
    let p2 =Promise.resolve({qmessage:'you dont exist! '})
    return p2
  }
}

export{fetchWhoTcard, fetchSubmitted, fetchTcard, putTcard, putTcardPu, putTcardJc, putTcardWk, delTcardPu}

const wkendLast = (apwa)=>{
  for(var i = 6; i<=7;i++ ){
    const fi = apwa.findIndex((a)=>a.wdprt.slice(-1)==i)
    const rec= apwa[fi]
    apwa.splice(fi, 1)
    apwa.push(rec)
  }
  const napwa = apwa.map((wa,i)=>{
    wa.idx=i
    return wa
  })
  return napwa
}

const sumThing=(arr, fld)=>{
  const narr=arr.map((a)=>a[fld])
  return narr
}

const processDb4app =(res)=>{
  const lsh = ls.getItem();
  const wkarr = wkendLast(adjWk4app(cfg.firstday, res.wkarr))
  const hrs= sumThing(wkarr, 'hrs')
  const jchrs= sumThing(wkarr, 'jchrs')
  return {wkarr, hrs, jchrs, emailid:lsh.email, jobs:res.jobs, wstat:res.wstat}
}

const adjWk4app =(firstday, wkarr)=>{
  const appwkarr= wkarr
    .map((d)=>{
      if (firstday!=1 && d.wdprt.slice(-1)>=firstday){
        d.wdprt= moment(d.wdprt).subtract(7, "days").format("YYYY-[W]WW-E")
      }
      return d
    })
    .sort((a,b)=>a.wdprt > b.wdprt)
  return appwkarr
}

const adjDay4db = (firstday, rec)=>{
  let d = {...rec}
  if (firstday!=1 && d.wdprt.slice(-1)>=firstday){
    console.log('it is greater: ')
    d.wdprt= moment(d.wdprt).add(7, "days").format("YYYY-[W]WW-E")
  }
  return d
}