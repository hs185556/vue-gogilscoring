<template>
  <div class="calc">
  	<toast :toastmsg='toastmsg' :toaststatu='toaststatu' @cleartoast='cleartoast'></toast>
  	<div class="calc-nav" v-show="calcModel.calctabselected!=='1-1'">
  		<div :class="calcModel.calctabselected==='1-2'?'calc-nav-left select':'calc-nav-left'" @click="tocalcTab('1-2')">
  			<span>团队</span>
  		</div>
  		<div :class="calcModel.calctabselected==='1-3'?'calc-nav-right select':'calc-nav-right'" @click="tocalcTab('1-3')">
  			<span>个人</span>
  		</div>
  	</div>
  	<div class="time" v-show="calcModel.calctabselected!=='1-1'">
  		<p>
  			<span class="icon iconfont">&#xe62e;{{turnnum}} </span>
  			<span class="icon iconfont">&#xe61a;{{starttime }}</span>
  			<span class="icon iconfont">&#xe61a;{{continuetime}}</span>
  		</p>
  	</div>
  	<div class="tab tab-1-1" v-show="calcModel.calctabselected==='1-1'">
  		<p class='title'>比赛数据</p>
  		<ul v-if='gamerecord.length !== 0'>
	    		<li v-for="(item,index) in gamerecord">
	    			<mt-cell-swipe title="比赛数据"
					  :right="[
							{
						      content: '&nbsp&nbsp&nbsp查看&nbsp&nbsp&nbsp',
						      style: { background: '#FF9900', color: '#fff' },
						      handler: () => showgamerecord(index)
						  },
						  {
					      content: '&nbsp&nbsp&nbsp删除&nbsp&nbsp&nbsp',
					      style: { background: 'red', color: '#fff' },
					      handler: () => delgamerecord(index)
					    }
					  ]">
					  	<p>{{item.gname}}</p> 
	    			</mt-cell-swipe>
    		</li>
    	</ul>
  	</div>
  	<div class="tab tab-1-2" v-show="calcModel.calctabselected==='1-2'">
  		<table class="teamdata" v-if="gameteam.length === 2">
				<tr>
					<th></th>
					<th>{{gameteam[0].tname}} <span class="win" v-if='gameteam[0].iswin === "true"'>胜利</span><span class="fail" v-if='gameteam[0].iswin === "false" && gameteam[1].iswin !== "false"'>失败</span></th>
					<th>{{gameteam[1].tname}} <span class="win" v-if='gameteam[1].iswin === "true"'>胜利</span><span class="fail" v-if='gameteam[1].iswin === "false" && gameteam[0].iswin !== "false"'>失败</span></th>
				</tr>
				<tr v-for="(item,index) in teamtableattr">
					<td>{{teamtableattr[index][0]}}</td>
					<td :class="teamdataishigher(0,index)">{{gameteam[0][teamtableattr[index][1]]}}</td>
					<td :class="teamdataishigher(1,index)">{{gameteam[1][teamtableattr[index][1]]}}</td>
				</tr>
			</table>
  	</div>
  	<div class="tab tab-1-3" v-show="calcModel.calctabselected==='1-3'">
  		<div class="tab-1-3-nav" v-if="gameteam.length === 2">
  			<p>
  				<span :class="playerteamselect?'':'select'" @click='tab13select(0)'>{{gameteam[0].tname}}</span>
  				<span :class="!playerteamselect?'':'select'" @click='tab13select(1)'>{{gameteam[1].tname}}</span>
  			</p>
  		</div>
  		<div class="tab-1-3-1" v-show='!playerteamselect'>
  			<table class="playerteam">
					<tr>
						<th>球员</th>
						<th>击球数</th>
						<th>击球命中</th>
						<th>犯规次数</th>
						<th>&nbsp;评分&nbsp;</th>
					</tr>
					<tr v-for="(item,index) in gamerplayer">
						<td :class="playerdataiswin(0)">&nbsp;{{ball[item.ball]}}&nbsp;{{item.pname}}&nbsp;</td>
						<td>{{item.hittime}}</td>
						<td>{{item.hitsucrate}}</td>
						<td>{{item.foultime}}</td>
						<td :class="playerdataissuper(0,index)">{{item.score}}</td>
					</tr>
				</table>
  		</div>
  		<div class="tab-1-3-2" v-show='playerteamselect'>
  			<table class="playewteam">
					<tr>
						<th>球员</th>
						<th>击球数</th>
						<th>击球命中</th>
						<th>犯规次数</th>
						<th>&nbsp;评分&nbsp;</th>
					</tr>
					<tr v-for="(item,index) in gamewplayer">
						<td :class="playerdataiswin(1)">&nbsp;{{ball[item.ball]}}&nbsp;{{item.pname}}&nbsp;</td>
						<td>{{item.hittime}}</td>
						<td>{{item.hitsucrate}}</td>
						<td>{{item.foultime}}</td>
						<td :class="playerdataissuper(1,index)">{{item.score}}</td>
					</tr>
				</table>
  		</div>
  	</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import toast from '@/components/toast'
export default {
  name: 'calc',
  data () {
    return {
    	toastmsg:'',
      toaststatu:false,
    	gamerecord:[],
    	gameteam:[],
    	gamerplayer:[],
    	gamewplayer:[],
    	turnnum:'',
    	starttime:'',
    	continuetime:'',
    	teamtableattr:[['活球数量','livenum'],['初关数量','onecronum'],['二关数量','twocronum'],['出局数量','threecronum'],['布局率','setballrate'],['进攻率','hitrate'],['进攻成功率','hitsucrate'],['优势期占比','advrate'],['队伍评分','avgscore'],['总分','score']],
			playerteamselect:0,
			ball: ['①', '②', '③', '④', '⑤', '⑥', '⑦'],
    }
  },
  computed: {
			...mapGetters(['teamModel','playModel','calcModel'])
	},
	components:{toast},
  methods:{
  	toast(info){
  		//console.log('toast');
  		if(info === '')return;
  		this.toastmsg = info
			this.toaststatu = true;
  	},
  	cleartoast(){
  		//console.log('cleartoast')
			this.toastmsg = '';
			this.toaststatu = false;
  	},
  	tocalcTab(name){
  		//console.log('tocalcTab');
			if(this.calcModel.calctabselected !== name){
				this.$store.dispatch("tocalcTab",name);
			}
  	},
  	showgamerecord(index){
  		//console.log('showgamerecord');
  		let temp = this.gamerecord[index]
  		this.turnnum = temp.turnnum;
  		this.starttime = temp.starttime;
  		this.continuetime = temp.continuetime;
  		// 获取team和player数据
  		this.$websql.exe(
	  		"select * from gogilgameteam where gid = ?",
	  		[temp.gid+''],
	  		function (rs) {
	  			this.gameteam = rs.rows;
//	  			//console.log(this.gameteam);
	  		}.bind(this)
	  	)
  		this.gamerplayer = []
  		this.gamewplayer = []
  		this.$websql.exe(
	  		"select * from gogilgameplayer where gid = ?",
	  		[temp.gid+''],
	  		function (rs) {
	  			for(let i = 0;i<rs.rows.length;i++){
	  				let temp = rs.rows[i]
	  				if(temp.team ===  'r'){
	  					this.gamerplayer.push(temp)
	  				}else{
	  					this.gamewplayer.push(temp)
	  				}
	  			}
//	  			//console.log(this.gamerplayer,this.gamewplayer);
	  		}.bind(this)
	  	)
  		this.tocalcTab('1-2')
  	},
  	delgamerecord(index){
  		//console.log('delgamerecord');
  		this.$messagebox.confirm("确认执行删除操作?",'！').then(aAction =>{
  			let gid = this.gamerecord[index].gid
  			this.$websql.exe(
  				"delete from gogilgame where gid = ?",
  				[gid]
  			)
  			this.$websql.exe(
  				"delete from gogilgameteam where gid = ?",
  				[gid+'']
  			)
  			this.$websql.exe(
  				"delete from gogilgameplayer where gid = ?",
  				[gid+'']
  			)
  			this.gamerecord.splice(index,1);
  			this.toast('删除成功')
  		})
  	},
  	tab13select(index){
  		//console.log('tab13select');
  		if(this.playerteamselect !== index){
  			this.playerteamselect = index;
  		}
  	},
  	teamdataishigher(tindex,index){
  		//console.log('teamdataishigher');
  		let mclass = ''
  		if(this.gameteam[tindex].iswin === 'true'){
  			mclass += 'win'
  		}else{
  			mclass += 'fail'
  		}
  		let opstindex = tindex?0:1;
  		let attr = this.teamtableattr[index][1];
  		if(attr.indexOf('rate') === -1){
  			if( parseInt(parseInt(this.gameteam[tindex][attr])*10)/10 > parseInt(parseInt(this.gameteam[opstindex][attr]*10))/10 ){
  				mclass += 'higher'
  				return mclass;
  			}
  		}else{
  			if( parseInt(this.gameteam[tindex][attr]) > parseInt(this.gameteam[opstindex][attr]) ){
  				mclass += 'higher'
  				return mclass;
  			}
  		}
  		return '';
  	},
  	playerdataiswin(tindex){
  		//console.log('playerdataiswin');
  		if(this.gameteam[tindex].iswin === 'true'){
  			return 'win'
  		}
  		let opstindex = tindex?0:1;
  		if(this.gameteam[tindex].iswin === 'false' && this.gameteam[opstindex].iswin !== 'false'){
  			return 'fail'
  		}
  		return ''
  	},
  	playerdataissuper(tindex,index){
			//console.log('playerdataissuper'); 
			let mclass = ''
			let team = tindex?'gamewplayer':'gamerplayer'
			let opstindex = tindex?0:1;
			if(this.gameteam[tindex].iswin === 'true'){
  			mclass += 'win'
  			if(this[team][index].issuper === 'true'){
	  			mclass += 'higher'
	  			return mclass
	  		}
  		}else if(this.gameteam[tindex].iswin === 'false' && this.gameteam[opstindex].iswin !== 'false'){
  			mclass += 'fail'
  			if(this[team][index].issuper === 'true'){
	  			mclass += 'higher'
	  			return mclass
	  		}
  		}
  		return ''
  	}
  },
  created(){
  },
  mounted(){
  	this.$websql.exe(
  		"select * from gogilgame order by gid desc",
  		[],
  		function (rs) {
  			this.gamerecord = []
  			for(let i = 0;i<rs.rows.length;i++){
  				this.gamerecord.push(rs.rows[i])
  			}
  		}.bind(this)
  	)
  }
}
</script>

<style scoped>
.calc{
	margin-top: 40px;
	width: 100%;
}
.calc p{
	margin: 0;
}
.calc table .winhigher{
	color: #3399CC;
	font-size: 16px;
}
.calc table .failhigher{
	font-size: 16px;
	color: #FF6666;
}
.calc table .win{
	color: #3399CC;
}
.calc table .fail{
	color: #FF6666;
}
.calc table{
	font-family: verdana,arial,sans-serif;
	font-size:14px;
	color:#333333;
	padding: 9px;
	border-width: 1px;
	border-color: #666666;
	border-collapse: collapse;
	width: 100%;
	min-height:100%;
}
.calc table th{
	border-width: 1px;
	border-style: solid;
	padding: 4px 0;
	border-color: #666666;
	background-color: #dedede;
	height: 36px;
	width: 20%;
}
.calc table td{
	border-width: 1px;
	padding: 4px 0;
	border-style: solid;
	border-color: #666666;
	background-color: #ffffff;
	height: 36px;
	width: 20%;
}
.calc .title{
	font-size: 12px;
}
.calc .calc-nav span{
	padding: 0px;
}
.calc .calc-nav{
	height: 40px;
	width: 100%;
}
.calc .calc-nav .calc-nav-left,
.calc .calc-nav .calc-nav-right{
	font-size: 12px;
	line-height: 40px;
	width: 50%;
	float: left;
	text-align: center;
}
.calc .calc-nav .calc-nav-left.select,
.calc .calc-nav .calc-nav-right.select{
	background-color:#99CCFF;
	color:#fff
}
.calc .time span{
	font-size: 14px;
	margin-right: 8px;
}
.calc .time span:last-child{
	margin-right: 0;
}
.calc .tab-1-3 .tab-1-3-nav{
	text-align: left;
}
.calc .tab-1-3 .tab-1-3-nav p{
	display: inline-block;
	border: 1px solid #99CCFF;
	border-radius: 18px;
}
.calc .tab-1-3 .tab-1-3-nav p span{
	padding: 4px;
	display: inline-block;
}
.calc .tab-1-3 .tab-1-3-nav p span{
	padding: 4px;
	display: inline-block;
	width: 6em;
	text-align: center;
}
.calc .tab-1-3 .tab-1-3-nav p span:first-child{
	border-radius: 20px 0 0 20px;
}
.calc .tab-1-3 .tab-1-3-nav p span:last-child{
	border-radius: 0 20px 20px 0 ;
}
.calc .tab-1-3 .tab-1-3-nav p span.select{
	color:#fff;
	background-color: #99CCFF;
}
</style>
