import fs from 'fs'
import puppeteer from 'puppeteer'

(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto('https://storage.googleapis.com/infosimples-public/commercia/case/product.html')

    const txtList = await page.evaluate(() => {
        // Toda esta função será executada no browser.
        // Vamos pegar todas as imagens que estão na parte de posts.
        const nodeList = document.querySelectorAll('h2')

        // Transformar n NodeList em Array.
        const txtArray = [...nodeList]

        // Transformar os Nodes (elementos html) em objetos JS
        const txtList = txtArray.map(({ innerText }) => ({
            innerText
        }))


        // Colocar para fora da função
        return txtList
    })

    // Escrever  os dados em um arquivo (.json)
    fs.writeFile('file.json', JSON.stringify(txtList, null, 2), err => {
        if (err) {
            throw new Error('Something went wrong')
        }

        console.log('Well done!')
    })


    await browser.close()
    console.log(txtList)
})()
