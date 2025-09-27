export function getOneYearFromNow() {
    return Date.now() + 1000 * 60 * 60 * 24 * 365
}
export function get30daysfromNow() {
    return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
}
export function getOneHourFromNow() {
    return new Date(Date.now() + 1000 * 60 * 60)
}


export const ONE_DAY_MILIS = 24 * 60 * 60 * 1000;

export const getFiveMinsAgo = () => new Date(Date.now() - 5 * 60 * 1000);