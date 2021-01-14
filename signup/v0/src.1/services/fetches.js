import {ls, cfg} from '../utilities/getCfg'
import {geta} from '../utilities/wfuncs'

const fetchCoids=(mobj)=>{
  if(geta('mobj.token', mobj)){
    let url= cfg.url.api+'/reg/coids'
    let options= {headers: {'Authorization': 'Bearer '+ mobj.token}}
    return(
      fetch(url, options)
        .then((response)=>response.json())
        .then((json)=>{
          console.log('json: ', json)
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
const fetchCtoken=(token, co)=>{
  if(token){
    let url= cfg.url.api+'/reg/ctoken/'+co.coid+'/'+co.role
    console.log('url: ', url)
    let options= {headers: {'Authorization': 'Bearer '+ token}}
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


const fetchApps=()=>{
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/reg/apps'
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
    let p2 =Promise.resolve({qmessage:'you dont exist! Try re-registering '})
    return p2
  }
}

const fetchTokdata=()=>{
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/persons/tokdata'
    let options= {headers: {'Authorization': 'Bearer '+ lsh['token']}}
    return(
      fetch(url, options)
        .then((response)=>response.json())
        .then((json)=>{
          // console.log('json: ', json)
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
    let p2 =Promise.resolve({qmessage:'you dont exist!, cant get tokdata'})
    return p2
  }
}

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
    let p2 =Promise.resolve({qmessage:'you dont exist! Try re-registering '})
    return p2
  }
}
const fetchCompany=()=>{
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/co/co/'
    let options= {headers: {'Authorization': 'Bearer '+ lsh['token']}}
    return(
      fetch(url, options)
        .then((response)=>response.json())
        .then((json)=>{
          console.log('json: ', json)
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
    let p2 =Promise.resolve({qmessage:'you do not seem to be known on this device '})
    return p2
  }
}
// const fetchCurrent=()=>{
//   var lsh = ls.getItem();
//   if(geta('lsh.token', lsh)){
//     let url= cfg.url.api+'/persons/current/'
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
//     let p2 =Promise.resolve({qmessage:'you do not seem to be known on this device '})
//     return p2
//   }
// }
const postCompany=(newco)=>{
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/co/co'
    let options= {
      headers: {'Authorization': 'Bearer '+ lsh['token'],
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({newco})
    }  
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
    )        
  }else{
    let p2 =Promise.resolve({qmessage:'you dont exist! '})
    return p2
  }
}

const postUniCoid=(co,ttoken)=>{
  console.log('ttoken: ', ttoken)
  let url= cfg.url.api+'/reg/ckcoid'
  let options= {
    headers: {'Authorization': 'Bearer '+ ttoken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({co:co})
  }  
  return(
    fetch(url, options)
      .then((response)=>response.json())
  )        
}

const putPerson=(person)=>{
  console.log('person: ', person)
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/persons/update'
    let options= {
      headers: {'Authorization': 'Bearer '+ lsh['token'],
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({person:person})
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
// const putCk=(person)=>{
//   const personobjstr =JSON.stringify({person:person})
//   console.log('personobjstr: ', JSON.parse(personobjstr))
//   var lsh = ls.getItem();
//   if(geta('lsh.token', lsh)){
//     let url= cfg.url.api+'/persons/ck'
//     let options= {
//       headers: {'Authorization': 'Bearer '+ lsh['token'],
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       method: 'PUT',
//       body: personobjstr
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
// const newPerson=(person)=>{
//   var lsh = ls.getItem();
//   if(geta('lsh.token', lsh)){
//     let url= cfg.url.api+'/persons/new'
//     let options= {
//       headers: {'Authorization': 'Bearer '+ lsh['token'],
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       method: 'PUT',
//       body: JSON.stringify({persons:person})
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
const deletePerson=(person)=>{
  var lsh = ls.getItem();
  if(geta('lsh.token', lsh)){
    let url= cfg.url.api+'/persons/del'
    let options= {
      headers: {'Authorization': 'Bearer '+ lsh['token'],
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      body: JSON.stringify({person:person})
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


//export{fetchSettings, fetchCompany, postCompany, putPerson, newPerson, deletePerson, putCk, fetchCurrent, postUniCoid, fetchApps, fetchCoids, fetchCtoken}

export{fetchSettings, fetchCompany, postCompany,  postUniCoid, fetchCoids, fetchCtoken, fetchApps, putPerson, deletePerson, fetchTokdata}