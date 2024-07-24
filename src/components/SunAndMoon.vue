<template>
    <div style="margin-bottom:10px">
        Sun and Moon
    </div>
    <div class="d-flex" style="height:67px">
        <div>
            <img src="/Sunrise.png" style="width: 70px" />
            <div style="text-align:center">{{sunriseText}}</div>
        </div>
        <div class="flex-grow-1"></div>
        <div>
            <img src="/Sunset.png" style="width: 70px" />
            <div style="text-align:center">{{sunsetText}}</div>
        </div>

    </div>

    <!-- <div style="height: 30px;background-image:url('/MoonPhases.png');" /> -->

    <div>
        <canvas ref="moonCanvas" width="60" height="60" />
        <!-- <div :style="phaseStyle"></div> -->
    </div>
</template>

<script setup lang="ts">

    import { onMounted, type Ref, ref, computed } from "vue";
    import SunriseSunset from "@/utilities/SunriseSunset";
    import type { ISunriseSunset     } from "@/model/ISunriseSunset";

    const data: Ref<ISunriseSunset|null> = ref(null);

    const moonCanvas: Ref<HTMLCanvasElement|undefined> = ref();

    onMounted(async() => {
        data.value = await SunriseSunset.load();

        console.log("DATA = ", data.value);

        drawMoon();
    });

    const pad2 = (value: string|number) => {
        const s = String(value);
        return s.length == 1 ? `0${s}` : s;
    }

    const formatTime = (dateValue: string|null|undefined) => {
        if (!dateValue) return "- - -";
        const date = new Date(Date.parse(dateValue ?? "0"));
        return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
    }

    const sunriseText = computed(() => formatTime(data.value?.results.sunrise));

    const sunsetText = computed(() => formatTime(data.value?.results.sunset));

    const phaseStyle = computed(() => ({
        position: "absolute",
        top: "0px",
        left: "0px",
        height: "60px",
        width: "60px",
        backgroundImage: "url('\MoonPhases60h.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "-145px 0",
        //backgroundPosition: "-72px 0",
        //backgroundPosition: "0 0",
    }));

    const drawMoon = () => {
        const canvas = moonCanvas.value;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;
        const centreX = canvas.width / 2.0;
        const centreY = canvas.height / 2.0;
        const radius = Math.min(centreX, centreY) - 2;

        console.log(`"### W=${canvas.width} H=${canvas.width}`);

        context.beginPath();
        context.arc(centreX, centreY, radius, 0.0, 2.0 * Math.PI, false);
        context.fillStyle = "#6688FF";
        context.fill();

        context.lineWidth = 2;
        context.strokeStyle = "white";
        context.stroke();

        context.beginPath();
        context.fillStyle = "white";

        // left side
        context.ellipse(centreX, centreY, radius, radius, 0, Math.PI * 0.5, Math.PI * 1.5);

        // right side
        context.ellipse(centreX, centreY, radius / 2, radius, 0, Math.PI * 1.5, Math.PI * 0.5);

        context.fill();
    }

</script>