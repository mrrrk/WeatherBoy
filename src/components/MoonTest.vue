<template>
    <div style="margin-bottom:10px">
        Moon Test
    </div>
    <div class="d-flex" style="width:370px; flex-wrap: wrap">
        <div v-for="date in dates" style="margin-right:2px;margin-bottom:4px">
            <canvas :ref="setItemRef" width="50" height="50" />
            <div style="font-size:10px">{{ Stuff.dayMonthShort(date) }} {{ phaseAngleText(date) }}</div>
        </div>

    </div>

</template>

<script setup lang="ts">

    import { onMounted, type Ref, ref, computed } from "vue";
    import Moon from "@/utilities/Moon";
    import Stuff from "@/utilities/Stuff";

    const startDate = new Date(Date.parse("2024-08-04T12:13:00"));
    const dates: Ref<Array<Date>> = ref([...Array(35).keys()].map(i => new Date(startDate.getTime() + (i * 1000 * 60 * 60 * 24))));
    const moonCanvasses: Array<HTMLCanvasElement> = [];

    onMounted(async() => {
        let i = 0;
        for(const date of dates.value) {
            const julian = Stuff.epochMillisToJulian(date.getTime());
            const phaseAngle = Moon.phaseAngleDegrees(julian);
            drawMoon(moonCanvasses[i++], phaseAngle, Moon.tiltDegrees(phaseAngle));

            getIlluminatedFractionOfMoon(date);
        }
        //tilt();

    });

    // ---

    const getTiltsFromMoonphasesSite = async() => {
        const fromDate = new Date(Date.parse("2024-07-31T00:00:00"));
        const tiltDates:Array<Date> = [...Array(40).keys()].map(i => new Date(fromDate.getTime() + (i * 1000 * 60 * 60 * 24)));
        for(const date of tiltDates) {
            const url = `https://moonphases.co.uk/service/getMoonDetails.php?day=${date.getDate()}&month=${date.getMonth() + 1}&year=${date.getFullYear()}&lat=52&lng=-0.1&len=6&tz=0`;
            const response = await fetch(url);
            const respData = await response.json();
            //console.log(respData);
            console.log(`"${Stuff.dayMonthShort(new Date(Date.parse(respData.days[0].date)))}", ${respData.days[0].illumination},${respData.days[0].tilt}`);
            break; // uncomment to get all...
        }
    }

    const setItemRef = (canvas: HTMLCanvasElement) => {
        moonCanvasses.push(canvas);
    }

    const phaseAngleText = (date: Date) => {
        const julian = Stuff.epochMillisToJulian(date.getTime());
        return `${Math.round(Moon.phaseAngleDegrees(julian))}°`;
    }

    // ---- gregg miller's code

    function JulianDateFromUnixTime(t: number): number {
        return (t / 86400000) + 2440587.5;
    }

    function UnixTimeFromJulianDate(jd: number): number {
        return (jd-2440587.5)*86400000;
    }

    function constrain(d: number){
        let t=d%360;
        if(t<0){t+=360;}
        return t;
    }

    function getIlluminatedFractionOfMoon(date: Date) {

        const jd = JulianDateFromUnixTime(date.getTime());

        const toRad=Math.PI/180.0;
        const T=(jd-2451545)/36525.0;

        const D = constrain(297.8501921 + 445267.1114034*T - 0.0018819*T*T + 1.0/545868.0*T*T*T - 1.0/113065000.0*T*T*T*T)*toRad; //47.2
        const M = constrain(357.5291092 + 35999.0502909*T - 0.0001536*T*T + 1.0/24490000.0*T*T*T)*toRad; //47.3
        const Mp = constrain(134.9633964 + 477198.8675055*T + 0.0087414*T*T + 1.0/69699.0*T*T*T - 1.0/14712000.0*T*T*T*T)*toRad; //47.4

        //48.4
        const i=constrain(180 - D*180/Math.PI - 6.289 * Math.sin(Mp) + 2.1 * Math.sin(M) -1.274 * Math.sin(2*D - Mp) -0.658 * Math.sin(2*D) -0.214 * Math.sin(2*Mp) -0.11 * Math.sin(D))*toRad;

        const k=(1+Math.cos(i))/2;

        console.log(`${Stuff.dateText(date)} | GM's i = ${Stuff.toDegrees(i)} | illum = ${Math.round(k * 100)}%`);
    }

    // ----


    const drawMoon = (canvas: HTMLCanvasElement|undefined, phaseAngleDegrees: number, tiltDegrees: number) => {

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
        context.ellipse(x, y, w, r, 0, startAngle - 0.03, endAngle + 0.03); // started getting a thin line artefact after rotating - so extend these angles a little to fix it!
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

