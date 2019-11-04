<template>
	<div :class="toaststatu?'mytoast mytoast-show':'mytoast mytoast-hide'" v-swipe='cleartoast'>
  		<span>
  			{{toastmsg}}
  		</span>
  	</div>
</template>

<script>
export default{
	name: 'toast',
	data() {
		return {
		}
	},
	props: {
		toastmsg: '',
		toaststatu: false,
	},
	methods: {
		cleartoast(){
			//console.log('cleartoast');
			this.$emit('cleartoast')
		}
	},
	watch: {
	},
}
</script>

<style scoped>
.mytoast{
	position: absolute;
	bottom: 100px;
	text-align: center;
	transition: all 1s;
	width: 100%;
}
.mytoast-hide{
	display: none;
	opacity: 0;
}
.mytoast-show{
	display: block;
	opacity: 0.7;
}
.mytoast span{
	border-radius: 5px;	
	max-width: 70%;
	display: inline-block;
	background-color: rgb(68,71,70);
	padding: 10px 25px;
	font-size: 16px;
	color:white;
}
</style>