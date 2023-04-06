<template>
  <div id="add-button">
    <uni-icons type="plusempty" color="rgba(255,255,255,0.7)" size="35" @click="showInsert"></uni-icons>
  </div>
  <!-- <div> -->
  <search-box :pwListLength="pwLength" @qrCodeScan="qrCodeScan" @qrCodeGen="qrCodeGen" @importText="importText" @exportText="exportText"></search-box>
  <insert-pw v-if="insertShow" @closeBox="insertShow = false" @subInsert="subInsertPW" ref="insertBox"></insert-pw>
  <pw-list :pwList="pwListData" @delPW="deletePW" @editPW="editCurPW" @infoWarn="infoShow"></pw-list>
  <!-- </div> -->
  <uni-popup ref="popup" type="message">
    <uni-popup-message type="info" :message="msg" :duration="1500"></uni-popup-message>
  </uni-popup>
  <!-- 显示扫码 -->
  <div id="qrcodeBox" v-if="qrcodeShow">
    <canvas id="qrcode" canvas-id="qrcode" style="width: 300px; height: 300px" />
    <div id="notice">请截图保存后，进行扫描导入</div>
  </div>
  <!-- 显示导入 -->
  <div id="importBox" v-if="importShow">
    <textarea name="" id="" maxlength="-1" v-model.trim="importValue"></textarea>

    <div id="notice1" @click="exeImportText(importValue)">文本导入</div>
  </div>
  <!-- 显示导出 -->
  <div id="exportBox" v-if="exportShow">
    <div id="export-text" v-copy="exportPWText">{{ exportPWText }}</div>
    <div id="notice2" v-copy="exportPWText">文本导出，点击可复制</div>
  </div>
  <uni-popup ref="popupConfirm" type="dialog">
    <uni-popup-dialog mode="base" type="info" :content="msgConfirm" :duration="2000" :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
  </uni-popup>
  <div id="cover" v-if="coverShow" @click="showOff"></div>
</template>

<script setup lang="ts">
import { onReady } from '@dcloudio/uni-app'
import { ref, reactive, watch, getCurrentInstance, onMounted } from 'vue'
import searchBox from '/src/components/search-box/index.vue'
import insertPw from '/src/components/insert-pw/index.vue'
import pwList from '/src/components/pw-list/index.vue'

const insertShow = ref<boolean>(false)
const { proxy } = getCurrentInstance()

const pwLength = ref<number>(0)
const qrcodeShow = ref<boolean>(false)
const importShow = ref<boolean>(false)
const exportShow = ref<boolean>(false)
const coverShow = ref<boolean>(false)
const exportPWText = ref<string>('')
const importValue = ref<string>('')
const curInsertType = ref<boolean>(false)
const insertBox = ref(null)
const curPW = ref<number>(0)
const showOff = function () {
  coverShow.value = false
  qrcodeShow.value = false
  importShow.value = false
  exportShow.value = false
}
// 用文本导入
const importText = function () {
  coverShow.value = true
  importShow.value = true
  uni.getClipboardData({
    success: function (res) {
      infoShow('读取剪贴板成功')
      importValue.value = res.data
    }
  })
}
// 显示密码添加组件
const showInsert = function () {
  curInsertType.value = false
  insertShow.value = true
}

// 执行导入
const exeImportText = function (valueStr: string) {
  if (valueStr !== '' && valueStr !== null) {
    try {
      let num: Array<Array<string>> = decodeText(valueStr)
      num.forEach((o, i) => {
        let ids = pwListData.length == 0 ? 1 : pwListData[pwListData.length - 1].id + 1
        const obj: object = {
          id: ids,
          describe: o[0],
          userName: o[1],
          password: o[2],
          level: 3,
          active: false,
          createDate: getCreateDate()
        }
        pwListData.push(obj)
      })
      infoShow('导入成功')
    } catch (e) {
      console.log(e)
      infoShow('发生未知错误')
    }
  }
}

// 导出文本
const exportText = function () {
  coverShow.value = true
  exportShow.value = true
  exportPWText.value = generateText()
}
// 密码列表
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
  try {
    if (!curInsertType.value) {
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
      infoShow("添加成功")
    } else {
      pwListData[curPW.value].describe = e.describe
      pwListData[curPW.value].userName = e.userName
      pwListData[curPW.value].password = proxy.$AES_Encrypt(e.password)
      infoShow("修改成功")
    }
    insertShow.value = false
  } catch (e) {
    console.log(e)
    infoShow('发生未知错误')
  }
}

// 二维码生成
const genQrcode = function (text: string) {
  try {
    proxy.$uqrcode.make({
      canvasId: 'qrcode',
      componentInstance: this,
      text: text,
      size: 300,
      margin: 0,
      backgroundColor: '#ffffff',
      foregroundColor: '#000000',
      fileType: 'jpg',
      errorCorrectLevel: proxy.$uqrcode.errorCorrectLevel.H,
      success: (res) => {
        infoShow('二维码生成成功')
      },
      fail() {
        infoShow('二维码生成失败')
      }
    })
  } catch (error) {
    console.log(error)
    infoShow('发生未知错误，生成失败，请使用文本导入')
  }
}
// 二维码生成
const qrCodeGen = function () {
  coverShow.value = true
  qrcodeShow.value = true
  let tempStr: string = generateText()
  genQrcode(tempStr)
}

// 生成文本函数
const generateText = function (): string {
  try {
    let tempListStr: string = ''
    pwListData.forEach((o, i) => {
      let tempStr: string = `${o.describe}@${o.userName}@${o.password}|`
      if (pwListData.length - 1 === i) {
        tempStr = `${o.describe}@${o.userName}@${o.password}`
      }
      tempListStr += tempStr
    })
    // console.log(decodeText(tempListStr))
    return tempListStr
  } catch (e) {
    console.log(e)
    infoShow('发生未知错误')
    return ''
  }
}
// 解析字符函数
const decodeText = function (str: string): Array<Array<string>> {
  let num: Array<Array<string>> = []
  str.split('|').forEach((o) => {
    let temp: Array<string> = o.split('@')
    if (temp) num.push(temp)
  })
  return num
}

// 二维码扫描
const qrCodeScan = function (e: any) {
  try {
    uni.scanCode({
      success: function (res) {
        infoShow('扫描成功')
        exeImportText(res.result)
      },
      fail() {
        infoShow('扫描失败')
      }
    })
  } catch (error) {
    console.log(error)
    infoShow('发生未知错误')
  }
}
// 确认框操作
let close = function () {
  infoShow('取消')
  popupConfirm.value && popupConfirm.value.close()
}
let confirm = function () {
  infoShow('确认')
  popupConfirm.value && popupConfirm.value.close()
}
// 删除密码
const deletePW = function (e: number) {
  try {
    confirmShow('确定要<删除>此密码吗')
    close = () => {
      infoShow('取消删除')
      popupConfirm.value && popupConfirm.value.close()
    }
    confirm = () => {
      pwListData.splice(e, 1)
      popupConfirm.value && popupConfirm.value.close()
      infoShow('删除成功')
    }
  } catch (e) {
    console.log(e)
    infoShow('发生未知错误')
  }
}

// 编辑密码
const editCurPW = function (e: number) {
  try {
    confirmShow('确定要<修改>此密码吗')
    close = () => {
      infoShow('取消修改')
      popupConfirm.value && popupConfirm.value.close()
    }
    confirm = () => {
      infoShow('确认修改')
      curInsertType.value = true
      insertShow.value = true
      setTimeout(() => {
        insertBox.value.addFormData.describe = pwListData[e].describe
        insertBox.value.addFormData.userName = pwListData[e].userName
        insertBox.value.addFormData.password = proxy.$AES_Decrypt(pwListData[e].password)
      }, 20)
      curPW.value = e
      popupConfirm.value && popupConfirm.value.close()
    }
  } catch (error) {
    console.log(error)
  }
}
// 弹出层
const popup = ref<any>(null)
const popupConfirm = ref<any>(null)
const msg = ref<string>('')
const msgConfirm = ref<string>('')
const infoShow = function (value: string) {
  msg.value = value
  popup.value && popup.value.open()
}
const confirmShow = function (value: string) {
  msgConfirm.value = value
  popupConfirm.value && popupConfirm.value.open()
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
// 自定义复制指令
const vCopy = {
  mounted: (el: any, { value }: any) => {
    el.$value = value
    el.handler = () => {
      if (!el.$value) {
        infoShow('内容为空')
        return
      }
      uni.setClipboardData({
        data: el.$value,
        success() {
          infoShow('复制成功')
        },
        fail() {
          infoShow('复制失败')
        },
        showToast: false
      })
    }
    //绑定事件
    el.addEventListener('click', el.handler)
  },
  //当传进来的值更新的时候触发
  updated(el, { value }) {
    el.$value = value
  },
  //指令与元素解绑的时候
  unMounted(el) {
    el.removeEventListener('click', el.handler)
  }
}
</script>

<style lang="scss">
$shadow1: 3px 4px 12px 3px rgba(111, 109, 133, 0.09);
#cover {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(51, 51, 51, 0.13);
  z-index: 666;
}
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
#qrcodeBox {
  width: 92%;
  height: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 1);
  box-shadow: $shadow1;
  border-radius: 16px;
  z-index: 6666;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'ceyy';
  overflow: hidden;

  #notice {
    width: 90%;
    height: 30px;
    position: absolute;
    bottom: 0%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(51, 51, 51, 0.7);
    box-shadow: $shadow1;
    border-radius: 16px;
    z-index: 6666;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(255, 255, 255, 0.8);
  }
}
#importBox {
  width: 92%;
  height: 400px;
  position: absolute;
  top: 46%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 1);
  box-shadow: $shadow1;
  border-radius: 16px;
  z-index: 6666;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'ceyy';
  overflow: hidden;

  #notice1 {
    width: 90%;
    height: 30px;
    position: absolute;
    bottom: 0%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(51, 51, 51, 0.7);
    box-shadow: $shadow1;
    border-radius: 16px;
    z-index: 6666;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(255, 255, 255, 0.8);
  }
  textarea {
    width: 90%;
    height: 75%;
    border-radius: 16px;
    box-shadow: 0 0 0 0.9px rgba(51, 51, 51, 0.4);
    padding: 2em;
    margin-bottom: 3em;
  }
}
#exportBox {
  width: 92%;
  height: 300px;
  position: absolute;
  top: 44%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 1);
  box-shadow: $shadow1;
  border-radius: 16px;
  z-index: 6666;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'ceyy';

  #export-text {
    width: 90%;
    height: 70%;
    word-break: break-all;
    overflow: hidden;
    margin-bottom: 1em;
  }
  #notice2 {
    width: 90%;
    height: 30px;
    position: absolute;
    bottom: 0%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(51, 51, 51, 0.7);
    box-shadow: $shadow1;
    border-radius: 16px;
    z-index: 6666;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(255, 255, 255, 0.8);
  }
}
</style>
