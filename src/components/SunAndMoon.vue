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

    <div class="d-flex">
        <div class="flex-grow-1" style="padding-top:8px">{{ moonPhaseText }}</div>
        <div style="width:20px"></div>
        <canvas ref="moonCanvas" width="60" height="60" />
    </div>
</template>

<script setup lang="ts">

    import { onMounted, type Ref, ref, computed } from "vue";
    import Moon from "@/utilities/Moon";
    import SunriseSunset from "@/utilities/SunriseSunset";
    import type { ISunriseSunset     } from "@/model/ISunriseSunset";

    const data: Ref<ISunriseSunset|null> = ref(null);
    const moonCanvas: Ref<HTMLCanvasElement|undefined> = ref();
    const moonPhaseText = ref("");

    onMounted(async() => {

        console.log("new: ", Moon.lunarAgeDays(new Date(Date.parse("2024-08-04T12:13:00"))));
        console.log("qtr: ", Moon.lunarAgeDays(new Date(Date.parse("2024-08-12T16:18:00"))));
        console.log("ful: ", Moon.lunarAgeDays(new Date(Date.parse("2024-08-19T19:25:00"))));
        console.log("3rd: ", Moon.lunarAgeDays(new Date(Date.parse("2024-08-26T10:25:00"))));
        console.log("new: ", Moon.lunarAgeDays(new Date(Date.parse("2024-09-03T02:55:00"))));
        console.log("new: ", Moon.lunarAgeDays(new Date(Date.parse("2024-10-02T19:49:00"))));

        //console.log("DATA = ", data.value);

        // let p = 0;
        // setInterval(() => {
        //     drawMoon(p);
        //     moonPhaseText.value = getMoonPhaseText(p);
        //     p += 0.01;
        //     if (p >= 1) p = 0;
        // }, 200);

        const refresh = async () => {
            data.value = await SunriseSunset.load();

            const julianNow = Moon.julianDateFromUnixTime(new Date().getTime());
            const phaseAngle = Moon.phaseAngleDegrees(julianNow);
            const illuminatedPercent = Math.round(Moon.illuminatedFraction(phaseAngle) * 100);

            drawMoon(phaseAngle);
            moonPhaseText.value = getMoonPhaseText(phaseAngle, illuminatedPercent);
        }

        refresh();

        // update a couple of times a day
        setInterval(refresh, 1000 * 60 * 60 * 12);

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

    const getMoonPhaseText = (phaseAngle: number, illuminationPercent: number) => {
        //const percent = Moon.illuminationPercent();



        // are these fractions right?  maybe not so much...

        const percentText = `(${illuminationPercent}% ph: ${Math.round(phaseAngle)}°)`;

        const f = (phaseAngle + 22.5) / 360; // ???
        //console.log(`f1 = ${lunarCycleFraction} |f2 = ${f}`);
        switch (true) {
            case f < 0.125: return `new moon ${percentText}`;
            case f < 0.25: return `waxing crescent ${percentText}`;
            case f < 0.375: return `quarter moon ${percentText}`; // ???
            case f < 0.5: return `waxing gibbous ${percentText}`;
            case f < 0.625: return `full moon ${percentText}`;
            case f < 0.75: return `waning gibbous ${percentText}`;
            case f < 0.875: return `last quarter ${percentText}`;
            case f < 1: return `waning crescent ${percentText}`;
            default : return `new moon ${percentText}`;
        }
    }

    // todo? rotate through cycle for UK pov?

    // alternate approach: https://celestialprogramming.com/snippets/moonPhaseRender.html

    const drawMoon = (phaseAngleDegrees: number) => {
        const canvas = moonCanvas.value;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;
        const centreX = canvas.width / 2.0;
        const centreY = canvas.height / 2.0;
        const radius = Math.min(centreX, centreY) - 1.0;
        const shadow = "#6688FF";

        const phaseAngle = Math.PI * 2.0 * phaseAngleDegrees / 360;
        const crecentWidth = Math.abs(radius * Math.cos(phaseAngle));

        context.clearRect(0, 0, canvas.width, canvas.height);

        // rotate - TODO - what angle???
        // https://svs.gsfc.nasa.gov/5187/ ??? (no - libration is a different thing)

        // context.translate(centreX, centreY);
        // context.rotate(Math.PI / 4);
        // context.translate(-centreX, -centreY);

        context.beginPath();
        context.arc(centreX, centreY, radius, 0.0, 2.0 * Math.PI, false);
        context.fillStyle = shadow;
        context.fill();

        if(angle < Math.PI / 2) {
            // new moon -> waxing crecent -> quarter
            drawCrecent(context, shadow, centreX, centreY, crecentWidth, radius, true);
        }
        else if(angle < Math.PI) {
            // quarter -> waxing gibbous -> full moon
            drawGibbous(context, centreX, centreY, crecentWidth, radius, true);
        }
        else if(angle < 3 * Math.PI / 2) {
            // full moon -> waning gibbous -> last quarter
            drawGibbous(context, centreX, centreY, crecentWidth, radius, false);
        }
        else {
            // last quarter -> waning crecent -> new moon
            drawCrecent(context, shadow, centreX, centreY, crecentWidth, radius, false);
        }

        // bounding circle
        context.beginPath();
        context.arc(centreX, centreY, radius, 0.0, 2.0 * Math.PI, false);
        context.lineWidth = 1;
        context.strokeStyle = "white";
        context.stroke();
    }

    const drawCrecent = (context: CanvasRenderingContext2D, shadow: string, x: number, y: number, w:number, r: number, isWaxing: boolean) => {
        const startAngle = isWaxing ? Math.PI * 1.5 : Math.PI * 0.5;
        const endAngle = isWaxing ? Math.PI * 0.5 : Math.PI * 1.5;
        // full semicircle
        context.beginPath();
        context.fillStyle = "white";
        context.ellipse(x, y, r, r, 0, startAngle, endAngle);
        context.fill();
        // take a chip out of it
        context.beginPath();
        context.fillStyle = shadow;
        context.ellipse(x, y, w, r, 0, startAngle, endAngle);
        context.fill();
    }

    const drawGibbous = (context: CanvasRenderingContext2D, x: number, y: number, w:number, r: number, isWaxing: boolean) => {
        const angleA = isWaxing ? Math.PI * 1.5 : Math.PI * 0.5;
        const angleB = isWaxing ? Math.PI * 0.5 : Math.PI * 1.5;
        context.beginPath();
        context.fillStyle = "white";
        context.ellipse(x, y, r, r, 0, angleA, angleB);
        context.ellipse(x, y, w, r, 0, angleB, angleA);
        context.fill();
    }

</script>
