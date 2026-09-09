import {
	createRouter,
	createWebHistory,
	type RouteRecordRaw,
} from 'vue-router';
import ChooseView from '@/components/ChooseView.vue';
import GroupingView from '@/components/GroupingView.vue';
import RankingView from '@/components/RankingView.vue';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		redirect: () => {
			return { path: '/one' };
		},
	},
	{ path: '/one', component: ChooseView },
	{ path: '/grouping', component: GroupingView },
	{ path: '/ranking', component: RankingView },
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

export default router;
