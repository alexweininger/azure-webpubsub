"use strict";(self.webpackChunkgithub_pages=self.webpackChunkgithub_pages||[]).push([[710],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>h});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),m=c(n),h=a,d=m["".concat(l,".").concat(h)]||m[h]||u[h]||i;return n?r.createElement(d,o(o({ref:t},p),{},{components:n})):r.createElement(d,o({ref:t},p))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,o[1]=s;for(var c=2;c<i;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},7582:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>u,frontMatter:()=>i,metadata:()=>s,toc:()=>c});var r=n(7462),a=(n(7294),n(3905));const i={slug:"what_is_websocket_part1",title:"What is WebSocket? (part 1/2)",authors:["JialinX","KevinG"],custom_edit_url:null},o=void 0,s={permalink:"/azure-webpubsub/blog/what_is_websocket_part1",source:"@site/blog/2022-11-14-what-is-websockets_part1/index.md",title:"What is WebSocket? (part 1/2)",description:"Summary",date:"2022-11-14T00:00:00.000Z",formattedDate:"November 14, 2022",tags:[],readingTime:2.33,hasTruncateMarker:!1,authors:[{name:"Jialin Xin",title:"Senior Software Engineer",url:"https://github.com/JialinXin",imageURL:"https://avatars.githubusercontent.com/u/15338714?v=4",key:"JialinX"},{name:"Kevin Guo",title:"Senior Product Manager",url:"https://github.com/kevinguo-ed",imageURL:"https://avatars.githubusercontent.com/u/105208143?s=400&u=9fed0cb6d3e64908d9b6b7ae9e12dcb96a0e3882&v=4",key:"KevinG"}],frontMatter:{slug:"what_is_websocket_part1",title:"What is WebSocket? (part 1/2)",authors:["JialinX","KevinG"],custom_edit_url:null},prevItem:{title:"What is WebSocket? (part 2/2)",permalink:"/azure-webpubsub/blog/what_is_websocket_part2"},nextItem:{title:"Welcome",permalink:"/azure-webpubsub/blog/welcome"}},l={authorsImageUrls:[void 0,void 0]},c=[{value:"<strong>Summary</strong>",id:"summary",level:2},{value:"<strong>Quick links</strong>",id:"quick-links",level:2},{value:"<strong>Bidirectional</strong>",id:"bidirectional",level:2}],p={toc:c};function u(e){let{components:t,...i}=e;return(0,a.kt)("wrapper",(0,r.Z)({},p,i,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"summary"},(0,a.kt)("strong",{parentName:"h2"},"Summary")),(0,a.kt)("p",null,"This article is the first of a two-part series that describes the values of WebSocket on a high-level."),(0,a.kt)("h2",{id:"quick-links"},(0,a.kt)("strong",{parentName:"h2"},"Quick links")),(0,a.kt)("p",null,"Explore a few live apps built with ",(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("a",{parentName:"strong",href:"https://learn.microsoft.com/en-us/azure/azure-web-pubsub/overview"},"\ud83d\udd17 Web PubSub")),", a fully managed WebSocket service from Azure.  "),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://azure.github.io/azure-webpubsub/demos/chat"},"\ud83d\udd17 A simple chat app"),(0,a.kt)("br",{parentName:"p"}),"\n",(0,a.kt)("a",{parentName:"p",href:"https://azure.github.io/azure-webpubsub/demos/whiteboard"},"\ud83d\udd17 A collaborative whiteboard app")," "),(0,a.kt)("blockquote",null,(0,a.kt)("p",{parentName:"blockquote"},(0,a.kt)("strong",{parentName:"p"},"Definition")),(0,a.kt)("p",{parentName:"blockquote"},"WebSocket gives developers a ",(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("em",{parentName:"strong"},"bidirectional")),", ",(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("em",{parentName:"strong"},"full-duplex"))," communication channels over HTTP through a single TCP connection ")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"})),(0,a.kt)("p",null,"Let us unpack this loaded sentence together and try to understand the italicized words (technical jargon). "),(0,a.kt)("h2",{id:"bidirectional"},(0,a.kt)("strong",{parentName:"h2"},"Bidirectional")),(0,a.kt)("p",null,"The prefix \u201cbi-\u201c means two of something. We have bicycles, two wheels. We have bifold doors, the fancy doors with two folds. In the context of computer networking, no surprise here, bidirectional means two directions."),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Picture of a bicycle, bi-fold doors and bi-directional communication in computer networking",src:n(5460).Z,width:"407",height:"1022"})),(0,a.kt)("p",null,"However, to truly understand the significance of it, we will need to talk about the interaction between applications running on different computers on a network.\xa0 In a typical client and server model, the client sends an HTTP request. Once the server receives the request, it does some processing and returns an HTTP response. Most of the activities on the web can be simplified to this request and response interaction. For example, when we visit ",(0,a.kt)("a",{parentName:"p",href:"https://www.nytimes.com/"},"www.nytimes.com"),", the browser sends an HTTP request on the user\u2019s behalf and waits for an HTTP response from its server."),(0,a.kt)("p",null,"What is relevant to our discussion here is that the client ",(0,a.kt)("strong",{parentName:"p"},"ALWAYS")," initiates the communication, in other words, the client always ",(0,a.kt)("em",{parentName:"p"},"asks")," before the server ",(0,a.kt)("em",{parentName:"p"},"responds"),". We can call this form of communication one-directional because the server cannot send data to clients that is not requested. This is the decision made by the designer of HTTP protocol, and this simple design is the technological backbone of the internet. "),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Client makes request and server responds.",src:n(7669).Z,width:"813",height:"418"})),(0,a.kt)("p",null,"As the web welcomes more and more users, they are increasingly demanding more dynamic and interactive web experience. They want to track their ridesharing car without closing and reopening the app; they want to see the latest financial data, bid in an auction, collaborate on a document all without refreshing the browser all the time. A one-directional communication becomes inadequate in these scenarios. To enable these experiences, the web needs a way for server to send data to clients without client asking. Until WebSocket was standardized in 2008 and quickly supported by modern browsers, the web was unapologetically one-directional. With a bit of uneasiness and feeling cheating, software developers came up with workarounds to mimic bidirectional communication. Hacks no more! WebSocket brings native bi-directional communication to the web."),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"WebSocket enables bi-directional communication",src:n(5627).Z,width:"813",height:"157"})),(0,a.kt)("p",null,"In the second part, we will explore the idea of \u201cfull-duplex\u201d."),(0,a.kt)("hr",null),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Credits:"),(0,a.kt)("br",{parentName:"p"}),"\n","The bicycle photograph is taken by ",(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("a",{parentName:"strong",href:"https://www.pexels.com/@luftschnitzel/"},"\ud83d\udd17 Philipp M")),".",(0,a.kt)("br",{parentName:"p"}),"\n","The bi-fold door photograph is taken by ",(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("a",{parentName:"strong",href:"https://www.pexels.com/@sena-124356903/"},"\ud83d\udd17 sena")),"."))}u.isMDXComponent=!0},5460:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/bidirectional-d4131451fdab99c761d3086d7e7efb70.jpg"},7669:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/http-04c681a1ce589e7355f3a2ca430c5082.jpg"},5627:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/websocket-723ad73776e4551687f3c4331aa77e32.jpg"}}]);