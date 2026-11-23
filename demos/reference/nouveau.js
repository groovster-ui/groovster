/* Reference-app interactions only. Zero external imports or network calls. */
const root=document.querySelector('[data-era="art-nouveau"]');
const say=text=>{const el=document.querySelector('[data-live]');if(el)el.textContent=text;};
for(const [selector,key] of [['[data-mode-switch]','mode'],['[data-band-switch]','fidelityBand'],['[data-dialect-switch]','dialect']])document.querySelector(selector)?.addEventListener('change',event=>{root.dataset[key]=event.target.value;say(key+' set to '+event.target.value);});
const money=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value);
let cart=0;let items=0;
function applyFilters(){const cat=document.querySelector('[data-category]')?.value||'all',stock=document.querySelector('[data-stock]')?.checked||false;document.querySelectorAll('[data-product]').forEach(el=>{el.hidden=(cat!=='all'&&el.dataset.category!==cat)||(stock&&el.dataset.stock!=='true')});}
document.querySelector('[data-category]')?.addEventListener('change',applyFilters);
document.querySelector('[data-stock]')?.addEventListener('change',applyFilters);
document.querySelectorAll('[data-add]').forEach(el=>el.addEventListener('click',()=>{cart+=Number(el.dataset.price);items++;document.querySelectorAll('[data-cart-total]').forEach(out=>out.textContent=money(cart));document.querySelectorAll('[data-cart-count]').forEach(out=>out.textContent=String(items));say('Added to the local demonstration cart');}));
document.querySelector('[data-open-cart]')?.addEventListener('click',()=>document.querySelector('#cart-dialog')?.showModal());
document.querySelector('[data-close-cart]')?.addEventListener('click',()=>document.querySelector('#cart-dialog')?.close());
document.querySelector('[data-checkout]')?.addEventListener('click',()=>{say('Fictional checkout confirmed; no order placed and no payment collected.');document.querySelector('#cart-dialog')?.close();cart=0;items=0;document.querySelectorAll('[data-cart-total]').forEach(out=>out.textContent=money(0));document.querySelectorAll('[data-cart-count]').forEach(out=>out.textContent='0');});
document.querySelector('[data-newsletter]')?.addEventListener('submit',event=>{event.preventDefault();if(event.currentTarget.reportValidity()){say('Fictional signup confirmed; nothing was transmitted.');event.currentTarget.reset();}});
function ticketTotal(){const count=Math.max(0,Math.min(15,Number(document.querySelector('[data-tickets]')?.value||0)));const kind=document.querySelector('[data-ticket-type]')?.value||'general';const rate=kind==='concession'?12:18;document.querySelector('[data-ticket-total]').textContent=money(count*rate);}
document.querySelector('[data-tickets]')?.addEventListener('input',ticketTotal);
document.querySelector('[data-ticket-type]')?.addEventListener('change',ticketTotal);
document.querySelector('[data-visit-form]')?.addEventListener('submit',event=>{event.preventDefault();if(event.currentTarget.reportValidity()){say('Your demonstration visit request is recorded locally only.');event.currentTarget.reset();}});