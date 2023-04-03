<template>
  <header>_iLx1_</header>
  <div class="content" ref="content">
    <div class="headImg"></div>
    <div class="glass"></div>
    <div class="pw-content">
      <div class="pw-box">
        <div class="pw-box-content">
          <h1>请输入密码</h1>
          <input :type="showPW.inpType" v-model.trim="inpValue" placeholder="输入后请按回车" @confirm="subPassword" />
          <div class="showpw">
            <uni-icons :type="showPW.iconType" color="rgba(51,51,51,0.4)" size="30" @click="changePWStatus"></uni-icons>
            <span @click="resetPW">重置密码</span>
          </div>
        </div>
      </div>
    </div>
    <div class="software-des">PASSWORD</div>
    <div class="software-des1">MANAGEMENT</div>
    <div class="software-des2">
      <h1>LOGIN</h1>
    </div>
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
import { onReady } from '@dcloudio/uni-app'
import { reactive, ref, getCurrentInstance } from 'vue'
// import centerPage from '/src/components/center-page/index.vue'
import resetPw from '/src/components/reset-pw/index.vue'
interface ShowType {
  inpType: string
  iconType: string
}
onReady(() => {
  const cheight: number = uni.getSystemInfoSync().windowHeight
  content.value && (content.value.style.height = cheight * 0.9 + 'px')
  // uni.clearStorage()
  // AES_Decrypt(AES_Encrypt("1123qweqwe"))
})
const { proxy } = getCurrentInstance()

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
  uni.navigateTo({
    url: '../pwsystem/index',
    animationType: 'fade-in',
    animationDuration: 7000
  })
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
    } else if (!sysPW) {
      infoShow('请设置重置密码的问题')
      uni.setStorageSync('sysPW', proxy.$md5(inpValue.value))
      resetShow.value = true
    } else {
      infoShow('验证失败')
      console.log(sysPW)
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
  .software-des2 {
    position: absolute;
    top: 85%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 40px;
    font-family: 'ast';
    color: rgba(51, 51, 51, 0.5);
  }

  .software-des1 {
    top: 90%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 30px;
    color: rgba(51, 51, 51, 0.4);
  }

  .software-des2 {
    top: 12%;
    left: 68%;
    transform: translate(-50%, -50%);
    font-size: 50px;
    color: rgba(51, 51, 51, 0.2);
    font-family: 'ceyy';
    border-radius: 24px;
    box-shadow: $shadow1;
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
  filter: contrast(84%);
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
  box-shadow: $shadow1;
}

// .glass {
// 	width: 100%;
// 	height: 50%;
// 	position: absolute;
// 	top: 30%;
// 	left: 50%;
// 	transform: translate(-50%, -50%);
// 	background: url("/src/static/img/userin.png") no-repeat;
// 	/*background: rgba(51, 51, 51, 0.4);*/
// 	background-size: cover;
// 	filter: blur(6px);
// 	z-index: 66;
// 	clip-path: polygon(0% 60%, 100% 60%, 100% 100%, 0% 100%);
// 	box-shadow: 3px 4px 12px 3px rgba(111, 109, 133, 0.09);
// }

.pw-box {
  width: 100%;
  height: 100%;
  z-index: 69;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.94);
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
