<template>
  <div id="add-button">
    <uni-icons type="plusempty" color="rgba(255,255,255,0.7)" size="35" @click="showInsert"></uni-icons>
  </div>
  <search-box></search-box>
  <insert-pw v-if="insertShow" @closeBox="insertShow = false"></insert-pw>
  <pw-list></pw-list>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import searchBox from '/src/components/search-box/index.vue'
import insertPw from '/src/components/insert-pw/index.vue'
import pwList from '/src/components/pw-list/index.vue'

const insertShow = ref<boolean>(false)
const showInsert = function() {
  insertShow.value = true
}
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
}
</style>
