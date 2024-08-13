<template>
    <div style="display:flex;position:relative">
        <img src="/wind.png" :style="imageStyle">
        <div :style="textStyle">{{Stuff.mpsToMph(speed)}}</div>
    </div>
</template>

<script setup lang="ts">

    import { computed } from "vue";
    import Stuff from "@/utilities/Stuff";

    const props = defineProps({
        size: { type: Number, required: false, default: 150 },
        speed: { type: Number, required: true },
        direction: { type: Number, required: true },
    });

    const imageStyle = computed(() => ({
        width: `${props.size}px`,
        position: "absolute",
        transform: `rotate(${props.direction + 180}deg)`
    }));

    // style="position:absolute;color:#666;padding:58px;font-size:30px;font-weight:bold;text-align: center;"
    const textStyle = computed(() => ({
        position: "absolute",
        color: "#668",
        width: `${props.size}px`,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: `${props.size / 4.0}px`,
        paddingTop: `${props.size / 2.8}px`
    }));

</script>