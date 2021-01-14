import {ls, cfg} from '../utilities/getCfg'
import {geta, processDb4app, adjDay4db} from '../utilities/wfuncs'
const appid='tcard'

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
const fetchTcard=(yr, wk)=>{
  const lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/tcard/week/'+yr+'/'+wk
    console.log('url: ', url)
    let options= {headers: {'Authorization': 'Bearer '+ lsh['token']}}
    return(
      fetch(url, options)
        .then((response)=>response.json())
        .then((json)=>{
          console.log('json: ', json)
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

const fetchHelp=()=>{
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/common/help/'+appid
    let options= {
      headers: {'Authorization': 'Bearer '+ lsh['token']},
      method: 'GET'
    }
    return(
      fetch(url, options)
        .then((response)=>response.json())
        .then((json)=>json)
        .catch((e)=>{
          return {qmessage: e.message}
        })
      )         
  }else{
    let p2 =Promise.resolve({qmessage:'you do not seem to be known on this device '})
    return p2
  }
}

const putVote=(vote)=>{
  var lsh = ls.getItem();
  console.log(JSON.stringify({vote:vote}))
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/common/help/vote/'+appid
    let options= {
      headers: {'Authorization': 'Bearer '+ lsh['token'],
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({vote:vote})
    }
    return(
      fetch(url, options)
        .then((response)=>response.json())
        .then((json)=>json)
        .catch((e)=>{
          return {qmessage: e.message}
        })
      )         
  }else{
    let p2 =Promise.resolve({qmessage:'you do not seem to be known on this device '})
    return p2
  }
}

const putHelpAns=(ans)=>{
  var lsh = ls.getItem();
  console.log(JSON.stringify({ans:ans}))
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/common/help/ans/'+appid
    let options= {
      headers: {'Authorization': 'Bearer '+ lsh['token'],
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({ans:ans})
    }
    return(
      fetch(url, options)
        .then((response)=>response.json())
        .then((json)=>json)
        .catch((e)=>{
          return {qmessage: e.message}
        })
      )         
  }else{
    let p2 =Promise.resolve({qmessage:'you do not seem to be known on this device '})
    return p2
  }
}
const putHelpQues=(ques)=>{
  var lsh = ls.getItem();
  console.log(JSON.stringify({ques:ques}))
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/common/help/ques/'+appid
    let options= {
      headers: {'Authorization': 'Bearer '+ lsh['token'],
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({ques:ques})
    }
    return(
      fetch(url, options)
        .then((response)=>response.json())
        .then((json)=>json)
        .catch((e)=>{
          return {qmessage: e.message}
        })
      )         
  }else{
    let p2 =Promise.resolve({qmessage:'you do not seem to be known on this device '})
    return p2
  }
}

const delHelp=(id, qa)=>{
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/common/help/'+appid+'/'+qa+'/'+id  
    let options= {
      headers: {'Authorization': 'Bearer '+ lsh['token'],
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'DELETE'
    }
    return(
      fetch(url, options)
        .then((response)=>response.json())
        .then((json)=>json)
        .catch((e)=>{
          return {qmessage: e.message}
        })
      )         
  }else{
    let p2 =Promise.resolve({qmessage:'you do not seem to be known on this device '})
    return p2
  }
}


export{fetchSettings, fetchTcard, putTcard, putTcardPu, putTcardJc, putTcardWk, delTcardPu, fetchHelp, putHelpAns, putHelpQues, delHelp, putVote}

