import{d as v,u as k,J as y,i as b,K as f,Q as i,o as a,b as r,f as e,g as o,t as n,h as l,R as s,F as x,n as C,S as w,r as T}from"./app.0349bd01.js";const F={class:"va-footer p-4 text-$va-c-text-light",text:"center sm"},V={key:0,class:"beian",m:"y-2"},$={href:"https://beian.miit.gov.cn/",target:"_blank",rel:"noopener"},B={class:"copyright flex justify-center items-center",p:"1"},H=["href","title"],N={key:1,class:"powered",m:"2"},S=["innerHTML"],Y=["href","title"],L=v({__name:"YunFooter",setup(z){const{t:p}=k(),u=y(),t=b(),m=new Date().getFullYear(),h=f(()=>m===t.value.footer.since),d=f(()=>p("footer.powered",[`<a href="${i.repository}" target="_blank" rel="noopener">Valaxy</a> v${i.version}`])),c=f(()=>t.value.footer.icon||{url:i.repository,name:"i-ri-cloud-line",title:i.name});return(g,D)=>{var _;return a(),r("footer",F,[((_=e(t).footer.beian)==null?void 0:_.enable)&&e(t).footer.beian.icp?(a(),r("div",V,[o("a",$,n(e(t).footer.beian.icp),1)])):l("v-if",!0),o("div",B,[o("span",null,[s(" \xA9 "),e(h)?l("v-if",!0):(a(),r(x,{key:0},[s(n(e(t).footer.since)+" - ",1)],64)),s(" "+n(e(m)),1)]),e(t).footer.icon?(a(),r("a",{key:0,m:"x-2",class:"inline-flex animate-pulse",href:e(c).url,target:"_blank",title:e(c).title},[o("div",{class:C(e(c).name)},null,2)],8,H)):l("v-if",!0),o("span",null,n(e(u).author.name),1)]),e(t).footer.powered?(a(),r("div",N,[o("span",{innerHTML:e(d)},null,8,S),s(" | "),o("span",null,[s(n(e(p)("footer.theme"))+" - ",1),o("a",{href:e(t).pkg.homepage,title:e(t).pkg.name,target:"_blank"},n(w(e(u).theme)),9,Y),s(" v"+n(e(t).pkg.version),1)])])):l("v-if",!0),T(g.$slots,"default")])}}});export{L as _};
