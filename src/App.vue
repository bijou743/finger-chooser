<script setup lang="ts">
import { useRoute } from 'vue-router';
import MainMenu from './components/MainMenu.vue';
import { useStore } from '@/stores/store';
import { provide, watch } from 'vue';
import { maxTouchesKey } from '@/types/injectionKeys';

const store = useStore();
const route = useRoute();

watch(
	() => route.path,
	() => {
		store.reset();
	},
);

const maxTouches = navigator.maxTouchPoints;
const isTouchDevice = 'ontouchstart' in window && maxTouches > 1;
// const isTouchDevice = true;

provide(maxTouchesKey, maxTouches);
</script>

<template>
	<div
		class="flex flex-col h-dvh bg-linear-to-b from-brand-pink to-brand-purple-light"
	>
		<main class="flex flex-col flex-1">
			<RouterView v-if="isTouchDevice" />
			<div
				v-else
				class="flex flex-1 flex-col align-center justify-center text-center gap-2.5"
			>
				<h2>Your device isn't supported</h2>
				<p class="text-white">Please use device with touchscreen</p>
			</div>
		</main>

		<footer class="bg-brand-purple rounded-t-4xl">
			<MainMenu />
		</footer>
	</div>
</template>
