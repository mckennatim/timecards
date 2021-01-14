import Navigo from 'navigo';
import { switchPage} from './actions/responsive';

var routes = [
  {path: 'signup', page: 'Splash'},
  {path: 'splash', page: 'Splash'},
  {path: 'aboutdemo', page: 'AboutDemo'},
  {path: 'about', page: 'About'},
  {path: 'help', page: 'Help'},
  {path: 'company', page: 'Company'},
  {path: 'addcompany', page: 'AddCompany'},
  {path: 'getdata', page: 'GetData'},
  {path: 'urapps', page: 'UrApps'},
  {path: 'registered', page: 'Registered'},
  {path: '*', page: 'Splash'},
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
  //const cfg ={root: 'http://10.0.1.233/spa/admin/dist/', useHash: true}
  const cfg ={root: null, useHash: true}
  router = new Navigo(cfg.root, cfg.useHash);
  router
    .on(rts)
    .resolve();
  return router
}


export {routing, routes}


// {
//   'about': ()=>{switchPage({name: 'About', params: null});},
//   'aboutdemo': ()=>{switchPage({name: 'AboutDemo', params: null});},
//   'company': (params,query)=>{switchPage({name: 'Company', params: {...params, query: query}});},
//   'blank': (params,query)=>{switchPage({name: 'Blank', params: {...params, query: query}});},
//   'xeff': (params,query)=>{switchPage({name: 'XuseEffect', params: {...params, query: query}});},
//   'addco': (params,query)=>{switchPage({name: 'AddCompany', params: {...params, query: query}});},
//   'splash': (params,query)=>{switchPage({name: 'Splash', params: {...params, query: query}});},
//   'getdata': (params,query)=>{switchPage({name: 'GetData', params: {...params, query: query}});},
//   'urapps': (params,query)=>{switchPage({name: 'UrApps', params: {...params, query: query}});},
//   'addcompany': (params,query)=>{switchPage({name: 'AddCompany', params: {...params, query: query}});},
//   'registered': (params, query)=> {switchPage({name: 'Registered', params: {...params, query: query}});} ,
//   '*': ()=>{switchPage({name: 'Splash', params: null});}
// }