import React from 'react'
import ReactDOM from 'react-dom'
var moment = require('moment');
import {ls} from '../utilities/getCfg'

// var lsh = ls.getItem()

const geta=(dotstr, obj)=>{
  return dotstr.split(".")
    .slice(1)
    .reduce((xs,x)=>(xs && xs[x]) ? xs[x] : null , obj)
}

const deepObjModify=(dotstr, val, obj)=>{
  if(geta(dotstr, obj)){
    var keyarray = dotstr.split(".")
    var ls = keyarray.slice(-1)[0]
    keyarray
      .slice(1) 
      .reduce((xs,x)=>{
        if(xs && xs[x]) {
          if(x==ls){
            xs[x]=val
          }
          return xs[x]
        }
      }, obj)
    let newobj = {...obj}
    return newobj
  } else {
    return null
  }
}

const log = console.log.bind(console);

function el(id){
  return document.getElementById(id)
}

const dog = ()=>{
  return 'girl'
}

const render = (pg, para)=>{
  ReactDOM.render(React.createElement(pg, para), document.getElementById('rt')) 
}

const parseQuery = (query)=>{
  var obj = {};
  query.split('&')
    .map((term)=>{
      var ar = term.split('=')
      obj[ar[0]]=ar[1]
    }
  )
  return obj
}
const drnd=(n)=>{
  return Math.round(n*100)/100
}

const processDb4app =(res)=>{
  const wprt = res.wkarr[0].wdprt.slice(0,-2)
  if(!res.wstat){
    res.wstat = {wprt:wprt}
  }
  const wkarr = wkendLast(adjWk4app(ls.getKey('firstday'), res.wkarr))
  const hrs= sumThing(wkarr, 'hrs')
  const jchrs= sumThing(wkarr, 'jchrs')
  return {wkarr, hrs, jchrs, emailid:ls.getKey('email'), jobs:res.jobs, wstat:res.wstat, wprt:wprt}
}

const adjDay4db = (firstday, rec)=>{
  let d = {...rec}
  if (firstday!=1 && d.wdprt.slice(-1)>=firstday){
    console.log('it is greater: ')
    d.wdprt= moment(d.wdprt).add(7, "days").format("YYYY-[W]WW-E")
  }
  return d
}

export {geta, dog, render, log, parseQuery, el, deepObjModify, drnd, processDb4app, adjDay4db}  

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



const adjWk4app =(firstday, wkarr)=>{
  let appwkarr= wkarr
    .map((d)=>{
      if (firstday!=1 && d.wdprt.slice(-1)>=firstday){
        d.wdprt= moment(d.wdprt).subtract(7, "days").format("YYYY-[W]WW-E")
      }
      return d
    })
    .sort((a,b)=>{
      //console.log( b.wdprt, '>', a.wdprt, '=', a.wdprt < b.wdprt)
      return a.wdprt < b.wdprt ? -1 : 1
    })
  return appwkarr
}

