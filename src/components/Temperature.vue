<template>
    <div>
        <div style="font-size:3rem; font-weight:bold;">{{ externalTemperature }}</div>

        <div style="font-size:1.1rem;font-weight: bold;">feels like {{ feelsLikeTemperature }}</div>

        <div style="font-size:2rem;">{{ internalTemperature }}</div>
        
    </div>
</template>

<script setup lang="ts">

    import { computed } from "vue";
    import type { IForecast } from "@/model/IForecast";

    const props = defineProps<{
        forecast: IForecast|undefined;
    }>();

    const externalTemperature = computed(() => `${Math.round(props.forecast?.screenTemperature ?? 99)}°C`);
    const feelsLikeTemperature = computed(() => `${Math.round(props.forecast?.feelsLikeTemperature ?? 99)}°C`);
    const internalTemperature = computed(() => `99°C`);

</script>