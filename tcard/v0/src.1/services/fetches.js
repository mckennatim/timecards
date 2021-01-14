import {ls, cfg} from '../utilities/getCfg'
import {geta, processDb4app, adjDay4db} from '../utilities/wfuncs'

const fetchSettings=()=>{
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/tcard/settings'
    let options= {headers: {'Authorization': 'Bearer '+ lsh['token']}}
    return(
      fetch(url, options)
        .then((response)=>response.json())
        .then((json)=>{
          if(json.message){
            return {qmessage: json.message+' - perhaps you need to register'}
          }else{
            return json[0]
          }
        })
        .catch((e)=>{
          return {qmessage: e.message+'fetchSettings- perhaps you need to register'}
        })
      )         
  }else{
    let p2 =Promise.resolve({qmessage:'you dont exist! - perhaps you need to register'})
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
            // console.log('json: ', json)
            const processed= processDb4app(json)
            return processed
          }
        })
        .catch((e)=>{
          return {qmessage: e.message + ' from fetchTcard'}
        })
      )         
  }else{
    let p2 =Promise.resolve({qmessage:'click register back on the app '})
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
  var lsh = ls.getItem();
  const tday = adjDay4db(lsh['firstday'], aday)
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
  var lsh = ls.getItem();
  const tday = adjDay4db(lsh['firstday'], aday)
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
  var lsh = ls.getItem();
  const tday = adjDay4db(lsh['firstday'], aday)
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
  var lsh = ls.getItem();
  const tday = adjDay4db(lsh['firstday'], aday)
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

export{fetchSettings, fetchTcard, putTcard, putTcardPu, putTcardJc, putTcardWk, delTcardPu}

// const wkendLast = (apwa)=>{
//   for(var i = 6; i<=7;i++ ){
//     const fi = apwa.findIndex((a)=>a.wdprt.slice(-1)==i)
//     const rec= apwa[fi]
//     apwa.splice(fi, 1)
//     apwa.push(rec)
//   }
//   const napwa = apwa.map((wa,i)=>{
//     wa.idx=i
//     return wa
//   })
//   return napwa
// }

// const sumThing=(arr, fld)=>{
//   const narr=arr.map((a)=>a[fld])
//   return narr
// }

// const processDb4app =(res)=>{
//   const wkarr = wkendLast(adjWk4app(ls.getKey('firstday'), res.wkarr))
//   const hrs= sumThing(wkarr, 'hrs')
//   const jchrs= sumThing(wkarr, 'jchrs')
//   return {wkarr, hrs, jchrs, emailid:lsh.email, jobs:res.jobs, wstat:res.wstat}
// }

// const adjWk4app =(firstday, wkarr)=>{
//   const appwkarr= wkarr
//     .map((d)=>{
//       if (firstday!=1 && d.wdprt.slice(-1)>=firstday){
//         d.wdprt= moment(d.wdprt).subtract(7, "days").format("YYYY-[W]WW-E")
//       }
//       return d
//     })
//     .sort((a,b)=>a.wdprt > b.wdprt)
//   return appwkarr
// }

// const adjDay4db = (firstday, rec)=>{
//   let d = {...rec}
//   if (firstday!=1 && d.wdprt.slice(-1)>=firstday){
//     console.log('it is greater: ')
//     d.wdprt= moment(d.wdprt).add(7, "days").format("YYYY-[W]WW-E")
//   }
//   return d
// }