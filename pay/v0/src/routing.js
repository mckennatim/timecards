import Navigo from 'navigo';
import { switchPage} from './actions/responsive';
// import { on } from 'cluster';
var routes = [
  {path: 'pay', page: 'Pay'},
  {path: 'help', page: 'Help'},
  {path: 'jobcosts', page: 'JobCosts'},
  {path: 'taxes', page: 'Taxes'},
  {path: '*', page: 'Pay'},
]
const makeRouter = (routes)=>{
  const onrt = routes.reduce((acc,rt)=>{
    acc[rt.path]=(params,query)=>{switchPage({name: rt.page, params: {...params, query: query}});}
    return acc
  }, {})
  return onrt
}

const rts = makeRouter(routes)
console.log('rts: ', rts)

var router

const routing = ()=>{
  // const cfg ={root: 'http://10.0.1.233/spa/admin/dist/', useHash: true}
  const cfg ={root: null, useHash: true}
  router = new Navigo(cfg.root, cfg.useHash);
  router
    .on(rts)
    .resolve();
  return router
}

export {routing, routes}

    // .on({
    //   'products': ()=> {switchPage({name: 'Products', params: null});} ,
    //   'products/:id': (params)=>{switchPage({name: 'Products', params: params});},
    //   'about': ()=>{switchPage({name: 'About', params: null});},
    //   'dog': ()=>{switchPage({name: 'Dog', params: null});},
    //   'cat': ()=>{switchPage({name: 'Cat', params: null});},
    //   'pay': (params,query)=>{switchPage({name: 'Pay', params: {...params, query: query}});},
    //   'report?taxes': (params,query)=>{switchPage({name: 'Report', params: {...params, query: query}});},
    //   'report?jobcosts': (params,query)=>{switchPage({name: 'Report', params: {...params, query: query}});},
    //   'report': (params,query)=>{switchPage({name: 'Report', params: {...params, query: query}});},
    //   'help': (params,query)=>{switchPage({name: 'Help', params: {...params, query: query}});},
    //   'jobcosts': (params,query)=>{switchPage({name: 'JobCosts', params: {...params, query: query}});},
    //   'taxes': (params,query)=>{switchPage({name: 'Taxes', params: {...params, query: query}});},
    //   'registered': (params, query)=> {switchPage({name: 'Registered', params: {...params, query: query}});} ,
    //   '*': ()=>{switchPage({name: 'Pay', params: null});}
    // })