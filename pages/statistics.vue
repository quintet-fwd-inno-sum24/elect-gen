<script setup lang="ts">
import * as mathjs from 'mathjs'

const submittedCount = ref(1)
const submittedPercent = computed(() => {
  const totalStudents = 321
  return mathjs.round((100 * submittedCount.value) / totalStudents, 1)
})

const fileExtensions = ['xlsx', 'csv'] as const
</script>

<template>
  <main class="flex flex-col items-center">
    <h1 class="primary">{{ $t('appName') }}</h1>

    <span class="text-center">
      <i18n-t keypath="statistics.submitted.line1" :plural="submittedCount">
        <template #count>
          <b class="font-semibold">{{ submittedCount }}</b>
        </template>
        <template #percent>
          <b class="font-semibold">{{ `${submittedPercent}%` }}</b>
        </template>
      </i18n-t>
      <br />
      <i18n-t keypath="statistics.submitted.line2" :plural="submittedCount" />
    </span>

    <div class="flex flex-col items-center">
      <div class="flex flex-row">
        <UButton>{{ $t('statistics.download') }}</UButton>
        <USelectMenu v-model="selected" variant="none" :options="fileExtensions" />
      </div>
      <UButton variant="link">{{ $t('statistics.fill') }}</UButton>
    </div>

    <div class="border-primary-500 flex h-90 w-160 border-4 border-dashed"></div>
  </main>
</template>