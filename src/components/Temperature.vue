<template>
    <div>
        <div style="font-size:40px; font-weight:bold;">{{ temperatureMaxText }}</div>
        <div style="font-size:32px;">{{ temperatureMinText }}</div>
    </div>
</template>

<script setup lang="ts">

    import { computed } from "vue";
    import type { IForecastDay } from "@/model/IForecastDay";

    const props = defineProps<{
        day: IForecastDay|undefined;
    }>();

    const temperatureMinText = computed(() => `${props.day?.nightMinScreenTemperature}°C`);
    const temperatureMaxText = computed(() => `${props.day?.dayMaxScreenTemperature}°C`);

</script>