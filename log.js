import fs from 'fs'
import oldest from './retweets.js'

function log(){
    const newest = process.env.DID_RETWEET
    const latest = [...newest, ...oldest]
    fs.writeFile('./retweets.js', latest, err => {
        console.log(err)
    })
}


log()