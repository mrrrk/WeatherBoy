<template>

    <!-- <div>Mon 8am </div>
    <div>Mon 4pm </div>
    <div>Wed 8am </div>
    <div>Wed 4pm </div> -->

    <div class="d-flex">
        <img src="/img/bicycle.svg" height="20px" width="20px" />
        <div style="margin-left:10px; margin-bottom:6px; line-height: 20px;"><i>{{ todayDay }}</i></div>
    </div>
    <div class="d-flex">
        <div style="width:50px">{{ todayMorningTime }}</div>
        <WindCycling :size="50" :speed="todayMorningWindSpeed" :direction="todayMorningWindDirection" :cyclingDirection="70" />
    </div>
    <div class="d-flex">
        <div style="width:50px">{{ todayAfternoonTime }}</div>
        <WindCycling :size="50" :speed="todayAfternoonWindSpeed" :direction="todayAfternoonWindDirection" :cyclingDirection="250" />
    </div>

    <div class="d-flex" style="margin-top:6px">
        <img src="/img/bicycle.svg" height="20px" width="20px" />
        <div style="margin-left:10px; margin-bottom:6px; line-height: 20px;"><i>{{ tomorrowDay }}</i></div>
    </div>
    <div class="d-flex">
        <div style="width:50px">{{ tomorrowMorningTime }}</div>
        <WindCycling :size="50" :speed="tomorrowMorningWindSpeed" :direction="tomorrowMorningWindDirection" :cyclingDirection="70" />
    </div>
    <div class="d-flex">
        <div style="width:50px">{{ tomorrowAfternoonTime }}</div>
        <WindCycling :size="50" :speed="tomorrowAfternoonWindSpeed" :direction="tomorrowAfternoonWindDirection" :cyclingDirection="250" />
    </div>

</template>

<script setup lang="ts">

    import { computed, onMounted, type Ref, ref } from "vue";
    import Stuff from "@/utilities/Stuff";
    import type { IForecast } from "@/model/IForecast";

    import WindCycling from "@/components/WindCycling.vue";

    const props = defineProps<{
        forecastHours: Array<IForecast>;
    }>();

    onMounted(() => {
        // const now = new Date();
        // const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        // const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
        // const todayMorning = new Date(todayStart.getTime() + 7 * 60 * 60 * 1000);
        // const todayAfternoon = new Date(todayStart.getTime() + 16 * 60 * 60 * 1000);
        // const tomorrowMorning = new Date(tomorrowStart.getTime() + 7 * 60 * 60 * 1000);
        // const tomorrowAfternoon = new Date(tomorrowStart.getTime() + 16 * 60 * 60 * 1000);

        // console.log("@@@ 1 ", todayStart);
        // console.log("@@@ 2 ", tomorrowStart);
        // console.log("@@@ 3 ", todayMorning);
        // console.log("@@@ 4 ", todayAfternoon);



    //     const a1 = [];
    //     const a2 = [];
    //     const a3 = [];
    //     for(let i = 0; i < 30; i++) {
    //         const f1 = 255 * i / 30.0; // 0 -> 255
    //         const f2 = 255 * (30 - i) / 30.0; // 255 -> 0
    //         const f3 = i < 15 ? 510 * i / 30.0 : 255; // 0 -> 255 ...
    //         const f4 = i < 15 ? 255 - (510 * i / 30.0) : 0; // 255 -> 0 ...
    //         const f5 = i < 15 ? 255 : 255 - (510 * (i - 15) / 30.0); // ...255 -> 0
    //         const f6 = i < 10 ? 255 : 255 - (510 * (i - 10) / 30.0); // ...255 -> 0
    //         a1[i] = `rgb(255 ${f4} 255)`; // assist
    //         a2[i] = `rgb(255 ${f6} ${f4})`; // resist
    //         a3[i] = `rgb(${f6} ${f6} ${f6})`;
    //     }
    //     colours1.value = a1;
    //     colours2.value = a2;
    //     colours3.value = a3;
    });

    // const colours1: Ref<Array<string>> = ref([]);
    // const colours2: Ref<Array<string>> = ref([]);
    // const colours3: Ref<Array<string>> = ref([]);

    const todayDay = computed(() => Stuff.dayText(todayMorningForecast.value?.when));
    const todayMorningTime = computed(() => Stuff.timeTextShort(todayMorningForecast.value?.when));
    const todayAfternoonTime = computed(() => Stuff.timeTextShort(todayAfternoonForecast.value?.when));

    const tomorrowDay = computed(() => Stuff.dayText(tomorrowMorningForecast.value?.when));
    const tomorrowMorningTime = computed(() => Stuff.timeTextShort(tomorrowMorningForecast.value?.when));
    const tomorrowAfternoonTime = computed(() => Stuff.timeTextShort(tomorrowAfternoonForecast.value?.when));

    const todayMorningWindSpeed = computed(() => todayMorningForecast.value?.windSpeed10m ?? 99 );
    const todayMorningWindDirection = computed(() => todayMorningForecast.value?.windDirectionFrom10m ?? 0 );

    const todayAfternoonWindSpeed = computed(() => todayAfternoonForecast.value?.windSpeed10m ?? 99 );
    const todayAfternoonWindDirection = computed(() => todayAfternoonForecast.value?.windDirectionFrom10m ?? 0 );

    const tomorrowMorningWindSpeed = computed(() => tomorrowMorningForecast.value?.windSpeed10m ?? 99 );
    const tomorrowMorningWindDirection = computed(() => tomorrowMorningForecast.value?.windDirectionFrom10m ?? 0 );

    const tomorrowAfternoonWindSpeed = computed(() => tomorrowAfternoonForecast.value?.windSpeed10m ?? 99 );
    const tomorrowAfternoonWindDirection = computed(() => tomorrowAfternoonForecast.value?.windDirectionFrom10m ?? 0 );

    const todayMorningForecast = computed(() => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const time = new Date(todayStart.getTime() + 7 * 60 * 60 * 1000);
        return props.forecastHours.find(f => f.when != null && f.when >= time);
    });

    const todayAfternoonForecast = computed(() => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const time = new Date(todayStart.getTime() + 16 * 60 * 60 * 1000);
        return props.forecastHours.find(f => f.when != null && f.when >= time);
    });

    const tomorrowMorningForecast = computed(() => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
        const time = new Date(tomorrowStart.getTime() + 7 * 60 * 60 * 1000);
        return props.forecastHours.find(f => f.when != null && f.when >= time);
    });

    const tomorrowAfternoonForecast = computed(() => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
        const time = new Date(tomorrowStart.getTime() + 16 * 60 * 60 * 1000);
        return props.forecastHours.find(f => f.when != null && f.when >= time);
    });

</script>
