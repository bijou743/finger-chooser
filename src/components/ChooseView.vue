<script setup lang="ts">
import Chooser from './FingerChooser.vue';
import IconChoose from '@/assets/svg/choose.svg';
</script>

<template>
	<Chooser mode="choose-one" title="Finger chooser" :icon="IconChoose" />
</template>
