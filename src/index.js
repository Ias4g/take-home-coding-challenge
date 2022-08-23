import fs from 'fs'
import puppeteer from 'puppeteer'

(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto('https://storage.googleapis.com/infosimples-public/commercia/case/product.html')

    const txtList = await page.evaluate(() => {
        // Toda esta função será executada no browser.
        // Vamos pegar todas as imagens que estão na parte de posts.
        const { innerText: title } = document.querySelector('h2#product_title')
        const { innerText: brand } = document.querySelector('div.brand')
        const nodeListCategories = document.querySelectorAll('nav a')
        const { innerText: description } = document.querySelector('div.product-details p')
        const nodeListSkus = document.querySelectorAll('div.card-container')
        const { innerText: reviews_average_score } = document.querySelector('div#comments h4')

        // Transformar o NodeList em Array.
        const arrayCategories = [...nodeListCategories]
        const arraySkus = [...nodeListSkus]

        // Transformar os Nodes (elementos html) em objetos JS
        const objectCategories = arrayCategories.map(({ innerText }) => (
            innerText
        ))

        const objectSkus = arraySkus.map(({ innerText }) => {
            const [
                name,
                currentPrice = null,
                oldPrice = null,
                available = false
            ] = innerText.split("\n")

            return {
                name,
                currentPrice,
                oldPrice,
                available
            }
        })

        // Montando o objeto JS
        const resultFinal = {
            title,
            brand,
            categories: objectCategories,
            description,
            objectSkus,
            reviews_average_score
        }

        // Colocar para fora da função
        return resultFinal
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
