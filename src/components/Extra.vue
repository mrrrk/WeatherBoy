<template>
    <div>
        <div>Time:{{ forecastWhen }}</div>
        <div>Pressure: {{pressureText}}</div>
        <div>Humidity: {{ humidityText }}</div>
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
    const humidityText = computed(() => `${Math.round(props.forecast?.screenRelativeHumidity ?? 0)}%`);
    const forecastWhen = computed(() => Stuff.timeTextShort(props.forecast?.when));

</script>