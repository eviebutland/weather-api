export function secondsUntilMidnight() {
    const now = new Date()
    const midnight = new Date(now)

    midnight.setHours(24, 0, 0, 0)
    return Math.floor((Number(midnight) - Number(now)) / 1000)
}
