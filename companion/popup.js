const list=document.getElementById('list'),status=document.getElementById('status'),search=document.getElementById('search');
let all=[];
function say(t){status.textContent=t}
function scan(){list.innerHTML='';say('Scanning this Chrome profile…');chrome.management.getAll(items=>{if(chrome.runtime.lastError){say('Scan failed: '+chrome.runtime.lastError.message);return}
all=(items||[]).filter(x=>x.type==='extension');say('Found '+all.length+' extensions.');render();});}
function render(){const q=search.value.trim().toLowerCase();list.innerHTML='';const filtered=all.filter(e=>(e.name+' '+e.id).toLowerCase().includes(q));
if(!filtered.length){list.innerHTML='<div class="empty">No matching extensions.</div>';return}
filtered.forEach(e=>{const card=document.createElement('div');card.className='card';
const name=document.createElement('div');name.className='name';name.textContent=e.name||'Unnamed extension';
const id=document.createElement('div');id.className='id';id.textContent=e.id;
const row=document.createElement('div');row.className='row';
const state=document.createElement('span');state.className='state';state.textContent=e.enabled?'Enabled':'Disabled';
row.appendChild(state);
const allowed=e.installType==='normal'&&e.mayDisable===true;
if(allowed){const btn=document.createElement('button');btn.className=e.enabled?'toggle off':'toggle';btn.textContent=e.enabled?'Disable':'Enable';btn.addEventListener('click',()=>{btn.disabled=true;chrome.management.setEnabled(e.id,!e.enabled,()=>{if(chrome.runtime.lastError){say('Chrome rejected the change: '+chrome.runtime.lastError.message);btn.disabled=false;return}say((e.name||'Extension')+' updated.');scan();});});row.appendChild(btn)}
else{const protectedLabel=document.createElement('span');protectedLabel.className='protected';protectedLabel.textContent='Managed / protected';row.appendChild(protectedLabel)}
card.append(name,id,row);list.appendChild(card);});}
document.getElementById('scan').addEventListener('click',scan);search.addEventListener('input',render);
scan();