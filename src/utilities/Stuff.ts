module Stuff {

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const pad2 = (value: string|number) => {
        const s = String(value);
        return s.length == 1 ? `0${s}` : s;
    }

    export const dayMonthShort = (d: Date | undefined) => {
        return d ? `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}` : "- - -";
    }

    export const dateText = (d: Date | undefined): string => {
        return d ? `${dayNames[d.getDay()]} ${pad2(d.getDate())} ${monthNames[d.getMonth()]}` : "- - -";
    }

    export const dayText = (d: Date | undefined): string => {
        return d ? dayNames[d.getDay()] : "- - -";
    }

    export const timeText = (d: Date | undefined): string => {
        return d ? `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}` : "- - -";
    }

    export const timeTextShort = (d: Date | undefined) => {
        return d ? `${pad2(d.getHours())}:${pad2(d.getMinutes())}` : "- - -";
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