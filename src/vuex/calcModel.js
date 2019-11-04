import Vue from 'vue'
// 比赛记录模块
const calcModel = {
    // 初始化状态
    state: {
        calcModel: {
			calctabselected: '1-1',
        }
    },
    // 编写动作
    mutations: {
    	TOCALCTAB (state, data) {
        	state.calcModel.calctabselected = data;
        },
    },
    // 取值
    getters: {
        calcModel: function(state){
            return state.calcModel;
        },
    },
    // 创建驱动，可异步
    actions: {
    	tocalcTab ({commit}, data) {
            commit('TOCALCTAB', data)
        },
    }
}

export default calcModel;