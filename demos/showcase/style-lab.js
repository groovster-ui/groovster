const root = new URL('../../', import.meta.url);
const byId = id => document.getElementById(id);
const stage = byId('stage');
const inputs = Object.fromEntries(['era','dialect','mode','fidelity','density'].map(id => [id, byId(id)]));
const status = byId('status');
const get = async path => {
  const response = await fetch(new URL(path, root));
  if (!response.ok) throw new Error('Missing '+path+'; run pnpm gen and serve the repository root.');
  return response.json();
};
const options = (select, entries) => select.replaceChildren(...entries.map(([id,label]) => new Option(label,id)));
function apply() {
  stage.dataset.era=inputs.era.value;
  stage.dataset.mode=inputs.mode.value;
  stage.dataset.fidelityBand=inputs.fidelity.value;
  if (inputs.dialect.value) stage.dataset.dialect=inputs.dialect.value;
  else delete stage.dataset.dialect;
  if (inputs.density.value) stage.dataset.density=inputs.density.value;
  else delete stage.dataset.density;
  status.textContent=[inputs.era.value,inputs.dialect.value||'default',inputs.mode.value,inputs.fidelity.value,inputs.density.value||'comfortable'].join(' / ');
}
function sample(spec) {
  const article=document.createElement('article');
  article.className='ew-card lab-sample';
  article.dataset.component=spec.id;
  const title=document.createElement('h3');
  title.textContent=spec.name;
  article.append(title);
  const body=document.createElement('div');
  body.className='lab-table';
  // Repository-owned canonical HTML. Namespace IDs and corresponding IDREF attributes
  // so different samples do not accidentally label or control one another.
  const template=document.createElement('template');
  template.innerHTML=spec.canonicalHtml;
  const ids=new Map();
  template.content.querySelectorAll('[id]').forEach(el=>{
    ids.set(el.id,spec.id+'-'+el.id);
    el.id=ids.get(el.id);
  });
  for(const el of template.content.querySelectorAll('*')){
    for(const attr of ['for','aria-controls','aria-labelledby','aria-describedby','aria-owns','aria-activedescendant']){
      if(el.hasAttribute(attr))el.setAttribute(attr,el.getAttribute(attr).split(/\s+/).map(id=>ids.get(id)||id).join(' '));
    }
    if(el.getAttribute('href')?.startsWith('#')){
      const id=el.getAttribute('href').slice(1);
      if(ids.has(id))el.setAttribute('href','#'+ids.get(id));
    }
  }
  body.append(template.content);
  article.append(body);
  const dialog=article.querySelector('dialog');
  if(dialog){
    const open=document.createElement('button');open.type='button';open.className='ew-button';open.textContent='Open dialog';
    open.addEventListener('click',()=>dialog.showModal());body.prepend(open);
  }
  return article;
}
async function init(){
  const catalog=await get('generated/manifest.json');
  const eras=await Promise.all(catalog.eras.map(id=>get('spec/eras/'+id+'/era.spec.json')));
  const components=await Promise.all(catalog.components.map(id=>get('spec/components/'+id+'.json')));
  const map=new Map(eras.map(era=>[era.id,era]));
  options(inputs.era,eras.map(era=>[era.id,era.name]));
  inputs.era.value=map.has('nordic')?'nordic':eras[0].id;
  const updateDialect=()=>{
    options(inputs.dialect,[['','Default'],...(map.get(inputs.era.value).dialects||[]).map(d=>[d.id,d.label])]);
    apply();
  };
  inputs.era.addEventListener('change',updateDialect);
  for(const key of ['dialect','mode','fidelity','density'])inputs[key].addEventListener('change',apply);
  byId('gallery').replaceChildren(...components.map(sample));
  updateDialect();
  stage.dataset.ready='true';
}
init().catch(error=>{status.textContent=error.message;status.setAttribute('role','alert');});
