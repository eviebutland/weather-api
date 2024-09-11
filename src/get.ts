import { FastifyRedis } from "@fastify/redis";
import { FastifyReply, FastifyRequest } from "fastify";

async function getWeather (day: string, city:string, apiKey: string) {
    return await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${day}?unitGroup=metric&include=days&key=${apiKey}&contentType=json`, {
        "method": "GET",
    })
}

export async function getWeatherToday(redis: FastifyRedis, request: FastifyRequest, reply: FastifyReply)  {
    // HEXISTS [london]:[dateUTC] conditions
    try {
        
      
        const value = await redis.hexists('location', 'london');

        console.log(value)
        if(value > 0){
            // update key with new temp?
        }
       
        if (!request.query?.city) {
            return reply.status(400).send({message: 'Please provide a city'})
        }
        const today = new Date().toISOString()

        const response = await getWeather(today,request.query?.city, request.getEnvs()?.WEATHER_API_KEY)
    

        if(response.status === 400){
            return reply.status(400).send({error: 'Bad request, please check your city'})
        } 

        if(response.status === 500){
            return reply.status(500).send({error: 'Something went wrong, please try again later'})
        }
        
        const weather = await response.json()


        // call to redis SET weather weathet NX 
        // NX being set this if it doesn't already exist
        return reply.status(200).send(weather)
    } catch(error) {
        console.log(error)
        return reply.status(400).send(error)
        
    }
}

export async function getWeatherTomorrow(redis: FastifyRedis, request: FastifyRequest, reply: FastifyReply){
    // check redis first
    try {
        if (!request.query?.city) {
            return reply.status(400).send({message: 'Please provide a city'})
        }
     
        const tomorrow = new Date()
        tomorrow.setUTCDate(new Date().getUTCDate() + 1)


        const response = await getWeather(tomorrow.toISOString(), request.query?.city, request.getEnvs()?.WEATHER_API_KEY)
    
        if(response.status === 400){
            return reply.status(400).send({error: 'Bad request, please check your city'})
        } 

        if(response.status === 500){
            return reply.status(500).send({error: 'Something went wrong, please try again later'})
        }
        
        const weather = await response.json()
        return reply.status(200).send(weather)
    } catch(error) {
        console.log(error)
        return reply.status(400).send(error)
    }
}

export async function getWeatherConditionToday(redis: FastifyRedis, request: FastifyRequest, reply: FastifyReply){
    // check redis first
    try {
        if (!request.query?.city) {
            return reply.status(400).send({message: 'Please provide a city'})
        }

        if(!request.query?.weatherCondition){
            return reply.send({error: "Please provide a weather condition, e.g. snow/rain/sunshine"})
        }

        const today = new Date().toISOString()

        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${request.query?.city}/${today}?unitGroup=metric&include=days&key=${request.getEnvs()?.WEATHER_API_KEY}&contentType=json`, {
            "method": "GET",
        })
        
        const weather = await response.json()
        const todaysWeather = weather.days[0]

        if(request.query?.weatherCondition === 'snow'){
            return todaysWeather.snow > 0 ? reply.status(200).send({snowDepth: todaysWeather.snowDepth, 
                conditions: `${todaysWeather.conditions}. ${todaysWeather.description}`}) 
                : reply.status(200).send({conditions:  `${todaysWeather.conditions}. ${todaysWeather.description}`})
        }

        if(request.query?.weatherCondition === 'rain'){
            return todaysWeather.precipprob > 0 ? 
                reply.status(200).send({
                    precip: todaysWeather.precip, 
                    precipprob: `${todaysWeather.precipprob}%`,
                    conditions: `${todaysWeather.conditions}. ${todaysWeather.description}`
                }) : reply.status(200).send({conditions: `${todaysWeather.conditions}. ${todaysWeather.description}`, 
                    precipprob: `${todaysWeather.precipprob}%`,})
        }

        if(request.query.weatherCondition === 'sunshine'){
            return todaysWeather.cloudcover < 30 ? reply.status(200).send({
                conditions: `${todaysWeather.conditions}. ${todaysWeather.description}`, 
                uvindex: todaysWeather.uvindex, 
                cloudcover: todaysWeather.cloudcover, 
                solarradiation: todaysWeather.solarradiation}) 
                : reply.status(200).send({
                    conditions: `${todaysWeather.conditions}. ${todaysWeather.description}`, 
                    precipprob: `${todaysWeather.precipprob}%`,})
        }
    } catch (error) {
        console.log(error)
        return reply.status(400).send(error)
    }
   
}