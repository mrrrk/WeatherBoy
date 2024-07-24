import type { IForecastDay } from "@/model/IForecastDay";
import Secrets from "@/utilities/Secrets";

interface IMetofficeData {
    timestamp: number;
    days: Array<IForecastDay>
}

module MetofficeData {

    const saveLocal = (days: Array<IForecastDay>) => {
        const json = JSON.stringify({
            timestamp: new Date().getTime(),
            days
        });
        localStorage.setItem("met-office-data" ,json)
    }

    const loadLocal = (): IMetofficeData | null => {
        const json = localStorage.getItem("met-office-data");
        if(json == null) return null;
        const data = JSON.parse(json) as IMetofficeData;
        return data;
    }

    const loadFromApi = async (): Promise<Array<IForecastDay>> => {
        // TODO - try catch...
        // TODO - non-200 responses
        // TODO - what about errors?

        const lat = encodeURIComponent(String(Secrets.latitude));
        const lon = encodeURIComponent(String(Secrets.longitude));
        const url = `https://data.hub.api.metoffice.gov.uk/sitespecific/v0/point/daily?latitude=${lat}&longitude=${lon}&excludeParameterMetadata=True&includeLocationName=True`;

        console.log("URL = ", url);

        const headers = new Headers();
        headers.append("apiKey", Secrets.MetOfficeApiKey);
        headers.append("Content-Type", "application/json");

        const response = await fetch(url, {
            method: "GET",
            headers: headers
        });

        const data: any = await response.json();

        const timeSeries = data.features[0]?.properties?.timeSeries as Array<IForecastDay> | undefined;

        console.log("METOFFICE = ", data);
        //console.log("timeSeries = ", timeSeries);

        return timeSeries ? timeSeries : [];
    }

    export const load = async(): Promise<Array<IForecastDay>> => {
        const localData = loadLocal();
        if(localData == null) {
            const apiData = await loadFromApi();
            if(apiData.length > 0) {
                saveLocal(apiData);
                console.log("+++ load - local is null, called API");
                return apiData;
            }
            console.log("+++ load - local is null and failed to call API");
            return []; // :-(
        }
        // refresh if older than 10 mins
        const isOld =  localData.timestamp < new Date(new Date().getTime() - (1000 * 60 * 15)).getTime();
        if(isOld) {
            const apiData = await loadFromApi();
            if(apiData.length > 0) {
                saveLocal(apiData);
                console.log("+++ load - local is old, called API");
                return apiData;
            }
        }
        console.log("+++ load - using local data - old = ", isOld);
        return localData.days;
    }

}

export default MetofficeData;