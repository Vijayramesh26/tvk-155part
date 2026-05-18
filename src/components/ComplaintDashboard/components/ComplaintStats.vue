<template>
  <v-row class="mb-8">
    <v-col cols="12" sm="6" md="3">
      <v-card class="premium-card pa-4 d-flex align-items-center justify-space-between h-100 border-l-4 border-maroon">
        <div>
          <div class="text-caption font-weight-bold text-uppercase text-grey-darken-1 mb-1">
            {{ t.dashboard.stats.total }}
          </div>
          <div class="text-h3 font-weight-black text-maroon tamil-title">
            {{ total }}
          </div>
        </div>
        <v-avatar size="56" color="rgba(128, 0, 0, 0.1)" class="rounded-lg">
          <v-icon size="32" color="primary">mdi-file-document-multiple</v-icon>
        </v-avatar>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="3">
      <v-card class="premium-card pa-4 d-flex align-items-center justify-space-between h-100 border-l-4 border-success">
        <div>
          <div class="text-caption font-weight-bold text-uppercase text-grey-darken-1 mb-1">
            {{ t.dashboard.stats.resolved }}
          </div>
          <div class="text-h3 font-weight-black text-success tamil-title">
            {{ resolved }}
          </div>
        </div>
        <v-avatar size="56" color="rgba(40, 167, 69, 0.1)" class="rounded-lg">
          <v-icon size="32" color="success">mdi-check-all</v-icon>
        </v-avatar>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="3">
      <v-card class="premium-card pa-4 d-flex align-items-center justify-space-between h-100 border-l-4 border-warning">
        <div>
          <div class="text-caption font-weight-bold text-uppercase text-grey-darken-1 mb-1">
            {{ t.dashboard.stats.inProgress }}
          </div>
          <div class="text-h3 font-weight-black text-warning tamil-title">
            {{ inProgress }}
          </div>
        </div>
        <v-avatar size="56" color="rgba(255, 193, 7, 0.1)" class="rounded-lg">
          <v-icon size="32" color="warning">mdi-progress-wrench</v-icon>
        </v-avatar>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="3">
      <v-card class="premium-card pa-4 d-flex align-items-center justify-space-between h-100 border-l-4 border-error">
        <div>
          <div class="text-caption font-weight-bold text-uppercase text-grey-darken-1 mb-1">
            {{ t.dashboard.stats.pending }}
          </div>
          <div class="text-h3 font-weight-black text-error tamil-title">
            {{ pending }}
          </div>
        </div>
        <v-avatar size="56" color="rgba(220, 53, 69, 0.1)" class="rounded-lg">
          <v-icon size="32" color="error">mdi-clock-alert</v-icon>
        </v-avatar>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { useComplaintStore } from "../../../store/complaintStore";
import { translations } from "../../../translations";

export default {
  name: "ComplaintStats",
  computed: {
    store() {
      return useComplaintStore();
    },
    lang() {
      return this.store.language;
    },
    t() {
      return translations[this.lang] || translations.ta;
    },
    total() {
      return this.store.totalComplaints;
    },
    resolved() {
      return this.store.resolvedCount;
    },
    inProgress() {
      return this.store.inProgressCount;
    },
    pending() {
      return this.store.pendingCount;
    },
  },
};
</script>

<style scoped>
.border-l-4 {
  border-left-width: 4px !important;
  border-left-style: solid !important;
}
.border-maroon {
  border-left-color: var(--tvk-maroon) !important;
}
.border-success {
  border-left-color: #28a745 !important;
}
.border-warning {
  border-left-color: #ffc107 !important;
}
.border-error {
  border-left-color: #dc3545 !important;
}
.text-maroon {
  color: var(--tvk-maroon) !important;
}
.text-success {
  color: #28a745 !important;
}
.text-warning {
  color: #d39e00 !important;
}
.text-error {
  color: #dc3545 !important;
}
</style>
