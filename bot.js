import * as core from '@actions/core';
import Twitter from 'twitter-api-v2';
import getSentiment from './getSentiment.js';
import buildIdToUser from './helpers/buildIdToUser.js';
import isDropboxer from './helpers/isDropboxer.js';
import RETWEETS from './retweets.js';

async function bot(){
    const searchParams = {
        since_id: RETWEETS[0],
        'tweet.fields': ['author_id'],
        'user.fields': ['created_at', 'description'],
        expansions: ['author_id']
    };
    
    const twitter = new Twitter.TwitterApi({
        appKey: process.env.API_KEY,
        appSecret: process.env.API_KEY_SECRET,
        accessToken: process.env.ACCESS_TOKEN,
        accessSecret: process.env.ACCESS_TOKEN_SECRET,
    });
    
    const client = twitter.readWrite;

    try {
        const response = await client.v2.search(process.env.SEARCH, searchParams)

        const tweets = response.data.data
        const users = response.data.includes.users
        const idToUser = buildIdToUser(users)

        const didRetweet = []
        const toInvestigate = []

        for (const tweet of tweets.reverse()) {
            const user = idToUser[tweet.author_id]

            if (isDropboxer(user)) {
                await client.v2.retweet(process.env.DROPBOX_OSS_ID, tweet.id)
                didRetweet.unshift(tweet.id)
            } else {
                const sentiment = await getSentiment(tweet.text)
                const isNegative = sentiment.NEG > sentiment.NEU && sentiment.NEG > sentiment.POS
                
                if (isNegative) {
                    toInvestigate.push(tweet.id)
                } else {
                    await client.v2.retweet(process.env.DROPBOX_OSS_ID, tweet.id)
                    didRetweet.unshift(tweet.id)
                }
            }
        }

        core.setOutput('didRetweet', JSON.stringify(didRetweet))
        core.setOutput('toInvestigate', JSON.stringify(toInvestigate))
    } catch (e) {
        console.log(e)
        process.exit(-1)
    }
};

bot()

