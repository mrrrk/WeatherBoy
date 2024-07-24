<template>
    <div>
        <div style="font-size:34px; font-weight:bold;">{{ timeText }}</div>
        <div style="font-size:28px;margin-top:10px">{{ dateText }}</div>
    </div>
</template>

<script setup lang="ts">

    import { onMounted, ref } from "vue";

    onMounted(() => {
        setTimeText();
        setDateText();
        setInterval(setTimeText, 200);
        setInterval(setDateText, 60000);
    });

    const timeText = ref("- - -");
    const dateText = ref("- - -");

    const dayText = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthText = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const pad2 = (value: string|number) => {
        const s = String(value);
        return s.length == 1 ? `0${s}` : s;
    }

    const setDateText = () => {
        const now = new Date();
        dateText.value = `${dayText[now.getDay()]} ${pad2(now.getDate())} ${monthText[now.getMonth()]}`;
    }

    const setTimeText = () => {
        const now = new Date();
        timeText.value = `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;
    }

</script>