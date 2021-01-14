import Navigo from 'navigo';
import { switchPage} from './actions/responsive';

var routes = [
  {path: 'jobs', page: 'Jobs'},
  {path: 'sortjob', page: 'SortJobs'},
  {path: 'about', page: 'About'},
  {path: 'help', page: 'Help'},
  {path: 'addjob', page: 'AddJob'},
  {path: '*', page: 'Jobs'},
]
const makeRouter = (routes)=>{
  const onrt = routes.reduce((acc,rt)=>{
    acc[rt.path]=(params,query)=>{switchPage({name: rt.page, params: {...params, query: query}});}
    return acc
  }, {})
  return onrt
}

const rts = makeRouter(routes)
var router

const routing = ()=>{
  const cfg ={root: null, useHash: true}
  router = new Navigo(cfg.root, cfg.useHash);
  router
    .on(rts)
    .resolve();
  return router
}


export {routing, routes}

// 'products': ()=> {switchPage({name: 'Products', params: null});} ,
// 'products/:id': (params)=>{switchPage({name: 'Products', params: params});},
// 'about': ()=>{switchPage({name: 'About', params: null});},
// 'dog': ()=>{switchPage({name: 'Dog', params: null});},
// 'cat': ()=>{switchPage({name: 'Cat', params: null});},
// 'sortjobs': ()=>{switchPage({name: 'SortJobs', params: null});},
// 'jobs': (params,query)=>{switchPage({name: 'Jobs', params: {...params, query: query}});},
// 'addjob': (params, query)=> {switchPage({name: 'AddJob', params: {...params, query: query}});},
// 'registered': (params, query)=> {switchPage({name: 'Registered', params: {...params, query: query}});} ,
// '*': ()=>{switchPage({name: 'Jobs', params: null});}