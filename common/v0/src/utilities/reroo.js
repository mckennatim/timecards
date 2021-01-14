var moment = require('moment');

const processDb4app =(firstday, emailid, res)=>{
  const wkarr = wkendLast(adjWk4app(firstday, res.wkarr))
  const hrs= sumThing(wkarr, 'hrs')
  const jchrs= sumThing(wkarr, 'jchrs')
  return {wkarr, hrs, jchrs, emailid:emailid, jobs:res.jobs, wstat:res.wstat}
}

const adjDay4db = (firstday, rec)=>{
  let d = {...rec}
  if (firstday!=1 && d.wdprt.slice(-1)>=firstday){
    console.log('it is greater: ')
    d.wdprt= moment(d.wdprt).add(7, "days").format("YYYY-[W]WW-E")
  }
  return d
}
const adjWdprtDn=(firstday, wdprt)=>{
  const mowdprt = moment(wdprt)
  let nwdprt = mowdprt.format("YYYY-[W]WW-E")
  if (firstday>4 && wdprt.slice(-1)>=firstday){
    nwdprt = mowdprt.subtract(7, "days").format("YYYY-[W]WW-E")
  }
  return nwdprt
}

const padWk= (wk)=>{
  return wk.toString().padStart(2,'0')
}

export{processDb4app, adjDay4db, adjWdprtDn, padWk}




const adjWk4app =(firstday, wkarr)=>{
  const appwkarr= wkarr
    .map((d)=>{
      if (firstday>4 && d.wdprt.slice(-1)>=firstday){
        d.wdprt= moment(d.wdprt).subtract(7, "days").format("YYYY-[W]WW-E")
      }
      return d
    })
    .sort((a,b)=>a.wdprt > b.wdprt)
  return appwkarr
}

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