import Vue from 'vue'
import websql from '@/public/websql'
// 比赛模块
const playModel = {
    // 初始化状态
    state: {
        playModel: {
			playtabselected: '1-1',
			gamestatu:false,
			tab11data: {
				"teamA": null,
				'teamB': null
			},
			tab12data: {
				'useTeam': '',
				'notselectedteam': [],
				'teamAplayer': [],
				'teamBplayer': []
			},
			tab21data: {
				'ball': ['①', '②', '③', '④', '⑤', '⑥', '⑦'],
				'redballplayer': ['', '', '', '', '', '', ''],
				'whiteballplayer': ['', '', '', '', '', '', '']
			},
			tab22data: {
				'useball': "",
				'useplayer': 'teamAplayer',
			},
        }
    },
    // 编写动作
    mutations: {
    	TOPLAYTAB (state, data) {
        	state.playModel.playtabselected = data;
        },
    },
    // 取值
    getters: {
        playModel: function(state){
            return state.playModel;
        },
    },
    // 创建驱动，可异步
    actions: {
    	toplayTab ({commit}, data) {
            commit('TOPLAYTAB', data)
        },
    }
}

export default playModel;