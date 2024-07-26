<template>
    <div>
        <div>Time:{{ forecastWhen }}</div>
        <div>Pressure: {{pressureText}}</div>
        <div>Humidity: {{ humidityText }}</div>
    </div>
</template>

<script setup lang="ts">

    import { computed } from "vue";
    import type { IForecast } from "@/model/IForecast";

    const props = defineProps<{
        forecast: IForecast|undefined;
    }>();

    const pressureText = computed(() => `${Math.round((props.forecast?.mslp ?? 0) / 100) } mb`);
    const humidityText = computed(() => `${Math.round(props.forecast?.screenRelativeHumidity)}%`);

    const pad2 = (value: string|number) => {
        const s = String(value);
        return s.length == 1 ? `0${s}` : s;
    }

    const forecastWhen = computed(() => `${pad2(props.forecast?.when?.getHours())}:${pad2(props.forecast?.when?.getMinutes())}`);


</script>