import puppeteer from 'puppeteer'

(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    await page.goto('https://www.instagram.com/rocketseat_oficial')

    await page.evaluate(() => {
        // Toda esta função será executada no browser.
        // Vamos pegar todas as imagens que estão na parte de posts.
        const NodeList = document.querySelectorAll('article img')

        // Transformar n NodeList em Array.
        const imgArray = [...NodeList]

        // Transformar os Nodes (elementos html) em objetos JS
        const list = imgArray.map(({ src }) => ({ src }))

        console.log(list)

        // Colocar para fora da função
    })

    // await browser.close()
})()