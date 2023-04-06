<template>
  <div id="zhanwei"></div>
  <div id="content-box" :style="{ height: boxHeight }">
    <div id="showToolBox" @click="toolBoxShow = true" v-if=" !toolBoxShow">
        <uni-icons type="more-filled" color="rgba(51,51,51,0.4)" size="30"></uni-icons>
      </div>
    <div id="tool-box" v-if="toolBoxShow">
      <div id="qrcodeIcon" @click="emits('qrCodeGen')">
        <uni-icons custom-prefix="iconfont" type="icon-erweima" size="30" color="rgba(51,51,51,0.4)"></uni-icons>
      </div>
      <div id="importIcon" @click="emits('importText')">
        <uni-icons custom-prefix="iconfont" type="icon-daoru" size="30" color="rgba(51,51,51,0.5)"></uni-icons>
      </div>
      <div id="exportIcon" @click="emits('exportText')">
        <uni-icons custom-prefix="iconfont" type="icon-daochu" size="30" color="rgba(51,51,51,0.5)"></uni-icons>
      </div>
      <div id="scanIcon" @click="emits('qrCodeScan')">
        <uni-icons type="scan" color="rgba(51,51,51,0.4)" size="30"></uni-icons>
      </div>
      <div id="scanIcon"  @click="toolBoxShow = false">
        <uni-icons type="forward" color="rgba(51,51,51,0.4)" size="30"></uni-icons>
      </div>
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
const toolBoxShow = ref<boolean>(false)
const props = defineProps({
  pwListLength: {
    type: Number
  }
})
const emits = defineEmits(['qrCodeScan', 'qrCodeGen', 'importText', 'exportText'])
</script>

<style lang="scss">
$shadow1: 3px 4px 12px 3px rgba(111, 109, 133, 0.09);
#zhanwei {
  width: 100%;
  height: 0.8em;
}
#showToolBox {
  width: 25px;
  height: 25px;
  position: absolute;
  top: 5%;
  right: 5%;
  z-index: 666;
}
#tool-box {
  width: 80%;
  height: 30px;
  position: absolute;
  top: 5%;
  right: 5%;
  z-index: 600;
  background: rgba(51, 51, 51, 0.1);
  border-radius: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
#content-box {
  width: 92%;
  height: 20%;
  // box-shadow: 0 0 0 1px rgba(51, 51, 51, 0.3);
  box-shadow: $shadow1, 0 0 0 0.3px rgba(51, 51, 51, 0.5);
  margin: 0 auto;
  margin-bottom: 1em;
  border-radius: 25px;
  background: rgba(218, 218, 224, 0.9);
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
    box-shadow: 0 0 0 0.9px rgba(255, 255, 255, 1);
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
