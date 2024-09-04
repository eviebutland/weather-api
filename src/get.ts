// get weather today in city
// get weather tomorrow in city
// get weather in city over the year
// get weather ' is it going to snow/rain/sunshine today'

import { FastifyReply, FastifyRequest } from "fastify";

export function getWeatherToday(request: FastifyRequest, reply: FastifyReply)  {
    // check redis first
    console.log('get weather today being called')
    return reply.status(200).send({message: "Yay!"})
}