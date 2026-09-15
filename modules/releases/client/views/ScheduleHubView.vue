<template>
  <div>
    <ScheduleView v-if="activeView === 'release-schedule'" @show-aipcc="showAipccMilestones" />
    <AipccMilestonesView v-else @show-schedule="showReleaseSchedule" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import ScheduleView from './ScheduleView.vue'
import AipccMilestonesView from './AipccMilestonesView.vue'

const RELEASE_SCHEDULE_HASH = '#/releases/schedule'
const AIPCC_MILESTONES_HASH = `${RELEASE_SCHEDULE_HASH}/aipcc`

function viewFromHash() {
  const path = (window.location.hash || '').split('?')[0].replace(/\/$/, '')
  return path === AIPCC_MILESTONES_HASH ? 'aipcc-milestones' : 'release-schedule'
}

const activeView = ref(viewFromHash())

function syncViewFromHash() {
  activeView.value = viewFromHash()
}

function showAipccMilestones() {
  activeView.value = 'aipcc-milestones'
  window.location.hash = AIPCC_MILESTONES_HASH
}

function showReleaseSchedule() {
  activeView.value = 'release-schedule'
  window.location.hash = RELEASE_SCHEDULE_HASH
}

onMounted(() => {
  window.addEventListener('hashchange', syncViewFromHash)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', syncViewFromHash)
})
</script>
