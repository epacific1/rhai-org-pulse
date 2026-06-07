import { defineAsyncComponent } from 'vue'

export const routes = {
  'overview': defineAsyncComponent(() => import('./views/OverviewView.vue')),
  'reports': defineAsyncComponent(() => import('./views/ReportsView.vue')),
}
