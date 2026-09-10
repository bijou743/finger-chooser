<script setup lang="ts">
import { computed, nextTick, ref, toRefs, watch, onMounted } from 'vue';
import { useStore } from '@/stores/store';
import { type TMode } from '@/types/TMode';
import { type ITouch } from '@/types/ITouch';

const props = defineProps<{
	mode: TMode;
	title: string;
	icon: string;
}>();

const store = useStore();
const { touches, seconds, status, selectedIndex } = toRefs(store);
const isSelectionRevealed = ref(false);

const isChooseOneReady = computed(
	() => props.mode === 'choose-one' && status.value === 'ready',
);

watch(isChooseOneReady, (ready) => {
	if (!ready) {
		isSelectionRevealed.value = false;
		return;
	}

	nextTick(() => {
		requestAnimationFrame(() => {
			isSelectionRevealed.value = true;
		});
	});
});

function touchClassList(index: number): string[] {
	const result: string[] = [];

	if (status.value === 'process' && seconds.value) {
		result.push('animate-pulse-scale');
	}

	if (isChooseOneReady.value && isSelectionRevealed.value) {
		result.push(index === selectedIndex.value ? 'scale-125' : 'opacity-30');
	}

	return result;
}

function borderColor(touch: ITouch, index: number): string {
	if (props.mode === 'grouping' && status.value === 'ready') {
		return index < touches.value.length / 2 ? '#00ce85' : '#ffffff';
	}

	return touch.color;
}

const hint = computed(() => {
	const minFingers = store.getMinFingers();
	const maxTouches = navigator.maxTouchPoints;
	let fingers: string[] = [];
	if (!maxTouches) {
		fingers.push(`from ${minFingers}`);
	} else {
		fingers.push(`${minFingers}-${maxTouches}`);
	}
	return `Touch the screen with ${fingers.join('')} fingers to start the game and wait a few
			seconds for the result`;
});

onMounted(() => {
	store.setMode(props.mode);
});
</script>

<template>
	<div
		class="flex flex-1 flex-col relative"
		@touchstart="store.addTouch"
		@touchmove="store.updateTouch"
		@touchend="store.removeTouch"
		@touchcancel="store.removeTouch"
	>
		<div
			class="flex items-center justify-center flex-col flex-1 gap-4 transition-opacity duration-200 ease-in-out"
			:class="{ 'opacity-0': touches.length }"
		>
			<h2>{{ title }}</h2>
			<component :is="icon" class="w-15 h-15 text-white opacity-60" />
		</div>

		<div
			class="text-white p-5 text-center text-lg leading-[1.4] absolute bottom-0 left-0 transition-opacity duration-200 ease-in-out w-auto"
			:class="touches.length ? 'opacity-0' : 'opacity-80'"
		>
			{{ hint }}
		</div>

		<div
			v-if="status === 'ready'"
			class="absolute bottom-0 z-10 w-full flex justify-center px-2.5 py-3"
		>
			<button
				class="text-white text-lg bg-brand-pink py-2 px-5 rounded-full"
				@click="store.reset()"
				@touchend.stop.prevent="store.reset()"
			>
				Reset
			</button>
		</div>

		<TransitionGroup
			enter-active-class="transition-scale duration-200 ease-out"
			enter-from-class="scale-0"
			leave-active-class=""
			tag="div"
		>
			<div
				v-for="(touch, index) in touches"
				:key="touch.id"
				:style="`top: ${touch.y}px; left: ${touch.x}px; border-color: ${borderColor(touch, index)}`"
				class="w-24 h-24 border-10 absolute -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_16px_4px_rgba(255,255,255,0.5)] flex items-center justify-center pointer-events-none"
				:class="[
					touchClassList(index),
					status === 'ready'
						? ''
						: 'transition-[opacity,scale] duration-200 ease-in-out',
				]"
			>
				<span
					v-if="status === 'ready' && mode === 'ranking'"
					class="text-white text-3xl font-black"
				>
					{{ index + 1 }}
				</span>
			</div>
		</TransitionGroup>
	</div>
</template>

<style scoped>
@keyframes pulse-scale {
	0%,
	100% {
		scale: 1;
	}
	50% {
		scale: 1.15;
	}
}

.animate-pulse-scale {
	animation: pulse-scale 1s ease-in-out infinite;
}
</style>
