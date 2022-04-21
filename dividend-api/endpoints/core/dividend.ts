import { responseFromJson } from '@chiselstrike/api'
import { differenceInCalendarMonths, parseISO } from 'date-fns'

export default async function chisel(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const cik = url.searchParams.get('cik')

    if (!cik) return responseFromJson({ error: 'Missing params' }, 400)
    const _cik = `CIK${cik.padStart(10, '0')}`

    let response = null;
    let response2 = null;

    try {
        response = await fetch(
            `https://data.sec.gov/api/xbrl/companyconcept/${_cik}/us-gaap/CommonStockDividendsPerShareCashPaid.json`
        )
            .then((response) => {
                if(response.ok) return response.json();
                throw Error('Something went wrong');
            })
            .then((reponse) =>
                reponse.units['USD/shares'].filter(
                    (unit) =>
                        unit.form === '10-Q' &&
                        differenceInCalendarMonths(
                            parseISO(unit.end),
                            parseISO(unit.start)
                        ) < 4
                )
            )
    } catch(error) {
        console.log(error, 'error1');
    }
    try {
        response2 = await fetch(
                `https://data.sec.gov/api/xbrl/companyconcept/${_cik}/us-gaap/CommonStockDividendsPerShareDeclared.json`
            )
                .then((response) => response.json())
                .then((reponse) =>
                    reponse.units['USD/shares'].filter(
                        (unit) =>
                            unit.form === '10-Q' &&
                            differenceInCalendarMonths(
                                parseISO(unit?.end || new Date().toISOString()),
                                parseISO(unit?.start|| new Date().toISOString())
                            ) < 4
                    )
                )
    } catch (error) {
        console.log(error, 'error2');
    }

    return response || response2 ? responseFromJson({paid: response, declared: response2}, 200) : responseFromJson({error: 'Error'}, 500);

}
