<template>

    <!-- <div>Mon 8am </div>
    <div>Mon 4pm </div>
    <div>Wed 8am </div>
    <div>Wed 4pm </div> -->

    <div class="d-flex">
        <img src="/bicycle.svg" height="20px" width="20px" />
        <div style="margin-left:10px; margin-bottom:6px; line-height: 20px;"><i>{{ todayDay }}</i></div>
    </div>
    <div class="d-flex">
        <div style="width:50px">{{ todayMorningTime }}</div>
        <WindCycling :size="50" :speed="5" :direction="230" :cyclingDirection="70" />
    </div>
    <div class="d-flex">
        <div style="width:50px">{{ todayAfternoonTime }}</div>
        <WindCycling :size="50" :speed="5" :direction="230" :cyclingDirection="250" />
    </div>

    <div class="d-flex" style="margin-top:6px">
        <img src="/bicycle.svg" height="20px" width="20px" />
        <div style="margin-left:10px; margin-bottom:6px; line-height: 20px;"><i>{{ tomorrowDay }}</i></div>
    </div>
    <div class="d-flex">

        <div style="width:50px">{{ tomorrowMorningTime }}</div>
        <WindCycling :size="50" :speed="5" :direction="230" :cyclingDirection="70" />
    </div>
    <div class="d-flex">
        <div style="width:50px">{{ tomorrowAfternoonTime }}</div>
        <WindCycling :size="50" :speed="5" :direction="230" :cyclingDirection="250" />
    </div>

    <!-- <div class="d-flex" >
        <div v-for="colour in colours1" :style="{ backgroundColor: colour, width: '5px', height: '20px' }"></div>
    </div>
    <div class="d-flex" >
        <div v-for="colour in colours2" :style="{ backgroundColor: colour, width: '5px', height: '20px' }"></div>
    </div>
    <div class="d-flex" >
        <div v-for="colour in colours3" :style="{ backgroundColor: colour, width: '5px', height: '20px' }"></div>
    </div> -->

</template>

<script setup lang="ts">

    import { computed, onMounted, type Ref, ref } from "vue";
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

    const todayDay = computed(() => dayText(todayMorningForecast.value?.when));
    const todayMorningTime = computed(() => timeText(todayMorningForecast.value?.when));
    const todayAfternoonTime = computed(() => timeText(todayAfternoonForecast.value?.when));

    const tomorrowDay = computed(() => dayText(tomorrowMorningForecast.value?.when));
    const tomorrowMorningTime = computed(() => timeText(tomorrowMorningForecast.value?.when));
    const tomorrowAfternoonTime = computed(() => timeText(tomorrowAfternoonForecast.value?.when));

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

    // helper funcs...

    const pad2 = (value: string|number) => {
        const s = String(value);
        return s.length == 1 ? `0${s}` : s;
    }

    const timeText = (when: Date) => when ? `${pad2(when.getHours())}:${pad2(when.getMinutes())}` : "- - -";

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayText = (when: Date) => when ? days[when.getDay()] : "- - -";

</script>
