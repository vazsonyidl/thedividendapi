import { responseFromJson } from '@chiselstrike/api'
import { Ticker, TickerReponse } from '../../../interfaces/ticker/ticker.interface'

export default async function chisel(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const quote = url.searchParams.get('quote')

    if (!quote) return responseFromJson({ error: 'Missing quote' }, 400)
    const data = await fetch('https://www.sec.gov/files/company_tickers.json')
        .then((response) => response.json())
        .then((data: TickerReponse) => {
            return Object.values(data).find((ticker: Ticker) => ticker.ticker === quote)
        })

    return responseFromJson(data)
}
