<template>
	<div class="timepanel">
		<p>
			<span>开始时间：</span>
			<span> {{year}}/{{mon}}/{{day}} {{hour}}:{{min}}:{{second}}</span>
		</p>
		<p>
			<span>比赛时长：</span>
			<span>{{chour}}:{{cmin}}:{{csecond}}</span>
		</p>
	</div>
</template>

<script>
export default{
	name: 'timepanel',
	data(){
		return {
			year:'----',
			mon:'--',
			day:'--',
			hour:'--',
			min:'--',
			second:'--',
			chour:'00',
			cmin:'00',
			csecond:'00',
			timer:null
		}
	},
	props: {
			statu: {
				type: Boolean,
				default: false
			},
		},
		methods: {
			gettime() {
				//console.log('gettime')
				var myDate = new Date();
				this.year = myDate.getFullYear(); //获取当前年份(2位)
				this.mon = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
				this.day = myDate.getDate(); //获取当前日(1-31)
				this.hour = (myDate.getHours()+'').length === 2?myDate.getHours():'0'+myDate.getHours(); //获取当前小时数(0-23)
				this.min = (myDate.getMinutes()+'').length === 2?myDate.getMinutes():'0'+myDate.getMinutes(); //获取当前分钟数(0-59)
				this.second = (myDate.getSeconds()+'').length === 2?myDate.getSeconds():'0'+myDate.getSeconds(); //获取当前秒数(0-59)
			},
			count() {
				//console.log('count')
				this.chour = '00';
				this.cmin = '00';
				this.csecond = '00';
				let temphour = 0;
				let tempmin = 0;
				let tempsecond = 0;
				clearInterval(this.timer);
				this.timer = setInterval(function() {
					tempsecond++;
					if(tempsecond === 60){
						tempsecond = 0;	
						tempmin++;
					}
					if(tempmin === 60){
						tempmin = 0;
						temphour++;
					}
					this.chour = (temphour+'').length === 2?temphour:'0'+temphour;
					this.cmin = (tempmin+'').length === 2?tempmin:'0'+tempmin;
					this.csecond = (tempsecond+'').length === 2?tempsecond:'0'+tempsecond;
				}.bind(this), 1000)
			},
		},
		watch: {
			statu() {
				//console.log('statu 变化')
				if(this.statu){
					this.gettime()
					this.count()
				}else{
					clearInterval(this.timer);
					let starttime = this.year+'/'+this.mon+'/'+this.day+' '+this.hour+':'+this.min+':'+this.second;
					let continuetime = this.chour+':'+this.cmin+':'+this.csecond;
					this.$emit('passtimerecord',{starttime,continuetime})
				}
			}
		},
	}
</script>

<style scoped>
	.timepanel{
		width: 100%;
		background-color: #CCCCFF;
		border-radius: 5px;
	}
	.timepanel p{
		margin: 0;
		padding: 1px 0px 0px 0px;
		line-height: 22px;
		font-size: 14px;
	}
</style>