// 引入vue
import Vue from 'vue'
// 引入vuex
import Vuex from 'vuex'
// 引入teamModel
import teamModel from '@/vuex/teamModel'
// 引入playerModel
import playModel from '@/vuex/playModel'
// 引入calcModel
import calcModel from '@/vuex/calcModel'

// 使用vuex
Vue.use(Vuex)

const store = new Vuex.Store({
	modules:{
		teamModel: teamModel,
		playModel: playModel,
		calcModel: calcModel
	}
});

// 6、输出store
export default store;