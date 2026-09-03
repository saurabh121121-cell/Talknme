const fs=require('fs');const path=require('path');
const src=path.join(process.cwd(),'index.html');const out=path.join(process.cwd(),'public');fs.mkdirSync(out,{recursive:true});let s=fs.readFileSync(src,'utf8');if(!s.includes('/chat-widget.js'))s=s.replace('</body>','<script src="/chat-widget.js"></script></body>');fs.writeFileSync(path.join(out,'index.html'),s);fs.copyFileSync(path.join(process.cwd(),'chat-widget.js'),path.join(out,'chat-widget.js'));
// The employee dashboard lives at /employee.html and must also be included in Vercel's public output.
fs.copyFileSync(path.join(process.cwd(),'employee.html'),path.join(out,'employee.html'));
console.log('TalkNMe site and employee dashboard enabled.');
