<template>
    <div>
        <div><span class="legend">Forecast at</span>{{ forecastWhen }}</div>
        <div><span class="legend">Pressure</span>{{pressureText}}</div>
        <div><span class="legend">Humidity</span>{{ humidityText }}</div>

        <div style="margin-top:5px"><b>Precipitation:</b></div>
        <div><span class="legend">Probability</span>{{ forecast?.probOfPrecipitation }} %</div>
        <div><span class="legend">Amount</span>{{ forecast?.totalPrecipAmount }}</div>
        <div><span class="legend">Rate</span>{{ forecast?.precipitationRate }}</div>

    </div>
</template>

<script setup lang="ts">

    import { computed } from "vue";
    import Stuff from "@/utilities/Stuff";
    import type { IForecast } from "@/model/IForecast";

    const props = defineProps<{
        forecast: IForecast|undefined;
    }>();

    const pressureText = computed(() => `${Math.round((props.forecast?.mslp ?? 0) / 100) } mb`);
    const humidityText = computed(() => `${Math.round(props.forecast?.screenRelativeHumidity ?? 0)} %`);
    const forecastWhen = computed(() => Stuff.timeTextShort(props.forecast?.when));

</script>
