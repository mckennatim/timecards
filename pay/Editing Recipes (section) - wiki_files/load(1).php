var mediaWikiLoadStart=(new Date()).getTime(),mwPerformance=(window.performance&&performance.mark)?performance:{mark:function(){}};mwPerformance.mark('mwLoadStart');function isCompatible(str){var ua=str||navigator.userAgent;return!!('querySelector'in document&&'localStorage'in window&&'addEventListener'in window&&!(ua.match(/webOS\/1\.[0-4]/)||ua.match(/PlayStation/i)||ua.match(/SymbianOS|Series60|NetFront|Opera Mini|S40OviBrowser|MeeGo/)||(ua.match(/Glass/)&&ua.match(/Android/))));}(function(){var NORLQ,script;if(!isCompatible()){document.documentElement.className=document.documentElement.className.replace(/(^|\s)client-js(\s|$)/,'$1client-nojs$2');NORLQ=window.NORLQ||[];while(NORLQ.length){NORLQ.shift()();}window.NORLQ={push:function(fn){fn();}};window.RLQ={push:function(){}};return;}function startUp(){mw.config=new mw.Map(true);mw.loader.addSource({"local":"/load.php"});mw.loader.register([["site","0u6b2uj",[1]],["site.styles","0qo4px9",[],"site"],["noscript","1nssvu0",[],"noscript"
],["filepage","0z3qar3"],["user.groups","1dcvlul",[5]],["user","1kgd5qb",[6],"user"],["user.styles","1g47oyd",[],"user"],["user.cssprefs","09p30q0",[],"private"],["user.defaults","1kqm45t"],["user.options","0j3lz3q",[8],"private"],["user.tokens","1588muf",[],"private"],["mediawiki.language.data","0msaucq",[179]],["mediawiki.skinning.elements","06xwr7o"],["mediawiki.skinning.content","05xjnpl"],["mediawiki.skinning.interface","10t8emc"],["mediawiki.skinning.content.parsoid","009245c"],["mediawiki.skinning.content.externallinks","1a0tqf4"],["jquery.accessKeyLabel","0ec2sue",[27,136]],["jquery.appear","1x6kb3i"],["jquery.arrowSteps","15venzr"],["jquery.async","0tfg5hk"],["jquery.autoEllipsis","04tifck",[39]],["jquery.badge","1p1fzrv",[176]],["jquery.byteLength","16jrjhz"],["jquery.byteLimit","0llmf46",[23]],["jquery.checkboxShiftClick","0qn0zbk"],["jquery.chosen","0xobir2"],["jquery.client","0wumtyz"],["jquery.color","0j0e34u",[29]],["jquery.colorUtil","06ci84m"],["jquery.confirmable",
"0xpmmvr",[180]],["jquery.cookie","0ov8iad"],["jquery.expandableField","0ower32"],["jquery.farbtastic","1xgacq9",[29]],["jquery.footHovzer","0l37osx"],["jquery.form","12ml2ok"],["jquery.fullscreen","1gjq6vc"],["jquery.getAttrs","033ukdj"],["jquery.hidpi","0ol0q4w"],["jquery.highlightText","1fu6vzo",[251,136]],["jquery.hoverIntent","0d9xl8c"],["jquery.i18n","0of0bn1",[178]],["jquery.localize","03ym378"],["jquery.makeCollapsible","114hsot"],["jquery.mockjax","1kgcgd3"],["jquery.mw-jump","0vpnn2d"],["jquery.mwExtension","0hsqa91"],["jquery.placeholder","1i9rxt2"],["jquery.qunit","0mdfzqp"],["jquery.qunit.completenessTest","0fi6kqh",[48]],["jquery.spinner","1edo60q"],["jquery.jStorage","023k7c8",[94]],["jquery.suggestions","0rupzz7",[39]],["jquery.tabIndex","13m6vuy"],["jquery.tablesorter","02kah1y",[251,136,181]],["jquery.textSelection","08fwquj",[27]],["jquery.throttle-debounce","1pw41dt"],["jquery.xmldom","18b234e"],["jquery.tipsy","1terixi"],["jquery.ui.core","1cjcn2z",[60],"jquery.ui"
],["jquery.ui.core.styles","0vo4q7g",[],"jquery.ui"],["jquery.ui.accordion","0vg2ozh",[59,79],"jquery.ui"],["jquery.ui.autocomplete","0za4my8",[68],"jquery.ui"],["jquery.ui.button","1ajrfbm",[59,79],"jquery.ui"],["jquery.ui.datepicker","0y7zvma",[59],"jquery.ui"],["jquery.ui.dialog","0e10vfy",[63,66,70,72],"jquery.ui"],["jquery.ui.draggable","1y7x6td",[59,69],"jquery.ui"],["jquery.ui.droppable","0ir5pi0",[66],"jquery.ui"],["jquery.ui.menu","0xoasez",[59,70,79],"jquery.ui"],["jquery.ui.mouse","1vgac2d",[79],"jquery.ui"],["jquery.ui.position","0d8w0a2",[],"jquery.ui"],["jquery.ui.progressbar","1iork95",[59,79],"jquery.ui"],["jquery.ui.resizable","1wrkci9",[59,69],"jquery.ui"],["jquery.ui.selectable","0h2bolv",[59,69],"jquery.ui"],["jquery.ui.slider","0c4arh7",[59,69],"jquery.ui"],["jquery.ui.sortable","1rq57cz",[59,69],"jquery.ui"],["jquery.ui.spinner","0tz877v",[63],"jquery.ui"],["jquery.ui.tabs","18gohr8",[59,79],"jquery.ui"],["jquery.ui.tooltip","1m0g9x0",[59,70,79],"jquery.ui"],[
"jquery.ui.widget","0302yb8",[],"jquery.ui"],["jquery.effects.core","1oczxjk",[],"jquery.ui"],["jquery.effects.blind","1xcs6hp",[80],"jquery.ui"],["jquery.effects.bounce","0bcgyfn",[80],"jquery.ui"],["jquery.effects.clip","1iu5g3m",[80],"jquery.ui"],["jquery.effects.drop","1youe4m",[80],"jquery.ui"],["jquery.effects.explode","1rsstrv",[80],"jquery.ui"],["jquery.effects.fade","0z8etlj",[80],"jquery.ui"],["jquery.effects.fold","09ucx83",[80],"jquery.ui"],["jquery.effects.highlight","0f3nl0b",[80],"jquery.ui"],["jquery.effects.pulsate","0yer6bz",[80],"jquery.ui"],["jquery.effects.scale","1rdxrlr",[80],"jquery.ui"],["jquery.effects.shake","0f5obn4",[80],"jquery.ui"],["jquery.effects.slide","0n0227j",[80],"jquery.ui"],["jquery.effects.transfer","15ub557",[80],"jquery.ui"],["json","1ruoprk",[],null,null,"return!!(window.JSON\u0026\u0026JSON.stringify\u0026\u0026JSON.parse);"],["moment","0i1s01u",[176]],["mediawiki.apihelp","187mtq6"],["mediawiki.template","1r6ggy0"],[
"mediawiki.template.mustache","0fpuvlm",[97]],["mediawiki.template.regexp","038gv68",[97]],["mediawiki.apipretty","03am1am"],["mediawiki.api","1dlf80b",[153,10]],["mediawiki.api.category","0q2zf1f",[141,101]],["mediawiki.api.edit","1gc5a8x",[141,101]],["mediawiki.api.login","0ictt5h",[101]],["mediawiki.api.options","10l7xzm",[101]],["mediawiki.api.parse","1790h1c",[101]],["mediawiki.api.upload","188mssq",[251,94,103]],["mediawiki.api.user","1xqlgzh",[101]],["mediawiki.api.watch","1lncezi",[101]],["mediawiki.api.messages","12l2o79",[101]],["mediawiki.api.rollback","151yjs7",[101]],["mediawiki.content.json","0hey5h8"],["mediawiki.confirmCloseWindow","0zlm1lc"],["mediawiki.debug","1hfd3jr",[34]],["mediawiki.diff.styles","0cbc04l"],["mediawiki.feedback","18tbydu",[141,130,260]],["mediawiki.feedlink","05s82nx"],["mediawiki.filewarning","0512ilq",[256]],["mediawiki.ForeignApi","1upqsob",[120]],["mediawiki.ForeignApi.core","0vmq29w",[101,252]],["mediawiki.helplink","0pczmgn"],[
"mediawiki.hidpi","1w4crar",[38],null,null,"return'srcset'in new Image();"],["mediawiki.hlist","0x5o41u"],["mediawiki.htmlform","02o7q60",[24,136]],["mediawiki.htmlform.ooui","0dt97ux",[256]],["mediawiki.htmlform.styles","1gr4d2z"],["mediawiki.htmlform.ooui.styles","0n3dfg6"],["mediawiki.icon","12md1gl"],["mediawiki.inspect","0yvuvca",[23,94,136]],["mediawiki.messagePoster","1tui4wj",[119]],["mediawiki.messagePoster.wikitext","1e8f6hz",[103,130]],["mediawiki.notification","0xr85xu",[189]],["mediawiki.notify","1t6143p"],["mediawiki.notification.convertmessagebox","13bm67k",[132]],["mediawiki.notification.convertmessagebox.styles","0ecyjpl"],["mediawiki.RegExp","1t7fprn"],["mediawiki.pager.tablePager","0w246ct"],["mediawiki.searchSuggest","1wi0si1",[37,47,52,101]],["mediawiki.sectionAnchor","0lx2oq8"],["mediawiki.storage","0njsvh9"],["mediawiki.Title","0zv4k82",[23,153]],["mediawiki.Upload","0ghptam",[107]],["mediawiki.ForeignUpload","0dgkzyh",[119,142]],[
"mediawiki.ForeignStructuredUpload.config","1fvsh13"],["mediawiki.ForeignStructuredUpload","16vzotk",[144,143]],["mediawiki.Upload.Dialog","1tjrcjd",[147]],["mediawiki.Upload.BookletLayout","0w975xz",[142,180,151,249,95,258,260,266,267]],["mediawiki.ForeignStructuredUpload.BookletLayout","0lxflf5",[145,147,110,184,245,243]],["mediawiki.toc","1dthi4d",[157]],["mediawiki.Uri","0x95bly",[153,99]],["mediawiki.user","1wugedl",[108,157,9]],["mediawiki.userSuggest","00wbw4g",[52,101]],["mediawiki.util","0j4a6c1",[17,133]],["mediawiki.viewport","0wv29hx"],["mediawiki.checkboxtoggle","0hpb5y0"],["mediawiki.checkboxtoggle.styles","1kq3qju"],["mediawiki.cookie","0c87853",[31]],["mediawiki.toolbar","03ohowa",[55]],["mediawiki.experiments","172w0rr"],["mediawiki.action.edit","0qr5t1t",[24,55,161,101]],["mediawiki.action.edit.styles","1wo4d72"],["mediawiki.action.edit.collapsibleFooter","09ffrwo",[43,157,128]],["mediawiki.action.edit.preview","16cz6fs",[35,50,55,101,115,180]],[
"mediawiki.action.history","1ikfyos"],["mediawiki.action.history.styles","1qbdnc6"],["mediawiki.action.history.diff","0cbc04l"],["mediawiki.action.view.dblClickEdit","0j38up9",[189,9]],["mediawiki.action.view.metadata","13qqvpb"],["mediawiki.action.view.categoryPage.styles","16x2gso"],["mediawiki.action.view.postEdit","1qsaonf",[157,180,97]],["mediawiki.action.view.redirect","12gblkw",[27]],["mediawiki.action.view.redirectPage","0vqcmbi"],["mediawiki.action.view.rightClickEdit","16r5515"],["mediawiki.action.edit.editWarning","1fewlaj",[55,113,180]],["mediawiki.action.view.filepage","03jdmt9"],["mediawiki.language","16n5ctd",[177,11]],["mediawiki.cldr","0u51rya",[178]],["mediawiki.libs.pluralruleparser","0mec9r0"],["mediawiki.language.init","1l21sfb"],["mediawiki.jqueryMsg","0jm4mo7",[251,176,153,9]],["mediawiki.language.months","1tlvw78",[176]],["mediawiki.language.names","16yzhn6",[179]],["mediawiki.language.specialCharacters","06es0c8",[176]],["mediawiki.libs.jpegmeta","15ah2qj"],[
"mediawiki.page.gallery","1t8j4gy",[56,186]],["mediawiki.page.gallery.styles","0xa3nla"],["mediawiki.page.gallery.slideshow","1252gqy",[141,101,258,274]],["mediawiki.page.ready","0kolr4e",[17,25,43,45,47]],["mediawiki.page.startup","0wbfdob",[153]],["mediawiki.page.patrol.ajax","0e5ozu3",[50,141,101,189]],["mediawiki.page.watch.ajax","1a9k7jb",[109,189]],["mediawiki.page.rollback","1ph0bfz",[50,111]],["mediawiki.page.image.pagination","0burhy2",[50,153]],["mediawiki.special","0s9lemm"],["mediawiki.special.apisandbox.styles","0dgy9ak"],["mediawiki.special.apisandbox","0ijl8bx",[101,180,244,255]],["mediawiki.special.block","189yler",[153]],["mediawiki.special.changeslist","0z918kj"],["mediawiki.special.changeslist.legend","12wm0ko"],["mediawiki.special.changeslist.legend.js","1lqorao",[43,157]],["mediawiki.special.changeslist.enhanced","0hut67h"],["mediawiki.special.changeslist.visitedstatus","1r3tcl0"],["mediawiki.special.comparepages.styles","0q3wzvw"],["mediawiki.special.edittags",
"1h3qd27",[26]],["mediawiki.special.edittags.styles","1uk19zq"],["mediawiki.special.import","1dbenth"],["mediawiki.special.movePage","1wa0tc8",[241]],["mediawiki.special.movePage.styles","0zg82zu"],["mediawiki.special.pageLanguage","056a1j8",[256]],["mediawiki.special.pagesWithProp","0qtf2hn"],["mediawiki.special.preferences","03b8ptd",[113,176,134]],["mediawiki.special.userrights","1d8ln7o",[134]],["mediawiki.special.preferences.styles","10v4oe1"],["mediawiki.special.recentchanges","0f6je7q"],["mediawiki.special.search","0t1kq7n",[247]],["mediawiki.special.search.styles","1y80m8g"],["mediawiki.special.undelete","0rb8kp5"],["mediawiki.special.upload","1f06ll1",[50,141,101,113,180,184,219,97]],["mediawiki.special.upload.styles","0ukneul"],["mediawiki.special.userlogin.common.styles","1coamzu"],["mediawiki.special.userlogin.signup.styles","1t56b57"],["mediawiki.special.userlogin.login.styles","183rgp8"],["mediawiki.special.userlogin.signup.js","10rctfi",[56,101,180]],[
"mediawiki.special.unwatchedPages","1wjz42l",[141,109]],["mediawiki.special.watchlist","108lm6f"],["mediawiki.special.version","1fnlgxn"],["mediawiki.legacy.config","1bcbx3y"],["mediawiki.legacy.commonPrint","1e0jplk"],["mediawiki.legacy.protect","0pn0fcg",[24]],["mediawiki.legacy.shared","0jvyeh3"],["mediawiki.legacy.oldshared","1h59hol"],["mediawiki.legacy.wikibits","1o25dvv",[153]],["mediawiki.ui","0dpypuc"],["mediawiki.ui.checkbox","0x70ckf"],["mediawiki.ui.radio","0zmc3pk"],["mediawiki.ui.anchor","10fd6ij"],["mediawiki.ui.button","19sxviv"],["mediawiki.ui.input","0ezt1e0"],["mediawiki.ui.icon","0vqd64z"],["mediawiki.ui.text","16n235y"],["mediawiki.widgets","08yfn03",[21,24,141,101,242,258]],["mediawiki.widgets.styles","06ohdf6"],["mediawiki.widgets.DateInputWidget","0x9c4pq",[95,258]],["mediawiki.widgets.datetime","0wuxztx",[256]],["mediawiki.widgets.CategorySelector","0qt01ue",[119,141,258]],["mediawiki.widgets.UserInputWidget","0wn5jrs",[258]],[
"mediawiki.widgets.SearchInputWidget","1xxsuum",[138,241]],["mediawiki.widgets.SearchInputWidget.styles","08dbsba"],["mediawiki.widgets.StashedFileWidget","00niss4",[256]],["es5-shim","0vhs4xm",[],null,null,"return(function(){'use strict';return!this\u0026\u0026!!Function.prototype.bind;}());"],["dom-level2-shim","095zag0",[],null,null,"return!!window.Node;"],["oojs","1dthait",[250,94]],["mediawiki.router","186uzt2",[254]],["oojs-router","0qkgw3u",[252]],["oojs-ui","1dcvlul",[259,258,260]],["oojs-ui-core","0tjexzm",[176,252,257,261,262,263]],["oojs-ui-core.styles","0n46cfr"],["oojs-ui-widgets","1g8cyeg",[256]],["oojs-ui-toolbars","1vbiepd",[256]],["oojs-ui-windows","1vmldq3",[256]],["oojs-ui.styles.icons","1e2nlwq"],["oojs-ui.styles.indicators","09f3uk6"],["oojs-ui.styles.textures","1ea726i"],["oojs-ui.styles.icons-accessibility","1r5xnv8"],["oojs-ui.styles.icons-alerts","0evpz85"],["oojs-ui.styles.icons-content","1mm5b7x"],["oojs-ui.styles.icons-editing-advanced","0zpjirq"],[
"oojs-ui.styles.icons-editing-core","0suylwa"],["oojs-ui.styles.icons-editing-list","03x3nh7"],["oojs-ui.styles.icons-editing-styling","1ooi1km"],["oojs-ui.styles.icons-interactions","1d547p6"],["oojs-ui.styles.icons-layout","14inefi"],["oojs-ui.styles.icons-location","1a5lqea"],["oojs-ui.styles.icons-media","1jrngtd"],["oojs-ui.styles.icons-moderation","1rmpr3j"],["oojs-ui.styles.icons-movement","08b59by"],["oojs-ui.styles.icons-user","1x8gpmc"],["oojs-ui.styles.icons-wikimedia","01p8uhi"],["skins.cologneblue","1itvwme"],["skins.modern","132h9sd"],["skins.monobook.styles","0x1qawu"],["skins.vector.styles","02ueu2q"],["skins.vector.styles.responsive","0fr3ugo"],["skins.vector.js","00sgxl9",[53,56]],["skins.minerva.base.reset","1xxvcaz"],["skins.minerva.base.styles","148bvk1"],["skins.minerva.content.styles","1sk6hw4"],["mobile.pagelist.styles","1wnbs7n"],["mobile.pagesummary.styles","0mbcqxm"],["skins.minerva.tablet.styles","1di56iw"],["skins.minerva.icons.images","132tyi9"],[
"skins.minerva.icons.images.variants","08wtxpl"],["mobile.overlay.images","1y0uox0"],["mobile.issues.images","1rya6my"],["mobile.toc.images","1bsjksy"],["mobile.references.images","0hfwtjy"],["skins.minerva.icons.images.scripts","0fbj3nk"],["skins.minerva.footerV2.styles","1ex4shg"],["skins.minerva.mainPage.styles","0mt6y51"],["skins.minerva.userpage.styles","0ifwt8s"],["mobile.modules","1pnwh1o",[252]],["mobile.oo","0z3g7fg",[301]],["mobile.view","0rmhn4m",[302]],["mobile.context","183bj70",[301]],["mobile.browser","10qtfv7",[303]],["mobile.mainMenu.icons","1df4w5q"],["mobile.mainMenu","11fc36q",[305,390,306,310]],["mobile.messageBox","15w4y5c",[303,310]],["mobile.modifiedBar","0k70ct4",[180,301]],["mediawiki.template.hogan","1ukm918",[97]],["mobile.pagelist","12gyhfi",[305,288,289,310]],["mobile.pagelist.scripts","0wotvm4",[311,342]],["mobile.watchlist","1q8gknu",[349,312]],["mobile.toc","11w97bn",[295,340]],["mobile.ajax","1ijb7k0"],["mobile.settings","0pncw4x",[31,140,301]],[
"mobile.backtotop","1g42u51",[340]],["mobile.startup","1l3yied",[56,154,305,304,309,316,320,310]],["mobile.foreignApi","13vjudv",[120,318]],["mobile.user","1pqivrr",[140,151,301]],["mobile.abusefilter","002qamz",[334]],["mobile.editor.api","0zn8sg6",[318]],["mobile.editor.common","0zk9kqc",[113,322,389,308,336,255]],["mobile.editor.overlay","1lkwjqu",[132,321,323,268]],["mobile.search.images","14kz0xl"],["mobile.search","125cgfo",[391,312,325]],["mobile.search.util","16o8zo9",[318]],["mobile.search.api","1dggtjn",[141,327]],["mobile.talk.overlays","13b376v",[236,323]],["mobile.mediaViewer","1rs5uu1",[334,332]],["mobile.mediaViewer.beta","0h7m2bg",[330,350]],["mobile.swipe.images","10tizpq"],["mobile.categories.overlays","1lbu2xd",[323,349,326,328]],["mobile.overlays","05vsw64",[315,293,318]],["mobile.drawers","12y8i20",[334]],["mobile.toast","1sa5u29",[335]],["mobile.references","1itcrnb",[335,322,338,296]],["mobile.references.gateway","1o2yga2",[339,302]],["mobile.cache","1ojj4fz",[
301]],["mobile.toggle","1irtw8h",[318,292]],["mobile.pointerOverlay","0ugqacl",[334]],["mobile.watchstar","0qoi5ll",[327,336]],["mobile.languages.structured","09z666v",[334]],["mobile.issues","0x3hmk2",[294,334]],["mobile.nearby","1ts8jhn",[319,308,312,352]],["mobile.gallery","19y6myn",[349,336]],["mobile.betaoptin","0j478kc",[159,318]],["mobile.fontchanger","1mbbi7g",[335]],["mobile.infiniteScroll","1ilfl1a",[302]],["mobile.swipe","121j17t",[302]],["mobile.patrol.ajax","1xg3eyn",[141,336]],["mobile.special.nearby.styles","18bv42l"],["mobile.special.userlogin.scripts","06vnwm5"],["mobile.special.nearby.scripts","0n8pe56",[150,253,345]],["mobile.special.uploads.scripts","0w46797",[346]],["skins.minerva.scripts","1qslxrk",[253,347,344,337,326,357]],["skins.minerva.scripts.top","0gin04t",[307]],["skins.minerva.newusers","05v892v",[341,359]],["skins.minerva.editor","0xupv3e",[238,389,297,362]],["skins.minerva.categories","1d29iks",[356]],["skins.minerva.talk","1dcx2oa",[141,297,356]],[
"skins.minerva.toggling","11mkwss",[340,356]],["skins.minerva.watchstar","0eoga2z",[297,356]],["skins.minerva.beta.scripts","0jwtqhh",[317,319,356]],["skins.minerva.tablet.scripts","0oe5w6b",[314]],["ext.pygments","0tzmjyx"],["ext.geshi.visualEditor","0k84svk",["ext.visualEditor.mwcore"]],["ext.score.visualEditor","0d5t88q",["ext.visualEditor.mwcore"]],["ext.tmh.thumbnail.styles","0466new"],["ext.tmh.transcodetable","0mtohqc",[103,255]],["ext.tmh.TimedTextSelector","1e7r6rh"],["ext.tmh.OgvJsSupport","11grrk7"],["ext.tmh.OgvJs","1hyi7el",[372]],["embedPlayerIframeStyle","1o1z21w"],["mw.PopUpMediaTransform","1qjmeti",[141,392,376]],["mw.PopUpMediaTransform.styles","0nz8qse"],["mw.TMHGalleryHook.js","09noqxl"],["ext.tmh.embedPlayerIframe","0fgoco2",[409,392]],["mw.MediaWikiPlayerSupport","1jhltdz",[408,392]],["mw.MediaWikiPlayer.loader","1bx6dk4",[410,429]],["ext.tmh.video-js","083e6zb"],["ext.tmh.videojs-ogvjs","0dwjmi1",[373,381]],["ext.tmh.videojs-resolution-switcher","1iqhz10",[381]],
["ext.tmh.videojs-responsive-layout","11bkzjo",[381]],["ext.tmh.videojs-replay","06qwukv",[381]],["ext.tmh.mw-info-button","0srgm9z",[381]],["ext.tmh.player","1kvldhl",[372,386,385,383,384]],["ext.tmh.player.styles","09pv94i"],["mobile.loggingSchemas.edit","1dcvlul"],["mobile.loggingSchemas.mobileWebMainMenuClickTracking","1dcvlul"],["mobile.loggingSchemas.mobileWebSearch","1dcvlul"],["mw.MwEmbedSupport","1yfmeho",[393,395,405,404,396]],["Spinner","15y4dlc",[153]],["iScroll","115ghg2"],["jquery.loadingSpinner","1lv6efm"],["mw.MwEmbedSupport.style","0dowxph"],["mediawiki.UtilitiesTime","0rlvzet"],["mediawiki.client","1rq8akb"],["mediawiki.absoluteUrl","1m73kua"],["mw.ajaxProxy","1ht2ojo"],["fullScreenApi","0vjixgl"],["jquery.embedMenu","1hy9d8t"],["jquery.ui.touchPunch","1gzo538",[59,69]],["jquery.triggerQueueCallback","02d6r62"],["jquery.mwEmbedUtil","0hv72qn"],["jquery.debouncedresize","11sq6j1"],["mw.Language.names","0cjim6x"],["mw.Api","164ncsh"],["jquery.embedPlayer","03keh9c"],[
"mw.EmbedPlayer.loader","19tm6we",[409]],["mw.MediaElement","1vuatob",[372]],["mw.MediaPlayer","1t4aky4"],["mw.MediaPlayers","0xmqnjf",[412]],["mw.MediaSource","05o7exg",[392]],["mw.EmbedTypes","11eejyg",[150,413]],["mw.EmbedPlayer","0fhtv73",[401,31,406,402,40,74,403,397,399,398,180,419,415,411,414,425]],["mw.EmbedPlayerKplayer","0hc9b7c"],["mw.EmbedPlayerGeneric","0qiguim"],["mw.EmbedPlayerNative","0tokpga"],["mw.EmbedPlayerVLCApp","0z1pz21",[150]],["mw.EmbedPlayerIEWebMPrompt","0fou1x4"],["mw.EmbedPlayerOgvJs","1xs3oha",[372,50]],["mw.EmbedPlayerImageOverlay","0l1iqd2"],["mw.EmbedPlayerVlc","10toy4r"],["mw.PlayerSkinKskin","0vd2h9g"],["mw.PlayerSkinMvpcf","0nnrwl6"],["mw.TimedText","1br0a0m",[416,428]],["mw.TextSource","0v6ukgn",[397,400]],["mw.TimedText.loader","1vmzryt"]]);;mw.config.set({"wgLoadScript":"/load.php","debug":!1,"skin":"monobook","stylepath":"/skins","wgUrlProtocols":
"bitcoin\\:|ftp\\:\\/\\/|ftps\\:\\/\\/|geo\\:|git\\:\\/\\/|gopher\\:\\/\\/|http\\:\\/\\/|https\\:\\/\\/|irc\\:\\/\\/|ircs\\:\\/\\/|magnet\\:|mailto\\:|mms\\:\\/\\/|news\\:|nntp\\:\\/\\/|redis\\:\\/\\/|sftp\\:\\/\\/|sip\\:|sips\\:|sms\\:|ssh\\:\\/\\/|svn\\:\\/\\/|tel\\:|telnet\\:\\/\\/|urn\\:|worldwind\\:\\/\\/|xmpp\\:|\\/\\/","wgArticlePath":"/index.php?title=$1","wgScriptPath":"","wgScriptExtension":".php","wgScript":"/index.php","wgSearchType":null,"wgVariantArticlePath":!1,"wgActionPaths":{},"wgServer":"http://wiki.sitebuilt.net","wgServerName":"wiki.sitebuilt.net","wgUserLanguage":"en","wgContentLanguage":"en","wgTranslateNumerals":!0,"wgVersion":"1.28.0","wgEnableAPI":!0,"wgEnableWriteAPI":!0,"wgMainPageTitle":"Main Page","wgFormattedNamespaces":{"-2":"Media","-1":"Special","0":"","1":"Talk","2":"User","3":"User talk","4":"Wiki","5":"Wiki talk","6":"File","7":"File talk","8":"MediaWiki","9":"MediaWiki talk","10":"Template","11":"Template talk","12":"Help","13":"Help talk"
,"14":"Category","15":"Category talk","710":"TimedText","711":"TimedText talk"},"wgNamespaceIds":{"media":-2,"special":-1,"":0,"talk":1,"user":2,"user_talk":3,"wiki":4,"wiki_talk":5,"file":6,"file_talk":7,"mediawiki":8,"mediawiki_talk":9,"template":10,"template_talk":11,"help":12,"help_talk":13,"category":14,"category_talk":15,"timedtext":710,"timedtext_talk":711,"image":6,"image_talk":7,"project":4,"project_talk":5},"wgContentNamespaces":[0],"wgSiteName":"wiki","wgDBname":"sitebuil_wikidb","wgExtraSignatureNamespaces":[],"wgAvailableSkins":{"cologneblue":"CologneBlue","modern":"Modern","monobook":"MonoBook","vector":"Vector","minerva":"Minerva","fallback":"Fallback","apioutput":"ApiOutput"},"wgExtensionAssetsPath":"/extensions","wgCookiePrefix":"sitebuil_wikidb_sb_","wgCookieDomain":"","wgCookiePath":"/","wgCookieExpiration":15552000,"wgResourceLoaderMaxQueryLength":2000,"wgCaseSensitiveNamespaces":[],"wgLegalTitleChars":" %!\"$&'()*,\\-./0-9:;=?@A-Z\\\\\\^_`a-z~+\\u0080-\\uFFFF",
"wgIllegalFileChars":":/\\\\","wgResourceLoaderStorageVersion":1,"wgResourceLoaderStorageEnabled":!0,"wgResourceLoaderLegacyModules":[],"wgForeignUploadTargets":["local"],"wgEnableUploads":!0,"wgMFSearchAPIParams":{"ppprop":"displaytitle"},"wgMFQueryPropModules":["pageprops"],"wgMFSearchGenerator":{"name":"prefixsearch","prefix":"ps"},"wgMFNearbyEndpoint":"","wgMFThumbnailSizes":{"tiny":80,"small":150},"wgMFContentNamespace":0,"wgMFEditorOptions":{"anonymousEditing":!0,"skipPreview":!1},"wgMFLicense":{"msg":"mobile-frontend-copyright","link":"","plural":1},"wgMFSchemaEditSampleRate":0.0625,"wgMFExperiments":{"betaoptin":{"name":"betaoptin","enabled":!1,"buckets":{"control":0.97,"A":0.03}}},"wgMFIgnoreEventLoggingBucketing":!1,"wgMFEnableJSConsoleRecruitment":!1,"wgMFPhotoUploadEndpoint":"","wgMFDeviceWidthTablet":"720px","wgMFCollapseSectionsByDefault":!0,"EmbedPlayer.DirectFileLinkWarning":!0,"EmbedPlayer.EnableOptionsMenu":!0,
"EmbedPlayer.DisableHTML5FlashFallback":!0,"TimedText.ShowInterface":"always","TimedText.ShowAddTextLink":!0,"EmbedPlayer.WebPath":"/extensions/TimedMediaHandler/MwEmbedModules/EmbedPlayer","AjaxRequestTimeout":30,"MediaWiki.DefaultProvider":"local","MediaWiki.ApiProviders":{"wikimediacommons":{"url":"//commons.wikimedia.org/w/api.php"}},"MediaWiki.ApiPostActions":["login","purge","rollback","delete","undelete","protect","block","unblock","move","edit","upload","emailuser","import","userrights"],"EmbedPlayer.OverlayControls":!0,"EmbedPlayer.CodecPreference":["vp9","webm","h264","ogg","mp3"],"EmbedPlayer.DisableVideoTagSupport":!1,"EmbedPlayer.ReplaceSources":null,"EmbedPlayer.EnableFlavorSelector":!1,"EmbedPlayer.EnableIpadHTMLControls":!0,"EmbedPlayer.WebKitPlaysInline":!1,"EmbedPlayer.EnableIpadNativeFullscreen":!1,"EmbedPlayer.iPhoneShowHTMLPlayScreen":!0,"EmbedPlayer.ForceLargeReplayButton":!1,"EmbedPlayer.LibraryPage":
"http://www.kaltura.org/project/HTML5_Video_Media_JavaScript_Library","EmbedPlayer.RewriteSelector":"video,audio,playlist","EmbedPlayer.DefaultSize":"400x300","EmbedPlayer.ControlsHeight":31,"EmbedPlayer.TimeDisplayWidth":85,"EmbedPlayer.KalturaAttribution":!0,"EmbedPlayer.AttributionButton":{"title":"Kaltura html5 video library","href":"http://www.kaltura.com","class":"kaltura-icon","style":[],"iconurl":!1},"EmbedPlayer.EnableRightClick":!0,"EmbedPlayer.EnabledOptionsMenuItems":["playerSelect","download","share","aboutPlayerLibrary"],"EmbedPlayer.WaitForMeta":!0,"EmbedPlayer.ShowNativeWarning":!0,"EmbedPlayer.ShowPlayerAlerts":!0,"EmbedPlayer.EnableFullscreen":!0,"EmbedPlayer.EnableTimeDisplay":!0,"EmbedPlayer.EnableVolumeControl":!0,"EmbedPlayer.NewWindowFullscreen":!1,"EmbedPlayer.FullscreenTip":!0,"EmbedPlayer.FirefoxLink":"http://www.mozilla.com/en-US/firefox/upgrade.html?from=mwEmbed","EmbedPlayer.NativeControls":!1,
"EmbedPlayer.NativeControlsMobileSafari":!0,"EmbedPlayer.FullScreenZIndex":999998,"EmbedPlayer.ShareEmbedMode":"iframe","EmbedPlayer.SkinList":["mvpcf","kskin"],"EmbedPlayer.DefaultSkin":"mvpcf","EmbedPlayer.MonitorRate":250,"EmbedPlayer.UseFlashOnAndroid":!1,"EmbedPlayer.EnableURLTimeEncoding":"flash","EmbedPLayer.IFramePlayer.DomainWhiteList":"*","EmbedPlayer.EnableIframeApi":!0,"EmbedPlayer.PageDomainIframe":!0,"EmbedPlayer.NotPlayableDownloadLink":!0,"EmbedPlayer.BlackPixel":"data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%01%00%00%00%01%08%02%00%00%00%90wS%DE%00%00%00%01sRGB%00%AE%CE%1C%E9%00%00%00%09pHYs%00%00%0B%13%00%00%0B%13%01%00%9A%9C%18%00%00%00%07tIME%07%DB%0B%0A%17%041%80%9B%E7%F2%00%00%00%19tEXtComment%00Created%20with%20GIMPW%81%0E%17%00%00%00%0CIDAT%08%D7c%60%60%60%00%00%00%04%00%01'4'%0A%00%00%00%00IEND%AEB%60%82","TimedText.ShowRequestTranscript":!1,"TimedText.NeedsTranscriptCategory":"Videos needing subtitles","TimedText.BottomPadding":10,
"TimedText.BelowVideoBlackBoxHeight":40});var RLQ=window.RLQ||[];while(RLQ.length){RLQ.shift()();}window.RLQ={push:function(fn){fn();}};window.NORLQ={push:function(){}};}script=document.createElement('script');script.src="/load.php?debug=false&lang=en&modules=jquery%2Cmediawiki&only=scripts&skin=monobook&version=0lgappu";script.onload=script.onreadystatechange=function(){if(!script.readyState||/loaded|complete/.test(script.readyState)){script.onload=script.onreadystatechange=null;script=null;startUp();}};document.getElementsByTagName('head')[0].appendChild(script);}());