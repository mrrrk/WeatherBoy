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
    import Moon from "@/utilities/Moon";
    import SunriseSunset from "@/utilities/SunriseSunset";
    import type { ISunriseSunset     } from "@/model/ISunriseSunset";

    const data: Ref<ISunriseSunset|null> = ref(null);

    const moonCanvas: Ref<HTMLCanvasElement|undefined> = ref();

    onMounted(async() => {
        data.value = await SunriseSunset.load();

        console.log("DATA = ", data.value);

        console.log("moon perc = ", Moon.getLunarAgePercent());
        console.log("moon age = ", Moon.lunarAgeDays());
        console.log("moon = ", Moon.lunarFraction());

        let p = 0;
        setInterval(() => {
            drawMoon(p);
            p += 1;
            if (p >= 100) p = 0;
        }, 100);

        drawMoon(80);

        //drawMoon(6.25);

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

    // const phaseStyle = computed(() => ({
    //     position: "absolute",
    //     top: "0px",
    //     left: "0px",
    //     height: "60px",
    //     width: "60px",
    //     backgroundImage: "url('\MoonPhases60h.png')",
    //     backgroundRepeat: "no-repeat",
    //     backgroundPosition: "-145px 0",
    //     //backgroundPosition: "-72px 0",
    //     //backgroundPosition: "0 0",
    // }));

    const drawMoon = (percent: number) => {
        const canvas = moonCanvas.value;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;
        const centreX = canvas.width / 2.0;
        const centreY = canvas.height / 2.0;
        const radius = Math.min(centreX, centreY) - 2;

        const shadow = "#6688FF";

        //console.log(`"### W=${canvas.width} | H=${canvas.width} | perc = ${percent}`);

        const angle = Math.PI * 0.02 * percent;

        const x = Math.abs(radius * Math.cos(angle));

        //console.log(`"### A = ${360 * angle / (Math.PI * 2)} | r = ${radius} | cos = ${Math.cos(angle)} | x = ${x}`);

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.beginPath();
        context.arc(centreX, centreY, radius, 0.0, 2.0 * Math.PI, false);
        context.fillStyle = shadow;
        context.fill();


        if(angle < Math.PI / 2) {
            //console.log("...1ST");
            // full LH semicircle
            context.beginPath();
            context.fillStyle = "white";
            context.ellipse(centreX, centreY, radius, radius, 0, Math.PI * 0.5, Math.PI * 1.5);
            context.fill();

            // take a chip out of it
            context.beginPath();
            context.fillStyle = shadow;
            context.ellipse(centreX, centreY, x, radius, 0, Math.PI * 0.5, Math.PI * 1.5);
            context.fill();
        }
        else if(angle < Math.PI) {
            //console.log("...2ND");
            context.beginPath();
            context.fillStyle = "white";
            // left side = full semicircle
            context.ellipse(centreX, centreY, radius, radius, 0, Math.PI * 0.5, Math.PI * 1.5);
            // right = semi-ellipse
            context.ellipse(centreX, centreY, x, radius, 0, Math.PI * 1.5, Math.PI * 0.5);
            context.fill();
        }
        else if(angle < 3 * Math.PI / 2) {
            //console.log("...3RD");
            context.beginPath();
            context.fillStyle = "white";
            // right side = full semicircle
            context.ellipse(centreX, centreY, radius, radius, 0, Math.PI * 1.5, Math.PI * 0.5);
            // left = semi-ellipse
            context.ellipse(centreX, centreY, x, radius, 0, Math.PI * 0.5, Math.PI * 1.5);
            context.fill();
        }
        else {
            //console.log("...4TH");

            // full RH semicircle
            context.beginPath();
            context.fillStyle = "white";
            context.ellipse(centreX, centreY, radius, radius, 0, Math.PI * 1.5, Math.PI * 0.5);
            context.fill();

            // take a chip out of it
            context.beginPath();
            context.fillStyle = shadow;
            context.ellipse(centreX, centreY, x, radius, 0, Math.PI * 1.5, Math.PI * 0.5);
            context.fill();
        }

        // bounding circle
        context.beginPath();
        context.arc(centreX, centreY, radius, 0.0, 2.0 * Math.PI, false);
        context.lineWidth = 1;
        context.strokeStyle = "white";
        context.stroke();

    }

</script>
