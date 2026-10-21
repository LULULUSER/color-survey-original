const {chromium}=require('C:/Users/86175/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage(),posts=[],errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(()=>{const timer=setTimeout;window.setTimeout=(fn,ms,...a)=>timer(fn,ms===1000?0:ms,...a);});
    const base=process.argv[2];let fail=true;
    await page.route(base+'/',route=>{
      if(route.request().method()!=='POST')return route.continue();
      const payload=new URLSearchParams(route.request().postData());
      posts.push(payload);
      if(fail){fail=false;return route.fulfill({status:503,body:'Unavailable'});}
      return route.fulfill({status:200,body:'Saved'});
    });
    await page.goto(base+'/color-similarity/');
    await page.selectOption('#vision_select','normal');await page.getByRole('button',{name:'开始',exact:true}).click();
    await page.locator('.active .progress').waitFor();
    await page.evaluate(async()=>{for(let i=0;i<360;i++){document.querySelector('input[name="trial_'+i+'"][value=left]').checked=true;nextTrial(i);await new Promise(resolve=>setTimeout(resolve,0));}});
    await page.getByRole('button',{name:'提交',exact:true}).click();
    await page.getByRole('status').filter({hasText:'提交未成功'}).waitFor();
    assert.equal(new URL(page.url()).pathname,'/color-similarity/');
    await page.getByRole('button',{name:'提交',exact:true}).click();
    await page.waitForURL('**/thank-you.html?task=similarity');
    const similarity=posts[1];assert.equal(JSON.parse(similarity.get('responses_json')).length,360);
    assert.equal(posts[0].get('submission_id'),similarity.get('submission_id'));
    await page.getByRole('link',{name:'继续颜色描述实验'}).click();
    await page.locator('.active select').selectOption('normal');await page.getByRole('button',{name:'开始',exact:true}).click();
    await page.locator('.active textarea').first().waitFor();
    assert.equal(await page.locator('.active textarea').count(),2);
    await page.evaluate(async()=>{for(let i=0;i<10;i++){document.querySelectorAll('.active textarea').forEach(t=>t.value='表单测试');next();await new Promise(resolve=>setTimeout(resolve,0));}});
    await page.getByRole('button',{name:'提交',exact:true}).click();
    await page.waitForURL('**/thank-you.html?task=language');
    assert.equal(posts[2].get('participant_id'),similarity.get('participant_id'));
    assert(posts[2].get('color_10_q2'));assert.deepEqual(errors,[]);
    console.log('PASS: 360+20 original answers; shared ID; failed save retains page; stable retry ID; both form payloads and success routes.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
