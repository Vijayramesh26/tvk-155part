<template>
  <div class="complaint-dashboard-main">
    <v-row class="justify-center mb-6">
      <v-col cols="12" class="text-center">
        <v-chip color="amber" variant="elevated" class="text-maroon font-weight-bold mb-2 uppercase px-4 py-1">
          <v-icon left size="18" class="mr-1">mdi-broadcast</v-icon>
          {{ t.dashboard.tag }}
        </v-chip>
        <h1 class="tamil-title text-h4 font-weight-black text-white mb-2 shadow-text">
          {{ t.dashboard.title }}
        </h1>
        <p class="text-body-1 text-grey-lighten-1 mb-0 max-w-2xl mx-auto font-weight-medium">
          {{ t.dashboard.subtitle }}
        </p>
      </v-col>
    </v-row>

    <!-- Top Statistics Cards -->
    <ComplaintStats />

    <!-- Filtering Bar -->
    <ComplaintFilter />

    <!-- Complaints Grid / List -->
    <ComplaintList />
  </div>
</template>

<script>
import ComplaintStats from "./components/ComplaintStats.vue";
import ComplaintFilter from "./components/ComplaintFilter.vue";
import ComplaintList from "./components/ComplaintList.vue";
import { useComplaintStore } from "../../store/complaintStore";
import { translations } from "../../translations";

export default {
  name: "ComplaintDashboardMain",
  components: {
    ComplaintStats,
    ComplaintFilter,
    ComplaintList,
  },
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
  },
  mounted() {
    this.store.fetchComplaints();
  },
};
</script>

<style scoped>
.text-maroon {
  color: var(--tvk-maroon) !important;
}
.max-w-2xl {
  max-width: 768px;
}
.shadow-text {
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}
</style>
