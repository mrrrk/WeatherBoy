<template>
    <div>
        <div style="font-size:34px; font-weight:bold;">{{ timeText }}</div>
        <div style="font-size:28px;margin-top:10px">{{ dateText }}</div>
    </div>
</template>

<script setup lang="ts">

    import { onMounted, ref } from "vue";
    import Stuff from "@/utilities/Stuff";

    onMounted(() => {
        setTimeText();
        setDateText();
        setInterval(setTimeText, 200);
        setInterval(setDateText, 60000);
    });

    const timeText = ref("- - -");
    const dateText = ref("- - -");

    const setDateText = () => {
        dateText.value = Stuff.dateText(new Date());
    }

    const setTimeText = () => {
        timeText.value = Stuff.timeText(new Date());
    }

</script>