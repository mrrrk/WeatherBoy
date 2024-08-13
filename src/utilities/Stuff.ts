module Stuff {

    const dayText = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthText = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const pad2 = (value: string|number) => {
        const s = String(value);
        return s.length == 1 ? `0${s}` : s;
    }

    export const dayMonthShort = (date: Date) => {
        //return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
        return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}`;
    }

    export const dateText = (d: Date): string => {
        return `${dayText[d.getDay()]} ${pad2(d.getDate())} ${monthText[d.getMonth()]}`;
    }

    export const timeText = (d: Date): string => {
        return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
    }

    export const timeTextShort = (d: Date) => {
        return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    }

    // Julian date = number of days since January 1, 4713 BC (!!?)
    export const julianToEpochMillis = (julian: number) => (julian - 2440587.5) * 86400000.0;
    export const epochMillisToJulian = (millis: number) => millis / 86400000.0 + 2440587.5;

    //
    // -- angles
    //

    const radiansPerDegree = Math.PI / 180.0;

    export const toRadians = (d: number) => d * radiansPerDegree;

    export const toDegrees = (r: number) => r / radiansPerDegree;

    export const constrainAngle = (degrees: number) => {
        const t = degrees % 360;
        return t < 0 ? t + 360 : t;
    }

    //
    // -- etc.
    //

    export const mpsToMph = (speedMps: number) => Math.round(speedMps * 2.23694);

}

export default Stuff;