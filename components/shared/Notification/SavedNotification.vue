<script lang="ts" setup>
import { defineProps } from 'vue'

const props = defineProps<{
  message: string
  visible: boolean
}>()
</script>

<template>
  <transition name="fade">
    <div
      class="absolute bottom-4 z-10 rounded-xl bg-color-accent p-5 text-color-dark"
      v-if="props.visible"
    >
      <p class="font-semibold text-color-text">{{ props.message }}</p>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0.1%;
}
</style>
