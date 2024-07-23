<template>
    <div style="position:relative">
        <div style="position:absolute;top:0;left:0">{{ dayText }} | {{ props.day?.daySignificantWeatherCode  }}</div>

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
    import type { IForecastDay } from "@/model/IForecastDay";
    import Wind from "@/components/Wind.vue";

    // const props = defineProps({
    //     day: { type: object, required: true }
    // });

    const props = defineProps<{
        day: IForecastDay|undefined;
    }>();

    const dayText = computed(() => {
        const days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
        if(props.day == null) return "- - -";
        const date = new Date(Date.parse(props.day.time));
        const day = date.getDay();
        return days[day];
    });

    const symbolStyle = computed(() => ({
        width: "90px",
        height: "80px"
    }));

    const symbolSource = computed(() => {
        if (props.day?.daySignificantWeatherCode == null) return "/WeatherSymbols/Unknown.png";
        const i = props.day?.daySignificantWeatherCode ?? 0;
        if(i < 0 || i >= symbolImageFileNames.length) return "/WeatherSymbols/Unknown.png";
        return `/WeatherSymbols/${symbolImageFileNames[i]}`;
    });

    const dayTempText = computed(() => {
        return `${Math.round(props.day?.dayMaxScreenTemperature)}°C`;
    });

    const nightTempText = computed(() => {
        return `${Math.round(props.day?.nightMinScreenTemperature)}°C`;
    });

    const windDirection = computed(() => {
        return Number(props.day?.midday10MWindDirection);
    });

    const windSpeed = computed(() => {
        return Number(props.day?.midday10MWindSpeed);
    });

    const windGustText = computed(() => {
        return `Gust: ${Math.round(props.day?.midday10MWindGust * 2.23694)}`; // m/s
        //return `Gust: ${Math.round(props.day?.midday10MWindGust * 1.15078)}`; // knots
    });

    const windDirectionText = computed(() => {
        const bearing = props.day?.midday10MWindDirection;
        const i = Math.round(bearing / 22.5);
        const dirctions = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
        return dirctions[(i % 16)];
    });

    // const imageStyle = computed(() => ({
    //     width: `${props.size}px`,
    //     position: "absolute",
    //     transform: `rotate(${props.direction}deg)`
    // }));

    const symbolImageFileNames = {
        0: "0-ClearNight.png",
        1: "1-SunnyDay.png",
        2: "2-PartlyCloudyNight.png",
        3: "3-PartlyCloudyDay.png",
        5: "5-Mist.png",
        6: "6-Fog.png",
        7: "7-Cloudy.png",
        8: "8-Overcast.png",
        9: "9-LightRainShowerNight.png",
        10: "10-LightRainShowerDay.png",
        11: "11-Drizzle.png",
        12: "12-LightRain.png",
        13: "13-HeavyRainShowerNight.png",
        14: "14-HeavyRainShowerDay.png",
        15: "15-HeavyRain.png",
        16: "16-SleetShowerNight.png",
        17: "17-SleetShowerDay.png",
        18: "18-Sleet.png",
        19: "19-HailShowerNight.png",
        20: "20-HailShowerDay.png",
        21: "21-Hail.png",
        22: "22-LightSnowShowerNight.png",
        23: "23-LightSnowShowerDay.png",
        24: "24-LightSnow.png",
        25: "25-HeavySnowShowerNight.png",
        26: "26-HeavySnowShowerDay.png",
        27: "27-HeavySnow.png",
        28: "28-ThunderShowerNight.png",
        29: "29-ThunderShowerDay.png",
        30: "30-Thunder.png"
    };

</script>