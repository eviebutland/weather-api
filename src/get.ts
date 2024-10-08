import { FastifyRedis } from "@fastify/redis";
import { FastifyReply, FastifyRequest } from "fastify";
import { secondsUntilMidnight } from "./utils/time";

async function getWeather (day: string, city:string, apiKey: string) {
    return await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${day}?unitGroup=metric&include=days&key=${apiKey}&contentType=json`, {
        "method": "GET",
    })
}

export async function getWeatherToday(redis: FastifyRedis, request: FastifyRequest, reply: FastifyReply)  {
    try {
        if (!request.query?.city) {
            return reply.status(400).send({message: 'Please provide a city'})
        }

        const today = new Date().toISOString()
        const shorthandToday = today.split('T')[0]
        const redisKey = `${request.query?.city}:${shorthandToday}`

        const storedTemp = await redis.hget(redisKey, 'temp')
       
        if(storedTemp){
            const today = await redis.hgetall(redisKey)
            
            return reply.status(200).send({message: 'Collected from stored value', today})
        } else {
            const response = await getWeather(today, request.query?.city, request.getEnvs()?.WEATHER_API_KEY)
        
            if(response.status === 400){
                return reply.status(400).send({error: 'Bad request, please check your city'})
            } 
    
            if(response.status === 500){
                return reply.status(500).send({error: 'Something went wrong, please try again later'})
            }
            
            const weather = await response.json()
    
            await redis.hset(redisKey, 
                'temp', weather.days[0].temp, 
                'description', weather.days[0].description,
                'tempmax', weather.days[0].tempmax, 
                'precip', weather.days[0].precip, 
                'snow',  weather.days[0].snow, 
                'feelslike', weather.days[0].feelslike,
                'uvindex',  weather.days[0].uvindex)

            await redis.expire(redisKey, secondsUntilMidnight())
            
            return reply.status(200).send(weather)
        }
    } catch(error) {
        console.log(error)
        return reply.status(400).send(error)
    }
}

export async function getWeatherTomorrow(redis: FastifyRedis, request: FastifyRequest, reply: FastifyReply){
    try {
        if (!request.query?.city) {
            return reply.status(400).send({message: 'Please provide a city'})
        }
     
        const tomorrow = new Date()
        tomorrow.setUTCDate(new Date().getUTCDate() + 1)
        const shorthandTomorrow = tomorrow.toISOString().split('T')[0]
        const redisKey = `${request.query?.city}:${shorthandTomorrow}`
        const storedTemp = await redis.hget(redisKey, 'temp')
       
        if(storedTemp){
            const tomorrow = await redis.hgetall(redisKey)
            
            return reply.status(200).send({message: 'Collected from stored value', tomorrow})
        } else {

            const response = await getWeather(tomorrow.toISOString(), request.query?.city, request.getEnvs()?.WEATHER_API_KEY)
        
            if(response.status === 400){
                return reply.status(400).send({error: 'Bad request, please check your city'})
            } 

            if(response.status === 500){
                return reply.status(500).send({error: 'Something went wrong, please try again later'})
            }
            
            const weather = await response.json()

            await redis.hset(redisKey, 
                'temp', weather.days[0].temp, 
                'description', weather.days[0].description,
                'tempmax', weather.days[0].tempmax, 
                'precip', weather.days[0].precip, 
                'snow',  weather.days[0].snow, 
                'feelslike', weather.days[0].feelslike,
                'uvindex',  weather.days[0].uvindex)

            await redis.expire(redisKey, secondsUntilMidnight())
            
            return reply.status(200).send(weather)
        }
    } catch(error) {
        console.log(error)
        return reply.status(400).send(error)
    }
}

export async function getWeatherConditionToday(redis: FastifyRedis, request: FastifyRequest, reply: FastifyReply){
    try {
        if (!request.query?.city) {
            return reply.status(400).send({message: 'Please provide a city'})
        }

        if(!request.query?.weatherCondition){
            return reply.send({error: "Please provide a weather condition, e.g. snow/rain/sunshine"})
        }

        const today = new Date().toISOString()
        const shorthandToday = today.split('T')[0]
        const tomorrow = new Date()
        tomorrow.setUTCDate(new Date().getUTCDate() + 1)
        // tomorrow.setHours(0,0,0,0)


        const redisKey = `${request.query?.city}:${shorthandToday}`

        const storedTemp = await redis.hget(redisKey, 'temp')
       
        if(storedTemp){
            const today = await redis.hgetall(redisKey)
            
            return reply.status(200).send({message: 'Collected from stored value', today})
        } else {

            const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${request.query?.city}/${today}?unitGroup=metric&include=days&key=${request.getEnvs()?.WEATHER_API_KEY}&contentType=json`, {
                "method": "GET",
            })
            
            const weather = await response.json()
            const todaysWeather = weather.days[0]

            await redis.hset(redisKey, 
                'temp', todaysWeather.temp, 
                'description', todaysWeather.description,
                'tempmax', todaysWeather.tempmax, 
                'precip', todaysWeather.precip, 
                'snow',  todaysWeather.snow, 
                'feelslike', todaysWeather.feelslike,
                'uvindex',  todaysWeather.uvindex)

            
            await redis.expire(redisKey, secondsUntilMidnight())

    
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
            
        }
    } catch (error) {
        console.log(error)
        return reply.status(400).send(error)
    }
   
}