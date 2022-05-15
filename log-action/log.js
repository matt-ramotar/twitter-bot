import fs from 'fs'
import oldest from '../retweets.js'

function log(){
    const newestStr = process.env.DID_RETWEET
    const newest = JSON.parse(newestStr)

    const latest = [...newest, ...oldest]
    const content = `
    const retweets = [${latest.map(tweetId => `\"${tweetId}\"`)}];

    export default retweets;
    `
    
    fs.writeFile('./retweets.js', content, err => {
        console.log(err)
    })
}


log()