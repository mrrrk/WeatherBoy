<template>
    <div>
        <div style="font-size:3rem; font-weight:bold;">{{ externalMetOfficeTemperature }}</div>

        <div style="font-size:1.1rem;font-weight: bold;">feels like {{ feelsLikeTemperature }}</div>

        <div style="font-size:2rem;">{{ internalTemperature }}</div>

    </div>
</template>

<script setup lang="ts">

    import { computed } from "vue";
    import type { IForecast } from "@/model/IForecast";
    import { SensorDataSet } from "@/model/SensorDataSet";

    const props = defineProps<{
        forecast: IForecast|undefined;
        sensorDataSet: SensorDataSet;
    }>();

    const externalMetOfficeTemperature = computed(() => `${Math.round(props.forecast?.screenTemperature ?? 99)}°C`);
    const feelsLikeTemperature = computed(() => `${Math.round(props.forecast?.feelsLikeTemperature ?? 99)}°C`);

    const internalTemperature = computed(() => props.sensorDataSet.shedDataPoint.isError
        ? "(error)" // props.sensorDataSet.shedDataPoint.error
        : `${Math.round(props.sensorDataSet.shedDataPoint.temperature)}°C`);

    const shedTemperature =  computed(() => props.sensorDataSet.shedDataPoint.isError
        ? props.sensorDataSet.shedDataPoint.error
        : `${Math.round(props.sensorDataSet.shedDataPoint.temperature)}°C`);

</script>