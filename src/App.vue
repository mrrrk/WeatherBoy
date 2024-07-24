<template>

   <div class="grid-container">

        <div class="tile"><Temperature :day="days[1]" /></div>
        <div class="tile" style="grid-column: 2 / 4; grid-row:1 / 3"><WeatherBoy :day="days[1]" /></div>
        <div class="tile"><Wind :size="150" :speed="5" :direction="180"></Wind></div>
        <div class="tile"><TimeAndDate /></div>
        <div class="tile"><PressureAndHumidity :day="days[1]" /></div>
        <div class="tile"><SunAndMoon /></div>
        <div class="tile"><ExtraInfo :day="days[1]" /></div>

        <div class="tile"><MetofficeDay :day="days[1]"></MetofficeDay></div>
        <div class="tile"><MetofficeDay :day="days[2]"></MetofficeDay></div>
        <div class="tile"><MetofficeDay :day="days[3]"></MetofficeDay></div>
        <div class="tile"><MetofficeDay :day="days[4]"></MetofficeDay></div>
        <div class="tile"><MetofficeDay :day="days[5]"></MetofficeDay></div>

    </div>

</template>


<script setup lang="ts">

    import { type Ref, onMounted, ref, reactive, computed, watch } from "vue";
    import MetofficeData from "@/utilities/MetofficeData";

    import Temperature from "@/components/Temperature.vue";
    import WeatherBoy from "@/components/WeatherBoy.vue";
    import Wind from "@/components/Wind.vue";
    import SunAndMoon from "@/components/SunAndMoon.vue";
    import PressureAndHumidity from "@/components/PressureAndHumidity.vue";
    import TimeAndDate from "@/components/TimeAndDate.vue";
    import ExtraInfo from "@/components/ExtraInfo.vue";
    import MetofficeDay from "@/components/MetofficeDay.vue";

    const days: Ref<Array<IForecastDay>> = ref([]);

    onMounted(async() => {
        console.log("loading...");
        days.value = await MetofficeData.load();

        //console.log("data = ", days);

        console.log(`time 0 = ${days.value[0]?.time} | symbol 0 = ${days.value[0]?.daySignificantWeatherCode}`);
        console.log(`time 1 = ${days.value[1]?.time} | symbol 1 = ${days.value[1]?.daySignificantWeatherCode}`);
        console.log(`time 2 = ${days.value[2]?.time} | symbol 2 = ${days.value[2]?.daySignificantWeatherCode}`);
        console.log(`time 3 = ${days.value[3]?.time} | symbol 3 = ${days.value[3]?.daySignificantWeatherCode}`);

        console.log("tomorrow = ", days.value[2]);
    });

</script>

<style>
    .grid-container {
        margin: 20px;
        height:100vh;
        display:grid;
        grid-template-columns:
            repeat(5, 1fr)
            /* calc(30vh - 20px); */;
        grid-template-rows:
            repeat(3, calc(31vh - 10px));
        column-gap: 10px;
        row-gap: 10px;

        grid-template-areas:
            "header header header header header"
            "mid-1 mid-1 . mid-2 mid-2"
            "footer-1 footer-2 footer-3 footer-4 footer-5";
    }

</style>

