import{d as c,u as m,o as n,b as s,h as i,g as e,t as d,f as o,X as r,F as l}from"./app.0349bd01.js";const f={key:0,class:"post-draft-icon",title:"draft"},u=e("div",{"i-ri-draft-line":""},null,-1),_=[u],h={key:1,class:"post-top-icon"},v=e("div",{"i-ri-pushpin-line":""},null,-1),y=[v],k={key:2,class:"post-meta justify-center",flex:"~",text:"sm"},p={key:0,class:"post-time flex items-center"},x=e("div",{class:"inline-block","i-ri-calendar-line":""},null,-1),g=["title"],B=e("span",{m:"x-2"},"-",-1),b=e("div",{"i-ri-calendar-2-line":""},null,-1),C=["title"],N=c({__name:"YunPostMeta",props:{frontmatter:null},setup(t){const{t:a}=m();return(D,F)=>(n(),s(l,null,[t.frontmatter.draft?(n(),s("div",f,_)):i("v-if",!0),t.frontmatter.top?(n(),s("div",h,y)):i("v-if",!0),t.frontmatter?(n(),s("div",k,[t.frontmatter.date?(n(),s("div",p,[x,e("time",{m:"l-1",title:o(a)("post.posted")},d(o(r)(t.frontmatter.date)),9,g),t.frontmatter.updated&&t.frontmatter.updated!==t.frontmatter.date?(n(),s(l,{key:0},[B,b,e("time",{m:"l-1",title:o(a)("post.edited")},d(o(r)(t.frontmatter.updated)),9,C)],64)):i("v-if",!0)])):i("v-if",!0)])):i("v-if",!0)],64))}});export{N as _};
