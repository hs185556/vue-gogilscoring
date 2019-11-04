import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/gogil/team',
    },
    {
    	path: '/gogil',
			redirect: '/gogil/play',
			name: 'gogil',
			component:  ()=>import('@/components/Gogil'),
			children: [{
					path: '/gogil/play',
					name: 'play',
					component: () => import('@/components/play'),
				},
				{
					path: '/gogil/team',
					name: 'team',
					component: () => import('@/components/Team'),
				}, 
				{
					path: '/gogil/calc',
					name: 'calc',
					component: () => import('@/components/Calc'),
				} 
			]
    },
  ]
})
