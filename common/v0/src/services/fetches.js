import {ls, cfg} from '../utilities/getCfg'
import {geta} from '../utilities/wfuncs'

const fetchHelp=(appid)=>{
  console.log('in fetch help')
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

const putVote=(appid,vote)=>{
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

const putHelpAns=(appid, ans)=>{
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
const putHelpQues=(appid,ques)=>{
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

const delHelp=(appid, id, qa)=>{
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/common/help/del/'+appid+'/'+qa+'/'+id  
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


export {fetchHelp, putHelpAns, putHelpQues, delHelp, putVote}

// import {ls, cfg} from '../utilities/getCfg'
// import {geta} from '../utilities/wfuncs'

// const fetchCoids=(mobj)=>{
//   if(geta('mobj.token', mobj)){
//     let url= cfg.url.api+'/reg/coids'
//     let options= {headers: {'Authorization': 'Bearer '+ mobj.token}}
//     return(
//       fetch(url, options)
//         .then((response)=>response.json())
//         .then((json)=>{
//           console.log('json: ', json)
//           if(json.message){
//             return {qmessage: json.message}
//           }else{
//             return json
//           }
//         })
//         .catch((e)=>{
//           return {qmessage: e.message}
//         })
//       )         
//   }else{
//     let p2 =Promise.resolve({qmessage:'you dont exist! '})
//     return p2
//   }
// }
// const fetchCtoken=(token, co)=>{
//   if(token){
//     let url= cfg.url.api+'/reg/ctoken/'+co.coid+'/'+co.role
//     console.log('url: ', url)
//     let options= {headers: {'Authorization': 'Bearer '+ token}}
//     return(
//       fetch(url, options)
//         .then((response)=>response.json())
//         .then((json)=>{
//           if(json.message){
//             return {qmessage: json.message}
//           }else{
//             return json
//           }
//         })
//         .catch((e)=>{
//           return {qmessage: e.message}
//         })
//       )         
//   }else{
//     let p2 =Promise.resolve({qmessage:'you dont exist! '})
//     return p2
//   }
// }

// const fetchSettings=()=>{
//   var lsh = ls.getItem();
//   if(geta('lsh.token', lsh)){
//     let url= cfg.url.api+'/payroll/settings'
//     let options= {headers: {'Authorization': 'Bearer '+ lsh['token']}}
//     return(
//       fetch(url, options)
//         .then((response)=>response.json())
//         .then((json)=>{
//           if(json.message){
//             return {qmessage: json.message}
//           }else{
//             return json[0]
//           }
//         })
//         .catch((e)=>{
//           return {qmessage: e.message}
//         })
//       )         
//   }else{
//     let p2 =Promise.resolve({qmessage:'you dont exist! '})
//     return p2
//   }
// }

// const fetchTokdata=()=>{
//   var lsh = ls.getItem();
//   if(geta('lsh.token', lsh)){
//     let url= cfg.url.api+'/persons/tokdata'
//     let options= {headers: {'Authorization': 'Bearer '+ lsh['token']}}
//     return(
//       fetch(url, options)
//         .then((response)=>response.json())
//         .then((json)=>{
//           console.log('json: ', json)
//           if(json.message){
//             return {qmessage: json.message}
//           }else{
//             return json
//           }
//         })
//         .catch((e)=>{
//           return {qmessage: e.message}
//         })
//       )         
//   }else{
//     let p2 =Promise.resolve({qmessage:'you dont exist!, cant get tokdata'})
//     return p2
//   }
// }

// const fetchJobs=(wk)=>{
//   var lsh = ls.getItem();
//   if(geta('lsh.token', lsh)){
//     let url= cfg.url.api+'/jobs/list/'+wk
//     let options= {headers: {'Authorization': 'Bearer '+ lsh['token']}}
//     return(
//       fetch(url, options)
//         .then((response)=>response.json())
//         .then((json)=>{
//           if(json.message){
//             return {qmessage: json.message}
//           }else{
//             return json
//           }
//         })
//         .catch((e)=>{
//           return {qmessage: e.message}
//         })
//       )         
//   }else{
//     let p2 =Promise.resolve({qmessage:'you dont exist! '})
//     return p2
//   }
// }
// const postJobs=(jobs,wk)=>{
//   var lsh = ls.getItem();
//   console.log(jobs)
//   if(geta('lsh.token', lsh)){
//     let url= cfg.url.api+'/jobs/post/'+wk
//     let options= {
//       headers: {'Authorization': 'Bearer '+ lsh['token'],
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       method: 'POST',
//       body: JSON.stringify({jobs:jobs})
//     }  
//     return(
//       fetch(url, options)
//         .then((response)=>response.json())
//     )        
//   }else{
//     let p2 =Promise.resolve({qmessage:'you dont exist! '})
//     return p2
//   }
// }

// const putJob=(job)=>{
//   var lsh = ls.getItem();
//   if(geta('lsh.token', lsh)){
//     let url= cfg.url.api+'/jobs/update'
//     let options= {
//       headers: {'Authorization': 'Bearer '+ lsh['token'],
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       method: 'PUT',
//       body: JSON.stringify({jobs:job})
//     }  
//     return(
//       fetch(url, options)
//         .then((response)=>response.json())
//     )        
//   }else{
//     let p2 =Promise.resolve({qmessage:'you dont exist! '})
//     return p2
//   }
// }
// const newJob=(job)=>{
//   var lsh = ls.getItem();
//   if(geta('lsh.token', lsh)){
//     let url= cfg.url.api+'/jobs/new'
//     let options= {
//       headers: {'Authorization': 'Bearer '+ lsh['token'],
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       method: 'PUT',
//       body: JSON.stringify({jobs:job})
//     }  
//     return(
//       fetch(url, options)
//         .then((response)=>response.json())
//     )        
//   }else{
//     let p2 =Promise.resolve({qmessage:'you dont exist! '})
//     return p2
//   }
// }
// const deleteJob=(job)=>{
//   var lsh = ls.getItem();
//   if(geta('lsh.token', lsh)){
//     let url= cfg.url.api+'/jobs/del'
//     let options= {
//       headers: {'Authorization': 'Bearer '+ lsh['token'],
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       method: 'DELETE',
//       body: JSON.stringify({job:job})
//     }  
//     return(
//       fetch(url, options)
//         .then((response)=>response.json())
//     )        
//   }else{
//     let p2 =Promise.resolve({qmessage:'you dont exist! '})
//     return p2
//   }
// }

// export{fetchSettings, fetchJobs, postJobs, putJob, newJob, deleteJob, fetchCoids, fetchCtoken, fetchTokdata}