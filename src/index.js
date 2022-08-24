import fs from 'fs'
import puppeteer from 'puppeteer'

(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto('https://storage.googleapis.com/infosimples-public/commercia/case/product.html')

    const txtList = await page.evaluate(() => {
        // Vamos pegar todas as imagens que estão na parte de posts.
        const { innerText: title } = document.querySelector('h2#product_title')
        const { innerText: brand } = document.querySelector('div.brand')
        const nodeListCategories = document.querySelectorAll('nav a')
        const { innerText: description } = document.querySelector('div.product-details p')
        const nodeListSkus = document.querySelectorAll('div.card-container')
        const nodeListProperties = document.querySelectorAll('table tbody tr')
        const { innerText: average_score } = document.querySelector('div#comments h4')
        const nodeListReviews = document.querySelectorAll('div#comments div.review-box')
        const url = window.location.href

        // Transformar o NodeList em Array.
        const arrayCategories = [...nodeListCategories]
        const arraySkus = [...nodeListSkus]
        const arrayProperties = [...nodeListProperties]
        const arratReviews = [...nodeListReviews]

        // Transformar os Nodes (elementos html) em objetos JS
        const objectCategories = arrayCategories.map(({ innerText }) => (
            innerText
        ))

        const objectSkus = arraySkus.map(({ innerText }) => {
            let [
                name,
                currentPrice = null,
                oldPrice = null,
                available = true
            ] = innerText.split("\n")

            if (currentPrice === "Out of stock") {
                currentPrice = null
                available = false
            }

            if (currentPrice !== null) {
                currentPrice = parseFloat(currentPrice.substr(2))
            }

            if (oldPrice !== null) {
                oldPrice = parseFloat(oldPrice.substr(2))
            }

            return {
                name,
                currentPrice,
                oldPrice,
                available
            }
        })

        const objectProperties = arrayProperties.map(({ innerText }) => {
            const [label, value] = innerText.split('\t')

            return {
                label,
                value
            }
        })

        const objectReviews = arratReviews.map(({ innerText }) => {
            const [left, text] = innerText.split('\n\n')
            const [name, date, stars] = left.split('\n')

            const score = Number((stars.match(/★/g) || []).length)

            return {
                name,
                date,
                score,
                text
            }
        })

        const score = average_score.substr(15)
        const reviews_average_score = parseFloat(score.replace('/5', ''))

        // Montando o objeto JS
        const resultFinal = {
            title,
            brand,
            categories: objectCategories,
            description,
            skus: objectSkus,
            properties: objectProperties,
            reviews: objectReviews,
            reviews_average_score,
            url
        }

        // Colocar para fora da função
        return resultFinal
    })

    // Escrever  os dados em um arquivo (.json)
    fs.writeFile('produto.json', JSON.stringify(txtList, null, 2), err => {
        if (err) {
            throw new Error('Something went wrong')
        }
        console.log('Well done!')
    })

    await browser.close()
})()
