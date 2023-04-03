<template>
  <div class="bg"></div>
  <div class="security">
    <div class="security-ques">
      <form :model="resetFormData">
        <div id="security-content">
          <input type="text" placeholder="你最喜欢食物" v-model.trim="resetFormData.interest" />
          <input type="text" placeholder="你最感兴趣的事情" v-model.trim="resetFormData.food" />
          <div id="subButton" @click="setCode">提交</div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup="props, { emit }" lang="ts">
import { reactive, ref, getCurrentInstance } from 'vue'
const resetFormData = reactive({
  interest: '',
  food: ''
})
const emits = defineEmits(['closeRS', 'showMes'])
const { proxy } = getCurrentInstance()
console.log(proxy.$AES_Decrypt(proxy.$AES_Encrypt('werwer')))
const setCode = function () {
  try {
    const secQuesString: string = uni.getStorageSync('secQues')
    if (secQuesString) {
      const verifyCode = JSON.parse(secQuesString)
      if (resetFormData.interest === verifyCode.interest && resetFormData.food === verifyCode.food) {
        uni.removeStorageSync('sysPW')
        uni.removeStorageSync('secQues')
        emits('showMes', '验证成功，已重置密码')
      } else {
        emits('showMes', '验证失败')
      }
    } else {
      if (resetFormData.interest !== '' && resetFormData.interest !== null && resetFormData.food !== '' && resetFormData.food !== null) {
        uni.setStorageSync('secQues', JSON.stringify(resetFormData))
        console.log(uni.getStorageSync('secQues'))
        emits('showMes', '验证信息输入成功')
      } else {
        emits('showMes', '输入不能为空')
      }
    }
  } catch (e) {
    emits('showMes', '产生错误')
  }
  resetFormData.interest = ''
  resetFormData.food = ''
  emits('closeRS')
}
</script>

<style lang="scss">
$shadow1: 3px 4px 12px 3px rgba(111, 109, 133, 0.09);

.security {
  width: 100%;
  height: 100%;
  background: rgba(51, 51, 51, 0.16);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 66;
  /*display: none;*/
  font-family: 'ceyy';
}

.security-ques {
  width: 90%;
  height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 88;
  background: rgba(255, 255, 255, 1);
  border-radius: 22px;
  box-shadow: $shadow1;
  padding: 1em;

  #security-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-evenly;
    align-items: center;

    input {
      width: 100%;
      height: 60px;
      text-align: center;
      border-radius: 12px;
      border: none;
      background: rgba(51, 51, 51, 0.05);
      font-size: 18px;
    }

    #subButton {
      width: 100%;
      height: 60px;
      border-radius: 12px;
      background: rgba(212, 225, 228, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      color: rgba(51, 51, 51, 0.9);
    }
  }
}
</style>
