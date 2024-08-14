<template>
    <div style="position:relative">
        <div style="position:absolute;top:0;left:0">{{ dayText }}</div>

        <div style="height:80px;position:absolute;top:30px;left:0">
            <img :src="symbolSource" :style="symbolStyle">
        </div>

        <div style="position:absolute;top:30px;right:0;text-align:right;">
            <div style="font-size:20px; font-weight:bold;">{{ dayTempText }}</div>
            <div style="font-size:18px">{{ nightTempText }}</div>
        </div>

        <div style="position:absolute;top:110px;left:0">
            <div>{{ windDirectionText }}</div>
            <div>{{ windGustText }}</div>
        </div>

        <div style="height:70px;position:absolute;top:80px;left:80px">
            <Wind :size="70" :speed="windSpeed" :direction="windDirection"></Wind>
        </div>

    </div>
</template>

<script setup lang="ts">

    import { computed } from "vue";
    import Stuff from "@/utilities/Stuff";
    import type { IForecast } from "@/model/IForecast";
    import Wind from "@/components/Wind.vue";
    import { symbolImageFileNames } from "@/model/Enums";

    // const props = defineProps({
    //     day: { type: object, required: true }
    // });

    const props = defineProps<{
        forecast: IForecast|undefined;
    }>();

    const dayText = computed(() => {
        const days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
        if(props.forecast == null) return "- - -";
        const date = new Date(Date.parse(props.forecast.time));
        const day = date.getDay();
        return days[day];
    });

    const symbolStyle = computed(() => ({
        width: "90px",
        height: "80px"
    }));

    const symbolSource = computed(() => {
        if (props.forecast?.daySignificantWeatherCode == null) return "/img/WeatherSymbols/Unknown.png";
        const i = props.forecast?.daySignificantWeatherCode ?? 0;
        if(!symbolImageFileNames.hasOwnProperty(i)) return "/img/WeatherSymbols/Unknown.png";
        return `/img/WeatherSymbols/${(symbolImageFileNames as any)[i]}`;
    });

    const dayTempText = computed(() => {
        return `${Math.round(props.forecast?.dayMaxScreenTemperature ?? 0)}°C`;
    });

    const nightTempText = computed(() => {
        return `${Math.round(props.forecast?.nightMinScreenTemperature ?? 0)}°C`;
    });

    const windDirection = computed(() => {
        return Number(props.forecast?.midday10MWindDirection);
    });

    const windSpeed = computed(() => {
        return Number(props.forecast?.midday10MWindSpeed);
    });

    const windGustText = computed(() => {
        return `Gust: ${Stuff.mpsToMph(props.forecast?.midday10MWindGust ?? 0 * 2.23694)}`; // m/s
    });

    const windDirectionText = computed(() => {
        const bearing = props.forecast?.midday10MWindDirection ?? 0;
        const i = Math.round(bearing / 22.5);
        const dirctions = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
        return dirctions[(i % 16)];
    });

</script>