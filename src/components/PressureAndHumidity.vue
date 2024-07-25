<template>
    <div>
        Pressure<br>Humidity
    </div>
</template>

<script setup lang="ts">

    import { computed } from "vue";
    import type { IForecast } from "@/model/IForecast";

    const props = defineProps<{
        forecast: IForecast|undefined;
    }>();

    const temperatureMinText = computed(() => `${props.forecast?.nightMinScreenTemperature}°C`);
    const temperatureMaxText = computed(() => `${props.forecast?.dayMaxScreenTemperature}°C`);

</script>