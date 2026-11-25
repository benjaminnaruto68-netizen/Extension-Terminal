const idBox=document.getElementById('id'), statusBox=document.getElementById('status');
function say(s){statusBox.textContent=s}
function getId(){const id=idBox.value.trim();if(!/^[a-p]{32}$/.test(id)){say('That does not look like a valid Chrome extension ID.');return null}return id}
function getExtension(id){return new Promise((resolve,reject)=>chrome.management.get(id,e=>{if(chrome.runtime.lastError)reject(chrome.runtime.lastError.message);else resolve(e)}))}
async function setState(enabled){const id=getId();if(!id)return;try{const e=await getExtension(id);if(e.type!=='extension'){say('That ID is not a manageable extension.');return}chrome.management.setEnabled(id,enabled,()=>{if(chrome.runtime.lastError){say('Chrome blocked the change: '+chrome.runtime.lastError.message);return}say(e.name+' is now '+(enabled?'enabled':'disabled')+'.')})}catch(err){say('Extension not found in this Chrome profile, or permission denied: '+err)}}
document.getElementById('enable').addEventListener('click',()=>setState(true));
document.getElementById('disable').addEventListener('click',()=>setState(false));
idBox.addEventListener('keydown',e=>{if(e.key==='Enter')setState(true)});
