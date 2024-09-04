// get weather today in city
// get weather tomorrow in city
// get weather in city over the year
// get weather 'is it going to snow/rain/sunshine today'

import { FastifyReply, FastifyRequest } from "fastify";

// Make sure to handle errors properly. If the 3rd party API is down, or if the city code is invalid, make sure to return the appropriate error message.
// Implement rate limiting to prevent abuse of your API. You can use a package like express-rate-limit if you are using Node.js


export async function getWeatherToday(request: FastifyRequest, reply: FastifyReply)  {
    // check redis first

    try {
        console.log(process.env.WEATHER_API_KEY)
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london?unitGroup=metric&include=days&key=SSGXSX3DAPQDLCKGK6VL9P2UZ&contentType=json`, {
            "method": "GET",
        })

        const weather = await response.json()
        return reply.status(200).send(weather)

         
    } catch(error) {
        console.log(error)
        return reply.status(400).send(error)
        
    }
}

export function getWeatherTomorrow(request: FastifyRequest, reply: FastifyReply){
    return reply.status(200).send({message: "for tomorrow!"})
}

export function getWeatherOverYear(request: FastifyRequest, reply: FastifyReply){
    return reply.status(200).send({message: "Months in the year"})
}

export function getWeatherConditionToday(request: FastifyRequest, reply: FastifyReply){
    return reply.status(200).send({message: "Months in the year"})
}