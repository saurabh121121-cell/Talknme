(()=>{
const SB_URL='https://aipwsddemomhicymqjmp.supabase.co';
const SB_KEY='sb_publishable_gQiJEwyU9WNajNAFd9CGCQ_HrUqEYcO';
async function rpc(name,body){const r=await fetch(`${SB_URL}/rest/v1/rpc/${name}`,{method:'POST',headers:{'apikey':SB_KEY,'Authorization':`Bearer ${SB_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(body||{})});if(!r.ok)throw new Error(await r.text());return r.json()}
window.TalkNMeQueue={
 createRequest:email=>rpc('create_call_request',{p_customer_email:email}),
 status:(id,token)=>rpc('get_call_status',{p_request_id:id,p_access_token:token}),
 online:(id,v)=>rpc('set_listener_status',{p_listener_id:id,p_online:v}),
 claim:id=>rpc('claim_next_call',{p_listener_id:id}),
 start:(id,l)=>rpc('start_call',{p_request_id:id,p_listener_id:l}),
 release:(id,l)=>rpc('release_call',{p_request_id:id,p_listener_id:l}),
 finish:(id,l)=>rpc('finish_call',{p_request_id:id,p_listener_id:l})
};

if(document.getElementById('modal')&&document.getElementById('email')){
 const originalStatus=document.getElementById('status');
 window.startCall=async function(){
  const input=document.getElementById('email'),email=input.value.trim();
  if(!email||!input.checkValidity()){input.focus();input.reportValidity();return}
  const btn=document.getElementById('continueBtn');btn.disabled=true;btn.textContent='Finding a listener…';originalStatus.style.display='block';originalStatus.textContent='Finding an available listener…';
  try{
   const rows=await TalkNMeQueue.createRequest(email);const row=Array.isArray(rows)?rows[0]:rows;localStorage.setItem('talknme_request_id',row.request_id);localStorage.setItem('talknme_request_token',row.access_token);originalStatus.textContent='You’re in the queue. We’ll connect you as soon as a listener is available.';
   const started=Date.now();
   const poll=async()=>{try{const result=await TalkNMeQueue.status(row.request_id,row.access_token);const s=Array.isArray(result)?result[0]:result;if(s&&s.status==='assigned'&&s.room_name){originalStatus.textContent=`${s.listener_name||'Your listener'} is ready. Opening your private call…`;clearInterval(timer);setTimeout(()=>{window.location.href=`https://talknme.daily.co/${encodeURIComponent(s.room_name)}`},400);return}if(Date.now()-started>15*60*1000){clearInterval(timer);btn.disabled=false;btn.textContent='Try again';originalStatus.textContent='No listener became available. Please try again.'}}catch(e){console.warn(e)}};
   const timer=setInterval(poll,2000);poll();
  }catch(e){btn.disabled=false;btn.textContent='Continue to call';originalStatus.textContent='We could not place your request. Please try again.';console.error(e)}
 };
}
})();