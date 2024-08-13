<template>
    <div class="d-flex">
        <div style="position:relative; width:20px;margin-right:3px">
            <div :style="textStyle">{{ speedMph }}</div>
        </div>

        <div><img src="/windMini.png" :style="imageStyle"></div>

    </div>

    <!-- <div style="display:flex;position:relative">
        <img src="/wind.png" :style="imageStyle">
        <div :style="textStyle">{{Stuff.mpsToMph(speed)}}</div>
    </div> -->
</template>

<script lang="ts">
interface IColour {
    r: number;
    g: number;
    b: number;
}
</script>

<script setup lang="ts">

    import { computed } from "vue";
    import Stuff from "@/utilities/Stuff";

    const props = defineProps({
        size: { type: Number, required: false, default: 150 },
        speed: { type: Number, required: true },
        direction: { type: Number, required: true },
        // 0 = cycling north,  90 = cycling east, etc.
        cyclingDirection: { type: Number, required: true }
    });

    const imageStyle = computed(() => ({
        position: "relative",
        height: "20px",
        transform: `rotate(${props.direction + 180}deg)`
    }));

    // style="position:absolute;color:#666;padding:58px;font-size:30px;font-weight:bold;text-align: center;"

    //line-height:20px;height:20px;
    const textStyle = computed(() => {
        const colour = cyclingColourValues();
        return {
            position: "absolute",
            backgroundColor: `rgb(${colour.r} ${colour.g} ${colour.b})`,
            top: "0",
            left: "0",
            lineHeight: "20px",
            height: "20px",
            width: "20px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "16px",
            color: textColor(colour)
        };
    });

    const speedMph = computed(() => Stuff.mpsToMph(props.speed) );

    // // debug functions
    // const to = computed(() => cyclingWindResistanceComponentMph(Stuff.mpsToMph(props.speed), props.direction, directionToDegrees));
    // const from = computed(() => cyclingWindResistanceComponentMph(Stuff.mpsToMph(props.speed), props.direction, directionToDegrees + 180));
    // const cyclingColour = computed(() => {
    //     const c = cyclingColourValues();
    //     return `rgb(${c.r} ${c.g} ${c.b})`;
    // });

    const textColor = (c: IColour): string => {
        return ((c.r * 0.299) + (c.g * 0.587 ) + (c.b * 0.114) > 186) ? "black" : "white"
    };

    const cyclingColourValues = (): IColour => {
        const speedComponentMph = cyclingWindResistanceComponentMph(Stuff.mpsToMph(props.speed), props.direction, props.cyclingDirection);
        const absoluteSpeed = Math.abs(speedComponentMph);
        const c1 = absoluteSpeed < 15 ? 255 - (510 * absoluteSpeed / 30.0) : 0; // 255 -> 0 ...
        const c2 = absoluteSpeed < 10 ? 255 : 255 - (510 * (absoluteSpeed - 10) / 30.0); // ...255 -> 0
        return speedComponentMph < 0
            ? { r: 255, g: c1, b: 255 }  // assisting (white -> magenta)
            : { r: 255, g: c2, b: c1 }  // resisting (white -> yellow -> red)
    }

    const cyclingWindResistanceComponentMph = (speedMph: number, windDirectrionDegrees: number, cyclingDirectionDegrees: number) =>
        Math.round(speedMph * Math.cos((Math.PI / 180) * (cyclingDirectionDegrees - windDirectrionDegrees)));


</script>