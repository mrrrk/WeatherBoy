<template>
    <div>
        Pressure: {{pressureText}}<br>
        Humidity: {{ humidityText }}
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

</script>