<template>
    <div style="position:relative;">
        <img :src="weatherBoySource" style="width: 160px; position:absolute; top:10px;left:10px" />

        <img :src="symbolSource" style="width: 100px; position:absolute; top:10px;right:10px" />

        <div style="width: 130px; position:absolute; top:120px;right:0px;">
            <!-- <div><span class="legend" style="min-width: 30px;">Min</span>{{ temperatureMinText }}</div> -->
            <!-- <div><span class="legend" style="min-width: 30px;">Max</span>{{ temperatureMaxText }}</div> -->
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
        if (props.forecast?.significantWeatherCode == null) return "/img/WeatherSymbols/Unknown.png";
        const i = props.forecast?.significantWeatherCode ?? 0;
        if(!symbolImageFileNames.hasOwnProperty(i)) return "/img/WeatherSymbols/Unknown.png";
        return `/img/WeatherSymbols/${(symbolImageFileNames as any)[i]}`;

    });

    const weatherBoySource = computed(() => {
        // TODO - use temperature + precipitation or symbol (???)
        // hat / scarf / coat / jumper / sweatshirt / tshirt / shorts / trunks
        // dry / rain1 / rain2

        const forecast = props.forecast;
        if(!forecast) return "/img/WeatherBoy/Unknown.png";
        const temperature = (forecast?.feelsLikeTemperature ?? 0);
        const precipitation = (forecast?.probOfPrecipitation ?? 0);

        if(forecast.significantWeatherCode === 1 && (forecast?.feelsLikeTemperature ?? 0) > 22) return "/img/WeatherBoy/Trunks.png";

        const rain =
            precipitation >= 70 ? "Rain2" :
            precipitation >= 20 ? "Rain1" :
            "Dry";
        const clothes =
            temperature >= 22 ? "Shorts" :
            temperature >= 17 ? "Tshirt" :
            temperature >= 14 ? "Sweatshirt" :
            temperature >= 10 ? "Jumper" :
            temperature >= 6 ? "Coat" :
            temperature >= 2 ? "Scarf" :
            "Hat";

        return `/img/WeatherBoy/${clothes}${rain}.png`;

    });

</script>