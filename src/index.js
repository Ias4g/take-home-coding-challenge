import puppeteer from 'puppeteer'
import fs from 'fs'

(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto('https://www.instagram.com/rocketseat_oficial')

    const imgList = await page.evaluate(() => {
        // Toda esta função será executada no browser.

        // Vamos pegar todas as imagens que estão na parte de posts.
        const nodeList = document.querySelectorAll('article img')

        // Transformar n NodeList em Array.
        const imgArray = [...nodeList]

        // Transformar os Nodes (elementos html) em objetos JS
        const imgList = imgArray.map(({ src }) => ({
            src
        }))

        // Colocar para fora da função
        return imgList
    })

    // Escrever  os dados em um arquivo (.json)
    fs.writeFile('file.json', JSON.stringify(imgList, null, 2), err => {
        if (err) throw new Error('Something went wrong')
        console.log('Well done!')
    })

    await browser.close()
})()
