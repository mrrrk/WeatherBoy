import type { IForecast } from "@/model/IForecast";
import Secrets from "@/utilities/Secrets";

interface IMetofficeData {
    timestamp: number;
    forecasts: Array<IForecast>
}

module MetofficeData {

    const saveLocal = (timeSteps: string, forecasts: Array<IForecast>) => {
        const json = JSON.stringify({
            timestamp: new Date().getTime(),
            forecasts
        });
        localStorage.setItem(`met-office-data-${timeSteps}` ,json)
    }

    const loadLocal = (timeSteps: string): IMetofficeData | null => {
        const json = localStorage.getItem(`met-office-data-${timeSteps}`);
        if(json == null) return null;
        const data = JSON.parse(json) as IMetofficeData;
        setDates(data.forecasts);
        return data;
    }

    const setDates = (forecasts?: Array<IForecast>): void => {
        if (!forecasts) return;
        for(const forecast of forecasts) {
            forecast.when = new Date(Date.parse(forecast.time));
        }
    }

    // TODO - report error somehow...
    const loadFromApi = async (timeSteps: string): Promise<Array<IForecast>> => {
        if(timeSteps !== "daily" && timeSteps !== "three-hourly" && timeSteps !== "hourly") {
            console.error("Incorrect time step argument: ", timeSteps);
            return [];
        }
        const lat = encodeURIComponent(String(Secrets.latitude));
        const lon = encodeURIComponent(String(Secrets.longitude));
        const url = `https://data.hub.api.metoffice.gov.uk/sitespecific/v0/point/${timeSteps}?latitude=${lat}&longitude=${lon}&excludeParameterMetadata=True&includeLocationName=True`;
        //console.log("URL = ", url);
        const headers = new Headers();
        headers.append("apiKey", Secrets.MetOfficeApiKey);
        headers.append("Content-Type", "application/json");
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: headers
            });
            if(response.status !== 200) {
                console.error("HTTP Error: ", response.statusText);
                return [];
            }
            const data: any = await response.json();
            const forecasts = data.features[0]?.properties?.timeSeries as Array<IForecast> | undefined;
            setDates(forecasts);
            return forecasts ? forecasts : [];
        } catch (error) {
            console.error("Error: ", error);
            return [];
        }
    }

    export const load = async(timeSteps: string): Promise<Array<IForecast>> => {
        const localData = loadLocal(timeSteps);
        if(localData == null) {
            const forecasts = await loadFromApi(timeSteps);
            if(forecasts.length > 0) {
                saveLocal(timeSteps, forecasts);
                console.log(`+++ load ${timeSteps} - local is null, called API`);
                return forecasts;
            }
            console.log(`+++ load ${timeSteps} - local is null and failed to call API`);
            return []; // :-(
        }

        // refresh if older than X
        const maxAgeMinutes = timeSteps == "daily" ? 120 : 15;
        const isOld = localData.timestamp < new Date(new Date().getTime() - (1000 * 60 * maxAgeMinutes)).getTime();

        if(isOld) {
            const forecasts = await loadFromApi(timeSteps);
            if(forecasts.length > 0) {
                saveLocal(timeSteps, forecasts);
                console.log(`+++ load ${timeSteps} - local is old, called API`);
                return forecasts;
            }
        }
        console.log(`+++ load  ${timeSteps} - using local data - old = `, isOld);
        return localData.forecasts;
    }
}

export default MetofficeData;