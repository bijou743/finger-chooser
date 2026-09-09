<script setup lang="ts">
import IconChoose from '@/assets/svg/choose.svg';
import IconGrouping from '@/assets/svg/grouping.svg';
import IconRanking from '@/assets/svg/ranking.svg';

type TLink = {
	to: string;
	label: string;
	icon: typeof IconChoose;
};

const links: TLink[] = [
	{
		to: '/one',
		label: 'Choose one',
		icon: IconChoose,
	},
	{
		to: '/grouping',
		label: 'Grouping',
		icon: IconGrouping,
	},
	{
		to: '/ranking',
		label: 'Ranking',
		icon: IconRanking,
	},
];
</script>

<template>
	<nav class="grid grid-cols-3 text-center">
		<RouterLink
			v-for="link in links"
			:key="link.to"
			:to="link.to"
			class="flex flex-col items-center gap-1 p-5 text-white no-underline opacity-40 transition-opacity duration-300 ease-in-out"
			active-class="opacity-100"
		>
			<component
				:is="link.icon"
				style="width: 24px; height: 24px; color: #fff"
			/>
			{{ link.label }}
		</RouterLink>
	</nav>
</template>
