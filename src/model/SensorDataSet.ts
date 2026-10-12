import { SensorDataPoint } from "@/model/SensorDataPoint";

export interface IShedData{
    temperature_c: number;
    humidity: number;
    pressure_hpa: number;
}

export class SensorDataSet {

    shedDataPoint = new SensorDataPoint();
    loungeDataPoint = new SensorDataPoint();
    // todo - other sensors (bedroom, kitchen, lounge...)

    async refresh() {
        await this.load("http://192.168.151.186", this.shedDataPoint);
        await this.load("http://192.168.151.186", this.loungeDataPoint);
        // + other sensors...
    }

    async load(url: string, target: SensorDataPoint) {
        try {
            const response = await fetch(url, { method: "GET" });
            if(response.status !== 200) {
                target.error = `HTTP error ${response.status}`;
                return;
            }
            // todo - different data interfaces?  standardise?
            const data: IShedData = await response.json();
            target.update(data);
            target.error = "";
        }
        catch (error) {
            console.log("error trap...");
            target.error = `ERROR: ${error}`;
        }
    }
}