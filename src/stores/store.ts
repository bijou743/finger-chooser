import { defineStore } from 'pinia';
import { type ITouch } from '@/types/ITouch';
import { ref } from 'vue';
import { type TMode } from '@/types/TMode';

type TStatus = 'inactive' | 'process' | 'ready';

const TIMER_SECONDS = 2;

const COLORS: string[] = [
	'#FFD500', // жёлтый
	'#39FF88', // мятно-зелёный
	'#00E5FF', // голубой
	'#FF7A00', // оранжевый
	'#FFFFFF', // белый
	'#B6FF00', // кислотно-лаймовый
	'#00FFC2', // бирюзовый
	'#FF3B30', // красный
	'#2EA9FF', // синий
	'#FFEA8A', // светло-жёлтый
	'#C4C4C4', // серебристый
	'#000000', // чёрный
	'#5C67FF', // индиго
	'#8B4513', // коричневый
	'#2E8B57', // морская волна
];

export const useStore = defineStore('store', () => {
	const touches = ref<ITouch[]>([]);
	const seconds = ref<number>(TIMER_SECONDS);
	const status = ref<TStatus>('inactive');
	const mode = ref<TMode>('choose-one');
	const selectedIndex = ref<number | null>(null);

	let timeout: number | undefined;
	let interval: number | undefined;
	let availableColors: string[] = [];

	function randomColor() {
		if (availableColors.length === 0) {
			availableColors = [...COLORS];
		}
		const index = Math.floor(Math.random() * availableColors.length);
		return availableColors.splice(index, 1)[0]!;
	}

	function setMode(newMode: TMode) {
		mode.value = newMode;
	}

	function getMinFingers(): number {
		return mode.value === 'grouping' ? 3 : 2;
	}

	function resetTimers() {
		if (timeout) clearTimeout(timeout);
		if (interval) clearInterval(interval);
		status.value = 'inactive';
	}

	function shuffle<T>(array: T[]): T[] {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j]!, array[i]!];
		}
		return array;
	}

	function chooseOne() {
		selectedIndex.value = Math.floor(Math.random() * touches.value.length);
	}

	function grouping() {
		shuffle(touches.value);
	}

	function ranking() {
		shuffle(touches.value);
	}

	function makeSelection() {
		switch (mode.value) {
			case 'choose-one':
				chooseOne();
				break;
			case 'grouping':
				grouping();
				break;
			case 'ranking':
				ranking();
				break;
			default:
				break;
		}
	}

	function initTimers() {
		if (touches.value.length >= getMinFingers()) {
			timeout = setTimeout(() => {
				seconds.value = TIMER_SECONDS;

				status.value = 'process';
				interval = setInterval(() => {
					seconds.value--;

					if (seconds.value === 0) {
						makeSelection();
						status.value = 'ready';
						clearInterval(interval);
						return;
					}
				}, 1000);
			}, 500);
		}
	}

	function addTouch(event: TouchEvent) {
		event.preventDefault();

		if (status.value === 'ready') {
			return;
		}

		resetTimers();

		for (const touch of event.changedTouches) {
			touches.value.push({
				x: touch.clientX,
				y: touch.clientY,
				id: touch.identifier,
				color: randomColor(),
			});
		}

		initTimers();
	}

	function updateTouch(event: TouchEvent) {
		event.preventDefault();

		if (status.value === 'ready') {
			return;
		}

		for (const touch of event.changedTouches) {
			const stored = touches.value.find((t) => t.id === touch.identifier);
			if (stored) {
				stored.x = touch.clientX;
				stored.y = touch.clientY;
			}
		}
	}

	function removeTouch(event: TouchEvent) {
		event.preventDefault();

		if (status.value === 'ready') {
			return;
		}

		resetTimers();

		const ids = Array.from(event.changedTouches).map(
			(touch) => touch.identifier,
		);
		touches.value = touches.value.filter((touch) => !ids.includes(touch.id));

		initTimers();
	}

	function reset() {
		status.value = 'inactive';
		touches.value = [];
		seconds.value = TIMER_SECONDS;
		clearTimeout(timeout);
		clearInterval(interval);
		selectedIndex.value = null;
		availableColors = [];
	}

	return {
		touches,
		addTouch,
		updateTouch,
		removeTouch,
		seconds,
		status,
		reset,
		setMode,
		getMinFingers,
		selectedIndex,
	};
});
