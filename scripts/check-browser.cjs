const {chromium}=require('C:/Users/86175/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage(),posts=[],errors=[];
    page.on('request',r=>{if(r.method()!=='GET')posts.push(r.url());});
    page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(()=>{const timer=setTimeout;window.setTimeout=(fn,ms,...a)=>timer(fn,ms===1000?0:ms,...a);});
    const base=process.argv[2];await page.goto(base);
    await page.getByRole('link',{name:'颜色相似性判断实验',exact:true}).click();
    assert.equal(await page.locator('input[type=radio]').count(),720);
    await page.selectOption('#vision_select','normal');await page.getByRole('button',{name:'开始',exact:true}).click();
    await page.locator('.active .progress').waitFor();
    await page.locator('.active input[value=left]').check();
    assert.equal(await page.locator('.active .progress').innerText(),'问题 1 / 360');
    assert.equal(await page.locator('body').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(128, 128, 128)');
    await page.evaluate(async()=>{for(let i=0;i<360;i++){document.querySelector('input[name="trial_'+i+'"][value=left]').checked=true;nextTrial(i);await new Promise(resolve=>setTimeout(resolve,0));}});
    await page.getByRole('button',{name:'完成演示（不上传）',exact:true}).click();
    await page.waitForURL('**/color-survey-original/demo-complete.html');
    await page.getByRole('link',{name:'返回实验入口'}).click();
    await page.getByRole('link',{name:'颜色描述实验',exact:true}).click();
    await page.locator('.active select').selectOption('normal');await page.getByRole('button',{name:'开始',exact:true}).click();
    await page.locator('.active textarea').first().waitFor();
    assert.equal(await page.locator('.active textarea').count(),2);
    assert.equal(await page.locator('.active .hint').count(),2);
    await page.evaluate(async()=>{for(let i=0;i<10;i++){document.querySelectorAll('.active textarea').forEach(t=>t.value='原版展示验证');next();await new Promise(resolve=>setTimeout(resolve,0));}});
    await page.getByRole('button',{name:'完成演示（不上传）',exact:true}).click();
    await page.waitForURL('**/color-survey-original/demo-complete.html');
    assert.deepEqual(posts,[]);assert.deepEqual(errors,[]);
    console.log('PASS: nested Pages path; all 360+20 answers; original next-button behavior; demo completion; no submissions.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
