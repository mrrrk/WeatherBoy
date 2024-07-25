<template>
    <div>
        <div style="font-size:40px; font-weight:bold;">{{ externalTemperature }}</div>

        <div>feels like {{ feelsLikeTemperature }}</div>

        <div style="font-size:32px;">{{ internalTemperature }}</div>
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
    const internalTemperature = computed(() => `to do...`);

</script>