<template>

   <div class="grid-container">

        <div class="tile"><Temperature :forecast="currentHourly" /></div>
        <div class="tile" style="grid-column: 2 / 4; grid-row:1 / 3">
            <!-- <WeatherBoy :forecast="currentHourly" /> -->
            <MoonTest />
        </div>
        <div class="tile" style="position:relative">
            <Wind :size="150" :speed="windSpeed" :direction="windDirection"></Wind>
            <div style="position:absolute;bottom:10px;left:10px">
                {{ windDirectionText }} - {{ windGustText }}
            </div>

        </div>
        <div class="tile"><TimeAndDate /></div>
        <div class="tile"><Cycling :forecastHours="hourForecasts" /></div>
        <div class="tile"><SunAndMoon /></div>
        <div class="tile"><Extra :forecast="currentHourly" /></div>

        <div class="tile"><MetofficeDay :forecast="dayForecasts[1]"></MetofficeDay></div>
        <div class="tile"><MetofficeDay :forecast="dayForecasts[2]"></MetofficeDay></div>
        <div class="tile"><MetofficeDay :forecast="dayForecasts[3]"></MetofficeDay></div>
        <div class="tile"><MetofficeDay :forecast="dayForecasts[4]"></MetofficeDay></div>
        <div class="tile"><MetofficeDay :forecast="dayForecasts[5]"></MetofficeDay></div>

    </div>

</template>


<script setup lang="ts">

    import { type Ref, onMounted, ref, reactive, computed, watch } from "vue";
    import MetofficeData from "@/utilities/MetofficeData";

    import Temperature from "@/components/Temperature.vue";
    import WeatherBoy from "@/components/WeatherBoy.vue";
    import MoonTest from "@/components/MoonTest.vue";
    import Wind from "@/components/Wind.vue";
    import SunAndMoon from "@/components/SunAndMoon.vue";
    import Cycling from "@/components/Cycling.vue";
    import TimeAndDate from "@/components/TimeAndDate.vue";
    import Extra from "@/components/Extra.vue";
    import MetofficeDay from "@/components/MetofficeDay.vue";

    const dayForecasts: Ref<Array<IForecast>> = ref([]);
    const hourForecasts: Ref<Array<IForecast>> = ref([]);

    onMounted(() => {
        refresh();
        // run refresh every minute - but note MetofficeData has its own caching policy that prevents too many requests...
        //setInterval(refresh, 60000);
    });

    const refresh = async () => {
        console.log("loading...");
        dayForecasts.value = await MetofficeData.load("daily");
        hourForecasts.value = await MetofficeData.load("hourly"); // gets next 48 hours from now...

        console.log(`+++ refresh | day forecasts: ${dayForecasts.value?.length} | hour forecasts: ${hourForecasts.value?.length}`);

        console.log("tomorrow = ", dayForecasts.value[2]);
    }

    // TODO - check times
    const currentHourly1 = computed(() => hourForecasts.value[0] );

    // possible to have forecasts from past - so try to get the current one
    const currentHourly = computed(() => {
        const now = new Date();
        const topOfTheHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0);
        // relies on forcasts being in chronological order
        return hourForecasts.value.find(f => f.when != null && f.when >= topOfTheHour);
    });

    const windSpeed = computed(() => currentHourly.value?.windSpeed10m ?? 99 );
    const windDirection = computed(() => currentHourly.value?.windDirectionFrom10m ?? 0 );

    const windGustText = computed(() => {
        return `Gust: ${Math.round(currentHourly.value?.max10mWindGust * 2.23694)}`;
    });

    const windDirectionText = computed(() => {
        const bearing = currentHourly.value?.windDirectionFrom10m;
        const i = Math.round(bearing / 22.5);
        const dirctions = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
        return dirctions[(i % 16)];
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