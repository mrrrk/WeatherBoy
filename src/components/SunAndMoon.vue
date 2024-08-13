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
    import Secrets from "@/utilities/Secrets";
    import Stuff from "@/utilities/Stuff";
    import Moon from "@/utilities/Moon";
    import Sun from "@/utilities/Sun";
    import type { SunriseSunsetResult } from "@/utilities/Sun";

    const sunData: Ref<SunriseSunsetResult|null> = ref(null);
    const moonCanvas: Ref<HTMLCanvasElement|undefined> = ref();
    const moonPhaseText = ref("");

    onMounted(async() => {
        // let p = 0;
        // setInterval(() => {
        //     drawMoon(p);
        //     moonPhaseText.value = getMoonPhaseText(p);
        //     p += 0.01;
        //     if (p >= 1) p = 0;
        // }, 200);

        const refresh = async () => {
            const now = new Date().getTime();

            sunData.value = Sun.SunriseAndSunset(now, Secrets.latitude, Secrets.longitude);

            const julianNow = Stuff.epochMillisToJulian(now);
            const phaseAngle = Moon.phaseAngleDegrees(julianNow);
            const tiltAngle = Moon.tiltDegrees(phaseAngle);
            const illuminatedPercent = Math.round(Moon.illuminatedFraction(phaseAngle) * 100);

            drawMoon(phaseAngle, tiltAngle);
            moonPhaseText.value = getMoonPhaseText(phaseAngle, illuminatedPercent);
        }

        refresh();

        // update a couple of times a day
        setInterval(refresh, 1000 * 60 * 60 * 12);

    });

    const sunriseText = computed(() => Stuff.timeTextShort(new Date(sunData.value?.sunrise ?? 0)));

    const sunsetText = computed(() => Stuff.timeTextShort(new Date(sunData.value?.sunset ?? 0)));

    const getMoonPhaseText = (phaseAngle: number, illuminationPercent: number) => {
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

    const radiansPerDegree = Math.PI / 180.0;

    const drawMoon = (phaseAngleDegrees: number, tiltDegrees: number) => {
        const canvas = moonCanvas.value;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;
        const centreX = canvas.width / 2.0;
        const centreY = canvas.height / 2.0;
        const radius = Math.min(centreX, centreY) - 1.0;
        const shadow = "#6688FF";

        const phaseAngle = phaseAngleDegrees * radiansPerDegree;
        const crecentWidth = Math.abs(radius * Math.cos(phaseAngle));

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.translate(centreX, centreY);
        context.rotate(Stuff.toRadians(tiltDegrees));
        context.translate(-centreX, -centreY);

        context.beginPath();
        context.arc(centreX, centreY, radius, 0.0, 2.0 * Math.PI, false);
        context.fillStyle = shadow;
        context.fill();

        if(phaseAngle < Math.PI / 2) {
            // new moon -> waxing crecent -> quarter
            drawCrecent(context, shadow, centreX, centreY, crecentWidth, radius, true);
        }
        else if(phaseAngle < Math.PI) {
            // quarter -> waxing gibbous -> full moon
            drawGibbous(context, centreX, centreY, crecentWidth, radius, true);
        }
        else if(phaseAngle < 3 * Math.PI / 2) {
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
        // started getting a thin line artefact (after rotating) - so extend the angles a little to fix it!
        context.ellipse(x, y, w, r, 0, startAngle - 0.03, endAngle + 0.03);
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
