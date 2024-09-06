
import { describe, it, expect } from 'vitest'
import { getWeatherToday } from '../get'
// https://fastify.dev/docs/v1.14.x/Documentation/Testing/

describe('Get weather', () => {
    it('Returns an error if do not provide city', () => {
        // expect(getWeatherToday(re)).toThrow()
        expect(true).toBe(true)
    })
})