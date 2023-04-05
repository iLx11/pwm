<template>
  <div id="zhanwei"></div>
  <div id="content-box" :style="{ height: boxHeight }">
    <div id="scanIcon" @click="emits('qrCodeScan')">
      <uni-icons type="scan" color="rgba(51,51,51,0.4)" size="30"></uni-icons>
    </div>
    <div id="data-box">
      <div>存储的密码数量</div>
      <span>{{ pwListLength }}</span>
      <div id="circle"></div>
    </div>
    <div id="search-box">
      <div>
        <uni-icons type="search" color="rgba(51,51,51,0.4)" size="30"></uni-icons>
      </div>
      <input type="text" />
    </div>
  </div>
</template>

<script setup="props, { emit }" lang="ts">
import { onMounted, ref } from 'vue'
onMounted(() => {
  const cheight: number = uni.getSystemInfoSync().windowHeight
  boxHeight.value = cheight * 0.25 + 'px'
})
const boxHeight = ref<string>('')

const props = defineProps({
  pwListLength: {
    type: Number
  }
})
const emits = defineEmits(['qrCodeScan'])
</script>

<style lang="scss">
$shadow1: 3px 4px 12px 3px rgba(111, 109, 133, 0.09);
#zhanwei {
  width: 100%;
  height: 2em;
}
#scanIcon {
  width: 25px;
  height: 25px;
  position: absolute;
  top: 5%;
  right: 5%;
  z-index: 666;
}
#content-box {
  width: 92%;
  height: 20%;
  // box-shadow: 0 0 0 1px rgba(51, 51, 51, 0.3);
  box-shadow: $shadow1, 0 0 0 0.23px rgba(51, 51, 51, 0.2);
  margin: 0 auto;
  margin-bottom: 1em;
  border-radius: 23px;
  background: rgba(241, 242, 245, 1);
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-evenly;
  align-items: center;
  font-family: 'ast', 'ceyy';
  padding: 1em;
  position: relative;
  #data-box {
    width: 100%;
    height: 60%;
    font-size: 23px;
    color: rgba(51, 51, 51, 0.7);
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    position: relative;
    #circle {
      width: 50px;
      height: 50px;
      position: absolute;
      bottom: 2%;
      right: 5%;
      background: rgba(223, 177, 180, 0.3);
      border-radius: 50%;
      z-index: 1;
    }
    span {
      font-size: 70px;
      color: rgba(51, 51, 51, 0.6);
    }
  }
  #search-box {
    width: 96%;
    height: 30%;
    box-shadow: 0 0 0 0.5px rgba(51, 51, 51, 0.7);
    border-radius: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    div {
      width: 15%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    input {
      width: 80%;
      height: 100%;
      font-size: 25px;
      // margin-left: 2em;
    }
  }
}
</style>
