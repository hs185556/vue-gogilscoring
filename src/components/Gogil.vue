<template>
  <div class="gogil">
  	<toast :toastmsg='toastmsg' :toaststatu='toaststatu' @cleartoast='cleartoast'></toast>
  	<mt-header fixed title="高智尔球">
  		<mt-button v-show="isshowback()" icon="back" @click.native="tabback" slot="left">返回</mt-button>
  		<mt-button icon="more" slot="right" @click.native='showmore'></mt-button>
  	</mt-header>
    <div class="nav-bar">
    	<ul>
    		<li @click="toPage('team')" :class="(gogilnavselected === 'team')?'select':''">
    			<span class="icon iconfont icon-Myteam"></span>
    			<div class="name">
    				团队
    			</div>
    		</li>
    		<li @click="toPage('play')" :class="(gogilnavselected === 'play')?'select':''">
    			<span class="icon iconfont">&#xe628;</span>
    				<div class="name">
    					比赛
    				</div>
    		</li>
    		<li @click="toPage('calc')" :class="(gogilnavselected === 'calc')?'select':''">
    			<span class="icon iconfont icon-analysis"></span>
    			<div class="name">
    				记录
    			</div>
    		</li>
    	</ul>
    </div>
    <div class="showmore" v-show="isshowmore">
    	<div class="boot">
    		<h4>快速引导</h4>
    		<div class="text">
    			<p>
	    			&nbsp;&nbsp;&nbsp;&nbsp;1.团队界面，添加成员、队伍，队伍右滑添加队伍成员
	    		</p>
	    		<p>
	    			&nbsp;&nbsp;&nbsp;&nbsp;2.比赛界面，选对战组和球员，界面右滑查看设置或实时比赛数据
	    		</p>
	    		<p>
	    			&nbsp;&nbsp;&nbsp;&nbsp;3.裁判记录比赛数据时，除了犯规其他按钮都会直接切换到下回合。如一次击中多个球，就选中多个球同时操作。
	    		</p>
	    		<p>
	    			&nbsp;&nbsp;&nbsp;&nbsp;4.悬浮窗信息不需要时可手动划掉
	    		</p>
	    		<p>
	    			&nbsp;&nbsp;&nbsp;&nbsp;5.记录界面，记录右滑查看比赛
	    		</p>
    		</div>
    	</div>
    	<div class="feedback">
    		<h4>用户反馈</h4>
    		<div class="text">
	    		<p>
	    			&nbsp;&nbsp;&nbsp;&nbsp;如遇问题，可联系QQ410262593或1329321704进行反馈
	    		</p>
    		</div>
    	</div>
			<div class="copyright">
				<p>© 2019 hst gzc</p>
				<p>All rights reserved.</p>
			</div>    	
    </div>
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import toast from '@/components/toast'
export default {
  name: 'gogil',
  data () {
    return {
    	toastmsg:'',
      toaststatu:false,
//    gogilnavselected:localStorage.getItem("_gogilnavselected") || 'team',
			gogilnavselected: "team",
			isshowmore:false,
    }
  },
  computed:{
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
  	toPage(name){
  	//console.log('toPage');
  	if(this.isshowmore)return;
  	if(this.playModel.gamestatu){
//			this.toast("游戏已开始");
			return;
  	}
		if(this.gogilnavselected !== name){
				if(name === 'calc'){
					this.calcModel.calctabselected = "1-1";
				}
				if(name === 'play'){
					this.playModel.playtabselected = "1-1";
				}
				this.$router.push({'name':name})
				this.gogilnavselected = name;
			}
  	},
  	isshowback(){
  		//console.log('isshowback');
  		if(this.isshowmore)return true;
  		if(this.playModel.gamestatu){
  			return false;
  		}
  		if(this.gogilnavselected === 'play'){
  			if(this.playModel.playtabselected !== '1-1')return true;
  		}
  		if(this.gogilnavselected === 'calc'){
  			if(this.calcModel.calctabselected !== '1-1')return true;
  		}
  		return false;
  	},
  	tabback(){
  		//console.log('tabback');
  		let temp;
  		if(this.isshowmore){
  			this.isshowmore = false;
  			return;
  		}
  		if(this.gogilnavselected === 'play'){
  			switch(this.playModel.playtabselected)
				{
				case '3-1':
					temp = '2-1'
				  break;
				case '2-1':
					temp = '1-1'
				  break;
				case '3-2':
					temp = '3-1'
				  break;
				case '2-2':
					temp = '2-1'
				  break;
				case '1-2':
					temp = '1-1'
				  break;
				default:
					temp = '1-1'
				}
				this.$store.dispatch("toplayTab",temp)
  		}
  		if(this.gogilnavselected === 'calc'){
//			switch(this.calcModel.calctabselected)
//				{
//				case '1-3':
//					temp = '1-1'
//				  break;
//				case '1-2':
//					temp = '1-1'
//				  break;
//				default:
//					temp = '1-1'
//				}
				this.$store.dispatch("tocalcTab",'1-1')
  		}
  	},
  	showmore(){
  		//console.log('showmore');
  		this.isshowmore = true
  	}
  },
  created(){
  	this.$store.dispatch('openGogilDB');
		this.$store.dispatch('createGroupTable');
		this.$store.dispatch('createGameTable');
		this.$store.dispatch('createGameteamTable');
		this.$store.dispatch('createGameplayerTable');
  },
  mounted(){
  	// 首页返回键处理
		// 处理逻辑：弹窗询问是否退出应用，确定则退出；
  	let self = this;
  	mui.back = function () {
  		self.$messagebox.confirm("确认退出应用?",'！').then(aAction =>{
//			self.$router.go(-1)
				plus.runtime.quit(); //那么就退出app
  		})
  	}
  }
}
</script>

<style scoped>
	a{
		text-decoration: none;
	}
	.nav-bar{
		text-align: center;
		border-top: 1px solid #e6e6e6;
		opacity: 0.9;
		padding: 2px 0 2px 0;
		background-color: #fcfcfc;
		position: fixed;
		bottom: 0;
		width: 100vw;
		height: 44px;
		left:0;
		z-index: 10;
	}
	.showmore{
		z-index: 999;
		width: 100%;
		height: calc(100vh - 89px);
		position: absolute;
		top: 40px;
		left: 0;
		background-color: #fff;
		text-align: center;
	}
	.showmore p{
		font-size: 16px;
	}
	.showmore .text{
		text-align: left;
	}
	.showmore h4{
		margin-bottom: 5px;
	}
	.showmore .boot{
		margin: 10px 0 50px 0;
	}
	.showmore .feedback{
		margin: 10px 0 50px 0;
	}
	.showmore .copyright{
		width: 100%;
		position: absolute;
		bottom: 14px;
		color:#7e7e7e;
		font-size:15px;
	}
	.nav-bar ul{
		width: 100%;
		height:100%;
		margin: 0;
		padding: 0;
		display: flex;
		justify-content: center;
	}
	.nav-bar ul li{
		list-style: none;
		float: left;
		width: 33%;
	}
	.nav-bar ul li .name{
		font-size: 12px;
	}
	.nav-bar ul li .icon{
		font-size: 16px;
		height: 28px;
  		line-height: 28px;
		-webkit-transition: font-size 0.25s linear, width 0.25s linear;
	  -moz-transition: font-size 0.25s linear, width 0.25s linear;
	  transition: font-size 0.25s linear, width 0.25s linear;		
	}
	.nav-bar ul li.select{
		color: #26a2ff;
	}
	.nav-bar ul li.select .icon{
		font-size: 23px;
	}
</style>
