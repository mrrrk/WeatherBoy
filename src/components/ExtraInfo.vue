<template>
    <div>Extra Info</div>
    <div>{{ forecastWhen }}</div>

    <div>Mon 8am </div>
    <div>Mon 4pm </div>
    <div>Wed 8am </div>
    <div>Wed 4pm </div>

    <Wind :size="36" :speed="20" :direction="0"></Wind>

</template>

<script setup lang="ts">

    import { computed, onMounted } from "vue";
    import type { IForecast } from "@/model/IForecast";

    import Wind from "@/components/Wind.vue";

    const props = defineProps<{
        forecast: IForecast|undefined;
    }>();

    onMounted(() => {
        console.log("ExtraInfo - forecast = ", props.forecast);
    });

    const pad2 = (value: string|number) => {
        const s = String(value);
        return s.length == 1 ? `0${s}` : s;
    }

    const forecastWhen = computed(() => `${pad2(props.forecast?.when?.getHours())}:${pad2(props.forecast?.when?.getMinutes())}`);

    //const forecastWhen = computed(() => `blee`);

</script>
