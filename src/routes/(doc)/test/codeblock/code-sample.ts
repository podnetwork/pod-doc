export const jsSample = `fetch('https://baconipsum.com/api/?type=meat-and-filler');`;

export const pySample = `import requests

response = requests.get('https://baconipsum.com/api/?type=meat-and-filler')`;

export const rustSample = `use reqwest::Error;

async fn fetch_bacon() -> Result<String, Error> {
    let response = reqwest::get("https://baconipsum.com/api/?type=meat-and-filler").await?;
    response.text().await
}`;
