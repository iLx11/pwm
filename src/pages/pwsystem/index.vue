<template>
  <div id="add-button">
    <uni-icons type="plusempty" color="rgba(255,255,255,0.7)" size="35" @click="showInsert"></uni-icons>
  </div>
  <!-- <div> -->
  <search-box :pwListLength="pwLength" @qrCodeScan="qrCodeScan"></search-box>
  <insert-pw v-if="insertShow" @closeBox="insertShow = false" @subInsert="subInsertPW"></insert-pw>
  <pw-list :pwList="pwListData" @delPW="deletePW" @editPW="editCurPW" @infoWarn="infoShow"></pw-list>
  <!-- </div> -->
  <uni-popup ref="popup" type="message">
    <uni-popup-message type="info" :message="msg" :duration="1500"></uni-popup-message>
  </uni-popup>
  <div id="qrcode">
    <canvas id="qrcode" canvas-id="qrcode" style="width: 300px; margin: 0 auto; height: 300px" />
  </div>
</template>

<script setup lang="ts">
import { onReady } from '@dcloudio/uni-app'
import { ref, reactive, watch, getCurrentInstance, onMounted } from 'vue'
import searchBox from '/src/components/search-box/index.vue'
import insertPw from '/src/components/insert-pw/index.vue'
import pwList from '/src/components/pw-list/index.vue'

const insertShow = ref<boolean>(false)
const { proxy } = getCurrentInstance()
const showInsert = function () {
  insertShow.value = true
}

const pwLength = ref<number>(0)
const pwListData = reactive<object[]>([
  {
    id: 1,
    describe: '1',
    userName: '1',
    password: '12hgfdgh3',
    level: 1,
    active: false,
    createDate: '2000.12.12'
  },
  {
    id: 2,
    describe: '2',
    userName: '2',
    password: '12hgfdgh3',
    level: 1,
    active: false,
    createDate: '2000.12.12'
  },
  {
    id: 3,
    describe: '3',
    userName: '3',
    password: '12hgfdgh3',
    level: 1,
    active: false,
    createDate: '2000.12.12'
  },
  {
    id: 4,
    describe: '3',
    userName: '3',
    password: '12hgfdgh3',
    level: 1,
    active: false,
    createDate: '2000.12.12'
  },
  {
    id: 5,
    describe: '3',
    userName: '3',
    password: '12hgfdgh3',
    level: 1,
    active: false,
    createDate: '2000.12.12'
  }
])
// 提交添加密码
const subInsertPW = function (e: object) {
  console.log(e.describe)
  let ids = pwListData.length == 0 ? 1 : pwListData[pwListData.length - 1].id + 1
  const obj: object = {
    id: ids,
    describe: e.describe,
    userName: e.userName,
    password: proxy.$AES_Encrypt(e.password),
    level: 3,
    active: false,
    createDate: getCreateDate()
  }
  pwListData.push(obj)
}
onReady(() => {})

// 二维码生成
const genQrcode = function (text: string) {
  proxy.$uqrcode.make({
    canvasId: 'qrcode',
    componentInstance: this,
    text: text,
    size: 100,
    margin: 0,
    backgroundColor: '#ffffff',
    foregroundColor: '#000000',
    fileType: 'jpg',
    errorCorrectLevel: proxy.$uqrcode.errorCorrectLevel.H,
    success: (res) => {
      infoShow("二维码生成成功")
    }
  })
}

// 二维码扫描
const qrCodeScan = function (e: any) {
  console.log(12312)
  uni.scanCode({
    success: function (res) {
      infoShow('扫描成功')
      const tempList: Array<object> = JSON.parse(res.result)
      for (let i = 0; i < tempList.length; i++) {
        pwListData.push(tempList[i])
      }
    },
    fail() {
      infoShow('扫描失败')
    }
  })
}
const deletePW = function (e: number) {
  console.log(e)
}
const editCurPW = function (e: number) {
  console.log(e)
}
// 弹出层
const popup = ref<any>(null)
const msg = ref<string>('')
const infoShow = function (value: string) {
  msg.value = value
  popup.value && popup.value.open()
}
// 获取创建时间
const getCreateDate = function () {
  let date = new Date()
  let date_month: number = date.getMonth() + 1
  let date_day: number = date.getDate()
  const mouthStr: string = date_month > 10 ? date_month.toString() : '0' + date_month.toString()
  const dayStr: string = date_day > 10 ? date_day.toString() : '0' + date_day.toString()
  return `${date.getFullYear()}-${mouthStr}-${dayStr}`
}
// 密码数组长度的监听
watch(
  () => pwListData.length,
  () => {
    pwLength.value = pwListData.length
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss">
$shadow1: 3px 4px 12px 3px rgba(111, 109, 133, 0.09);

#add-button {
  width: 55px;
  height: 55px;
  position: fixed;
  bottom: 10%;
  right: 10%;
  background: rgba(51, 51, 51, 0.5);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: $shadow1;
  z-index: 665;
}
</style>
