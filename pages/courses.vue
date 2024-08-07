<script lang="ts" setup>
import { ref, watch } from 'vue'
import ElectiveInput from '~/components/shared/Elective/ElectiveInput.vue'
import ClearedNotification from '~/components/shared/Notification/ClearedNotification.vue'
import SavedNotification from '~/components/shared/Notification/SavedNotification.vue'
import Heading from '~/components/shared/Text/Heading.vue'
import * as api from '~/server/utils/api'
import type { CourseCodename } from '~/server/utils/schemas'
import SwitchBox from '~/components/widgets/SwitchBox.vue'
import ElectiveInputDatalist from '~/components/shared/Elective/ElectiveInputDatalist.vue'

interface ElectiveData {
  codename: CourseCodename
  full_name: string
  short_name: string
  description: string
  instructor: string
  min_overall: number
  max_overall: number
  low_in_group: number
  high_in_group: number
  max_in_group: number
  groups: string[]
}

const currentElective = ref<string | null>(null)
const electiveData = ref<{ [key: string]: ElectiveData }>({})
const notificationOkVisible = ref(false)
const notificationOkMessage = ref('')
const notificationClearVisible = ref(false)
const notificationClearMessage = ref('')
const notificationDeleteVisible = ref(false)

const switchBoxDisabled = ref(false)
const currentBlock = ref('block1')

const groupTypes = ['First year', 'Second year', 'First & Second years']

const handleElectiveChange = (elective: string) => {
  currentElective.value = elective
  full_name.value = elective
}

const handleCourseSelected = (course: ElectiveData) => {
  codename.value = course.codename
  full_name.value = course.full_name
  short_name.value = course.short_name
  instructor.value = course.instructor
  min_overall.value = course.min_overall
  max_overall.value = course.max_overall
  low_in_group.value = course.low_in_group
  high_in_group.value = course.high_in_group
  max_in_group.value = course.max_in_group
  description.value = course.description
  groups.value = course.groups
}

const handleBlockChange = (block: string) => {
  currentBlock.value = block
}

const transformGroups = (group: groups.value) => {
  let transformedGroups: string[] = []

  if (groups.value.includes('First')) {
    transformedGroups.push('year 1')
  }
  if (groups.value.includes('Second')) {
    transformedGroups.push('year 2')
  }

  return transformedGroups
}

const codename = ref('')
const full_name = ref('')
const short_name = ref('')
const instructor = ref('')
const min_overall = ref<number>(0)
const max_overall = ref<number>(0)
const low_in_group = ref<number>(0)
const high_in_group = ref<number>(0)
const max_in_group = ref<number>(0)
const description = ref('')
const groups = ref([''])

const handleSave = async () => {
  if (currentElective.value) {
    electiveData.value[currentElective.value] = {
      codename: codename.value,
      full_name: full_name.value,
      short_name: short_name.value,
      instructor: instructor.value,
      min_overall: min_overall.value,
      max_overall: max_overall.value,
      low_in_group: low_in_group.value,
      high_in_group: high_in_group.value,
      max_in_group: max_in_group.value,
      description: description.value,
      groups: groups.value
    }

    const type = currentBlock.value === 'block1' ? 'tech' : 'hum'

    await api.postCourses(
      {
        codename: codename.value,
        type: type,
        full_name: full_name.value,
        short_name: short_name.value,
        instructor: instructor.value,
        min_overall: min_overall.value,
        max_overall: max_overall.value,
        low_in_group: low_in_group.value,
        high_in_group: high_in_group.value,
        max_in_group: max_in_group.value,
        description: description.value,
        groups: transformGroups(groups.value)
      },
      type
    )

    notificationOkMessage.value = 'Saved successfully'
    notificationOkVisible.value = true
    switchBoxDisabled.value = true
    setTimeout(() => {
      notificationOkVisible.value = false
      switchBoxDisabled.value = false
    }, 2000)
  }
}

const handleClear = () => {
  if (currentElective.value) {
    full_name.value = ''
    short_name.value = ''
    instructor.value = ''
    min_overall.value = 0
    max_overall.value = 0
    low_in_group.value = 0
    high_in_group.value = 0
    max_in_group.value = 0
    description.value = ''
    groups.value = ['']

    electiveData.value[currentElective.value] = {
      codename: '',
      full_name: '',
      short_name: '',
      instructor: '',
      min_overall: 0,
      max_overall: 0,
      low_in_group: 0,
      high_in_group: 0,
      max_in_group: 0,
      description: '',
      groups: []
    }

    notificationClearMessage.value = 'Cleared successfully'
    notificationClearVisible.value = true
    setTimeout(() => {
      notificationClearVisible.value = false
    }, 2000)
  }
}

const handleToggleDeleteMode = (isDeleting: boolean) => {
  notificationDeleteVisible.value = isDeleting
}

watch(currentElective, (newElective) => {
  if (newElective && electiveData.value[newElective]) {
    const data = electiveData.value[newElective]
    codename.value = data.codename
    full_name.value = data.full_name
    short_name.value = data.short_name
    instructor.value = data.instructor
    min_overall.value = data.min_overall
    max_overall.value = data.max_overall
    low_in_group.value = data.low_in_group
    high_in_group.value = data.high_in_group
    max_in_group.value = data.max_in_group
    description.value = data.description
    groups.value = data.groups
  } else {
    codename.value = ''
    full_name.value = ''
    short_name.value = ''
    instructor.value = ''
    min_overall.value = 0
    max_overall.value = 0
    low_in_group.value = 0
    high_in_group.value = 0
    max_in_group.value = 0
    description.value = ''
    groups.value = ['']
  }
})
</script>

<template>
  <main
    class="flex min-w-full flex-col items-center gap-12 tablet:max-w-screen-tablet desktop:max-w-screen-desktop"
  >
    <Heading text="Electives" />
    <div class="flex h-auto w-full items-center justify-around tablet:flex-col laptop:flex-row">
      <div class="flex flex-col items-center self-stretch tablet:w-full laptop:w-1/2">
        <SwitchBox
          :disabled="switchBoxDisabled"
          @block-change="handleBlockChange"
          @course-selected="handleCourseSelected"
          @elective-change="handleElectiveChange"
          @toggle-delete-mode="handleToggleDeleteMode"
        />
      </div>
      <div
        class="flex min-h-full flex-col items-center gap-8 self-start tablet:w-full laptop:w-1/2"
      >
        <h2 class="text-3xl font-semibold">Options</h2>
        <form
          class="flex h-full w-full flex-col items-center gap-4 self-stretch"
          @submit.prevent="handleSave"
        >
          <div class="flex min-h-full w-full flex-col items-center gap-6 self-stretch">
            <div class="flex flex-col items-center gap-6">
              <ElectiveInput
                id="codename"
                v-model="codename"
                headerName="Course codename"
                placeholder="Codename"
              />
              <ElectiveInput
                id="full-name"
                v-model="full_name"
                headerName="Course full name"
                placeholder="Full name"
              />
              <ElectiveInput
                id="short-name"
                v-model="short_name"
                headerName="Course short name"
                placeholder="Short name"
              />
              <ElectiveInputDatalist
                id="group"
                v-model="groups"
                :options="groupTypes"
                headerName="Course groups"
                placeholder="Groups"
              />
              <ElectiveInput
                id="instructor-name"
                v-model="instructor"
                autocomplete="email"
                headerName="Instructor’s name"
                placeholder="Instructor’s name"
              />
              <ElectiveInput
                id="min-overall"
                v-model="min_overall"
                headerName="Minimum overall students"
                placeholder="Min overall"
                type="number"
              />
              <ElectiveInput
                id="max-overall"
                v-model="max_overall"
                headerName="Maximum overall students"
                placeholder="Max overall"
                type="number"
              />
              <ElectiveInput
                id="low-group"
                v-model="low_in_group"
                headerName="Lower number students in group"
                placeholder="Low in group"
                type="number"
              />
              <ElectiveInput
                id="high-group"
                v-model="high_in_group"
                headerName="Higher number students in group"
                placeholder="High in group"
                type="number"
              />
              <ElectiveInput
                id="max-group"
                v-model="max_in_group"
                headerName="Maximum students in course"
                placeholder="Enter maximum"
                type="number"
              />
            </div>
            <div class="flex flex-col items-center justify-around tablet:min-w-72 laptop:min-w-90">
              <label class="text-xl font-semibold" for="description">Course description</label>
              <textarea
                class="placeholder-p-4 placeholder-color-gray h-full w-full resize-none rounded-3xl bg-color-surface p-4 text-color-dark dark:placeholder-color-base"
                id="description"
                v-model="description"
                placeholder="Description"
                type="text"
              />
            </div>
          </div>
          <div class="flex flex-row items-center gap-4">
            <button
              class="rounded-xl bg-color-accent px-6 py-2.5 text-lg hover:opacity-75"
              type="submit"
            >
              Save changes
            </button>
            <button
              class="rounded-xl border border-color-text bg-transparent px-6 py-2.5 text-lg hover:opacity-75"
              @click="handleClear"
            >
              Clear fields
            </button>
          </div>
        </form>
      </div>
      <SavedNotification :message="notificationOkMessage" :visible="notificationOkVisible" />
      <ClearedNotification
        :message="notificationClearMessage"
        :visible="notificationClearVisible"
      />
      <ClearedNotification
        :message="'Delete mode active. Click to the elective you want delete'"
        :visible="notificationDeleteVisible"
      />
    </div>
  </main>
</template>

<style scoped></style>
