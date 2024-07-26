<template>
    <div style="position:relative;">
        <img :src="weatherBoySource" style="width: 200px; position:absolute; top:20px;left:0" />

        <img :src="symbolSource" style="width: 100px; position:absolute; top:10px;right:0" />

        <div style="width: 120px; position:absolute; top:120px;right:10px">
P% = {{ forecast?.probOfPrecipitation }}<br>
amount = {{ forecast?.totalPrecipAmount }}<br>
rate = {{ forecast?.precipitationRate }}<br>
        </div>
    </div>
</template>

<script setup lang="ts">

    import { computed } from "vue";
    import type { IForecast } from "@/model/IForecast";
    import { symbolImageFileNames } from "@/model/Enums";

    const props = defineProps<{
        forecast: IForecast|undefined;
    }>();

    const temperatureMinText = computed(() => `${props.forecast?.nightMinScreenTemperature}°C`);
    const temperatureMaxText = computed(() => `${props.forecast?.dayMaxScreenTemperature}°C`);

    const symbolSource = computed(() => {
        if (props.forecast?.significantWeatherCode == null) return "/WeatherSymbols/Unknown.png";
        const i = props.forecast?.significantWeatherCode ?? 0;
        if(i < 0 || i >= symbolImageFileNames.length) return "/WeatherSymbols/Unknown.png";
        return `/WeatherSymbols/${symbolImageFileNames[i]}`;
    });

    const weatherBoySource = computed(() => {
        // TODO - use temperature + precipitation or symbol (???)
        // hat / scarf / coat / jumper / sweatshirt / tshirt / shorts / trunks
        // dry / rain1 / rain2

        const forecast = props.forecast;
        if(!forecast) return "/WeatherBoy/Unknown.png";

        if(forecast.significantWeatherCode === 1 && forecast.feelsLikeTemperature > 22) return "/WeatherBoy/Trunks.png";

        const rain =
            forecast.probOfPrecipitation >= 70 ? "Rain2" :
            forecast.probOfPrecipitation >= 20 ? "Rain1" :
            "Dry";
        const clothes =
            forecast.feelsLikeTemperature >= 22 ? "Shorts" :
            forecast.feelsLikeTemperature >= 17 ? "Tshirt" :
            forecast.feelsLikeTemperature >= 14 ? "Sweatshirt" :
            forecast.feelsLikeTemperature >= 10 ? "Jumper" :
            forecast.feelsLikeTemperature >= 6 ? "Coat" :
            forecast.feelsLikeTemperature >= 2 ? "Scarf" :
            "Hat";

        return `/WeatherBoy/${clothes}${rain}.png`;

    });

</script>