import type { IForecastDay } from "@/model/IForecastDay";

module MetofficeData {

    export const load = async (): Promise<Array<IForecastDay>> => {

        //const lat = encodeURIComponent("52.91782940803691");
        //const lon = encodeURIComponent("-1.2334558742728607");

        const lat = encodeURIComponent("52.917");
        const lon = encodeURIComponent("-1.233");
        const url = `https://data.hub.api.metoffice.gov.uk/sitespecific/v0/point/daily?latitude=${lat}&longitude=${lon}&excludeParameterMetadata=True&includeLocationName=True`;

        //console.log("URL = ", url);

        const headers = new Headers();
        headers.append("apiKey", "eyJ4NXQiOiJOak16WWpreVlUZGlZVGM0TUdSalpEaGtaV1psWWpjME5UTXhORFV4TlRZM1ptRTRZV1JrWWc9PSIsImtpZCI6ImdhdGV3YXlfY2VydGlmaWNhdGVfYWxpYXMiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJtcnJya0BtcnJyay5uZXRAY2FyYm9uLnN1cGVyIiwiYXBwbGljYXRpb24iOnsib3duZXIiOiJtcnJya0BtcnJyay5uZXQiLCJ0aWVyUXVvdGFUeXBlIjpudWxsLCJ0aWVyIjoiVW5saW1pdGVkIiwibmFtZSI6InNpdGVfc3BlY2lmaWMtY2JlMmM2ZDQtMDUyOS00ZWI2LWIzYWQtMzNhMjAxMTNmNTM5IiwiaWQiOjU0MjgsInV1aWQiOiJhZWMyZDFhOS00MTRmLTRmYzItOGZhYy03YjlmZTUwNjRmNzAifSwiaXNzIjoiaHR0cHM6XC9cL2FwaS1tYW5hZ2VyLmFwaS1tYW5hZ2VtZW50Lm1ldG9mZmljZS5jbG91ZDo0NDNcL29hdXRoMlwvdG9rZW4iLCJ0aWVySW5mbyI6eyJ3ZGhfc2l0ZV9zcGVjaWZpY19mcmVlIjp7InRpZXJRdW90YVR5cGUiOiJyZXF1ZXN0Q291bnQiLCJncmFwaFFMTWF4Q29tcGxleGl0eSI6MCwiZ3JhcGhRTE1heERlcHRoIjowLCJzdG9wT25RdW90YVJlYWNoIjp0cnVlLCJzcGlrZUFycmVzdExpbWl0IjowLCJzcGlrZUFycmVzdFVuaXQiOiJzZWMifX0sImtleXR5cGUiOiJQUk9EVUNUSU9OIiwic3Vic2NyaWJlZEFQSXMiOlt7InN1YnNjcmliZXJUZW5hbnREb21haW4iOiJjYXJib24uc3VwZXIiLCJuYW1lIjoiU2l0ZVNwZWNpZmljRm9yZWNhc3QiLCJjb250ZXh0IjoiXC9zaXRlc3BlY2lmaWNcL3YwIiwicHVibGlzaGVyIjoiSmFndWFyX0NJIiwidmVyc2lvbiI6InYwIiwic3Vic2NyaXB0aW9uVGllciI6IndkaF9zaXRlX3NwZWNpZmljX2ZyZWUifV0sInRva2VuX3R5cGUiOiJhcGlLZXkiLCJpYXQiOjE3MjE2NDI5MjksImp0aSI6ImI2N2VmMjhmLTAwOTItNDZhNS1iZWI2LTc0ZmVhYmNjMmI1ZSJ9.hEtfzpTXPLB153_1dAvXrCgTiEsh7eMfGYPW6pSzXfsxjHs5JJz65flypGcHH0Wf_LxSFB0QlrmT1i6O3j8o0W9dy5FjLNEZ8dha5VGGRuiv2db6WKEFk4ML-i8lQzL5hJQNHsKUuNs53mwipx5B5hDwFaOyGOxx6tn5og7RoPxdGGVzZuuWhFedvufFYX7WR8q05e7gJjS0B5ww-L0pPbL5luBPFR97FL3DKrHgWHw0s7GQSGi7c4HLFJm3TuZwF2rp67jbRkTfix_vJwvWpWbRS2MuA_POzZ9bZPgYyqk9FgpmGKOJq1AUvVRkcpR97Qyd7p-HIweLaRjRJZ8WWQ==");
        headers.append("Content-Type", "application/json");

        const response = await fetch(url, {
            method: "GET",
            headers: headers
        });

        const data: any = await response.json();

        const timeSeries = data.features[0]?.properties?.timeSeries as Array<IForecastDay> | undefined;

        //console.log("METOFFICE = ", data);
        //console.log("timeSeries = ", timeSeries);

        return timeSeries ? timeSeries : [];
    }
}

export default MetofficeData;