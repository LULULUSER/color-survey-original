function getParticipantId() {
  const key='color-survey-collection-participant';
  try {
    let id=localStorage.getItem(key);
    if(!id){id='p_'+crypto.randomUUID();localStorage.setItem(key,id);}
    return id;
  } catch {
    if(!window.collectionParticipant)window.collectionParticipant='p_'+crypto.randomUUID();
    return window.collectionParticipant;
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  const form=document.querySelector('form[data-collection]');
  if(!form)return;
  form.elements.submission_id.value=crypto.randomUUID();
  const notice=document.createElement('p');
  notice.textContent='回答将在全部完成并点击提交后保存。提交前请勿刷新或关闭页面；请勿在文字中填写姓名或联系方式。';
  form.before(notice);
  const status=document.createElement('p');
  status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  form.after(status);
  let submitting=false;
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(submitting)return;
    submitting=true;
    const button=form.querySelector('button[type=submit]');
    button.disabled=true;status.textContent='正在保存，请保持此页面打开。';
    const payload=new URLSearchParams(new FormData(form));
    try {
      const response=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:payload.toString()});
      if(!response.ok)throw new Error('Submission failed');
      const task=form.name==='color-similarity-survey'?'similarity':'language';
      location.assign('/thank-you.html?task='+task);
    } catch {
      submitting=false;button.disabled=false;
      status.textContent='提交未成功，答案仍在本页。请检查网络后再次点击提交，不要刷新页面。';
      status.scrollIntoView({block:'nearest'});
    }
  });
});
