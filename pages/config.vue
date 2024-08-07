<script lang="ts" setup>
import Heading from '~/components/shared/Text/Heading.vue'
import * as api from '~/server/utils/api'

definePageMeta({ layout: false })

function clickById(id: string): void {
  document.getElementById(id)!.click()
}

function focusById(id: string): void {
  document.getElementById(id)!.focus()
}

async function updateCount(): Promise<void> {
  techCount.value = (await api.getStudents('tech'))?.length
  humCount.value = (await api.getStudents('hum'))?.length
}

const techCount = ref<number | undefined>()
const humCount = ref<number | undefined>()

const fileExtensions = ['xlsx', 'ods']
const extensionTech = ref(fileExtensions[0])
const extensionHum = ref(fileExtensions[0])

function checkExtension(): boolean {
  if (filepath.value === undefined) {
    return false
  }

  const types: string[] = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.oasis.opendocument.spreadsheet'
  ] as const

  return types.includes(browseButton.value!.files![0].type)
}

async function clickTech(): Promise<void> {
  await api.getExampleTable('tech', extensionTech.value as 'xlsx' | 'ods')
}

async function clickHum(): Promise<void> {
  await api.getExampleTable('hum', extensionHum.value as 'xlsx' | 'ods')
}

async function submit(): Promise<void> {
  await api.uploadTable(browseButton.value!.files![0])
  alert('Operation successful!')
}

const filepath = ref<string>()
const browseButton = ref<HTMLInputElement>()

onMounted(() => {
  browseButton.value = document.getElementById('browse') as HTMLInputElement

  updateCount()
})

useHead({
  title: 'Elect.Gen - Distribution page',
  meta: [{ name: 'description', content: 'Distribution main page' }]
})
</script>

<template>
  <NuxtLayout name="default">
    <Heading :level="2" text="Configure parameters" />

    <div class="flex flex-col items-center gap-2">
      <span class="font-semibold"> Download a template configuration </span>

      <div class="flex flex-row justify-center gap-4">
        <div />
        <div />

        <div class="flex flex-row">
          <UButton
            class="w-16 justify-center justify-self-center"
            :label="'Tech'"
            @click="clickTech"
          />

          <USelectMenu
            class="justify-self-start text-color-overlay"
            v-model="extensionTech"
            :arrow="{ placement: 'left-top' }"
            :options="fileExtensions"
            :ui="{ base: 'hover:cursor-pointer' }"
            default="xlsx"
            variant="none"
          />
        </div>
        <div class="flex flex-row">
          <UButton
            class="w-16 justify-center justify-self-center"
            :label="'Hum'"
            @click="clickHum"
          />

          <USelectMenu
            class="justify-self-start text-color-overlay"
            v-model="extensionHum"
            :arrow="{ placement: 'left-top' }"
            :options="fileExtensions"
            :ui="{ base: 'hover:cursor-pointer' }"
            default="xlsx"
            variant="none"
          />
        </div>
      </div>

      <UButton to="/courses" variant="link"> Edit course information here </UButton>
    </div>

    <UButton
      class="flex h-90 w-[40rem] flex-col items-center justify-evenly rounded-3xl border-4 border-dashed border-color-accent"
      @click="clickById('browse')"
      @focus="focusById('browse')"
      variant="ghost"
    >
      <h2 class="text-2xl font-semibold tablet:max-w-screen-tablet desktop:max-w-screen-desktop">
        {{ $t('distribute.form.heading') }}
      </h2>
      <div class="flex flex-row gap-16 text-gray-300">
        <Icon class="tablet:size-16 desktop:size-24" name="fa6-solid:table" />
        <Icon class="tablet:size-16 desktop:size-24" name="fa6-solid:file-excel" />
      </div>

      <UInput
        id="browse"
        v-model="filepath"
        :ui="{ base: 'hover:cursor-pointer' }"
        color="gray"
        type="file"
      />
    </UButton>

    <UButton v-if="checkExtension()" @click="submit"> Upload </UButton>
    <span v-else-if="filepath !== undefined">
      {{ $t('distribute.form.wrong-extension-error') }}
    </span>
  </NuxtLayout>
</template>
