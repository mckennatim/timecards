import jsenv from '../../envmy.json'
import env from '../../denv.json'
import {storageLocal} from './storageLocal'

const cfg= env[jsenv.m||'local']

const authqry = cfg.url.soauth+"/spa/"+cfg.appid+"?apiURL="+encodeURIComponent(cfg.url.api)+"&cbPath="+encodeURIComponent(cfg.cbPath)

cfg.url.authqry = authqry

const ls = storageLocal(cfg.appid)

export{ls, cfg}
