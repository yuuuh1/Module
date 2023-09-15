const puppeteer = require('puppeteer');
const PuppeteerHar = require('puppeteer-har-fetch');

const chrome = process.argv[2];
const url = process.argv[3];
const output = process.argv[4];
const url_access_log_path = process.argv[5];
const args = process.argv.slice(6);

(async () => {
    const browser = await puppeteer.launch({
        executablePath: chrome,
        args: args,
        headless: 'new'
    });

    const page = await browser.newPage();

    // 删除chrome的webdriver，防止被识别成Web爬虫
    await page.evaluateOnNewDocument(() => {
        delete navigator.__proto__.webdriver;
    });

    // 设置HTTP头，对整个请求过程的所有子页面有效
    await page.setExtraHTTPHeaders({
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
        'DNT': '1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
    });

    // 修改UA，这种方式设置，在HTTP头中会是大写的：'User-Agent'
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.183');

    const har = new PuppeteerHar(page);
    await har.start({
        path: output,
        saveResponse: true,
        useFetch: true,
    });

    // 设置窗口大小
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url);
    // 等待页面加载完成，确保所有内容都在可视范围内
    await page.waitForSelector('html');
    // 等待10秒
    await page.waitForTimeout(10000);
    await har.stop();
    await page.screenshot({ path: url_access_log_path });
    await browser.close();
})();