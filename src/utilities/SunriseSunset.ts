
import type { ISunriseSunset } from "@/model/ISunriseSunset";
import Secrets from "@/utilities/Secrets";

module SunriseSunset {

    let lastLoaded: Date = new Date(0);
    let data: ISunriseSunset|null = null;

    const loadFromApi = async (): Promise<void> => {
        // TODO - try catch...
        // TODO - non-200 responses
        // TODO - what about errors?

        const lat = encodeURIComponent(String(Secrets.latitude));
        const lng = encodeURIComponent(String(Secrets.longitude));
        const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`;
        const response = await fetch(url);
        const responseData: ISunriseSunset = await response.json();
        data = responseData;
        lastLoaded = new Date();
    }

    export const load = async(): Promise<ISunriseSunset|null> => {
        const isOld = lastLoaded.getTime() < new Date(new Date().getTime() - (1000 * 60 * 15)).getTime();
        if (data != null && !isOld) {
            return data;
        }
        await loadFromApi();
        return data;
    }

}

export default SunriseSunset;