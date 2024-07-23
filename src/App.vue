<template>

   <div class="grid-container">

            <div class="tile" style="font-size:40px; font-weight:bold;">15°C</div>

            <div class="tile" style="grid-column: 2 / 4; grid-row:1 / 3">weatherboy</div>
            <div class="tile" style="position:relative">
                <img src="/wind.png" style="width:150px;position:absolute;transform: rotate(45deg);">
                <div style="position:absolute;color:#666;padding:58px;font-size:30px;font-weight:bold;text-align: center;">30</div>
            </div>
            <div class="tile">Sun</div>
            <div class="tile">Press</div>
            <div class="tile">Humidity</div>
            <div class="tile">Moon</div>



            <div class="tile">Metoffice Day 1<br>temp<br>weather<br>wind+dir</div>
            <div class="tile">Metoffice Day 2</div>
            <div class="tile">Metoffice Day 3</div>
            <div class="tile">Metoffice Day 4</div>
            <div class="tile">Metoffice Day 5</div>


    </div>

</template>

<script setup lang="ts">

    import { type Ref, onMounted, ref, reactive, computed, watch } from "vue";
    import MetofficeData from "@/utilities/MetofficeData";

    onMounted(() => {
        MetofficeData.load();
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
