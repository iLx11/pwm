<template>
  <header>_iLx1_</header>
  <div class="content" :style="{ height: contentH }">
    <div class="headImg"></div>
    <div class="glass"></div>
    <view class="pw-content">
      <view class="pw-box" :animation="boxAnimate">
        <div class="pw-box-content">
          <h1>请输入密码</h1>
          <input :type="showPW.inpType" v-model.trim="inpValue" placeholder="输入后请按回车" @confirm="subPassword" :focus="isFocus" @blur="isFocus = false"/>
          <div class="showpw">
            <uni-icons :type="showPW.iconType" color="rgba(51,51,51,0.4)" size="30" @click="changePWStatus"></uni-icons>
            <span @click="resetPW">重置密码</span>
          </div>
        </div>
      </view>
    </view>
    <div class="software-des">PASSWORD</div>
    <div class="software-des1">MANAGEMENT</div>
    <view class="software-des2" :animation="cycle1Animation"></view>
    <view class="software-des3" :animation="cycle2Animation" @click="showInput"><span>login</span></view>
    <view class="software-des4" :animation="cycle3Animation" @click="hideInput"></view>

  </div>
  <div>
    <!-- <center-page v-if="systemShow"></center-page> -->
    <reset-pw v-if="resetShow" @closeRS="closeResetShow" @showMes="showMessage"></reset-pw>
    <uni-popup ref="popup" type="message">
      <uni-popup-message type="info" :message="msg" :duration="1500"></uni-popup-message>
    </uni-popup>
  </div>
</template>

<script setup lang="ts">
import { onHide, onLoad, onReady, onShow } from '@dcloudio/uni-app'
import { reactive, ref, getCurrentInstance, onMounted } from 'vue'
// import centerPage from '/src/components/center-page/index.vue'
import resetPw from '/src/components/reset-pw/index.vue'
interface ShowType {
  inpType: string
  iconType: string
}
const isFocus = ref<boolean>(false)
// 动画
onShow(() => {
  let animation = uni.createAnimation()
  proxy.animation = animation
  cycle1ShowAnimation()
  cycle2ShowAnimation("18%", "10%")
  cycle3ShowAnimation("52%", "66%")
})
// 盒子动画
let boxAnimate = ref({})
let cycle1Animation = ref({})
let cycle2Animation = ref({})
let cycle3Animation = ref({})
// 输入框动画
const boxShowAnimation = function () {
  proxy.animation.translate(0).opacity(1).step({
    duration: 1000,
    timingFunction: 'ease'
  })
  boxAnimate.value = proxy.animation.export()
}
const boxHideAnimation = () => {
  proxy.animation.translate("-100%").opacity(1).step({
    duration: 1000,
    timingFunction: 'ease'
  })
  boxAnimate.value = proxy.animation.export()
}
// 圆圈动画
const cycle1ShowAnimation = function() {
  proxy.animation.top("15%").left("-5%").scale(1).step({
    duration: 1000,
    timingFunction: 'ease'
  })
  cycle1Animation.value = proxy.animation.export()
}
const cycle2ShowAnimation = (top: string, left: string) => {
  proxy.animation.top(top).left(left).scale(1).step({
    duration: 1000,
    timingFunction: 'ease'
  })
  cycle2Animation.value = proxy.animation.export()
}

const cycle3ShowAnimation = (top: string, left: string) => {
  proxy.animation.top(top).left(left).opacity(1).step({
    duration: 1000,
    timingFunction: 'ease'
  })
  cycle3Animation.value = proxy.animation.export()
}
const showInput = () => {
  boxShowAnimation()
  cycle2ShowAnimation("18%", "78%")
  cycle3ShowAnimation("75%", "64%")
  isFocus.value = true;
}
const hideInput = () => {
  boxHideAnimation()
  cycle1ShowAnimation()
  cycle2ShowAnimation("18%", "10%")
  cycle3ShowAnimation("52%", "66%")
}
const contentH = ref<string>('')
onMounted(() => {
  const cheight: number = uni.getSystemInfoSync().windowHeight
  // content.value && (content.value.style.height = cheight * 0.9 + 'px')
  contentH.value = cheight * 0.9 + 'px'
  if (!uni.getStorageSync('sysPW')) infoShow('首次登陆的话，直接输入就可以记录密码')
  // uni.clearStorage()
})
const { proxy } = getCurrentInstance() as any

const popup = ref<any>(null)
const msg = ref<string>('')
const infoShow = function (value: string) {
  msg.value = value
  popup.value && popup.value.open()
}
const content = ref<HTMLElement | null>(null)
const inpValue = ref<string | null>(null)
// const systemShow = ref<boolean>(false)
const resetShow = ref<boolean>(false)
const showPW = reactive<ShowType>({
  inpType: 'password',
  iconType: 'eye-slash'
})
// 更改输入框的显示状态
const changePWStatus = function () {
  if (showPW.inpType === 'password') {
    showPW.inpType = 'text'
    showPW.iconType = 'eye'
  } else {
    showPW.inpType = 'password'
    showPW.iconType = 'eye-slash'
  }
}
// 关闭密码重置组件
const closeResetShow = function () {
  resetShow.value = false
}
// 提交系统密码，并验证
const subPassword = function () {
  if (inpValue.value !== '' && inpValue.value !== null) {
    const sysPW = uni.getStorageSync('sysPW')
    if (sysPW && proxy.$md5(inpValue.value) === sysPW) {
      infoShow('验证成功')
      uni.navigateTo({
        url: '../pwsystem/index',
        animationType: 'fade-in',
        animationDuration: 200
      })
    } else if (!sysPW) {
      infoShow('请设置重置密码的问题')
      uni.setStorageSync('sysPW', proxy.$md5(inpValue.value))
      resetShow.value = true
    } else {
      infoShow('验证失败')
      // console.log(sysPW)
    }
  } else {
    infoShow('输入内容不能为空')
  }
}
const showMessage = (event: string) => {
  infoShow(event)
}
// 重置密码组件
const resetPW = function () {
  if (uni.getStorageSync('sysPW')) resetShow.value = true
}
</script>

<style lang="scss">
$shadow1: 3px 4px 12px 3px rgba(111, 109, 133, 0.09);

header {
  font-family: 'ceyy';
}

.content {
  width: 93%;
  height: 92%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'ceyy';

  .software-des,
  .software-des1,
  .software-des2,
  .software-des3,
  .software-des4 {
    position: absolute;
    top: 85%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 40px;
    font-family: 'ast';
    color: rgba(51, 51, 51, 0.2);
  }

  .software-des1 {
    top: 90%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 30px;
    color: rgba(51, 51, 51, 0.2);
  }

  .software-des2,
  .software-des3,
  .software-des4 {
    width: 135px;
    height: 135px;
    top: 18%;
    left: -18%;
    // transform: translate(-50%, -50%);
    font-size: 50px;
    color: rgba(51, 51, 51, 0.24);
    font-family: 'ceyy';
    border-radius: 50%;
    // box-shadow: $shadow1;
    background: rgba(210, 227, 231, 0.35);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
    backdrop-filter: blur(4.5px);
    -webkit-backdrop-filter: blur(14.5px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    z-index: 666;
  }
  .software-des2 {
    transform: scale(0.7);
    backdrop-filter: blur(10px);
  }
  .software-des3 {
    width: 280px;
    height: 280px;
    top: 8%;
    left: 38%;
    transform: scale(0.9);
    // z-index: 1;
    background: rgba(237, 242, 241, 0.35);
    span {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .software-des4 {
    width: 100px;
    height: 100px;
    top: 78%;
    left: 94%;
    // z-index: 1;
    opacity: 60%;
    background: rgba(238, 207, 213, 0.35);
  }
}

.headImg {
  width: 100%;
  height: 50%;
  position: absolute;
  top: 35%;
  left: 30%;
  transform: translate(-50%, -50%);
  background: url('/static/img/2.jpg') no-repeat;
  // filter: contrast(84%);
  background-size: cover;
  border-radius: 14px;
}

.pw-content {
  width: 88%;
  height: 30%;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 24px;
  overflow: hidden;
  z-index: 67;
  // box-shadow: 0px 0px 0px 0.26px rgba(51, 51, 51, 0.38);
  // box-shadow: $shadow1;
}
.pw-box {
  width: 100%;
  height: 100%;
  z-index: 69;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.94);
  transform: translate(-300px);
  opacity: 10%;
}

.pw-box-content {
  width: 90%;
  height: 60%;
  /*background: rgba(51, 51, 51, 0.6);*/
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 1.2em;
}

.pw-box-content h1 {
  font-size: 27px;
  color: rgba(51, 51, 51, 0.65);
}

.pw-box-content input {
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 12px;
  background: rgba(51, 51, 51, 0.1);
  color: rgba(51, 51, 51, 0.6);
  text-align: center;
  font-size: 17px;
}

.pw-box-content input::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.showpw {
  width: 100%;
  height: 15%;
  position: absolute;
  bottom: 5%;
  /*background: rgba(51, 51, 51, 0.4);*/
  text-align: center;
  color: darkcyan;
}

.showpw span {
  position: absolute;
  right: 8%;
  color: rgba(51, 51, 51, 0.4);
}
</style>
