const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const devicesName = ['iPhone X', 'iPhone 6 Plus', 'iPad'];
const allDevicesNames = Object.keys(devices);
const fs = require('fs');

const filterDevices = (devices, filtred) =>
  devices.filter(item => filtred.includes(item) ? true : false);

const extractHostname = url => {
  let hostname;  
  hostname = url.indexOf("//") > -1 ? url.split('/')[2] : url.split('/')[0];
  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];
  return hostname;
}

const makeDirectory = date => {
  const dir = __dirname + '/results/' + date;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

const date = new Date();
const currDate = `${date.getMonth()}-${date.getDay()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
makeDirectory(currDate)
const website = 'https://www.webkul.com';
const websiteName = extractHostname(website);

puppeteer.launch({ headless: false }).then(async browser => {
  const filtredNames = filterDevices(allDevicesNames, devicesName);
 
  console.log(websiteName);
  for (let device of filtredNames) {
    const page = await browser.newPage();
    const deviceProps = devices[device];
    await page.emulate(deviceProps);
    await page.goto(website);
    await page.screenshot({ path: `results/${currDate}/${websiteName}-${device.replace(/\s/g, '')}.png` });
  }
  await browser.close();
});

