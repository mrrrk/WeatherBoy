import { IShedData } from "./SensorDataSet";

export class SensorDataPoint {

    update(raw: IShedData) {
        this.temperature = raw.temperature_c;
        this.humidity = raw.humidity;
        this.pressure = raw.pressure_hpa;
    }

    temperature: number = 0;
    humidity: number = 0;
    pressure: number = 0;
    error: string = "";

    get isError(): boolean {
        return !!this.error;
    }
}