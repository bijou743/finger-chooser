<script setup lang="ts">
import Chooser from './Chooser.vue';
import IconChoose from '@/assets/svg/choose.svg';
import { useStore } from '@/stores/store.ts';
import { inject } from 'vue';
import { maxTouchesKey } from '@/types/injectionKeys';

const maxTouches = inject(maxTouchesKey);
</script>

<template>
	<Chooser
		mode="choose-one"
		title="Finger chooser"
		:hint="`Touch the screen with ${useStore().getMinFingers()}-${maxTouches} fingers to start the game and wait a few
			seconds for the result`"
		:icon="IconChoose"
	/>
</template>
