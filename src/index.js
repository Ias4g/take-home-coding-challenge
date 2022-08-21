import puppeteer from 'puppeteer'

(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto('https://instagram.com')
    await page.screenshot({ path: 'face.png' })

    await browser.close()
})()