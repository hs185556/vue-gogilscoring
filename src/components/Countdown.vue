<template>
	<div class="countdown">
		<span>
			倒计时
			<mt-button type="primary" size="small" plain @click.native="selectservetime">{{servetime}}</mt-button>
			<mt-button type="primary" size="small" plain @click.native="selectthinktime">{{thinktime}}</mt-button>
			<mt-button type="primary" size="small" plain @click.native="selectlefttime">{{delaytime - thinktime}}</mt-button>
			<mt-button type="primary" size="small" plain @click.native="selectoneminute">{{delaytime}}</mt-button>
			<mt-button type="primary" size="small" plain @click.native="count"><span class="icon iconfont">&#xe642;</span></mt-button>
			<span>{{currenttime}}</span>
		</span>
	</div>
</template>

<script>
export default{
	name: 'countdown',
	data(){
		return {
			currenttime:this.servetime,
			timer:null,
			usedelaytime:false,
			temp:this.thinktime,
		}
	},
	props: {
		thinktime: {
		    type: Number,
		    default: 20
		},
		servetime: {
		    type: Number,
		    default: 10
		},
		delaytime: {
		    type: Number,
		    default: 60
		},
		reset: {
		    type: Boolean,
		    default: false
		},
   },
   methods:{
   	count(){
		//console.log('count')
		if(this.timer !== null){// 不能重复开始
			return;
		}
		this.temp = this.currenttime;
		if(this.usedelaytime){// 思考延时，通知父组件
			this.$emit('move1mtime')
		}
		if(this.currenttime <= 0){
			this.currenttime = this.temp;
			return;
		}
		clearInterval(this.timer);
		this.timer = setInterval(function(){
			this.currenttime --;
			if(this.currenttime <= 0){
				clearInterval(this.timer);
				this.currenttime = this.temp;
				this.timer = null;
				navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
			    if(navigator.vibrate) {
			        //console.log("支持设备震动");
					navigator.vibrate(800);
					this.$emit('timeover')
			    }
			}
		}.bind(this),1000)
	},
	selectoneminute(){
		//console.log('selectoneminute')
		clearInterval(this.timer);
		this.timer = null
		this.currenttime = this.delaytime;
		this.usedelaytime = true;
	},
	selectlefttime(){
		//console.log('selectlefttime')
		clearInterval(this.timer);
		this.timer = null
		this.currenttime = this.delaytime - this.thinktime;
		this.usedelaytime = true;
	},
	selectthinktime(){
		//console.log('selectthinktime')
		clearInterval(this.timer);
		this.timer = null
		this.currenttime = this.thinktime;
		this.usedelaytime = false;
	},
	selectservetime(){
		//console.log('selectservetime')
		clearInterval(this.timer);
		this.timer = null
		this.currenttime = this.servetime;
		this.usedelaytime = false;
	},
   },
   watch:{
   	'reset'(){
   		//console.log('reset')
   		if(this.reset){
   			clearInterval(this.timer);
			this.currenttime = this.temp || 20;
			this.$emit('closereset')
   		}
   	}
   }
}
</script>

<style scoped>
	.countdown{
		font-size: 14px;
		width: 100%;
		background-color: #CCCCFF;
		border-radius: 5px;
		height: 35px;
		overflow: hidden;
		text-align: center;
	}
	.countdown span{
		width: 100%;
	}
</style>