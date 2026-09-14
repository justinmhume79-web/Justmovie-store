const API = ""; // Same-origin backend. Change to your deployed API URL if frontend is hosted separately.
let currentVideo = null;
let videos = [
 {title:"Sample Movie",category:"movie",url:"https://files.catbox.moe/n4a42c.mp4",description:"Sample video",requiresPassword:true}
];

const grid=document.querySelector("#videoGrid"), search=document.querySelector("#search");
function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function render(list=videos){
 grid.innerHTML=list.map((v,i)=>`<article class="video-card">
 <div class="thumb">▶</div><div class="video-info"><div class="muted">${esc(v.category)}</div>
 <h3>${esc(v.title)}</h3><p class="muted">${esc(v.description||"")}</p>
 <button class="watch" onclick="openVideo(${i})">Watch video</button></div></article>`).join("")||"<p>No videos found.</p>";
}
async function loadVideos(){
 try{const r=await fetch(API+"/api/videos"); if(r.ok){videos=await r.json();render()}}
 catch(e){render()}
}
window.openVideo=i=>{
 currentVideo=videos[i]; document.querySelector("#modalTitle").textContent=currentVideo.title;
 document.querySelector("#videoPassword").value=""; document.querySelector("#playerArea").innerHTML="";
 document.querySelector("#playerModal").classList.add("show");
};
document.querySelector(".close").onclick=()=>document.querySelector("#playerModal").classList.remove("show");
document.querySelector("#unlockBtn").onclick=async()=>{
 const pass=document.querySelector("#videoPassword").value;
 try{
   const r=await fetch(API+"/api/videos/"+currentVideo._id+"/unlock",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:pass})});
   if(r.ok){const data=await r.json(); document.querySelector("#playerArea").innerHTML=`<video controls autoplay src="${esc(data.url)}"></video>`;return}
 }catch(e){}
 alert("Wrong password or server unavailable.");
};
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");filter()});
search.oninput=filter;
function filter(){const q=search.value.toLowerCase(),cat=document.querySelector(".filter.active").dataset.cat;render(videos.filter(v=>(cat==="all"||v.category===cat)&&(`${v.title} ${v.description||""}`).toLowerCase().includes(q)))}
document.querySelector("#registerForm").onsubmit=async e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target));try{let r=await fetch(API+"/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});let x=await r.json();document.querySelector("#accountMsg").textContent=x.message||"Account created";}catch{document.querySelector("#accountMsg").textContent="Connect the backend server first."}};
document.querySelector("#loginForm").onsubmit=async e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target));try{let r=await fetch(API+"/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});let x=await r.json();document.querySelector("#accountMsg").textContent=x.message||"Login complete";}catch{document.querySelector("#accountMsg").textContent="Connect the backend server first."}};
render();loadVideos();
