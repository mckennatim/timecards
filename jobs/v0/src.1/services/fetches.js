import {ls, cfg} from '../utilities/getCfg'
import {geta} from '../utilities/wfuncs'

const fetchSettings=()=>{
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/payroll/settings'
    let options= {headers: {'Authorization': 'Bearer '+ lsh['token']}}
    return(
      fetch(url, options)
        .then((response)=>response.json())
        .then((json)=>{
          if(json.message){
            return {qmessage: json.message}
          }else{
            return json[0]
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
const fetchJobs=(wk)=>{
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/jobs/list/'+wk
    let options= {headers: {'Authorization': 'Bearer '+ lsh['token']}}
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
const postJobs=(jobs,wk)=>{
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/jobs/post/'+wk
    let options= {
      headers: {'Authorization': 'Bearer '+ lsh['token'],
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({jobs:jobs})
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

const putJob=(job)=>{
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/jobs/update'
    let options= {
      headers: {'Authorization': 'Bearer '+ lsh['token'],
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({jobs:job})
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
const putCk=(job)=>{
  const jobobjstr =JSON.stringify({job:job})
  console.log('jobobjstr: ', JSON.parse(jobobjstr))
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/jobs/ck'
    let options= {
      headers: {'Authorization': 'Bearer '+ lsh['token'],
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: jobobjstr
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
const newJob=(job)=>{
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/jobs/new'
    let options= {
      headers: {'Authorization': 'Bearer '+ lsh['token'],
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({jobs:job})
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
const deleteJob=(job)=>{
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/jobs/del'
    let options= {
      headers: {'Authorization': 'Bearer '+ lsh['token'],
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({job:job})
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

export{fetchSettings, fetchJobs, postJobs, putJob, newJob, deleteJob, putCk}