const express=require('express')
const puppeteer = require('puppeteer');
const app=express()

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
const port=process.env.PORT || 7253

app.use(express.json())

app.get('',(req,res)=>{

    console.log(req.query)    
    user=req.query.username;
    pass=req.query.password;
    hash=req.query.hashtag;
    reqno=req.query.number;

    
(async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: { width: 1920, height: 1080 }, args: ['--start-maximized'] });
    const page = await browser.newPage();
    let element, formElement, tabs;

	await page.goto(`https://www.instagram.com/accounts/login/?source=auth_switcher`, { waitUntil: 'networkidle0' });
	
	await sleep(3000);

	element = await page.$x(`//*[@name="username"]`);
	await element[0].click();

	element = await page.$x(`//*[@name="username"]`);
	await element[0].type(user);

	
	await sleep(2000);

	element = await page.$x(`//*[@name="password"]`);
	await element[0].click();

	element = await page.$x(`//*[@name="password"]`);
	await element[0].type(pass);

	
	await sleep(3000);

	
	element = await page.$x(`(.//*[normalize-space(text()) and normalize-space(.)='Show'])[1]/following::div[2]`);
	await element[0].click();

	console.log("Accessing...");
	await sleep(6000);

    try{
    element = await page.$x(`(.//*[normalize-space(text()) and normalize-space(.)='Know right away when people follow you or like and comment on your photos.'])[1]/following::button[2]`);
	await element[0].click();
    console.log('Notification Bypassed')
    }
    catch(e){
    console.log('Notification Excepted')
    }
    await sleep(2000);

	element = await page.$x(`(.//*[normalize-space(text()) and normalize-space(.)='© 2019 Instagram'])[1]/following::div[13]`);
	await element[0].click();

	element = await page.$x(`(.//*[normalize-space(text()) and normalize-space(.)='© 2019 Instagram'])[1]/following::input[2]`);
	await element[0].type("#"+hash);
	console.log("Hash typed");
	
	await sleep(6000);

	
	
	element = await page.$x(`(.//*[normalize-space(text()) and normalize-space(.)='#`+hash+`'])[1]/following::span[1]`);
	await element[0].click();

	console.log("Hash entered");
	await sleep(6000);


	// element = await page.$x(`//ul`);
	// await element[0].click();

	await page.waitForSelector('.Nnq7C > .v1Nh3 > a')
  	await page.click('.Nnq7C > .v1Nh3 > a')


	console.log("post");
	await sleep(6000);

	element = await page.$x(`//button/span`);
	await element[0].click();
    console.log("Initial Heart")
	
	
	console.log("Getting to the first post...");
	while(true){


		try{
		element = await page.$x(`//a[contains(text(),'Previous')]`);
		await element[0].click();
		await page.waitForNavigation();

		await sleep(1000);
		}
		catch(e){
			break;
		}
	
	}

	console.log("First post found on target");
	
    
    for (step = 0; step < reqno; step++) {
        
        element = await page.$x(`//button/span`);
	    await element[0].click();


        element = await page.$x(`//a[contains(text(),'Next')]`);
        await element[0].click();
        await page.waitForNavigation();

	
	    await sleep(2000);
        
        console.log('Post ',step,' liked');
        }

	
	await sleep(2000);

	element = await page.$x(`//button/span`);
	await element[0].click();
	await browser.close();

	return res.send({status:'Success'})
})();


    

})



app.listen(port,()=>{
    console.log('Server is up on port '+port)

})