import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json'
import { request } from 'http';

test.beforeEach(async({page})=>{
  await page.route('*/**/api/tags', async route => {
    await route.fulfill({
      body: JSON.stringify(tags)
    })
  })

 

  await page.goto('https://angular.realworld.how/')
})

test('has title', async ({ page }) => {
  await page.route('*/**/api/articles*', async route => {
    const response = await route.fetch()
    const responseBody = await response.json()
    responseBody.articles[0].title = "Mock TEST TITLE"
    responseBody.articles[0].description = "MOCK DESCRIPTiON in the TEST"

    await route.fulfill({
      body: JSON.stringify(responseBody)
    })
  })

  await page.getByText('Global Feed').click()
  await expect(page.locator('.navbar-brand')).toHaveText('conduit');
  await expect(page.locator('app-article-list h1').first()).toContainText("Mock TEST TITLE")
  await expect(page.locator('app-article-list p').first()).toContainText("MOCK DESCRIPTiON in the TEST")

});

test('delete article', async({page, request})=>{
 const response = await request.post('https://api.realworld.io/api/users/login', {
  data: {

user: {email: "test@test25.com", password: "password1"}
  }
})
const responseBody = await response.json()
const accessToken = responseBody.user.token
console.log("THIS IS THE ACCESS TOKEN", accessToken)
await page.waitForTimeout(5000)

const responseArticle = await request.post('https://api.realworld.io/api/articles/', {
  data: {
    "article":{"title":"ARTICLE 508","description":"DESCRIPTION 1","body":"BODY BODY BODY 1","tagList":[]},
    headers: {Authorization: `Token ${accessToken}`
  }  
  }
})
console.log(responseArticle)
// expect(responseArticle.status()).toEqual(201)
})

