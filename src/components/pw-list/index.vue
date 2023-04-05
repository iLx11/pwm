<template>
  <!-- <div> -->
    <div id="show-real-pw">
      <div id="levelChange" v-if="levelShow">
        <div @click="changeLevel(1)">1</div>
        <div @click="changeLevel(2)">2</div>
        <div @click="changeLevel(3)">3</div>
      </div>
      <div id="show-pw-box">
        <div id="show-pw-user" v-copy="curCode.userName">
          {{ curCode.userName }}
        </div>
        <div id="show-pw-password" v-copy="curCode.password">
          {{ curCode.password }}
        </div>
      </div>
      <div id="show-button" @click="showLevelBox">
        <div>{{ curCode.level }}</div>
      </div>
    </div>
    <!-- 密码列表 -->
    <ul class="showList" :style="{height: listHeight}">
      <li :class="{ showpwList: true, pwBorder: v.active }" v-for="(v, k) in pwList" :key="v.id" @click="pwActive(k)">
        <div class="show-desc">
          {{ v.describe }}
        </div>
        <div class="showData">
          <div class="show-data">
            <div class="show-level">level: {{ v.level }}</div>
            <div class="show-date">{{ v.createDate }}</div>
          </div>
        </div>
        <div id="del-pw">
          <uni-icons @click="emits('delPW', k)" type="clear" color="rgba(51,51,51,0.2)" size="25"></uni-icons>
        </div>
        <div id="edit-pw">
          <uni-icons @click="emits('editPW', k)" type="settings-filled" color="rgba(51,51,51,0.2)" size="25"></uni-icons>
        </div>
      </li>
    </ul>
   
  <!-- </div> -->
</template>

<script setup="props, { emit }" lang="ts">
import { ref, reactive, onMounted, getCurrentInstance, watch} from 'vue'

interface CurCode {
  userName: string
  password: string
  level: number
}
// 设置高度
const listHeight = ref<string>('')
onMounted(() => {
  const cheight: number = uni.getSystemInfoSync().windowHeight
  listHeight.value = cheight * 0.54 + 'px'
})
const props = defineProps({
  pwList: {
    type: Array
  }
})
const emits = defineEmits(['delPW', 'editPW', 'infoWarn'])
const { proxy } = getCurrentInstance()
const levelShow = ref<boolean>(false)
const pwListLength = ref<number>(0)
const pwList: object[] = props.pwList

// 更改密码等级
const changeLevel = function (level: number) {
  if (pwList) {
    for (let i = 0; i < pwList.length; i++) {
      if (pwList[i].active === true) {
        if (parseInt(pwList[i].level) === level) break
        let compareNum: number = parseInt(pwList[i].level) > level ? 1 : 0
        pwList[i].level = level
        // pwList[i].level = "2"
        sortList(compareNum, i)
      }
    }
  }
  levelShow.value = false
}

// 重新排列密码数组
// 交换算法，有待改进
const sortList = function (isUp: number, cur: number) {
  // 说明是往前走
  if (isUp) {
    for (let i = cur - 1; i >= 0; i--) {
      if (parseInt(pwList[i + 1].level) < parseInt(pwList[i].level)) {
        const temp = pwList[i]
        pwList[i] = pwList[i + 1]
        pwList[i + 1] = temp
        // 当前列表选中的密码
        curListKey.value = i
      }
    }
  } else {
    for (let i = cur + 1; i < pwList.length; i++) {
      if (parseInt(pwList[i - 1].level) > parseInt(pwList[i].level)) {
        const temp = pwList[i]
        pwList[i] = pwList[i - 1]
        pwList[i - 1] = temp
        // 当前列表选中的密码
        curListKey.value = i
      }
    }
  }
}

// 记录当前显示的key
const curListKey = ref<number>(0)
// 密码点击对应显示
const pwActive = function (k: number) {
  if (pwList[k].active === false) {
    for (let i = 0; i < pwList.length; i++) {
      pwList[i].active = false
    }
    pwList[k].active = true
    curListKey.value = k
    curCode.userName = pwList[k].userName
    curCode.password = proxy.$AES_Decrypt(pwList[k].password)
    curCode.level = pwList[k].level
  } else {
    pwList[k].active = false
    curCode.userName = curCode.password = curCode.level = ''
    levelShow.value = false
  }
}
// 当前显示的对象
const curCode = reactive<CurCode>({
  userName: 'user',
  password: 'password',
  level: ''
})
// 显示更改密码等级的组件
const showLevelBox = function () {
  if (curCode.level !== 0) levelShow.value = true
}
// 监听密码等级的修改
watch(
  () => pwList[curListKey.value].level,
  (newV, oldV) => {
    curCode.level = pwList[curListKey.value].level
  }
)


// 自定义复制指令
const vCopy = {
  mounted: (el: any, { value }: any) => {
    el.$value = value
    el.handler = () => {
      if (!el.$value) {
        emits('infoWarn','内容为空')
        return
      }
      uni.setClipboardData({
        data: el.$value,
        success() {
          emits('infoWarn',"复制成功")
        },
        fail() {
          emits('infoWarn',"复制失败")
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
.pwBorder {
  box-shadow: 0 0 0 1.2px rgba(51, 51, 51, 0.3) !important;
}
#del-pw {
  width: 27px;
  height: 27px;
  position: absolute;
  top: 3%;
  right: 3%;
}
#edit-pw {
  width: 27px;
  height: 27px;
  position: absolute;
  bottom: 7%;
  right: 3%;
}
#levelChange {
  width: 100%;
  height: 100%;
  background: rgba(51, 51, 51, 0.14);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.4em;
  z-index: 666;
  div {
    width: 23%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-end;
    box-shadow: $shadow1, 0 0 0 0.23px rgba(51, 51, 51, 0.2);
    border-radius: 12px;
    padding: 0.1em;
    position: relative;
    background: rgba(255, 255, 255, 1);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    color: rgba(51, 51, 51, 0.6);
  }
}
#show-real-pw {
  width: 92%;
  height: 90px;
  margin: 0 auto;
  margin-bottom: 0.9em;
  border-radius: 12px;
  background: rgba(237, 242, 241, 1);
  box-shadow: $shadow1, 0 0 0 0.23px rgba(51, 51, 51, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'ceyy';
  padding: 0.4em;
  position: relative;
  overflow: hidden;
  #show-pw-box {
    width: 70%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 0.2em;
    font-size: 20px;
    color: rgba(51, 51, 51, 0.8);
    div {
      width: 100%;
      height: 40%;
      text-align: center;
      line-height: 100%;
      overflow: scroll;
    }
  }
  #show-button {
    width: 23%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-end;
    box-shadow: $shadow1, 0 0 0 0.23px rgba(51, 51, 51, 0.2);
    border-radius: 12px;
    padding: 0.1em;
    position: relative;
    div:nth-child(1) {
      width: 100%;
      height: 40%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 26px;
      color: rgba(51, 51, 51, 0.4);
      z-index: 66;
    }
  }
}
.showList {
  width: 100%;
  height: 300px;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  // align-items: flex-start;
  padding: 0 0.9em;
  font-family: 'ceyy';
  color: rgba(51, 51, 51, 0.9);
  overflow: scroll;
  li {
    width: 48.5%;
    height: 120px;
    background: rgba(255, 255, 255, 1);
    margin-bottom: 0.7em;
    margin-top: 0.2em;
    border-radius: 16px;
    box-shadow: $shadow1, 0 0 0 0.23px rgba(51, 51, 51, 0.2);
    padding: 0.5em;
    position: relative;

    // flex-grow: 0.2;
    .show-desc {
      width: 100%;
      height: 70%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 23px;
      text-align: center;
      word-break: break-all;
      padding: 0.3em;
      overflow: hidden;
    }
    .show-level,
    .show-data {
      width: 100%;
      height: 10%;
      text-align: center;
      font-size: 13px;
    }
  }
}
</style>
