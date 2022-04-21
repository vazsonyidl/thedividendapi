export interface Ticker {
    cik_str: number
    ticker: string
    title: string
}

export interface TickerReponse {
    [key: string]: Ticker
}
