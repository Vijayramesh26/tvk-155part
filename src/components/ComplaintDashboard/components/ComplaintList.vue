<template>
  <div class="complaint-list-container">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="64" width="6"></v-progress-circular>
      <p class="text-maroon font-weight-bold mt-4">Loading data...</p>
    </div>

    <!-- Error State -->
    <v-alert v-else-if="errorMessage" type="error" variant="tonal" class="mb-6 font-weight-bold">
      {{ errorMessage }}
    </v-alert>

    <!-- Empty State -->
    <div v-else-if="complaints.length === 0" class="text-center py-12 premium-card rounded-lg pa-8">
      <v-avatar size="80" color="rgba(128,0,0,0.1)" class="mb-4">
        <v-icon size="40" color="primary">mdi-text-box-search-outline</v-icon>
      </v-avatar>
      <h3 class="tamil-title text-h6 font-weight-bold text-maroon mb-2">{{ t.dashboard.list.empty }}</h3>
      <v-btn color="primary" variant="elevated" class="rounded-pill font-weight-bold px-6 mt-4" @click="resetFilters">
        Reset Filters
      </v-btn>
    </div>

    <!-- Complaint Cards Grid -->
    <v-row v-else>
      <v-col cols="12" md="6" v-for="item in complaints" :key="item.id">
        <v-card class="premium-card h-100 d-flex flex-column justify-space-between pa-6">
          <div>
            <!-- Top Bar: ID & Status Chip -->
            <div class="d-flex align-items-center justify-space-between mb-3">
              <div class="d-flex align-items-center gap-2">
                <v-chip size="small" color="primary" variant="elevated" class="font-weight-black">
                  {{ item.complaintId }}
                </v-chip>
                <v-chip size="small" :color="getPriorityColor(item.priority)" variant="tonal" class="font-weight-bold">
                  <v-icon left size="14" class="mr-1">mdi-flag</v-icon>
                  {{ getPriorityLabel(item.priority) }}
                </v-chip>
              </div>

              <v-chip size="small" :class="getStatusChipClass(item.status)">
                <v-icon left size="14" class="mr-1">{{ getStatusIcon(item.status) }}</v-icon>
                {{ getStatusLabel(item.status) }}
              </v-chip>
            </div>

            <!-- Category & Street -->
            <h3 class="text-h6 font-weight-bold text-maroon mb-1 d-flex align-items-center">
              <v-icon size="20" color="secondary" class="mr-2">mdi-tag-alert</v-icon>
              {{ item.category }}
            </h3>

            <div class="text-subtitle-2 text-grey-darken-2 mb-3 d-flex align-items-center">
              <v-icon size="16" color="amber" class="mr-1">mdi-map-marker</v-icon>
              {{ item.street }}
            </div>

            <!-- Description -->
            <p class="text-body-1 bg-grey-lighten-4 pa-4 rounded-lg border-l-4 border-maroon mb-4 line-clamp-3">
              "{{ item.description }}"
            </p>

            <!-- Photo Preview (If Available) -->
            <div v-if="item.photoUrl && item.photoUrl.startsWith('http')" class="mb-4">
              <v-img
                :src="item.photoUrl"
                height="180"
                cover
                class="rounded-lg border border-grey-lighten-2 photo-hover cursor-pointer"
                @click="openImagePreview(item.photoUrl)"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-items-center justify-center h-100 bg-grey-lighten-3">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  </div>
                </template>
              </v-img>
            </div>

            <!-- Citizen & Date Info -->
            <div class="d-flex align-items-center justify-space-between text-caption text-grey-darken-1 mb-4">
              <div class="d-flex align-items-center">
                <v-icon size="16" class="mr-1">mdi-account</v-icon>
                <span>{{ item.citizenName }}</span>
              </div>
              <div>{{ formatDate(item.createdAt) }}</div>
            </div>

            <!-- Admin Remarks (If any) -->
            <v-alert v-if="item.adminRemarks" color="success" variant="tonal" class="mb-4 py-2 font-weight-medium">
              <div class="text-caption font-weight-black text-success d-flex align-items-center mb-1">
                <v-icon left size="16" class="mr-1">mdi-shield-check</v-icon>
                {{ t.dashboard.list.adminRemarks }}
              </div>
              <div class="text-body-2 text-dark">{{ item.adminRemarks }}</div>
            </v-alert>
          </div>

          <!-- Card Bottom Bar: Upvote Button -->
          <div class="pt-4 border-t border-grey-lighten-3 d-flex align-items-center justify-space-between">
            <v-btn
              color="amber"
              variant="elevated"
              class="font-weight-bold text-maroon rounded-pill px-4 py-1"
              size="small"
              @click="handleUpvote(item.id)"
            >
              <v-icon left color="primary" class="mr-1">mdi-thumb-up</v-icon>
              {{ t.dashboard.list.upvoteBtn }} ({{ item.upvotes }})
            </v-btn>

            <div class="text-caption text-secondary font-weight-bold">
              {{ t.app.ward }}
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Image Modal -->
    <v-dialog v-model="imageModal" max-width="800">
      <v-card class="pa-2 bg-dark">
        <div class="d-flex justify-end pb-2">
          <v-btn icon="mdi-close" color="white" variant="text" @click="imageModal = false"></v-btn>
        </div>
        <v-img :src="activeImageUrl" max-height="80vh" fit="contain"></v-img>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { useComplaintStore } from "../../../store/complaintStore";
import { translations } from "../../../translations";

export default {
  name: "ComplaintList",
  data() {
    return {
      imageModal: false,
      activeImageUrl: "",
    };
  },
  computed: {
    store() {
      return useComplaintStore();
    },
    isLoading() {
      return this.store.isLoading;
    },
    errorMessage() {
      return this.store.errorMessage;
    },
    complaints() {
      return this.store.filteredComplaints;
    },
    lang() {
      return this.store.language;
    },
    t() {
      return translations[this.lang] || translations.ta;
    },
  },
  methods: {
    handleUpvote(id) {
      this.store.upvote(id);
    },
    resetFilters() {
      this.store.selectedCategoryFilter = "All";
      this.store.selectedStatusFilter = "All";
      this.store.selectedStreetFilter = "All";
    },
    openImagePreview(url) {
      this.activeImageUrl = url;
      this.imageModal = true;
    },
    formatDate(isoStr) {
      if (!isoStr) return "";
      const date = new Date(isoStr);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
    getStatusChipClass(status) {
      if (status === "RESOLVED") return "chip-resolved";
      if (status === "IN PROGRESS") return "chip-progress";
      return "chip-pending";
    },
    getStatusLabel(status) {
      return this.t.common.status[status] || status;
    },
    getStatusIcon(status) {
      if (status === "RESOLVED") return "mdi-check-decagram";
      if (status === "IN PROGRESS") return "mdi-progress-clock";
      return "mdi-alert-circle-outline";
    },
    getPriorityColor(priority) {
      if (priority === "HIGH") return "error";
      if (priority === "MEDIUM") return "warning";
      return "info";
    },
    getPriorityLabel(priority) {
      return this.t.common.priority[priority] || priority;
    },
  },
};
</script>

<style scoped>
.text-maroon {
  color: var(--tvk-maroon) !important;
}
.border-l-4 {
  border-left-width: 4px !important;
  border-left-style: solid !important;
}
.border-maroon {
  border-left-color: var(--tvk-maroon) !important;
}
.photo-hover {
  transition: transform 0.3s ease;
}
.photo-hover:hover {
  transform: scale(1.02);
}
.cursor-pointer {
  cursor: pointer;
}
</style>
