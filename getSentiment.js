import axios from 'axios'

export default async function getSentiment(text) {
    const response = await axios({
        method: "POST",
        url: process.env.SENTIMENT_ANALYSIS_MODEL,
        headers: { Authorization: `Bearer ${process.env.SENTIMENT_ANALYSIS_MODEL_DEPLOYMENT}` },
        data: JSON.stringify({ "inputs": text }),
    })

    const sentiment = {}

    response.data[0].forEach(analysis => {
        sentiment[analysis.label] = analysis.score
    })

    return sentiment
}