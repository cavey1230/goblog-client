export const matchSpecialSymbol = (str: string) => {
    return str.match(/((?=[\x21-\x7e]+)[^A-Za-z0-9])/g)?.length
}