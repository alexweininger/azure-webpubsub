"use strict";(self.webpackChunkgithub_pages=self.webpackChunkgithub_pages||[]).push([[9872],{6694:(e,t,a)=>{a.d(t,{o:()=>l});let l=[{id:1,title:"Simple chat app",description:"A simple real-time chat app demonstrating the use of JavaScript server SDK",languages:[],detailURL:"demos/chat",thumbnailURL:"img/thumbnails/chat_abstract.jpeg",githubRepo:"https://github.com/Azure/azure-webpubsub/tree/main/samples/javascript/chatapp",buttonAriaLabel:"view demo of simple chat app",deployLink:"https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Flivedemopackages.blob.core.windows.net%2Ftemplate%2Fchatapp-containerapp-deploy.json"},{id:2,title:"Collaborative whiteboard",description:"Multi-user drawing on a shared whiteboard, built with Node.js",languages:[],detailURL:"demos/whiteboard",thumbnailURL:"img/thumbnails/whiteboard.jpeg",githubRepo:"https://github.com/Azure/azure-webpubsub/tree/main/samples/javascript/whiteboard",buttonAriaLabel:"view demo of collaborative whiteboard",deployLink:"https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Flivedemopackages.blob.core.windows.net%2Ftemplate%2Fwhiteboard-containerapp-deploy.json"},{id:3,title:"Metaverse",description:"Multi-player experience in Metaverse (coming soon)",languages:[],detailURL:"demos/metaverse",thumbnailURL:"img/thumbnails/metaverse.jpeg",githubRepo:"",buttonAriaLabel:"view demo of metaverse"},{id:4,title:"Code stream",description:"Real-time collaborative code editor",languages:[],detailURL:"demos/code-streaming",thumbnailURL:"img/thumbnails/code.png",githubRepo:"https://github.com/Azure/azure-webpubsub/tree/main/samples/javascript/codestream",buttonAriaLabel:"view demo of code stream",deployLink:"https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Flivedemopackages.blob.core.windows.net%2Ftemplate%2Fcodestream-containerapp-deploy.json"},{id:5,title:"Chatr",description:"Developed by Ben Coleman using Azure Web PubSub and other Azure technologies",languages:[],detailURL:"demos/chatr",thumbnailURL:"img/thumbnails/chat_closeup.jpeg",githubRepo:"https://github.com/Azure/azure-webpubsub/tree/main/samples/javascript/chatr",buttonAriaLabel:"view demo of Chatr"},{id:6,title:"Real-time scoreboard",description:"Push live game data from server to connected clients using Azure Web PubSub",languages:[],detailURL:"demos/scoreboard",thumbnailURL:"img/thumbnails/scoreboard.jpeg",githubRepo:"https://github.com/Azure/azure-webpubsub/tree/main/samples/javascript/scoreboard",deployLink:"https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Flivedemopackages.blob.core.windows.net%2Ftemplate%2Fscoreboard-deploy.json",buttonAriaLabel:"view demo of real-time scoreboard"}]},5033:(e,t,a)=>{a.d(t,{Z:()=>r});var l=a(7294);const r=function(e){let{text:t,to:a,children:r,openInNewTab:n=!0,tabIndex:o=0,ariaLabel:s=""}=e;return t=t.replace(/ /g,"\xa0"),l.createElement("a",{href:a,target:n?"_blank":"",className:"absolute bottom-4 flex items-center font-semibold justify-center rounded-sm bg-blue-600 px-5 py-2 text-sm text-gray-100 hover:bg-blue-700 gap-2",tabIndex:o,"aria-label":s,role:"button"},r&&l.createElement("div",{className:"w-5"},r),l.createElement("div",null,t))}},8665:(e,t,a)=>{a.d(t,{Z:()=>i});var l,r,n=a(7294);function o(){return o=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var l in a)Object.prototype.hasOwnProperty.call(a,l)&&(e[l]=a[l])}return e},o.apply(this,arguments)}const s=e=>{let{title:t,titleId:a,...s}=e;return n.createElement("svg",o({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16","aria-labelledby":a},s),void 0===t?n.createElement("title",{id:a},"ExternalLink"):t?n.createElement("title",{id:a},t):null,l||(l=n.createElement("path",{d:"M0 0h16v16H0z",fill:"none"})),r||(r=n.createElement("path",{d:"M12 13H4a1 1 0 0 1-1-1V4a1 1 0 0 0-2 0v8a3 3 0 0 0 3 3h8a1 1 0 0 0 0-2zm2.924-11.381A1 1 0 0 0 14 1H8.5a1 1 0 0 0 0 2h3.086L5.293 9.293a1 1 0 0 0 1.414 1.414L13 4.414V7.5a1 1 0 0 0 2 0V2a1 1 0 0 0-.076-.381z"})))};const i=function(e){let{to:t,text:a="here",openInNewTab:l=!0}=e;return n.createElement("a",{href:t,className:"font-bold text-blue-600 hover:underline",target:l?"_blank":""},a,n.createElement(s,{className:"icon_inline"}))}},7341:(e,t,a)=>{a.d(t,{Z:()=>r});var l=a(7294);const r=function(e){let{imgURL:t,ariaInfo:a="an image"}=e;return l.createElement("div",{className:"overflow-hidden pr-2 pb-2"},l.createElement("img",{src:t,className:"block w-[95%] rounded-2xl border border-gray-100 p-2 shadow-sm","aria-label":a}))}},6546:(e,t,a)=>{a.d(t,{Z:()=>o});var l=a(7294),r=a(1149),n=a(19);const o=function(e){let{overview:t,local:a,deploy:o,resources:s}=e;const[i,c]=l.useState("overview");return l.createElement("div",null,l.createElement("div",{className:"mb-8 w-full overflow-y-hidden overflow-x-scroll"},l.createElement(r.o,{"aria-label":"Details about the demo",selectedKey:i,onLinkClick:e=>{e&&c(e.props.itemKey)},headersOnly:!0},t&&l.createElement(n.M,{headerText:"Overview",itemKey:"overview"}),a&&l.createElement(n.M,{headerText:"Run locally",itemKey:"local"}),o&&l.createElement(n.M,{headerText:"One-click deploy to Azure",itemKey:"deploy"}),s&&l.createElement(n.M,{headerText:"Resources",itemKey:"resources"}))),l.createElement("div",{className:"font-sans font-light"},"overview"===i&&t,"local"===i&&a,"deploy"===i&&o,"resources"===i&&s))}},9014:(e,t,a)=>{a.d(t,{Z:()=>m});var l,r=a(7294);function n(){return n=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var l in a)Object.prototype.hasOwnProperty.call(a,l)&&(e[l]=a[l])}return e},n.apply(this,arguments)}const o=e=>{let{title:t,titleId:a,...o}=e;return r.createElement("svg",n({xmlns:"http://www.w3.org/2000/svg",width:18,height:18,viewBox:"0 0 18 18","aria-labelledby":a},o),t?r.createElement("title",{id:a},t):null,l||(l=r.createElement("path",{d:"M6.268.726h5.49a1.249 1.249 0 0 1 1.183.85l4.742 14.05a1.249 1.249 0 0 1-1.184 1.649h-5.352v-.005a1.284 1.284 0 0 1-.112.005h-.02a1.249 1.249 0 0 1-.745-.247L6.78 14.437l-.671 1.988a1.249 1.249 0 0 1-1.183.85H1.5a1.249 1.249 0 0 1-1.184-1.649L5.06 1.576a1.249 1.249 0 0 1 1.184-.85ZM5.787 12.53l5.041 3.745a.312.312 0 0 0 .187.062h.02a.312.312 0 0 0 .296-.412L8.777 8.358l-1.022 2.644-.116.3H4.152Zm10.712 3.807h-4.254a1.238 1.238 0 0 0-.026-.712L7.506 1.662h4.251a.312.312 0 0 1 .296.213l4.742 14.05a.312.312 0 0 1-.296.413Z",fillRule:"evenodd"})))},s=a.p+"assets/images/blade_outputs-b973dfc21e9e1279891c6105e275de59.jpg";var i=a(5033),c=a(7341),u=a(7029);const m=function(e){let{to:t}=e;return r.createElement("div",null,r.createElement("h2",{className:"text-4xl"},"One-click deploy to Azure"),r.createElement(u.Z,null,r.createElement("p",null,"Deploy this demo app to Azure with one single click. Note that you will need an Azure account.")),r.createElement(i.Z,{text:"Deploy to Azure",to:t},r.createElement(o,{className:"lightIcon"})),r.createElement("h2",{className:"mt-12 text-4xl"},"Visit your live demo"),r.createElement(u.Z,null,r.createElement("p",null,"Once the resources are provisioned, you can find ",r.createElement("code",null,"Outputs")," on the side bar. Open the link in your browser.")),r.createElement(c.Z,{imgURL:s,ariaInfo:"Blade outputs image",alt:"Blade outputs image"}))}},4043:(e,t,a)=>{a.d(t,{Z:()=>i});var l=a(7294),r=a(7029),n=a(4064);const o=function(e){let{text:t,language:a,title:r}=e;return l.createElement("div",{className:"mb-3"},r&&l.createElement("h5",{className:"font-bold"},r),l.createElement(n.Z1,{text:t,language:a,showLineNumbers:!0,codeBlock:!0,wrapLines:!0,theme:n.cL}))};var s=a(8665);const i=function(e){let{hub:t}=e;return l.createElement("div",null,l.createElement("h2",{className:"text-4xl"},"Prerequisites"),l.createElement(r.Z,{title:"To run this app locally, you will need the following"},l.createElement("ul",{className:"ml-5 list-disc "},l.createElement("li",{className:"mt-0"},"Node.js"),l.createElement("li",{className:"mt-0"},"Create an Azure Web PubSub resource"),l.createElement("li",{className:"mt-0"},l.createElement(s.Z,{to:"https://learn.microsoft.com/azure/azure-web-pubsub/howto-web-pubsub-tunnel-tool",text:"awps-tunnel"})," to tunnel traffic from Web PubSub to your localhost"))),l.createElement("h2",{className:"mb-5 mt-10 text-4xl"},"Install dependencies"),l.createElement(o,{text:"npm install",language:"shell"}),l.createElement("h2",{className:"mb-5 mt-10 text-4xl"},"Start the app"),l.createElement(o,{text:'export WebPubSubConnectionString="<connection_string>"\n  node server',language:"javascript",title:"Linux"}),l.createElement(o,{text:'set WebPubSubConnectionString="<connection_string>"\n  node server',language:"javascript",title:"Windows"}),t&&l.createElement(l.Fragment,null,l.createElement("h2",{className:"mb-5 mt-10 text-4xl"},"Use ",l.createElement("code",null,"awps-tunnel")," to tunnel traffic from Web PubSub service to localhost"),l.createElement(r.Z,null,l.createElement("p",null,"Install and run ",l.createElement(s.Z,{to:"https://learn.microsoft.com/azure/azure-web-pubsub/howto-web-pubsub-tunnel-tool",text:"awps-tunnel"}),":")),l.createElement(o,{text:`awps-tunnel run --hub ${t} --upstream http://localhost:8080`,language:"shell"}),l.createElement("h2",{className:"mb-5 mt-10 text-4xl"},"Configure the event handler"),l.createElement(r.Z,null,l.createElement("p",null,"Event handler can be set from Azure Portal or through Azure CLI.\xa0",l.createElement(s.Z,{to:"https://docs.microsoft.com/en-us/azure/azure-web-pubsub/howto-develop-eventhandler",text:"Here"}),"contains the detailed instructions of how to set it up."))))}},7744:(e,t,a)=>{a.d(t,{Z:()=>r});var l=a(7294);const r=function(){return l.createElement("div",null,"No additional resources for this sample application")}},7029:(e,t,a)=>{a.d(t,{Z:()=>r});var l=a(7294);const r=function(e){let{title:t,children:a}=e;return l.createElement("div",{className:"mt-5 mb-2"},l.createElement("h3",{className:"mb-1 font-sans font-semibold"},t),a)}},1955:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>g,contentTitle:()=>b,default:()=>f,frontMatter:()=>p,metadata:()=>h,toc:()=>v});var l=a(7462),r=a(7294),n=a(3905),o=a(6546),s=a(7029);const i=a.p+"assets/images/metaverse_scene-ee98b441f38947091d7a20487f08d150.jpg";var c=a(7341);a(4043),a(9014),a(7744);const u=a(6694).o.find((e=>"demos/metaverse"===e.detailURL));u.languages,u.githubRepo;function m(){return r.createElement("div",null,r.createElement("h2",{className:"text-4xl"},"Overview"),r.createElement(s.Z,{title:"About the app"},r.createElement("p",null,"An app demonstrating how Azure Web PubSub can be used to enable multi-player experience in Metaverse (coming soon)")))}const d=function(){return r.createElement(r.Fragment,null,r.createElement(c.Z,{imgURL:i,ariaInfo:"metaverse scene image",alt:"metaverse scene image"}),r.createElement("div",{className:"max-w-full overflow-hidden"},r.createElement(o.Z,{overview:r.createElement(m,null)})))},p={sidebar_position:3,slug:"/metaverse",title:"Metaverse",tags:[],description:"A sample app demontrating how Azure Web PubSub can be used in the context of Metaverse",hide_title:!0,custom_edit_url:null},b=void 0,h={unversionedId:"metaverse",id:"metaverse",title:"Metaverse",description:"A sample app demontrating how Azure Web PubSub can be used in the context of Metaverse",source:"@site/docs/metaverse.mdx",sourceDirName:".",slug:"/metaverse",permalink:"/azure-webpubsub/demos/metaverse",draft:!1,editUrl:null,tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3,slug:"/metaverse",title:"Metaverse",tags:[],description:"A sample app demontrating how Azure Web PubSub can be used in the context of Metaverse",hide_title:!0,custom_edit_url:null},sidebar:"tutorialSidebar",previous:{title:"Real-time scoreboard",permalink:"/azure-webpubsub/demos/scoreboard"},next:{title:"Code stream",permalink:"/azure-webpubsub/demos/code-streaming"}},g={},v=[],w={toc:v};function f(e){let{components:t,...a}=e;return(0,n.kt)("wrapper",(0,l.Z)({},w,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)(d,{mdxType:"Metaverse"}))}f.isMDXComponent=!0}}]);