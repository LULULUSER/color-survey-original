const {chromium}=require('C:/Users/86175/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage(),errors=[],posts=[];
    const participant='qa_deployment_'+Date.now();
    page.on('pageerror',e=>errors.push(e.message));
    page.on('request',r=>{if(r.method()==='POST')posts.push(new URLSearchParams(r.postData()));});
    await page.addInitScript(id=>{
      localStorage.setItem('color-survey-collection-participant',id);
      const timer=setTimeout;window.setTimeout=(fn,ms,...a)=>timer(fn,ms===1000?0:ms,...a);
    },participant);
    const base=process.argv[2];await page.goto(base+'/color-similarity/');
    await page.selectOption('#vision_select','unsure');await page.getByRole('button',{name:'开始',exact:true}).click();
    await page.locator('.active .progress').waitFor();
    await page.evaluate(async()=>{for(let i=0;i<360;i++){document.querySelector('input[name="trial_'+i+'"][value=left]').checked=true;nextTrial(i);await new Promise(resolve=>setTimeout(resolve,0));}});
    await page.getByRole('button',{name:'提交',exact:true}).click();
    await page.waitForURL(url=>/^\/thank-you(?:\.html)?$/.test(url.pathname)&&url.searchParams.get('task')==='similarity');
    await page.getByRole('link',{name:'继续颜色描述实验'}).click();
    await page.locator('.active select').selectOption('unsure');await page.getByRole('button',{name:'开始',exact:true}).click();
    await page.locator('.active textarea').first().waitFor();
    await page.evaluate(async()=>{for(let i=0;i<10;i++){document.querySelectorAll('.active textarea').forEach(t=>t.value='部署验证测试，不属于真实实验回答。');next();await new Promise(resolve=>setTimeout(resolve,0));}});
    await page.getByRole('button',{name:'提交',exact:true}).click();
    await page.waitForURL(url=>/^\/thank-you(?:\.html)?$/.test(url.pathname)&&url.searchParams.get('task')==='language');
    assert.equal(posts.length,2);assert.equal(JSON.parse(posts[0].get('responses_json')).length,360);
    assert(posts[1].get('color_10_q2'));assert.equal(posts[0].get('participant_id'),posts[1].get('participant_id'));
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({browser:'passed',participant,submissions:posts.map(p=>({form:p.get('form-name'),id:p.get('submission_id')})),note:'Confirm these records with the authenticated Netlify API before declaring persistence verified.'}));
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
