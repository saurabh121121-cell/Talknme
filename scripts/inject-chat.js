const fs=require('fs');
const path=require('path');
const src=path.join(process.cwd(),'index.html');
const out=path.join(process.cwd(),'public');
fs.mkdirSync(out,{recursive:true});
let s=fs.readFileSync(src,'utf8');

const reviews=`<section class="reviews moments-section">
  <div class="moments-head">
    <div class="moments-kicker">SOMETIMES, YOU JUST WANT TO TALK</div>
    <h2>There are moments when you just want <span>someone to talk to.</span></h2>
    <p>Whatever you’re going through, you don’t have to go through it alone.</p>
  </div>

  <div class="moments-grid">
    <article class="moment photo-night">
      <div class="moment-icon">☾</div>
      <div class="moment-copy"><h3>It’s 1 AM.<br><span>You’re still awake.</span></h3><p>Your mind is running. You don’t need a lecture—you just want someone to talk to.</p></div>
    </article>
    <article class="moment photo-heart">
      <div class="moment-icon">♡</div>
      <div class="moment-copy"><h3>You can’t call your ex.<br><span>You can’t call your best friend.</span></h3><p>Sometimes it’s easier to talk to someone who doesn’t know the whole story.</p></div>
    </article>
    <article class="moment photo-city">
      <div class="moment-icon">✈</div>
      <div class="moment-copy"><h3>New city.<br><span>No familiar faces.</span></h3><p>You’re surrounded by people, but you still feel alone.</p></div>
    </article>
    <article class="moment moment-wide photo-mind">
      <div class="moment-icon">◌</div>
      <div class="moment-copy"><h3>Something’s been on your mind <span>all day.</span></h3><p>Say it out loud. Sometimes hearing yourself talk makes things feel lighter.</p></div>
    </article>
    <article class="moment moment-wide photo-company">
      <div class="moment-icon">☕</div>
      <div class="moment-copy"><h3>Nothing is wrong.<br><span>You just want company.</span></h3><p>You don’t need a reason. You can simply want a conversation.</p></div>
    </article>
  </div>

  <div class="moments-closing">
    <div class="closing-art">♡</div>
    <div><div class="closing-kicker">REAL PEOPLE · REAL CONVERSATIONS · NO JUDGMENT</div><h3>You don’t need a reason to talk.</h3><strong>You just need someone willing to listen.</strong></div>
  </div>

  <div class="moments-trust">
    <div><b>◈ Private by design</b><span>Your conversations stay between you and your listener.</span></div>
    <div><b>▣ Safe & secure</b><span>We keep the experience simple and privacy-conscious.</span></div>
    <div><b>♧ Real human listeners</b><span>Talk to trained listeners who are here to understand you.</span></div>
    <div><b>ϟ Easy connection</b><span>Choose your conversation and get started at your pace.</span></div>
  </div>

  <style>
    .moments-section{max-width:none!important;padding:82px 5% 76px!important;background:linear-gradient(180deg,#f8fbfc 0%,#fff 100%);overflow:hidden}
    .moments-head{max-width:820px;margin:0 auto 36px;text-align:center}.moments-kicker{display:inline-block;color:#217c71;background:#e6f5f2;border:1px solid #cfeae5;border-radius:999px;padding:7px 13px;font-size:11px;font-weight:900;letter-spacing:.8px;margin-bottom:14px}.moments-head h2{font-size:clamp(36px,5vw,58px);line-height:1.02;letter-spacing:-2.5px;margin:0 auto 16px;max-width:850px}.moments-head h2 span{color:#2a9d8f}.moments-head p{font-size:18px;color:#66777d;margin:0}
    .moments-grid{max-width:1080px;margin:auto;display:grid;grid-template-columns:repeat(6,1fr);gap:16px}.moment{grid-column:span 2;min-height:315px;border-radius:28px;padding:22px;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;color:#fff;background-size:cover;background-position:center;box-shadow:0 18px 45px #172b351f}.moment:before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,#08131b08 25%,#07131dcc 100%)}.moment>*{position:relative;z-index:1}.moment-icon{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:#ffffff20;border:1px solid #ffffff55;backdrop-filter:blur(8px);font-size:28px}.moment-copy h3{font-size:24px;line-height:1.04;letter-spacing:-.5px;margin:0 0 10px}.moment-copy h3 span{color:#a7eee4}.moment-copy p{font-size:14px;line-height:1.45;color:#eef5f6;margin:0;max-width:390px}.moment-wide{grid-column:span 3;min-height:275px}.photo-night{background-image:url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=82')}.photo-heart{background-image:url('https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=82')}.photo-city{background-image:url('https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=82')}.photo-mind{background-image:url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=82')}.photo-company{background-image:url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=82')}
    .moments-closing{max-width:1080px;margin:24px auto 18px;padding:28px 34px;border-radius:28px;background:linear-gradient(110deg,#f3eafa,#eaf8f6 55%,#eef5ff);border:1px solid #dce8e9;display:flex;align-items:center;justify-content:center;gap:28px;text-align:center}.closing-art{width:72px;height:72px;border-radius:50%;display:grid;place-items:center;border:2px solid #2a9d8f;color:#2a9d8f;font-size:40px;flex:0 0 auto}.closing-kicker{font-size:11px;font-weight:900;letter-spacing:.6px;color:#217c71;margin-bottom:7px}.moments-closing h3{font-size:30px;line-height:1.08;margin:0 0 4px}.moments-closing strong{font-size:24px;color:#2a9d8f;line-height:1.1}
    .moments-trust{max-width:1080px;margin:auto;border:1px solid #e1e8e9;background:#f8fafb;border-radius:24px;display:grid;grid-template-columns:repeat(4,1fr);overflow:hidden}.moments-trust>div{padding:20px 18px;border-right:1px solid #dfe6e7}.moments-trust>div:last-child{border-right:0}.moments-trust b{display:block;font-size:14px;margin-bottom:5px}.moments-trust span{display:block;color:#66777d;font-size:12px;line-height:1.4}
    @media(max-width:800px){.moments-grid{grid-template-columns:1fr 1fr}.moment,.moment-wide{grid-column:span 1;min-height:290px}.moments-trust{grid-template-columns:1fr 1fr}.moments-trust>div:nth-child(2){border-right:0}.moments-trust>div{border-bottom:1px solid #dfe6e7}}
    @media(max-width:520px){.moments-section{padding-top:60px!important}.moments-head h2{letter-spacing:-1.5px}.moments-head p{font-size:16px}.moments-grid{grid-template-columns:1fr}.moment,.moment-wide{min-height:310px}.moments-closing{padding:25px 20px;flex-direction:column;gap:14px}.moments-closing h3{font-size:27px}.moments-closing strong{font-size:21px}.moments-trust{grid-template-columns:1fr}.moments-trust>div,.moments-trust>div:nth-child(2){border-right:0;border-bottom:1px solid #dfe6e7}.moments-trust>div:last-child{border-bottom:0}}
  </style>
</section>`;

s=s.replace(/<section class="reviews">[\s\S]*?<\/section>/,reviews);

const momentsStart=s.indexOf('<section class="reviews moments-section">');
if(momentsStart!==-1){
  const momentsEnd=s.indexOf('</section>',momentsStart)+10;
  const moments=s.slice(momentsStart,momentsEnd);
  s=s.slice(0,momentsStart)+s.slice(momentsEnd);
  s=s.replace('<header class="hero">',moments+'<header class="hero">');
}

if(!s.includes('/chat-widget.js'))s=s.replace('</body>','<script src="/chat-widget.js"></script></body>');
if(!s.includes('/queue.js'))s=s.replace('</body>','<script src="/queue.js"></script></body>');
fs.writeFileSync(path.join(out,'index.html'),s);
fs.copyFileSync(path.join(process.cwd(),'chat-widget.js'),path.join(out,'chat-widget.js'));
fs.copyFileSync(path.join(process.cwd(),'queue.js'),path.join(out,'queue.js'));
fs.copyFileSync(path.join(process.cwd(),'employee.html'),path.join(out,'employee.html'));
console.log('TalkNMe site, live call queue and employee dashboard enabled.');
