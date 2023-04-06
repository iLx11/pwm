<template>
  <div id="cover" @click="emits('closeBox')"></div>
  <!-- 添加密码 -->
  <div class="addPw">
    <div class="addInp">
      <div class="add-inp">
        <form :model="addFormData">
          <div id="insert-box">
            <input type="text" v-model="addFormData.describe" placeholder="密码描述" />
            <input type="text" v-model="addFormData.userName" placeholder="用户名" />
            <input type="text" v-model="addFormData.password" placeholder="密码" />
          </div>
        </form>
      </div>
      <div class="add-icon" @click="subInsert">
        <uni-icons type="plus-filled" color="rgba(51,51,51,0.28)" size="35"></uni-icons>
      </div>
    </div>
  </div>
</template>

<script setup="props, { emits }" lang="ts">
import { ref, reactive } from 'vue'
const emits = defineEmits(['closeBox', 'subInsert'])
const addFormData = reactive({
  describe: '',
  userName: '',
  password: ''
})
defineExpose({
  addFormData
})
const subInsert = function () {
  emits('subInsert', addFormData)
}

</script>
<style lang="scss">
$shadow1: 3px 4px 12px 3px rgba(111, 109, 133, 0.09);

/*添加密码开始*/
#cover {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(51, 51, 51, 0.23);
  z-index: 665;
}
.addPw {
  width: 92%;
  height: 220px;
  background: rgba(255, 255, 255, 1);
  box-shadow: $shadow1;
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  align-items: center;
  z-index: 666;
  font-family: 'ceyy';
}
.addInp {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-evenly;
  align-items: center;
  padding: 0.2em;
}

.add-inp {
  width: 78%;
  height: 100%;
  #insert-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-evenly;
    justify-items: center;
  }
}

.add-inp input {
  width: 100%;
  height: 24%;
  background: rgba(81, 132, 159, 0.06);
  border: none;
  border-radius: 12px;
  box-shadow: 0 0 0 0.23px rgba(51, 51, 51, 0.2);
  text-align: center;
  font-size: 18px;
  color: rgba(51, 51, 51, 0.7);
}

.add-inp input:nth-child(2) {
  background: rgba(171, 217, 201, 0.08);
}

.add-inp input:nth-child(3) {
  background: rgba(214, 164, 177, 0.08);
}

.add-icon {
  width: 16%;
  height: 88%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 3px 4px 12px 3px rgba(111, 109, 133, 0.09);
  border-radius: 12px 25px 25px 12px;
}
</style>
