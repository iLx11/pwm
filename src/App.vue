<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
onLaunch(() => {
  console.log('App Launch')
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>
<style>
@import "./static/font/iconfont.css";
@font-face {
  font-family: 'ceyy';
  src: url('./static/font/ceyy.ttf');
}
@font-face {
  font-family: 'ast';
  src: url('./static/font/ast.ttf');
}
* {
  margin: 0%;
  padding: 0%;
  box-sizing: border-box;
}
.icon {
  width: 1.8em;
  height: 1.8em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  color: rgba(51, 51, 51, 1);
}
li {
	list-style: none;
}
</style>
