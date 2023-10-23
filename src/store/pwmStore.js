import { defineStore } from 'pinia'
import { ref } from 'vue'

export const pwmStore = defineStore('pwm-store', () => {
  const aa = ref(2323)
  const setAa = () => {
    aa.value = 234234
  }
  return {
    aa,
    setAa
    
  }
})