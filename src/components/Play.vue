<template>
  <div class="play">
  	<toast :toastmsg='toastmsg' :toaststatu='toaststatu' @cleartoast='cleartoast'></toast>
  	<div class="tab tab-1-1"v-show="playModel.playtabselected==='1-1'">
				<div class="content">
					<div class="team teamA"@click="selectTeam('add','teamA')">
						<p class="teamAicon">♔</p>
						<p class="teamText":style="playModel.tab11data.teamA?'':'color:rgb(235, 235, 228)'"v-text="playModel.tab11data.teamA?playModel.tab11data.teamA:'红队'"></p>
					</div>
					<div class="img"></div>
					<div class="team teamB"@click="selectTeam('add','teamB')">
						<p class="teamBicon">♔</p>
						<p class="teamText":style="playModel.tab11data.teamB?'':'color:rgb(235, 235, 228)'"v-text="playModel.tab11data.teamB?playModel.tab11data.teamB:'白队'"></p>
					</div>
				</div>
				<div class="next">
					<mt-button v-show='playModel.tab11data.teamA && playModel.tab11data.teamB' type="danger"plain @click.native="reverseTeamPlayer()">交换队伍</mt-button>
					<mt-button type="primary"plain @click.native="checkTeam()">开启选球</mt-button>
				</div>
  	</div>
  	<div class="tab tab-2-1"v-show="playModel.playtabselected==='2-1'">
			<div class="container">
				<div class="top">
					<div class="redBall">
						<div class="setPlayerBall"v-for="(item,index) in playModel.tab21data.ball"@click="selectballplayer('add',('r'+index))">
							<p class="ball">{{item}}</p>
							<p class="player"v-text="playModel.tab21data.redballplayer[index]":style="playModel.tab21data.redballplayer[index]!==''?'':'color:rgb(235, 235, 228)'"></p>
						</div>
						<p class="balltitle redballtitle">♔{{playModel.tab11data.teamA}}</p>
					</div>
				</div>
				<div class="bottom">
					<div class="whiteBall">
						<p class="balltitle whiteballtitle">♔{{playModel.tab11data.teamB}}</p>
						<div class="setPlayerBall"v-for="(item,index) in playModel.tab21data.ball"@click="selectballplayer('add',('w'+index))">
							<p class="ball">{{item}}</p>
							<p class="player"v-text="playModel.tab21data.whiteballplayer[index]":style="playModel.tab21data.whiteballplayer[index]!==''?'':'color:rgb(235, 235, 228)'"></p>
						</div>
					</div>
				</div>
			</div>
			<div class="next">
					<mt-button type="primary"plain @click.native="checkballplayer">开启比赛界面</mt-button>
			</div>
		</div>
  	<div class="tab tab-3-1"v-show="playModel.playtabselected==='3-1'">
  		<div class="container":style="tab31data.slidebarstatu?'margin-left:-90vw':''" v-swipeleft="hideslidebar"v-swiperight="showslidebar">
  			<div class="left":style="tab31data.slidebarstatu?'background-color:#e6e6e6':''">
					<div class="top">
						<timepanel :statu='playModel.gamestatu' @passtimerecord='passtimerecord'></timepanel>
					</div>
					<div class="center">
						<div class="livegame">
							回合数：{{tab31data.game.turnnum}}
						</div>
						<div class="ballview">
							<div class="leftball":style="tab31data.game.turnteam === 0?'border:2px solid #3399CC;background-color:rgb(226,239,243)':''">
								<p class="redteamtitle">
									{{playModel.tab11data.teamA}}									
									<span v-html="tab31data.team.wteam.hitinvalidmsg"></span>
								</p>
								<div class='ballplay' v-for="(item,index) in playModel.tab21data.ball">
									<p>
										<span class="index" v-show="tab31data.playballstatu['r'+(index+1)].index">
											{{tab31data.playballstatu['r'+(index+1)].index}}
										</span>
										<span @click="selectcomside('r',index)" class='ball red'>
											{{item}}&nbsp
										</span>
										<span class="line" v-if="isservestage('r')">
											<span class="butline"v-show="tab31data.playballstatu['r'+(index+1)].line === 1">✕</span>
											<span class="overline"v-show="tab31data.playballstatu['r'+(index+1)].line === 2">✓</span>
										</span>
										<span class="ballstatu">
											<span class='yellow icon iconfont' v-show="tab31data.playballstatu['r'+(index+1)].statu === 1">&#xe627;</span>
											<span class='red icon iconfont' v-show="tab31data.playballstatu['r'+(index+1)].statu === 2">&#xe627;</span>
											<span class='icon iconfont' v-show="tab31data.playballstatu['r'+(index+1)].statu === 3">&#xe62f;</span>
											<svg class="icon" aria-hidden="true" v-show="tab31data.playballstatu['r'+(index+1)].issave">
											  <use xlink:href="#icon-huabanfuben"></use>
											</svg>
										</span>
									</p>
								</div>
							</div>
							<div class="middlebutton">
								<div :class="calcbuttonviewprop()">
									<mt-button v-show="tab31data.game.comside.length === 1" class="gamebutton" type="primary" size='small' plain @click.native="foul">犯<span class="oneword"></span>规</mt-button>
									<mt-button v-show="!(tab31data.game.comside.length === 1)" class="gamebutton" type="default" size='small' plain disabled>犯<span class="oneword"></span>规</mt-button>
								</div>
								<div :class="calcbuttonviewprop()">
									<mt-button v-show="tab31data.game.comside.length >= 2 && (!isservestage('r') || !isservestage('w'))" class="gamebutton"type="primary"size='small' plain @click.native="hit">击<span class="oneword"></span>中</mt-button>
								<mt-button v-show="!(tab31data.game.comside.length >= 2 && (!isservestage('r') || !isservestage('w')))" class="gamebutton"type="default"size='small' plain disabled>击<span class="oneword"></span>中</mt-button>
								</div>
								<div :class="calcbuttonviewprop()">
									<mt-button v-show="tab31data.game.comside.length === 1 && (!isservestage('r') || !isservestage('w'))" class="gamebutton"type="primary"size='small' plain @click.native="miss">不击中</mt-button>
									<mt-button v-show="!(tab31data.game.comside.length === 1 && (!isservestage('r') || !isservestage('w')))" class="gamebutton"type="default"size='small' plain disabled>不击中</mt-button>
								</div>
								<div :class="calcbuttonviewprop()">
									<mt-button v-show="tab31data.game.comside.length === 1 && (!isservestage('r') || !isservestage('w'))" class="gamebutton"type="primary"size='small' plain @click.native="setball">布<span class="oneword"></span>局</mt-button>
									<mt-button v-show="!(tab31data.game.comside.length === 1 && (!isservestage('r') || !isservestage('w')))" class="gamebutton"type="default"size='small' plain disabled>布<span class="oneword"></span>局</mt-button>
								</div>
								<div :class="calcbuttonviewprop()">
									<mt-button v-show="tab31data.game.comside.length === 0 && playModel.gamestatu === true" class="gamebutton"type="primary"size='small' plain @click.native="nextturn(1)">下回合</mt-button>
									<mt-button v-show="tab31data.game.comside.length !== 0 || playModel.gamestatu === false" class="gamebutton"type="default"size='small' plain disabled>下回合</mt-button>
								</div>
								<div v-if="isservestage('r') || isservestage('w')" :class="calcbuttonviewprop()">
									<mt-button v-show="tab31data.game.comside.length === 1" class="gamebutton"type="primary"size='small' plain @click.native="selectoverline">过<span class="oneword"></span>线</mt-button>
									<mt-button v-show="!(tab31data.game.comside.length === 1)" class="gamebutton"type="default"size='small' plain disabled>过<span class="oneword"></span>线</mt-button>
								</div>
								<div v-if="isservestage('r') || isservestage('w')" :class="calcbuttonviewprop()">
									<mt-button v-show="tab31data.game.comside.length === 1" class="gamebutton"type="primary"size='small' plain @click.native="selectbutline">不过线</mt-button>
									<mt-button v-show="!(tab31data.game.comside.length === 1)" class="gamebutton"type="default"size='small' plain disabled>不过线</mt-button>
								</div>
								<div :class="calcbuttonviewprop()">
									<mt-button v-show="historyrecord.length >= 1" class="gamebutton"type="primary"size='small' plain @click.native="databack">撤<span class="oneword"></span>销</mt-button>
									<mt-button v-show="!(historyrecord.length >= 1)" class="gamebutton"type="default"size='small' plain disabled>撤<span class="oneword"></span>销</mt-button>
								</div>
							</div>
							<div class="rightball":style="tab31data.game.turnteam === 1?'border:2px solid #3399CC;background-color:rgb(226,239,243)':''">
								<p class="whiteteamtitle">
									{{playModel.tab11data.teamB}}
									<span v-html="tab31data.team.rteam.hitinvalidmsg"></span>
								</p>
								<div class='ballplay' v-for="(item,index) in playModel.tab21data.ball">
									<p>
										<span class="index"v-show="tab31data.playballstatu['w'+(index+1)].index">
											{{tab31data.playballstatu['w'+(index+1)].index}}
										</span>
										<span @click="selectcomside('w',index)" class='ball'>
											{{item}}&nbsp
										</span>
										<span class="line" v-if="isservestage('w')">
											<span class="butline"v-show="tab31data.playballstatu['w'+(index+1)].line === 1">✕</span>
											<span class="overline"v-show="tab31data.playballstatu['w'+(index+1)].line === 2">✓</span>
										</span>
										<span class="ballstatu">
											<span class='yellow icon iconfont' v-show="tab31data.playballstatu['w'+(index+1)].statu === 1">&#xe627;</span>
											<span class='red icon iconfont' v-show="tab31data.playballstatu['w'+(index+1)].statu === 2">&#xe627;</span>
											<span class='icon iconfont' v-show="tab31data.playballstatu['w'+(index+1)].statu === 3">&#xe62f;</span>
											<svg class="icon" aria-hidden="true" v-show="tab31data.playballstatu['w'+(index+1)].issave">
											  <use xlink:href="#icon-huabanfuben"></use>
											</svg>
										</span>
									</p>
								</div>
							</div>
						</div>
					</div>
					<div class="bottom">
						<countdown 
							:thinktime='tab31data.game.thinktime' 
							:servetime='tab31data.game.servetime' 
							:delaytime='tab31data.game.delaytime' 
							:reset='tab31data.game.countreset'
							@move1mtime="move1mtime"
							@closereset='closereset'
							@timeover='timeover'>
					 </countdown>
						<div class="times">
							<div class="bleft">
								<p>红队得分：{{tab31data.team.rteam.score}}</p>
								<p>
									红队连布：
									<span
										 v-text="(tab31data.game.turnnum - tab31data.team.rteam.lastsetball.split('/')[0])<=2?tab31data.team.rteam.lastsetball.split('/')[1]:0">
									</span>
								</p>
								<p v-if="isservestage('r')">红队犯规：{{tab31data.team.rteam.servefoultime}}</p>
								<p v-if="!isservestage('r')">红队犯规：{{tab31data.team.rteam.foultime}}</p>
								<p>红队延时：{{tab31data.team.rteam.move1mtime}}</p>
							</div>
							<div class="bright">
								<p>白队得分：{{tab31data.team.wteam.score}}</p>
								<p>
									白队连布：
									<span
										 v-text="(tab31data.game.turnnum - tab31data.team.wteam.lastsetball.split('/')[0])<=2?tab31data.team.wteam.lastsetball.split('/')[1]:0">
									</span>
								</p>
								<p v-if="isservestage('w')">白队犯规：{{tab31data.team.wteam.servefoultime}}</p>
								<p v-if="!isservestage('w')">白队犯规：{{tab31data.team.wteam.foultime}}</p>
								<p>白队延时：{{tab31data.team.wteam.move1mtime}}</p>
							</div>
						</div>
					</div>
					<div class="next" :style="tab31data.slidebarstatu?'margin-left:-90vw;background-color:#e6e6e6;':''">
						<mt-button type="danger"size='small' plain @click.native="start(0)"v-if="!playModel.gamestatu">红队发球</mt-button>
						<mt-button type="default"size='small' plain @click.native="start(1)"v-if="!playModel.gamestatu">白队发球</mt-button>
						<mt-button type="primary"size='small' plain @click.native="finish"v-if="playModel.gamestatu">结束</mt-button>
						<mt-button type="danger"size='small' plain @click.native="discard"v-if="playModel.gamestatu">放弃</mt-button>
					</div>
				</div>
  			<div class="right">
  				<div class="set" v-show="!playModel.gamestatu">
  					<mt-field label="一关分数" type="number" placeholder="" v-model="temp.onecro"></mt-field>
  					<mt-field label="二关分数" type="number" placeholder="" v-model="temp.twocro"></mt-field>
  					<mt-field label="出局分数" type="number" placeholder="" v-model="temp.threecro"></mt-field>
  					<mt-field label="发球时间" type="number" placeholder="" v-model="temp.servetime"></mt-field>
  					<mt-field label="思考时间" type="number" placeholder="" v-model="temp.thinktime"></mt-field>
  					<mt-field label="延长思考时间" type="number" placeholder="" v-model="temp.delaytime"></mt-field>
  				</div>
  				<div class="quickcalc"v-show="playModel.gamestatu">
  					<table class="playerdata">
  						<tr>
  							<th>球</th>
  							<th>选手</th>
  							<th>击中</th>
  							<th>被击中</th>
  							<th>犯规</th>
  						</tr>
  						<tr v-for="(item,index) in playModel.tab21data.ball">
  							<td>红{{item}}</td>
  							<td>{{playModel.tab21data.redballplayer[index]}}</td>
  							<td>{{tab31data.playballstatu['r'+(index+1)].hitball}}</td>
  							<td>{{tab31data.playballstatu['r'+(index+1)].behitball}}</td>
  							<td>{{tab31data.playballstatu['r'+(index+1)].foultime}}</td>
  						</tr>
  						<tr v-for="(item,index) in playModel.tab21data.ball">
  							<td>白{{item}}</td>
  							<td>{{playModel.tab21data.whiteballplayer[index]}}</td>
  							<td>{{tab31data.playballstatu['w'+(index+1)].hitball}}</td>
  							<td>{{tab31data.playballstatu['w'+(index+1)].behitball}}</td>
  							<td>{{tab31data.playballstatu['w'+(index+1)].foultime}}</td>
  						</tr>
  					</table>
  				</div>
  			</div>
  		</div>
		</div>
  	<div class="tab tab-1-2"v-show="playModel.playtabselected==='1-2'">
  		<mt-radio
			  :title="playModel.tab12data.useTeam"
			  v-model="tab12data.selectRs"
			  :options="playModel.tab12data.notselectedteam">
			</mt-radio>
  	</div>
  	<div class="tab tab-2-2"v-show="playModel.playtabselected==='2-2'">
  		<mt-radio
			  :title="playModel.tab22data.useball.charAt(0)+(parseInt(playModel.tab22data.useball.charAt(1))+1)"
			  v-model="tab22data.selectRs"
			  :options="playModel.tab12data[playModel.tab22data.useplayer]">
			</mt-radio>
  	</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import countdown from '@/components/countdown'
import timepanel from '@/components/timepanel'
import toast from '@/components/toast'
export default {
  name: 'play',
  data () {
    return {
      msg: 'play',
      toastmsg:'',
      toaststatu:false,
      historyrecord:[],
      tab12data:{
      	'selectRs':''
      },
      tab22data:{
      	'selectRs':''
      },
			tab31data: {
				'game':{
					'thinktime': parseInt(localStorage.getItem('_gogilthinktime')) || 20,
					'servetime': parseInt(localStorage.getItem('_gogilservetime')) || 10,
					'delaytime': parseInt(localStorage.getItem('_gogildelaytime')) || 60,
					'onecro': parseInt(localStorage.getItem('_gogilonecro')) || 3,
					'twocro': parseInt(localStorage.getItem('_gogiltwocro')) || 1,
					'threecro': parseInt(localStorage.getItem('_gogilthreecro')) || 1,
					'countreset':false,
					'continuetime': null,
					'starttime': null,
					'turnnum':1,
					'turnteam':null,
					'comside':[],
					'record':[],
					'autofinish':false,
					'isattack':false
				},
				'playballstatu':{
					'r1':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'r2':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'r3':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'r4':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'r5':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'r6':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'r7':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'w1':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'w2':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'w3':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'w4':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'w5':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'w6':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'w7':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
				},
				'team':{
					'rteam': {
						'turntime': -1,// 发球阶段结束的那回合，符合条件，会加一，但其实不用加一的，所以设置了-1
						'serveturntime': 0,
						'score': 0,
						'foultime': 0,
						'servefoultime': 0,
						'move1mtime': 0,
						'setball': 0,
						'lastsetball': '-3/0',
						'hit': 0,
						'miss': 0,
						'avgball': 0,
						'serveball': 0,
						'overball': 0,
						'advant': 0,
						'livenum': 7,
						'onecronum': 0,
						'twocronum': 0,
						'threecronum': 0,
						'setballrate':0,
						'hitrate':0,
						'hitsucrate':0,
						'superplayer':'',
						'avgscore':0,
						'advrate':0,
						'hitinvalid':0,
						'hitinvalidmsg':'',
						'iswin':false
					},
					'wteam': {
						'turntime': -1,
						'serveturntime': 0,
						'score': 0,
						'foultime': 0,
						'servefoultime': 0,
						'move1mtime': 0,
						'setball': 0,
						'lastsetball': '-3/0',
						'hit': 0,
						'miss': 0,
						'avgball': 0,
						'serveball': 0,
						'overball': 0,
						'advant': 0,
						'livenum': 7,
						'onecronum': 0,
						'twocronum': 0,
						'threecronum': 0,
						'setballrate':0,
						'hitrate':0,
						'hitsucrate':0,
						'superplayer':'',
						'avgscore':0,
						'advrate':0,
						'hitinvalid':0,
						'hitinvalidmsg':'',
						'iswin':false
					},
				},
				'slidebarstatu': false,
			},
			temp: {
				'thinktime': localStorage.getItem('_gogilthinktime') || 20,
				'servetime': localStorage.getItem('_gogilservetime') || 10,
				'delaytime': localStorage.getItem('_gogildelaytime') || 60,
				'onecro': localStorage.getItem('_gogilonecro') || 3,
				'twocro': localStorage.getItem('_gogiltwocro') || 1,
				'threecro': localStorage.getItem('_gogilthreecro') || 1,
			}
		}
	},
	computed: {
			...mapGetters(['teamModel','playModel'])
	},
	components:{countdown,timepanel,toast},
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
  	calcbuttonviewprop(){
			//console.log('calcbuttonviewprop')
			if(this.isservestage('r') || this.isservestage('w')){// 两队都在发球阶段
				return 'buttonview8'
			}else{// 两队都不在发球阶段
				return 'buttonview6'
			}
  	},
  	shock(time){
  		if(!(time instanceof Number))time = 650
  		navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
	    if(navigator.vibrate) {
//	      console.log("支持设备震动！");
				navigator.vibrate(time);
	    }
  	},
  	timeover(){
  		//console.log('timeover');
  		this.toast('时间到')
  	},
  	closereset(){
  		//console.log('closereset');
  		this.tab31data.game.countreset = false;
  	},
  	isservestage(type){
  		if(this.tab31data.team[type+'team'].serveball < 7){
  			return true;
  		}else{
  			return false;
  		}
  	},
  	getballstatuchange(ball,flag){// 在球变化之后调用
  		//console.log('getballstatuchange');
  		let temp = this.tab31data.playballstatu[ball].statu;
  		let ballname = this.tranballname(ball)
  		if(flag === 'sub'){
  			if(temp === 1){
  				return ballname+"红->黄"
  			}else{
  				return ballname+"黄->绿"
  			}
  		}else{
  			if(temp === 1){
  				return ballname+"绿->黄"
  			}else if(temp === 2){
  				return ballname+"黄->红"
				}else{
  				return ballname+"出局"
  			}
  		}
  	},
  	calcballrecord(){
  		for(let i = 0;i<this.playModel.tab21data.ball.length;i++){
  			this.tab31data.playballstatu['r'+(i+1)].hitball = '';
  			this.tab31data.playballstatu['r'+(i+1)].behitball = '';
  			this.tab31data.playballstatu['w'+(i+1)].hitball = '';
  			this.tab31data.playballstatu['w'+(i+1)].behitball = '';
  		}
  		for(let i = 0;i<this.tab31data.game.record.length;i++){
				let temp = this.tab31data.game.record[i];
				let tempball = temp.split('-')[0];
				let tempballname = this.tranballname(tempball)
				let tempaimball = temp.split('-')[1];
				let tempflag = temp.split('-')[2];
				let tempdetail = temp.split('-').length === 4?temp.split('-')[3]:'';
				if(tempflag === 'default' || tempflag === 'out'){
						this.tab31data.playballstatu[tempball].hitball += this.tranballname(tempaimball) + ' ';
						this.tab31data.playballstatu[tempaimball].behitball += this.tranballname(tempball) + ' ';	
				}else if(tempflag === 'foul'){
						this.tab31data.playballstatu[tempaimball].behitball += tempdetail + ' ';	
				}else if(tempflag === 'hityourself'){
					if(this.tab31data.playballstatu[tempball].behitball.indexOf(tempdetail) === -1){
						this.tab31data.playballstatu[tempball].behitball += tempdetail + ' ';
					}
					this.tab31data.playballstatu[tempaimball].behitball += tempballname + ' ';
				}else if(tempflag === 'hityourselfsave'){
					if(this.tab31data.playballstatu[tempball].behitball.indexOf(tempdetail) === -1){
						this.tab31data.playballstatu[tempball].behitball += tempdetail + ' ';
					}
				}else{
					
				}
  		}
  	},
  	databack(){
  		//console.log('databack')
			this.tab31data = this.historyrecord.pop();
  		this.quickcalcteamdata();
  		this.shock(650)
  		this.toast('操作撤回成功')
  	},
  	toplayTab(name){
			if(this.playModel.playtabselected !== name){
				this.$store.dispatch("toplayTab",name);
			}
  	},
  	passtimerecord(data){
  		//console.log('passtimerecord');
  		this.tab31data.game.continuetime = data.continuetime;
  		this.tab31data.game.starttime = data.starttime;
  		//console.log(this.tab31data.game.starttime,this.tab31data.game.continuetime);
  	},
  	clearcomside(){
			//console.log('clearcomside');
			for(let i=0;i<this.tab31data.game.comside.length;i++){
				this.tab31data.playballstatu[this.tab31data.game.comside[i]].index = 0;
			}
			this.tab31data.game.comside = []
		},
		tranballname(ball){
			//console.log('tranballname');
			let first = ball.charAt(0) === 'r'?'红':'白';
//			let second = this.playModel.tab21data.ball[(parseInt(ball.charAt(1))-1)];
			let second = ball.charAt(1);
			return (first + second);
		},
		calcadvant(){
			//console.log('calcadvant');
			let s1 = this.tab31data.team.rteam.score
			let s2 = this.tab31data.team.wteam.score
			if(s1 > s2){// 累加优势
				this.tab31data.team.rteam.advant ++;
			}
			if(s1 < s2){
				this.tab31data.team.wteam.advant ++;
			}
			//console.log(this.tab31data.team.rteam.advant,this.tab31data.team.wteam.advant)
		},
		move1mtime(){
  		//console.log('move1mtime');
  		let that = this;
  		if(!this.playModel.gamestatu || this.tab31data.game.autofinish)return;
  		let aimteam = this.tab31data.game.turnteam === 0?'rteam':'wteam';
  		let teamname = this.tab31data.game.turnteam === 0?'红队':'白队'
  		if(this.tab31data.team[aimteam].move1mtime === 15){// 最多延时15次
  			this.tab31data.game.countreset = true;
  			that.toast(teamname+'延时次数已满')
  			return;
  		}
  		this.tab31data.team[aimteam].move1mtime++;
  		if(this.tab31data.team[aimteam].move1mtime === 12 || this.tab31data.team[aimteam].move1mtime === 15){
  			that.shock(650)
  			that.toast(teamname + '延时次数' + this.tab31data.team[aimteam].move1mtime + '次')
  		}
  	},
  	clearballcause(ball){
  		//console.log('clearballcause');
  		if(this.tab31data.playballstatu[ball].statu === 3){// 出局清因果
  			for(let i=0;i<this.tab31data.game.record.length;i++){
  				let temp = this.tab31data.game.record[i];
					let tempball = temp.split('-')[0];
					let tempaimball = temp.split('-')[1];
					let tempflag = temp.split('-')[2];
  				if(tempball === ball && tempflag === 'default'){// 是出局球的因果，并未标注因果
  					this.tab31data.game.record[i] = tempball + '-' + tempaimball + '-' + 'out';// 添加记录
  				}
  			}
  		}
  	},
  	savenode(){
  		//console.log(this.historyrecord)
  		let selfdata = this.tab31data
  		this.historyrecord.push(JSON.parse(JSON.stringify(selfdata)));
  	},
  	selectTeam(op,team){
  		if(op === "add"){
  			//console.log('selectTeam add');
  			this.playModel.tab12data.useTeam = "";
  			this.playModel.tab12data.notselectedteam = [];
  			this.tab12data.selectRs = "";//初始化
  			
  			this.playModel.tab12data.useTeam = team;// 'teamA || teamB
  			this.playModel.tab12data.notselectedteam = [...this.teamModel.team];// 数组深拷贝！！
  			let indexA = this.playModel.tab12data.notselectedteam.indexOf(this.playModel.tab11data.teamA) 
  			if(indexA !== -1)this.playModel.tab12data.notselectedteam.splice(indexA,1);
  			let indexB = this.playModel.tab12data.notselectedteam.indexOf(this.playModel.tab11data.teamB)
  			if(indexB !== -1)this.playModel.tab12data.notselectedteam.splice(indexB,1);
  			// 去除已经选择的队伍
  			this.playModel.playtabselected = "1-2";
  		}
  		if(op === "save"){
  			// 如果重新选择组的话，则清空球员
				this.playModel.tab21data.redballplayer = ['', '', '', '', '', '', ''];
				this.playModel.tab21data.whiteballplayer = ['', '', '', '', '', '', ''];
  			//console.log('selectTeam save');
  			this.playModel.tab11data[this.playModel.tab12data.useTeam] = this.tab12data.selectRs;
  			this.$websql.exe(
					"select pname from gogilgroup where tname = ?",
					[this.tab12data.selectRs],
					function (rs) {
						let opplayer = this.playModel.tab12data.useTeam === "teamA"?"teamAplayer":"teamBplayer";
		  				this.playModel.tab12data[opplayer] = [];
		  				for(let i=0;i<rs.rows.length;i++){
						  	this.playModel.tab12data[opplayer].unshift(rs.rows[i].pname);
		  				}// json => arr
		  				this.playModel.playtabselected = "1-1"
		  			}.bind(this)
				);// 查询选择的队伍的成员
			}
//		if(op === 'clear'){
//			let opplayer = this.playModel.tab12data.useTeam === "teamA"?"teamAplayer":"teamBplayer";
//			this.playModel.tab11data[this.playModel.tab12data.useTeam] = '';
//			this.playModel.tab12data[opplayer] = ['', '', '', '', '', '', ''];
//			this.playModel.playtabselected = "1-1"
//		}
		},
		reverseTeamPlayer(){
			//console.log('reverseTeamPlayer');
			[this.playModel.tab11data.teamA,this.playModel.tab11data.teamB] = [this.playModel.tab11data.teamB,this.playModel.tab11data.teamA];
			[this.playModel.tab21data.redballplayer,this.playModel.tab21data.whiteballplayer] = [this.playModel.tab21data.whiteballplayer,this.playModel.tab21data.redballplayer];
		},
		checkTeam() {
				//console.log('checkTeam');
				if(this.playModel.tab11data.teamA && this.playModel.tab11data.teamB) {
					for(let i = 0; i < this.playModel.tab12data.teamAplayer.length; i++) {
						if(this.playModel.tab12data.teamBplayer.indexOf(this.playModel.tab12data.teamAplayer[i]) !== -1) {
							this.toast('对战成员重复');
							return;
						}
					}
					if(this.playModel.tab12data.teamAplayer.length === 0 || this.playModel.tab12data.teamBplayer.length === 0) {
						this.toast('组员为空')
						return;
					}
					this.$store.dispatch("toplayTab", "2-1");
				} else {
					this.toast('未选择组');
				}
		},
		selectballplayer(op, ball) {
			if(op ==="add"){
				//console.log('selectballplayer add');
				this.playModel.tab22data.useball = "";
				this.tab22data.selectRs = "";
				this.playModel.tab22data.useplayer = "";//初始化
				this.playModel.tab22data.useball = ball;
				this.playModel.tab22data.useplayer = this.playModel.tab22data.useball.indexOf('r') !== -1?"teamAplayer":"teamBplayer"
				this.playModel.playtabselected = "2-2";
			}
			if(op === "save"){
				//console.log('selectballplayer save');
				let tempplayer =  this.playModel.tab22data.useball.indexOf('r') !== -1 ? "redballplayer": "whiteballplayer";
				let index =this.playModel.tab22data.useball.charAt(this.playModel.tab22data.useball.length-1);
				this.playModel.tab21data[tempplayer][index] = this.tab22data.selectRs;
				this.playModel.playtabselected = "2-1"
			}
  	},
  	checkballplayer(){
  		//console.log('checkballplayer');
			for(let i = 0;i<this.playModel.tab21data.redballplayer.length;i++){
				if(this.playModel.tab21data.redballplayer[i] === ''){
					this.toast('未选择球员');		
					return;
				}
			}
			for(let i = 0;i<this.playModel.tab21data.whiteballplayer.length;i++){
				if(this.playModel.tab21data.whiteballplayer[i] === ''){
					this.toast('未选择球员');		
					return;
				}
			}
			this.$store.dispatch("toplayTab","3-1");
  	},
  	hideslidebar(){
  		//console.log("hideslidebar 侧边栏隐藏");
  		if(!this.playModel.gamestatu && this.tab31data.slidebarstatu){// 游戏未开始并且侧边栏为显示状态
  			if(parseInt(this.temp.delaytime) <= parseInt(this.temp.thinktime)){
  				this.toast('延时时间小于思考时间')
  				return;
  			}
  			//自动取消焦点，只能用原生的写了，虽然有点low
  			let inputlist = document.querySelectorAll('.play .tab-3-1 .container .right .set input')
  			for(let i=0;i<inputlist.length;i++){
  				inputlist[i].blur()
  			}
	  		if(this.temp.onecro === '' || this.temp.onecro === null)this.temp.onecro = 3;
				if(this.temp.twocro === '' || this.temp.twocro === null)this.temp.twocro = 1;
				if(this.temp.threecro === '' || this.temp.threecro === null)this.temp.threecro = 1;
				if(this.temp.thinktime === '' || this.temp.thinktime === null)this.temp.thinktime = 20;
				if(this.temp.servetime === '' || this.temp.servetime === null)this.temp.servetime = 10;
				if(this.temp.delaytime === '' || this.temp.delaytime === null)this.temp.delaytime = 60;
				this.tab31data.game.onecro = parseInt(this.temp.onecro)
				this.tab31data.game.twocro = parseInt(this.temp.twocro)
				this.tab31data.game.threecro = parseInt(this.temp.threecro)
				this.tab31data.game.thinktime = parseInt(this.temp.thinktime)
				this.tab31data.game.servetime = parseInt(this.temp.servetime)
				this.tab31data.game.delaytime = parseInt(this.temp.delaytime)
				localStorage.setItem('_gogilonecro',this.tab31data.game.onecro)
				localStorage.setItem('_gogiltwocro',this.tab31data.game.twocro)
				localStorage.setItem('_gogilthreecro',this.tab31data.game.threecro)
				localStorage.setItem('_gogilthinktime',this.tab31data.game.thinktime)
				localStorage.setItem('_gogilservetime',this.tab31data.game.servetime)
				localStorage.setItem('_gogildelaytime',this.tab31data.game.delaytime)
  		}
  		this.tab31data.slidebarstatu = false;
  	},
  	showslidebar(){
  		//console.log("showslidebar 侧边栏显示");
  		this.tab31data.slidebarstatu = true;
  	},
		selectcomside(type,index){
			//console.log('selectcomside');
			if(!this.playModel.gamestatu)return;
			if(this.tab31data.game.autofinish){
				this.toast("游戏已结束，请手动结束保存比赛")
				return;
			}
			let aimball = type + (index+1);
			let aimtype = !this.tab31data.game.turnteam?'r':'w';
			if(this.tab31data.playballstatu[aimball].statu === 3)return;//黑球不能操作
			
			if(this.tab31data.playballstatu[aimball].index){// 已选中
				this.tab31data.playballstatu[aimball].index = 0;
				this.tab31data.game.comside.splice(this.tab31data.game.comside.indexOf(aimball),1);
			}else{//未选中
				this.tab31data.game.comside.push(aimball);
			}
			
			for(let i=0;i<this.tab31data.game.comside.length;i++){// 依次赋下标
				this.tab31data.playballstatu[this.tab31data.game.comside[i]].index = i+1;
			}
		},
		foul(){
//			-r1-foul-犯规
//			r1-r2-hityourself-自击
//			r1-r2-out
//			r1-r2-default
			//console.log('foul');
			let that = this;
			this.savenode()
			let info = "";
			let time;
			let type = this.tab31data.game.comside[0].charAt(0);
			let ball = this.tab31data.game.comside[0];
			let ballname = that.tranballname(ball);
			let teamname = type === 'r'?'红队':'白队'
			let turnteamtype = this.tab31data.game.turnteam === 1?'w':'r';
			if(this.isservestage(type)){// 发球阶段和竞技阶段的犯规分开
				this.tab31data.playballstatu[ball].servefoultime ++;
				time = this.tab31data.playballstatu[ball].servefoultime
			}else{
				this.tab31data.playballstatu[ball].foultime ++;
				time = this.tab31data.playballstatu[ball].foultime 
			}
			if(this.tab31data.playballstatu[ball].foultime === 4){// 竞技阶段个人犯规为4时
					this.tab31data.game.record.push('-'+ ball + '-' + 'foul' + '-' + '犯规');//添加记录
					this.tab31data.playballstatu[ball].statu ++;
					this.clearballcause(ball);
					info += ",加一关。"
					that.shock(650)
			}
			that.clearcomside();
			that.calcballrecord()
			that.calcadvant()
			that.quickcalcteamdata();
			if(this.tab31data.team[type+'team'].foultime === 11){// 团队犯规为11时，加罚一次
				this.tab31data.playballstatu[ball].statu ++;
				this.clearballcause(ball);
				info += ",加一关。"+teamname + "第11次犯规,加罚一次";
				that.shock(650)
			}
			this.toast(ballname + "第" + time + "次犯规" + info, 6000)
			that.isfinish()
		},
		hit(){
//			-r1-foul-犯规
//			r1-r2-hityourself-自击
//			r1-r2-hityourselfsave-自击
//			r1-r2-out
//			r1-r2-default
			//console.log('hit');
			let that = this;
			let info = "";
			
			// 获取进攻球信息
			let ball = this.tab31data.game.comside[0];
			let ballname = that.tranballname(ball);
			let type = this.tab31data.game.comside[0].charAt(0);
			let turnteamtype = this.tab31data.game.turnteam === 1?'w':'r';
			let turnteamname = type === 'w'?'白队':'红队';
			let behitballstr = '';
			let saveballstr = '';
			let ballstatustr = '';
			let behitownballstr = '';
			let hitownballmsg = '';
			let hitownball = false;
			// 检查进攻方是否是球权方，进攻方是否在发球阶段，进攻方是否已加关，被攻方是否同时有己方和敌方的球。被攻方是否未发球提示
			if(type !== turnteamtype){
				that.clearcomside();
				this.toast("进攻失败," + "非球权方")
				return;
			}
			if(this.isservestage(type)){
				that.clearcomside();
				this.toast("进攻失败," + turnteamname+"处于发球阶段")
				return;
			}
			
			for(let i = 1;i<this.tab31data.game.comside.length;i++){
				let temptype = this.tab31data.game.comside[i].charAt(0);
				let tempball = this.tab31data.game.comside[i];
				let tempballname = that.tranballname(tempball);
				if(this.tab31data.playballstatu[tempball].line === 0){
					that.clearcomside();
					this.toast("进攻失败," +tempballname +"未发球")
					return;
				}
			}
			this.savenode()
			let hasownball = false;
			let hasotherball = false;
			for(let i = 1;i<this.tab31data.game.comside.length;i++){
				let temptype = this.tab31data.game.comside[i].charAt(0);
				if(temptype === type)hasownball=true;
				if(temptype !== type)hasotherball=true;
				if(hasownball && hasotherball){// 同时包含自己和敌方的球，则第一个球有效
					for(let j = 2;j<this.tab31data.game.comside.length;j++){
						this.tab31data.playballstatu[this.tab31data.game.comside[j]].index = 0;
					}
					this.tab31data.game.comside.splice(2,this.tab31data.game.comside.length-2);
					break;
				}
			}
			// 过滤完之后，剩下的球必定为同一类型的
			if(this.tab31data.game.comside[1].charAt(0) === type){// 全为己方球 
				this.tab31data.playballstatu[ball].miss ++;
				this.tab31data.playballstatu[ball].statu = 3;
				that.clearballcause(ball);
				hitownballmsg += ballname + '出局'
				if(this.tab31data.team[type+'team'].hitinvalid){// 如果之前有布局犯规
				}
			}else{//全为敌方球
				this.tab31data.playballstatu[ball].hit ++;
				if(this.tab31data.team[type+'team'].hitinvalid){// 如果之前有布局犯规
					this.tab31data.team[type+'team'].hitinvalid --;
					this.toast('由于之前布局犯规，本次进攻无效')
					this.tab31data.game.isattack = true;
					that.nextturn()
					return;
				}
			}
			// 设置标记，在nextturn使用
			this.tab31data.game.isattack = true;
			
			// 先清空所有球的issave
			for(let i = 0;i<this.playModel.tab21data.ball.length;i++){
				this.tab31data.playballstatu['r'+(i+1)].issave = false;
				this.tab31data.playballstatu['w'+(i+1)].issave = false;
			}
			
			// 遍历循环，给每个被击中的球加关
			for(let i = 1;i<this.tab31data.game.comside.length;i++){
					// 存对象
					let temptype = this.tab31data.game.comside[i].charAt(0);
					let tempball = this.tab31data.game.comside[i];
					let tempballname = that.tranballname(tempball);
					let wrongball = null;
					let saveball = null;
					let delindex;
					
					// 击球情况
					if(type === temptype){//误伤己方球
						if(behitownballstr === ''){
							behitownballstr += tempballname
						}else{
							behitownballstr += "、"+tempballname
						}
						let opstype = type === 'r'?'w':'r'
						this.tab31data.playballstatu[tempball].statu ++;
						that.clearballcause(tempball);
						this.tab31data.game.record.push(ball+'-'+tempball + '-' + 'hityourself' + '-' + '自击');//添加记录
						hitownball = true;
					}else{//击中敌方球
						this.tab31data.playballstatu[tempball].statu ++;
						that.clearballcause(tempball);
						this.tab31data.game.record.push(ball+'-'+tempball + '-' + 'default');//添加记录
						if(behitballstr === ''){
							behitballstr += tempballname
						}else{
							behitballstr += " "+tempballname
						}
					}
					// 无论击中哪方球，以下操作是统一的
					if(ballstatustr === ''){
						ballstatustr += that.getballstatuchange(tempball,'add');
					}else{
						ballstatustr += "," + that.getballstatuchange(tempball,'add');
					}
				// 解救
				if(!hitownball){// 只有击中敌方球，才进行解救
					for(let i=0;i<this.tab31data.game.record.length;i++){
						let stemp = this.tab31data.game.record[i];
						let stempball = stemp.split('-')[0];
						let stempaimball = stemp.split('-')[1];
						let stempflag = stemp.split('-')[2];
						// 要求是可以解救的标志，击中为地方，救球为己方三个条件，只保存最近的一次
						if(!wrongball && (stempflag === 'foul' || stempflag === 'hityourself' || stempflag === 'out' ) && stempaimball.charAt(0) === ball.charAt(0)){
							wrongball = stempaimball;
							delindex = i;
						}
						//如果被击中的敌方球最近一次有击中己方球，且己方球未出局
						if(stempball === tempball && this.tab31data.playballstatu[stempaimball].statu !== 3 && tempball.charAt(0)!== stempaimball.charAt(0)){
							let opstype = tempball.charAt(0);
							this.tab31data.playballstatu[stempaimball].statu --;
							saveball = stempaimball;
							delindex = i;
							break;
						}
					}
					if(saveball === null && wrongball){// 找不到解救的球，但有找到被队友误伤的球
						let opstype = wrongball.charAt(0);
						this.tab31data.playballstatu[wrongball].statu --;
					}
					let rssaveball = saveball || wrongball;
					if(rssaveball){// 如果最后有解救
						let temprecord= this.tab31data.game.record[delindex]
						if(temprecord.split('-')[2] === 'hityourself'){// 自击被解救之后，自己的主球还要留着
							this.tab31data.game.record[delindex] = temprecord.split('-')[0]+'-'+temprecord.split('-')[1]+'-'+'hityourselfsave'+'-'+temprecord.split('-')[3];
						}else{
							this.tab31data.game.record.splice(delindex,1);
						}
						this.tab31data.playballstatu[rssaveball].issave = true;
						if(saveballstr === ''){
							saveballstr += that.tranballname(rssaveball)
						}else{
							saveballstr += " "+that.tranballname(rssaveball)
						}
					}
				}
			}
			// 统计
			if(saveballstr !== ''){// 全击中敌方并且有解救
				info = ballname + '击中' + behitballstr + '  ➢   解救' + saveballstr + '  ➢   ' + ballstatustr
			}else{
				if(hitownballmsg !== ''){// 击中己方球 
					info = ballname + '误伤' + behitownballstr + '  ➢   ' + hitownballmsg + '  ➢   ' + ballstatustr
				}else{//进攻敌方并且无解救
					info = ballname + '击中' + behitballstr + '  ➢  ' + ballstatustr
				}
			}
			that.toast(info)
			that.quickcalcteamdata();
			that.calcballrecord()
			that.nextturn()
		},
		miss(){
			//console.log('miss');
			let that = this;
			if(this.tab31data.game.autofinish){
				this.toast("游戏已结束，请手动结束保存比赛")
				return;
			}
			let aimball = this.tab31data.game.comside[0];
			let aimballname = this.tranballname(aimball)
			let type = this.tab31data.game.comside[0].charAt(0);
			let teamname = type === 'w'?'白队':'红队';
			let turnteamtype = this.tab31data.game.turnteam === 1?'w':'r';
			if(type !== turnteamtype){
				that.clearcomside();
				this.toast("非球权方")
				return;
			}
			if(this.isservestage(type)){
				that.clearcomside();
				this.toast(teamname+"处于发球阶段")
				return;
			}
			if(this.tab31data.playballstatu[aimball].statu !== 0){
				that.clearcomside();
				this.toast(aimballname+"已加关")
				return;
			}
			this.savenode()
			this.tab31data.game.isattack = true;
			this.tab31data.playballstatu[aimball].miss ++;
			this.toast(aimballname+'不击中')
			that.nextturn()
		},
		setball(){
			//console.log('setball');
			let that = this;
			let aimball = this.tab31data.game.comside[0];
			let aimballname = this.tranballname(aimball)
			let type = this.tab31data.game.comside[0].charAt(0);
			let turnteamtype = this.tab31data.game.turnteam === 1?'w':'r';
			let teamname = type === 'w'?'白队':'红队';
			let info = '';
			
			if(type !== turnteamtype){
				that.clearcomside();
				this.toast("非球权方")
				return;
			}
			if(this.isservestage(type)){
				that.clearcomside();
				this.toast(teamname+"处于发球阶段")
				return;
			}
			if(this.tab31data.playballstatu[aimball].statu !== 0){
				that.clearcomside();
				this.toast(aimballname+"已加关")
				return;
			}
			this.savenode()
			let temp = this.tab31data.team[type+'team'].lastsetball;
			let tempnum = parseInt(temp.split('/')[0]);
			let temptime = parseInt(temp.split('/')[1]);
			
			if(temptime >= 3 && (this.tab31data.game.turnnum - tempnum) === 2){// 上回合大于等于第三次布局
				this.tab31data.team[type+'team'].setball ++;
				this.tab31data.team[type+'team'].hitinvalid ++;
				this.tab31data.team[type+'team'].lastsetball = this.tab31data.game.turnnum + '/' + (temptime+1);
				info += teamname + "第"+ (temptime+1) +"次布局犯规，将球拿回原位，下"+ (temptime-2) +"次击中自动无效";
			}else if(temptime === 2 && (this.tab31data.game.turnnum - tempnum) === 2){// 上回合有布局为第二次布局
				this.tab31data.team[type+'team'].setball ++;
				this.tab31data.team[type+'team'].lastsetball = this.tab31data.game.turnnum + '/' + (temptime+1);
				info += teamname+"第三次布局。下回合必须进攻";
			}else if((this.tab31data.game.turnnum - tempnum) === 2){// 上回合有布局
				this.tab31data.team[type+'team'].setball ++;
				this.tab31data.team[type+'team'].lastsetball = this.tab31data.game.turnnum + '/' + (temptime+1);
				info += aimballname + "布局";
			}else{// 上回合没有布局
				this.tab31data.team[type+'team'].setball ++;
				this.tab31data.team[type+'team'].lastsetball = this.tab31data.game.turnnum + '/' + '1';
				info += aimballname + "布局";
			}
			this.toast(info)
			that.nextturn()
		},
		selectoverline(){
			//console.log('selectoverline');
			let that = this;
			let info = '';
			let aimball = this.tab31data.game.comside[0];
			let aimballname = this.tranballname(aimball)
			if(this.tab31data.playballstatu[aimball].line !== 0){
				that.clearcomside();
				this.toast(aimballname+"已经发过球")
				return;				
			}
			let type = this.tab31data.game.comside[0].charAt(0);
			let opstype = type === 'r'?'w':'r';
			let turnteamtype = this.tab31data.game.turnteam === 1?'w':'r';
			if(type !== turnteamtype){
				that.clearcomside();
				this.toast("非球权方")
				return;
			}
			let teamname = type === 'w'?'白队':'红队';
			if(this.tab31data.team[type+'team'].overball >= 5){
				that.clearcomside();
				this.toast(teamname+"过线数已满")
				return;
			}
			this.savenode()
			this.tab31data.playballstatu[aimball].line = 2;
			this.tab31data.team[type+'team'].serveball ++;
			this.tab31data.team[type+'team'].overball ++;
			info += aimballname + "过线";
			if(!this.isservestage(type)){
				info += ',' + teamname + "发球阶段结束";
			}
			this.toast(info)
			that.nextturn()
		},
		selectbutline(){
			//console.log('selectbutline');
			let that = this;
			let info = '';
			let aimball = this.tab31data.game.comside[0];
			let aimballname = this.tranballname(aimball)
			let type = this.tab31data.game.comside[0].charAt(0);
			let opstype = type === 'r'?'w':'r';
			let turnteamtype = this.tab31data.game.turnteam === 1?'w':'r';
			if(type !== turnteamtype){
				that.clearcomside();
				this.toast("非球权方")
				return;
			}
			let teamname = type === 'r'?"红队":"白队";
			if(this.tab31data.playballstatu[aimball].line !== 0){
				that.clearcomside();
				this.toast(aimballname+"已经发过球")
				return;				
			}
			// 5、0 6、1要求过线，7、2不用
			// 公式： 当前最多过球数 小于等于  当前还需要过几个球     即得出下回合必须过线
			if((7-this.tab31data.team[type+'team'].serveball)<=(2-this.tab31data.team[type+'team'].overball) && this.tab31data.team[type+'team'].serveball !== 7){
				that.clearcomside();
				this.toast(teamname+"过线数不足")
				return;
			}
			this.savenode()
			this.tab31data.playballstatu[aimball].line = 1;
			this.tab31data.team[type+'team'].serveball ++;
			info += aimballname + "不过线";
			if(!this.isservestage(type)){
				info += ',' + teamname + "发球阶段结束";
			}
			this.toast(info)
			that.nextturn()
		},
		nextturn(btnclick){
			//console.log('nextturn');
			let that = this;
			let type = this.tab31data.game.turnteam === 1?'w':'r'
			if(this.tab31data.game.autofinish){
				this.toast("游戏已结束，请手动结束保存比赛")
				return;
			}
			if(btnclick){// 参数有传
				if(btnclick === 1){// 直接点击下回合，则保存结点
					this.savenode()
				}
			}
			if(!this.playModel.gamestatu)return;
			if(this.isservestage(type)){// 发球阶段
				this.tab31data.team[type+'team'].serveturntime ++;
			}else{// 竞技阶段
				this.tab31data.team[type+'team'].turntime ++;
			}
			this.tab31data.game.countreset = true;
			if(this.tab31data.game.isattack){// 进攻，无需多余操作
				this.tab31data.game.isattack = false
			}else{// 非进攻,如直接按下回合，那么保留连续布局数(直接把上次布局的回合数改成当前就好了)，然后再清空上回合被救的球的标志
				for(let i = 0;i<this.playModel.tab21data.ball.length;i++){
					this.tab31data.playballstatu['r'+(i+1)].issave = false;
					this.tab31data.playballstatu['w'+(i+1)].issave = false;
				}
				let temp = this.tab31data.team[type+'team'].lastsetball;
				let tempnum = parseInt(temp.split('/')[0]);
				let temptime = parseInt(temp.split('/')[1]);
				this.tab31data.team[type+'team'].lastsetball = this.tab31data.game.turnnum + '/' + temptime;	
			}
			that.shock(650)
			that.calcadvant()
			that.clearcomside()
			if(!that.isfinish()){
				this.tab31data.game.turnnum++;
				this.tab31data.game.turnteam = this.tab31data.game.turnteam?0:1;
			}
		},
  	start(whichteam){
  		//console.log('start')
  		let that = this;
  		that.shock(650)
  		this.playModel.gamestatu = true;
  		this.historyrecord = [];
  		this.tab31data = {
				'game':{
					'thinktime': parseInt(localStorage.getItem('_gogilthinktime')) || 20,
					'servetime': parseInt(localStorage.getItem('_gogilservetime')) || 10,
					'delaytime': parseInt(localStorage.getItem('_gogildelaytime')) || 60,
					'onecro': parseInt(localStorage.getItem('_gogilonecro')) || 3,
					'twocro': parseInt(localStorage.getItem('_gogiltwocro')) || 1,
					'threecro': parseInt(localStorage.getItem('_gogilthreecro')) || 1,
					'countreset':false,
					'continuetime': null,
					'starttime': null,
					'turnnum':1,
					'turnteam':null,
					'comside':[],
					'record':[],
					'autofinish':false,
					'isattack':false
				},
				'playballstatu':{
					'r1':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'r2':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'r3':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'r4':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'r5':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'r6':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'r7':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'w1':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'w2':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'w3':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'w4':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'w5':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'w6':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
					'w7':{'line':0,'statu':0,'index':0,'hit':0,'miss':0,'foultime':0,'hitball':'','behitball':'','servefoultime':0,'hitball':'','behitball':'','hitsucrate':0,'score':0,'issuper':false,'issave':false,},
				},
				'team':{
					'rteam': {
						'turntime': -1,
						'serveturntime': 0,
						'score': 0,
						'foultime': 0,
						'servefoultime': 0,
						'move1mtime': 0,
						'setball': 0,
						'lastsetball': '-3/0',
						'hit': 0,
						'miss': 0,
						'avgball': 0,
						'serveball': 0,
						'overball': 0,
						'advant': 0,
						'livenum': 7,
						'onecronum': 0,
						'twocronum': 0,
						'threecronum': 0,
						'setballrate':0,
						'hitrate':0,
						'hitsucrate':0,
						'superplayer':'',
						'avgscore':0,
						'advrate':0,
						'hitinvalid':0,
						'hitinvalidmsg':'',
						'iswin':false
					},
					'wteam': {
						'turntime': -1,
						'serveturntime': 0,
						'score': 0,
						'foultime': 0,
						'servefoultime': 0,
						'move1mtime': 0,
						'setball': 0,
						'lastsetball': '-3/0',
						'hit': 0,
						'miss': 0,
						'avgball': 0,
						'serveball': 0,
						'overball': 0,
						'advant': 0,
						'livenum': 7,
						'onecronum': 0,
						'twocronum': 0,
						'threecronum': 0,
						'setballrate':0,
						'hitrate':0,
						'hitsucrate':0,
						'superplayer':'',
						'avgscore':0,
						'advrate':0,
						'hitinvalid':0,
						'hitinvalidmsg':'',
						'iswin':false
					},
				},
				'slidebarstatu': false,
			};
			
  		this.tab31data.game.turnteam = whichteam
  		let type = this.tab31data.game.turnteam?'w':'r';
  		let opstype = this.tab31data.game.turnteam?'r':'w';
  		this.tab31data.team[type+'team'].lastsetball = '-2/0';
  		this.tab31data.team[opstype+'team'].lastsetball = '-1/0';
  		
  		let rightteam = this.tab31data.game.turnteam?"白队":"红队";
  		this.toast(rightteam+'发球');
  	},
  	isfinish(){
  		//console.log('isfinish');
  		let that = this;
  		if(this.tab31data.team['rteam'].livenum === 0 || this.tab31data.team['wteam'].livenum === 0){//如果一方没有活球，则比赛结束
				this.tab31data.game.autofinish = true;
				that.finish()
				return true;
			}
  		return false
  	},
  	finish(){
  		//console.log('finish')
  		let that = this;
  		that.shock(650)
  		let rs;
  		that.clearcomside()
  		if(this.tab31data.team.rteam.score > this.tab31data.team.wteam.score){
  			rs = '红队获胜';
  			this.tab31data.team['rteam'].iswin = true;
  		}else if(this.tab31data.team.rteam.score < this.tab31data.team.wteam.score){
  			rs = '白队获胜';
  			this.tab31data.team['wteam'].iswin = true;
  		}else{
  			rs = '平局';
  		}
			that.savegame(rs)
  	},
  	savegame(rs){
		this.$messagebox.prompt(rs + '!请输入比赛名，默认按日期保存，点击确认保存').then(({ value, action }) => {
				//console.log('保存');
				this.playModel.gamestatu = false;
				this.tab31data.game.turnteam = null;
				// 计算组的数据
				let rteam = this.tab31data.team['rteam'];
				let wteam = this.tab31data.team['wteam'];
				this.tab31data.team['rteam'].setballrate = rteam.setball === 0?'0%':parseInt((rteam.setball / rteam.turntime) * 100) + '%'
				this.tab31data.team['rteam'].hitrate = (rteam.hit + rteam.miss) === 0?'0%':parseInt(((rteam.hit + rteam.miss) / this.tab31data.team['rteam'].turntime) * 100) + '%'
				this.tab31data.team['rteam'].hitsucrate = rteam.hit === 0?'0%':parseInt((rteam.hit / rteam.turntime) * 100) + '%'
				this.tab31data.team['rteam'].advrate = rteam.advant === 0?'0%':parseInt((rteam.advant / this.tab31data.game.turnnum) * 100) + '%'
				this.tab31data.team['rteam'].avgball = (rteam.hit + rteam.miss) === 0?0:(rteam.hit + rteam.miss) / 7
				this.tab31data.team['wteam'].setballrate = wteam.setball === 0?'0%':parseInt((wteam.setball / wteam.turntime) * 100) + '%'
				this.tab31data.team['wteam'].hitrate = (wteam.hit + wteam.miss) === 0?'0%':parseInt(((wteam.hit + wteam.miss) / wteam.turntime) * 100) + '%'
				this.tab31data.team['wteam'].hitsucrate = wteam.hit === 0?'0%':parseInt((wteam.hit / wteam.turntime) * 100) + '%'
				this.tab31data.team['wteam'].advrate = wteam.advant === 0?'0%':parseInt((wteam.advant / this.tab31data.game.turnnum) * 100) + '%'
				this.tab31data.team['wteam'].avgball = (wteam.hit + wteam.miss) === 0?0:(wteam.hit + wteam.miss) / 7
				
				// 计算球评分,mvp和命中率
				let temprteamscore = 0;
				let tempwteamscore = 0;
				let temprballscoremax = -999;
				let tempwballscoremax = -999;
				let temprballscoremaxball = [];
				let tempwballscoremaxball = [];
				for(let i = 0;i<this.playModel.tab21data.ball.length;i++){
					let rtemp = this.tab31data.playballstatu['r'+(i+1)]
					let wtemp = this.tab31data.playballstatu['w'+(i+1)]
					this.tab31data.playballstatu['r'+(i+1)].hitsucrate = rtemp.hit === 0?'0%':parseInt((rtemp.hit / (rtemp.hit + rtemp.miss)) * 100) + '%'
					this.tab31data.playballstatu['w'+(i+1)].hitsucrate = wtemp.hit === 0?'0%':parseInt((wtemp.hit / (wtemp.hit + wtemp.miss)) * 100) + '%'
					let rbase = (rtemp.hit - rtemp.miss * 0.25 - rtemp.foultime * 0.5) / rtemp.hit
					let rrate = rtemp.hit / (rtemp.hit + rtemp.miss + this.tab31data.team['rteam'].avgball)
					this.tab31data.playballstatu['r'+(i+1)].score = rtemp.hit === 0?parseInt((2 - rtemp.miss*0.25 - rtemp.foultime * 0.5)*10)/10:parseInt( (rbase * 5 * rrate + 2) * 10 ) /10
					temprteamscore += this.tab31data.playballstatu['r'+(i+1)].score
					if(this.tab31data.playballstatu['r'+(i+1)].score >= temprballscoremax){
						if(this.tab31data.playballstatu['r'+(i+1)].score > temprballscoremax){
							temprballscoremax = this.tab31data.playballstatu['r'+(i+1)].score; 
							temprballscoremaxball = [];
							temprballscoremaxball.push('r'+(i+1))
						}else{
							temprballscoremaxball.push('r'+(i+1))
						}
					}
					let wbase = (wtemp.hit - wtemp.miss *0.25 - wtemp.foultime * 0.5) / wtemp.hit
					let wrate = wtemp.hit / (wtemp.hit + wtemp.miss + this.tab31data.team['wteam'].avgball)
					this.tab31data.playballstatu['w'+(i+1)].score = wtemp.hit === 0?parseInt((2 - wtemp.miss*0.25 - wtemp.foultime * 0.5)*10)/10:parseInt( (wbase * 5 * wrate + 2) * 10 ) /10
					tempwteamscore += this.tab31data.playballstatu['w'+(i+1)].score
					if(this.tab31data.playballstatu['w'+(i+1)].score >= tempwballscoremax){
						if(this.tab31data.playballstatu['w'+(i+1)].score > tempwballscoremax){
							tempwballscoremax = this.tab31data.playballstatu['w'+(i+1)].score; 
							tempwballscoremaxball = [];
							tempwballscoremaxball.push('w'+(i+1))
						}else{
							tempwballscoremaxball.push('w'+(i+1))
						}
					}
				}
				for(let i=0;i<temprballscoremaxball.length;i++){
					this.tab31data.playballstatu[temprballscoremaxball[i]].issuper = true;
				}
				for(let i=0;i<tempwballscoremaxball.length;i++){
					this.tab31data.playballstatu[tempwballscoremaxball[i]].issuper = true;
				}
				
				// 计算组平均评分
				this.tab31data.team['rteam'].avgscore = parseInt( (temprteamscore / 7) * 10 ) / 10
				this.tab31data.team['wteam'].avgscore = parseInt( (tempwteamscore / 7) * 10 ) / 10
				
				// 存数据库
				let timer = setInterval(function(){
					if(this.tab31data.game.starttime!=null || this.tab31data.game.continuetime!=null){
						let rteam = this.tab31data.team['rteam'];
						let wteam = this.tab31data.team['wteam'];
						this.$websql.exe(
							"insert into gogilgame(gname,starttime,continuetime,turnnum) values(?,?,?,?)",
							[value || this.tab31data.game.starttime,this.tab31data.game.starttime,this.tab31data.game.continuetime,this.tab31data.game.turnnum+'']
						);
						this.$websql.exe(
							"insert into gogilgameteam(gid,iswin,tname,livenum,onecronum,twocronum,threecronum,setballrate,hitrate,hitsucrate,advrate,avgscore,score) values( (select max(gid) from gogilgame),?,?,?,?,?,?,?,?,?,?,?,?)",
							[rteam.iswin,this.playModel.tab11data.teamA,rteam.livenum+'',rteam.onecronum+'',rteam.twocronum+'',rteam.threecronum+'',rteam.setballrate,rteam.hitrate,rteam.hitsucrate,rteam.advrate,rteam.avgscore,rteam.score]
						);
						this.$websql.exe(
							"insert into gogilgameteam(gid,iswin,tname,livenum,onecronum,twocronum,threecronum,setballrate,hitrate,hitsucrate,advrate,avgscore,score) values( (select max(gid) from gogilgame),?,?,?,?,?,?,?,?,?,?,?,?)",
							[wteam.iswin,this.playModel.tab11data.teamB,wteam.livenum+'',wteam.onecronum+'',wteam.twocronum+'',wteam.threecronum+'',wteam.setballrate,wteam.hitrate,wteam.hitsucrate,wteam.advrate,wteam.avgscore,wteam.score]
						);
						for(let i = 0;i<this.playModel.tab21data.ball.length;i++){
							let rplayer = this.tab31data.playballstatu['r'+(i+1)]
							let wplayer = this.tab31data.playballstatu['w'+(i+1)]
							this.$websql.exe(
								"insert into gogilgameplayer(gid,pname,ball,team,hittime,hitsucrate,foultime,score,issuper) values((select max(gid) from gogilgame),?,?,?,?,?,?,?,?)",
								[this.playModel.tab21data.redballplayer[i],i+'','r',(rplayer.hit+rplayer.miss)+'',rplayer.hitsucrate,rplayer.foultime+'',rplayer.score,rplayer.issuper]
							)
							this.$websql.exe(
								"insert into gogilgameplayer(gid,pname,ball,team,hittime,hitsucrate,foultime,score,issuper) values((select max(gid) from gogilgame),?,?,?,?,?,?,?,?)",
								[this.playModel.tab21data.whiteballplayer[i],i+'','w',(wplayer.hit+wplayer.miss)+'',wplayer.hitsucrate,wplayer.foultime+'',wplayer.score,wplayer.issuper]
							)
						}
						this.toast('比赛已保存,在记录页面可查看')
						clearInterval(timer);
					}
				}.bind(this),20)
			});
  	},
  	discard(){
  		//console.log('discard');
  		this.$messagebox.confirm("确认不保存比赛数据？",'！').then(aAction =>{
	  		this.playModel.gamestatu = false;
				//console.log('不保存');
  		})
  	},
  	quickcalcteamdata(){
  		//console.log('quickcalcteamdata');
  		let s1=0,s2=0,f1=0,f2=0,l1=0,l2=0,qf1=0,qf2=0,h1=0,h2=0,m1=0,m2=0,one1=0,one2=0,two1=0,two2=0,three1=0,three2=0
  		let one = this.tab31data.game.onecro
  		let two = this.tab31data.game.twocro
  		let three = this.tab31data.game.threecro
  		for(let i = 0;i<this.playModel.tab21data.ball.length;i++){
  			let temp = this.tab31data.playballstatu['r'+(i+1)];
  			f1 += temp.foultime
  			qf1 += temp.servefoultime
  			h1 += temp.hit;
  			m1 += temp.miss
  			if(temp.statu === 0){
  				l1 ++;
  			}else if(temp.statu === 1){
  				s2 += one;
  				one1 ++;
  			}else if(temp.statu === 2){
  				s2 += one;
  				s2 += two;
  				two1 ++;
  			}else{
  				s2 += one;
  				s2 += two;
  				s2 += three;
  				three1 ++;
  			}
  		}
  		for(let i = 0;i<this.playModel.tab21data.ball.length;i++){
  			let temp = this.tab31data.playballstatu['w'+(i+1)];
  			f2 += temp.foultime
  			qf2 += temp.servefoultime
  			h2 += temp.hit;
  			m2 += temp.miss
  			if(temp.statu === 0){
  				l2 ++;
  			}else if(temp.statu === 1){
  				s1 += one;
  				one2 ++;
  			}else if(temp.statu === 2){
  				s1 += one;
  				s1 += two;
  				two2 ++;
  			}else{
  				s1 += one;
  				s1 += two;
  				s1 += three;
  				three2 ++;
  			}
  		}
  		this.tab31data.team.rteam.score = s1;
  		this.tab31data.team.rteam.foultime = f1;
  		this.tab31data.team.rteam.servefoultime = qf1;
  		this.tab31data.team.rteam.livenum = l1;
  		this.tab31data.team.rteam.hit = h1
  		this.tab31data.team.rteam.miss = m1
  		this.tab31data.team.rteam.onecronum = one1
  		this.tab31data.team.rteam.twocronum = two1
  		this.tab31data.team.rteam.threecronum = three1
  		this.tab31data.team.wteam.score = s2;
  		this.tab31data.team.wteam.foultime = f2;
  		this.tab31data.team.wteam.servefoultime = qf2;
  		this.tab31data.team.wteam.livenum = l2;
  		this.tab31data.team.wteam.hit = h2
  		this.tab31data.team.wteam.miss = m2
  		this.tab31data.team.wteam.onecronum = one2
  		this.tab31data.team.wteam.twocronum = two2
  		this.tab31data.team.wteam.threecronum = three2
  	},
  },
  watch:{
  	'tab22data.selectRs'(){
  		//console.log('watch 22 rs');
  		if(this.tab22data.selectRs){
  			this.selectballplayer('save')
  		}
  	},
  	'tab12data.selectRs'(){
  		//console.log('watch 21 rs');
  		if(this.tab12data.selectRs){
  			this.selectTeam('save')
  		}
  	},
  	'tab31data.team.rteam.hitinvalid'(){
  		//console.log('watch rteam hitinvalid');
  		this.tab31data.team.rteam.hitinvalidmsg = ''
  		if(this.tab31data.team.rteam.hitinvalid){
  			for(let i=0;i<this.tab31data.team.rteam.hitinvalid;i++){
  				this.tab31data.team.rteam.hitinvalidmsg += "<span class='icon iconfont'>&#xe645;</span>"; 
  			}
  		}
  	},
  	'tab31data.team.wteam.hitinvalid'(){
  		//console.log('watch wteam hitinvalid');
  		this.tab31data.team.wteam.hitinvalidmsg = ''
  		if(this.tab31data.team.wteam.hitinvalid){
  			for(let i=0;i<this.tab31data.team.wteam.hitinvalid;i++){
  				this.tab31data.team.wteam.hitinvalidmsg += "<span class='icon iconfont'>&#xe645;</span>"; 
  			}
  		}
  	},
  	
  },
  created(){
  },
  mounted(){
	}
}
</script>

<style scoped>
p{
	margin: 0;		
}
.play .oneword{
	width: 1em;
	display: inline-block;
}
.play .yellow{
	color:#FFCC00;
}
.play .red{
	color:#FF6666
}
.play{
	margin-top: 40px;
}
.play .next{
	width: 100%;
	position: absolute;
	bottom: 50px;
	left: 50%;
	transform: translate(-50%,0);
}
.play .tab{
}
.play .tab-1-1{
}
.play .tab-1-1 .content{
	width: 100%;
	height: 148px;
	position: absolute;
	top: 50%;
	transform: translate(0,-50%);
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}
.play .tab-1-1 .content .img{
	float: left;
	width: 128px;
	height: 128px;
	background: url('~@/assets/img/vs.png');
	background-size: 100% 100%;
	margin: 0 10px;
}
.play .tab-1-1 .content .team{
	float: left;
}
.play .tab-1-1 .content .team p.teamText{
	width: 5em;
}
.play .tab-1-1 .content .team .teamAicon,
.play .tab-1-1 .content .team .teamBicon{
	font-size: 30px;
}
.play .tab-1-1 .content .teamA,
.play .tab-1-1 .content .team .teamAicon{
	color:#CC3333;
}
.play .tab-1-1 .content .teamB{
	color:#666666;
}
.play .tab-2-1 .container{
	height: calc(100vh - 89px);
}
.play .tab-2-1 .container p{
	margin: 0;
}
.play .tab-2-1 .container .top,
.play .tab-2-1 .container .bottom{
	height: calc((100vh - 130px) / 2);
	display: flex;
	justify-content: center;
	align-items: center;
}
.play .tab-2-1 .container .balltitle{
	font-size: 19px;
}
.play .tab-2-1 .container .setPlayerBall .ball{
	font-size: 24px;
}
.play .tab-2-1 .container .setPlayerBall .player{
	width: 3em;
	text-align: center;
}
.play .tab-2-1 .container .redBall,
.play .tab-2-1 .container .redballtitle{
	color:#CC3333;
}
.play .tab-2-1 .container .redBall .setPlayerBall,
.play .tab-2-1 .container .whiteBall .setPlayerBall{
	display: inline-block;
	padding: 5px 10px;
}
.play .tab-3-1{
	height: calc(100vh - 89px);
	width: 100vw;
	overflow: hidden;
}
.play .tab-3-1 .container{
	width: 200vw;
	height: 100%;
	margin-left: 0;
	transition:all 1s;
}
.play .tab-3-1 .container .left{
	width: 100vw;
	height: calc(100% - 35px);
	float: left;
	transition:all 1s;
}
.play .tab-3-1 .container .left .top{
	height: 46px;
}
.play .tab-3-1 .container .center{
	height: calc(100% - 160px);
}
.play .tab-3-1 .container .center .livegame{
	font-size: 14px;
	height: 19px;
}
.play .tab-3-1 .container .center .ballview{
	width: 100%;
	height: calc(100% - 19px);
}
.play .tab-3-1 .container .center .ballview .ballplay{
	height: calc((100% - 16px) / 7);
	border-bottom: 0;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.play .tab-3-1 .container .center .ballview .ballplay .ball{
	font-size: 22px;
}
.play .tab-3-1 .container .center .ballview .ballplay .ballstatu span{
	font-size: 20px !important;
}
.play .tab-3-1 .container .center .ballview .ballplay .index{
	font-size:13px
}
.play .tab-3-1 .container .center .ballview .ballplay .butline,
.play .tab-3-1 .container .center .ballview .ballplay .overline{
	font-size: 20px
}
.play .tab-3-1 .container .center .ballview .leftball{
	float: left;
	width: 38%;
	height: 100%;
	box-sizing:border-box;
}
.play .tab-3-1 .container .center .ballview .leftball .redteamtitle{
	color:#FF6666;
	font-size: 12px;
	height: 16px;
}
.play .tab-3-1 .container .center .ballview .rightball .whiteteamtitle{
	font-size: 12px;
	height: 16px;
}
.play .tab-3-1 .container .center .ballview .middlebutton{
	float: left;
	width: 24%;
	height: 100%;
}
.play .tab-3-1 .container .center .ballview .middlebutton .buttonview8{
	height: calc(100% / 8);
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}
.play .tab-3-1 .container .center .ballview .middlebutton .buttonview7{
	height: calc(100% / 7);
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}
.play .tab-3-1 .container .center .ballview .middlebutton .buttonview6{
	height: calc(100% / 6);
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}
.play .tab-3-1 .container .center .ballview .rightball{
	float: left;
	width: 38%;
	height: 100%;
	box-sizing:border-box;
}
.play .tab-3-1 .container .left .bottom{
	width: 100%;
}
.play .tab-3-1 .container .left .bottom .times{
	width: 100%;
	overflow:hidden;
}
.play .tab-3-1 .container .left .bottom .times p{
	background-color: #CCCCFF;
	border:2px;
}
.play .tab-3-1 .container .left .bottom .times .bleft,
.play .tab-3-1 .container .left .bottom .times .bright{
	float: left;
	box-sizing: border-box;
}
.play .tab-3-1 .container .left .bottom .times .bleft p,
.play .tab-3-1 .container .left .bottom .times .bright p{
	font-size: 14px;
	line-height: 20px;
}
.play .tab-3-1 .container .left .bottom .times .bleft{
	margin-right: 1px;
	width: calc(50% - 1px);
}
.play .tab-3-1 .container .left .bottom .times .bright{
	margin-left: 1px;
	width: calc(50% - 1px);
}
.play .tab-3-1 .container .next{
	transition: all 1s;
}
.play .tab-3-1 .container .right{
	width: 90vw;
	height: 100%;
	float: left;
	overflow-y: auto;
}
.play .tab-3-1 .container .right .set{
}
.play .tab-3-1 .container .right .quickcalc{
	width: 100%;
	height: 100%;
}
.play .tab-3-1 .container .right .quickcalc table{
	font-family: verdana,arial,sans-serif;
	font-size:11px;
	color:#333333;
	padding: 9px;
	border-width: 1px;
	border-color: #666666;
	border-collapse: collapse;
	width: 100%;
	min-height:100%;
}
.play .tab-3-1 .container .right .quickcalc table tr{
	height: 35px;
}
.play .tab-3-1 .container .right .quickcalc table th{
	border-width: 1px;
	border-style: solid;
	height: 100%;
	padding: 4px 0;
	border-color: #666666;
	background-color: #dedede;
	width: 41px;
	height: 25px;
}
.play .tab-3-1 .container .right .quickcalc table td{
	border-width: 1px;
	padding: 4px 0;
	border-style: solid;
	border-color: #666666;
	background-color: #ffffff;
	width: 20px;
}
</style>
