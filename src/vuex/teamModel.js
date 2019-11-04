import Vue from 'vue'
import websql from '@/public/websql'
// 选手模块
const teamModel = {
    // 初始化状态
    state: {
        teamModel: {
            player:localStorage.getItem('_gogilplayer')?localStorage.getItem('_gogilplayer').split(','):[],
            team:localStorage.getItem('_gogilteam')?localStorage.getItem('_gogilteam').split(','):[],
        }
    },
    // 编写动作
    mutations: {
        ADDPLAYER (state, data) {
        	state.teamModel.player.unshift(data);
        	localStorage.setItem('_gogilplayer',state.teamModel.player)
        },
        DELPLAYER(state, index) {
            state.teamModel.player.splice(index, 1);
            localStorage.setItem('_gogilplayer',state.teamModel.player)
        },
        ADDTEAM (state, data) {
        	state.teamModel.team.unshift(data);
        	localStorage.setItem('_gogilteam',state.teamModel.team)
        },
        DELTEAM(state, index) {
            state.teamModel.team.splice(index, 1);
            localStorage.setItem('_gogilteam',state.teamModel.team)
        },
    },
    // 取值
    getters: {
        teamModel: function(state){
            return state.teamModel;
        },
    },
    // 创建驱动，可异步
    actions: {
    	openGogilDB(){
    		websql.openDB("gogildb", "1.0", "gogildb", 2 * 1024 * 1024);
    	},
    	createGroupTable(){
    		websql.createTable("gogilgroup", "gid integer primary key autoincrement,pname text,tname text,statu text");
    	},
    	createGameTable(){
    		websql.createTable("gogilgame", "gid integer primary key autoincrement,gname text,starttime text,continuetime text,turnnum text");
    	},
    	createGameteamTable(){
    		websql.createTable("gogilgameteam", "gid text,iswin text,tname text,livenum text,onecronum text,twocronum text,threecronum text,setballrate text,hitrate text,hitsucrate text,advrate text,avgscore text,score text");
    	},
    	createGameplayerTable(){
    		websql.createTable("gogilgameplayer", "gid text,pname text,ball text,team text,hittime text,hitsucrate text,foultime text,score text,issuper text");
    	},
        addPlayer ({commit}, data) {
            commit('ADDPLAYER', data)
        },
        delPlayer ({commit}, data) {
            commit('DELPLAYER', data)
        },
        addTeam ({commit}, data) {
            commit('ADDTEAM', data)
        },
        delTeam ({commit}, data) {
            commit('DELTEAM', data)
        },
    }
}

export default teamModel;