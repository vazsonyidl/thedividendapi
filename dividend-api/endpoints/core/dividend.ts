import { responseFromJson } from "@chiselstrike/api"

export default async function chisel(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const cik = url.searchParams.get('cik');
    if(!cik) return responseFromJson({error: 'Missing'}, 400)
    const reponse = await fetch(`https://data.sec.gov/api/xbrl/companyconcept/${cik}/us-gaap/CommonStockDividendsPerShareCashPaid.json`).then(response => response.json());
    return responseFromJson(reponse, 200);
}