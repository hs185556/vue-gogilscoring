<template>
  <div class="team" >
  	<toast :toastmsg='toastmsg' :toaststatu='toaststatu' @cleartoast='cleartoast'></toast>
  	<div class="top">
	  	<input type="text" class="playerorgroupInput" v-model="playerorteamname" placeholder="请输入选手或队伍名"/>
	  	<span class="icon iconfont icon-adduser" @click="addPlayer"></span>
	  	<span class="icon iconfont icon-addteam" @click="addTeam"></span>
	  	<div class="team-nav">
	  		<div :class="(teamplayertabselected.indexOf('1-') !== -1)?'team-nav-left select':'team-nav-left'" @click="showTab('1-1')">
	  			<span v-if="teamplayertabselected!=='1-1'&&teamplayertabselected.indexOf('1-') !== -1">返回队伍</span>
	  			<span v-else>{{msg_team}}</span>
	  		</div>
	  		<div :class="(teamplayertabselected.indexOf('2-') !== -1)?'team-nav-right select':'team-nav-right'" @click="showTab('2-1')">
	  			<span>{{msg_player}}</span>
	  		</div>
	  		<!--<div class="clearfix"></div>-->
	  	</div>
  	</div>
    <div class="tab tab-1-1" v-show="teamplayertabselected==='1-1' || teamplayertabselected==='all'">
			<ul>
	    		<li v-for="(item,index) in teamModel.team">
	    			<mt-cell-swipe title="队伍"
					  :right="[
					  	{
						      content: '&nbsp&nbsp&nbsp添加&nbsp&nbsp&nbsp',
						      style: { background: '#ccc', color: '#fff' },
						      handler: () => addTeamPlayer(item,index)
						  },
						  {
						      content: '&nbsp&nbsp&nbsp成员&nbsp&nbsp&nbsp',
						      style: { background: '#FF9900', color: '#fff' },
						      handler: () => showTeamPlayer(item,index)
						  },
					    {
					      content: '&nbsp&nbsp&nbsp删除&nbsp&nbsp&nbsp',
					      style: { background: 'red', color: '#fff' },
					      handler: () => delTeam(item,index)
					    }
					  ]">
					  	<p>{{item}}</p> 
	    			</mt-cell-swipe>
	    		</li>
	    	</ul>
    </div>
    <div class="tab tab-1-2" v-show="teamplayertabselected==='1-2' || teamplayertabselected==='all'">
    	<mt-checklist
			  :title="selectedteam"
			  v-model="selectedplayer"
			  :options="canbeselectedplayer">
			</mt-checklist>
			<mt-button type="primary" plain @click.native="saveTeamPlayer">
    		<span class="icon iconfont" slot="icon">&#xec09;</span>
			   保存	
			</mt-button>
    </div>
    <div class="tab tab-1-3" v-show="teamplayertabselected==='1-3' || teamplayertabselected==='all'">
    	<ul>
    		<li v-for="(item,index) in group.member">
    				<!--@click.native="(item.statu==='0')?onPlayerStatu(group.teamname,item.pname,index):offPlayerStatu(group.teamname,item.pname,index)"-->
    			<mt-cell-swipe :title="group.teamname" 
				  :right="[
				    {
				      content: '&nbsp&nbsp&nbsp删除&nbsp&nbsp&nbsp',
				      style: { background: 'red', color: '#fff'},
				      handler: () => deleteTeamPlayer(group.teamname,item.pname,index)
				    }
				  ]">
				  	<p><!--<span v-show="item.statu==='1'" class="icon iconfont" style="color:deepskyblue">&#xed1b;</span>-->  {{item.pname}}</p>
    			</mt-cell-swipe>
    		</li>
    	</ul>
    </div>
    <div class="tab tab-2-1" v-show="teamplayertabselected==='2-1' || teamplayertabselected==='all'">
    	<ul>
    		<li v-for="(item,index) in teamModel.player">
    			<mt-cell-swipe title="选手"
				  :right="[
				    {
				      content: '&nbsp&nbsp&nbsp删除&nbsp&nbsp&nbsp',
				      style: { background: 'red', color: '#fff'},
				      handler: () => delPlayer(item,index)
				    }
				  ]">
				  	<p>{{item}}</p> 
    			</mt-cell-swipe>
    		</li>
    	</ul>
    </div>
  </div> 
</template>

<script>
import { mapGetters } from 'vuex';
import toast from '@/components/toast'
export default {
  name: 'team',
  data () {
    return {
    	msg_team: '队伍',
    	msg_player: '选手',
    	toastmsg:'',
      toaststatu:false,
    	selectedteam:'',
    	selectedplayer:[],
    	canbeselectedplayer:[],
      playerorteamname:'',
      teamplayertabselected:'all',
      group:{'teamname':'','member':[]}
    }
  },
  computed:{
	    ...mapGetters(['teamModel','playModel'])
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
  	addPlayer(){
  		//console.log('addPlayer');
			if(this.playerorteamname===null || this.playerorteamname===""){
				this.toast('昵称为空');
				return;
			}
			if(this.playerorteamname.indexOf(' ')!==-1 || this.playerorteamname.indexOf(',')!==-1){
				this.toast('昵称含有非法字符');
				return;
			}
			if(this.playerorteamname.length > 5){
				this.toast('昵称过长');
				return;
			}
			if(this.teamModel.player.indexOf(this.playerorteamname)===-1){
				this.$store.dispatch('addPlayer',this.playerorteamname)
				this.toast('添加成功');	
			}else{
				this.toast('昵称已存在')
			}
			this.teamplayertabselected="2-1";
			this.playerorteamname = '';
  	},
  	delPlayer(pname,index){
  		//console.log('delPlayer');
  		this.$messagebox.confirm('确定执行删除操作?').then(action => {
  			this.playModel.tab11data = {
					"teamA": null,
					'teamB': null
				};
				this.playModel.playtabselected = '1-1';
  			this.$websql.exe(
  				"delete from gogilgroup where pname = ?",
  				[pname],
  				function (rs) {
						this.toast('删除成功')
			  		this.$store.dispatch('delPlayer',index);  					
  				}.bind(this)
  			)
			});
  	},
  	addTeam(){
  		//console.log('delPlayer');
			if(this.playerorteamname===null || this.playerorteamname===""){
				this.toast('队名为空');
				return;
			}
			if(this.playerorteamname.indexOf(' ')!==-1 || this.playerorteamname.indexOf(',')!==-1){
				this.toast('队名含有非法字符');
				return;
			}
			if(this.playerorteamname.length > 5){
				this.toast('队名过长');
				return;
			}
			if(this.teamModel.team.indexOf(this.playerorteamname)===-1){
				this.$store.dispatch('addTeam',this.playerorteamname)
				this.toast('添加成功');	
			}else{
				this.toast('队名已存在')
			}
			this.teamplayertabselected="1-1";
			this.playerorteamname = '';
  	},
  	delTeam(tname,index){
  		//console.log('delPlayer');
  		this.$messagebox.confirm('确定执行删除操作?').then(action => {
  			this.playModel.tab11data = {
					"teamA": null,
					'teamB': null
				};
				this.playModel.playtabselected = '1-1';
  			this.$websql.exe(
  				"delete from gogilgroup where tname = ?",
  				[tname],
  				function (rs) {
  					this.toast('删除成功')
			  		this.$store.dispatch('delTeam',index);
  				}.bind(this)
  			)
			});
  	},
  	addTeamPlayer(item,index){
  		//console.log('addTeamPlayer');
  		this.canbeselectedplayer=[];
  		this.selectedteam = item;
  		this.playModel.tab11data = {
					"teamA": null,
					'teamB': null
				};
			this.playModel.playtabselected = '1-1';
  		this.$websql.exe(
  			"select pname from gogilgroup where tname = ?",
  			[item],
  			function (rs) {
	  			var rstemparr = [];
	  			for(let i =0;i<rs.rows.length;i++){
	  				rstemparr.push(rs.rows[i].pname);
	  			}
	  			for(let i = 0;i<this.teamModel.player.length;i++){
	  				if(rstemparr.indexOf(this.teamModel.player[i])===-1){
							this.canbeselectedplayer.push(this.teamModel.player[i])  					
	  				}
	  			}
	  			this.teamplayertabselected='1-2'
	  		}.bind(this)
  		);
  	},
  	showTeamPlayer(item,index){
  		//console.log('showTeamPlayer');
  		this.group = {'teamname':'','member':[]};
  		this.$websql.exe(
  			"select pname,statu from gogilgroup where tname = ?",
  			[item],
  			function (rs) {
  			for(let i =0;i<rs.rows.length;i++){
  				this.group.member.push(rs.rows[i]);
  			}
  			this.teamplayertabselected='1-3'
  			this.group.teamname = item;
  		}.bind(this)
  		);
  	},
  	showTab(select){
  		//console.log('showTab');
  		if(this.teamplayertabselected!==select){
  			this.teamplayertabselected = select;
  		}
  	},
  	saveTeamPlayer(){
  		//console.log('saveTeamPlayer');
  		var tempplayer = this.selectedplayer;
  		var tempteam = this.selectedteam;
  		if(this.selectedplayer.length === 0){
  			this.toast('未选择成员');
  			return;
  		}
  		this.selectedplayer = [];
  		this.playModel.tab11data = {
					"teamA": null,
					'teamB': null
				};
			this.playModel.playtabselected = '1-1';
  		for(let i=0;i<tempplayer.length;i++){
  			this.$websql.exe(
  				'insert into gogilgroup(pname,tname,statu) values(?,?,?)',
  				[tempplayer[i],tempteam,'0'],
  				function (rs) {
  					this.selectedteam = '';
			  		this.teamplayertabselected="1-1"
			  		this.toast('添加成功');
  				}.bind(this))
  		}
  	},
//	onPlayerStatu(tname,pname,index){
//		//console.log('onPlayerStatu');
//			let onstateplayer = 0;
//			for(let i=0;i<this.group.member.length;i++){
//				if(this.group.member[i].statu === '1')onstateplayer++
//			}
//			if(onstateplayer >= 7){
//				this.toast('上场人数已满');
//				return;
//			}else{
//	  		this.$websql.exe(
//	  			'update gogilgroup set statu = 1 where tname = ? and pname = ?',
//	  			[tname,pname],
//	  			function (rs) {
//	  				this.group.member[index].statu = '1';
//	  			}.bind(this)
//	  		)
//			}
//	},
//	offPlayerStatu(tname,pname,index){
//		//console.log('offPlayerStatu');
//			this.$websql.exe(
//				'update gogilgroup set statu = 0 where tname =? and pname = ?',
//				[tname,pname],
//				function (rs) {
//					this.group.member[index].statu = '0';
//				}.bind(this)
//			)
//	},
  	deleteTeamPlayer(tname,pname,index){
  		//console.log('deleteTeamPlayer');
  		this.$messagebox.confirm('确定执行删除操作?').then(action => {
  			this.playModel.tab11data = {
						"teamA": null,
						'teamB': null
					};
				this.playModel.playtabselected = '1-1';
			  this.$websql.exe(
			  	"delete from gogilgroup where tname = ? and pname = ?",
			  	[tname,pname],
			  	function (rs) {
						this.group.member.splice(index,1);
			  		this.toast('删除成功')			  		
			  	}.bind(this)
			  )
			});
  	}
  },
  created() {
		localStorage.setItem("_gogilnavselected","team");
	},
  mounted(){
  	this.teamplayertabselected="1-1"
  }
}
</script>

<style scoped>
  .team{
  	margin-top: 48px;
  }
  .team .icon{
  	font-size: 20px;
  	vertical-align: top!important
  }
  .team .top{
  }
  .team .top .playerorgroupInput{
  	margin-left: 11%;
  	width: 50%;
  	font-size: 16px;
  	padding: 5px 10px;
  	display: inline-block;
  	border:1px solid #CCCCCC;
  	border-radius: 20px;
  	outline: 0px;
  }
  .team .top .playerorgroupInput:focus{
  	border:1px solid deepskyblue;
  }
  .team .top span{
  	margin-right: 5px;
  	padding: 5px;
  	display: inline-block;
  }
  .team .team-nav span{
  	padding: 0px;
  }
  .team .top .team-nav{
  	height: 40px;
  }
  .team .top .team-nav .team-nav-left,
  .team .top .team-nav .team-nav-right{
  	font-size: 12px;
  	line-height: 40px;
  	width: 50%;
  	float: left;
  	text-align: center;
  }
  .team .top .team-nav .team-nav-left.select,
  .team .top .team-nav .team-nav-right.select{
  	background-color:#99CCFF;
  	color:#fff
  }
	.team .tab{
		width: 100%;
		padding-bottom: 9px!important;
	}
	.team .tab-1-3 .mint-cell-value p{
		height: 20px;
		display: inline-block;
	}
</style>
