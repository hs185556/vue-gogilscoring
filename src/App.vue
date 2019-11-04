<template>
  <div id="app">
  	<!--@touchstart="subtouchStart($event,index)"-->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods:{
  	subtouchStart(event,index){
	    event.preventDefault();//阻止默认事件
	  }
  }
}
</script>

<style>
*{
	-webkit-touch-callout:none;
	-webkit-user-select:none;
	-khtml-user-select:none;
	-moz-user-select:none;
	-ms-user-select:none;
	user-select:none;
}
.icon {
  width: 1.25em;
  height: 1.25em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
body{
	margin: 0;
}
ul{
	padding-left: 0;
	margin: 0;
}
h1,h2,h3,h4,h5,p{
	margin: 0;
}
ul li{
	list-style: none;
}
.mint-cell-wrapper{
	text-align: left;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 40px;
}
.clearfix{
	overflow: auto;
	zoom: 1;
}
</style>
