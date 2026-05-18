<template>
  <v-card class="premium-card pa-6">
    <div class="d-flex flex-column flex-md-row align-items-center justify-space-between mb-6 gap-4">
      <div class="d-flex align-items-center text-maroon font-weight-bold">
        <v-icon left color="primary" class="mr-2">mdi-table-cog</v-icon>
        <span class="text-h6 tamil-title">{{ t.admin.table.total }} ({{ complaints.length }})</span>
      </div>

      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        :label="t.admin.table.searchPlaceholder"
        variant="outlined"
        density="compact"
        hide-details
        class="max-w-sm w-100"
        color="primary"
      ></v-text-field>
    </div>

    <!-- Data Table Container -->
    <v-table class="bg-transparent">
      <thead>
        <tr class="bg-grey-lighten-4">
          <th class="font-weight-black text-maroon">{{ t.admin.table.headers.id }}</th>
          <th class="font-weight-black text-maroon">{{ t.admin.table.headers.citizen }}</th>
          <th class="font-weight-black text-maroon">{{ t.admin.table.headers.street }}</th>
          <th class="font-weight-black text-maroon">{{ t.admin.table.headers.category }}</th>
          <th class="font-weight-black text-maroon">{{ t.admin.table.headers.priority }}</th>
          <th class="font-weight-black text-maroon">{{ t.admin.table.headers.status }}</th>
          <th class="font-weight-black text-maroon text-center">{{ t.admin.table.headers.actions }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="filteredTableData.length === 0">
          <td colspan="7" class="text-center py-8 text-grey-darken-1 font-weight-bold">
            {{ t.admin.table.empty }}
          </td>
        </tr>
        <tr v-for="item in filteredTableData" :key="item.id" class="hover-row">
          <td class="font-weight-bold text-primary">
            {{ item.complaintId }}
            <div class="text-caption text-grey">{{ formatDate(item.createdAt) }}</div>
          </td>
          <td>
            <div class="font-weight-bold">{{ item.citizenName }}</div>
            <div class="text-caption text-secondary">
              <a :href="'https://wa.me/91' + item.phone" target="_blank" class="text-decoration-none color-inherit font-weight-bold">
                <v-icon size="14" color="success">mdi-whatsapp</v-icon> {{ item.phone }}
              </a>
            </div>
          </td>
          <td class="text-body-2 font-weight-medium">{{ item.street }}</td>
          <td class="text-body-2">{{ item.category }}</td>
          <td>
            <v-select
              v-model="item.priority"
              :items="priorityList"
              item-title="label"
              item-value="value"
              density="compact"
              variant="outlined"
              hide-details
              class="priority-select"
              @update:modelValue="onPriorityChange(item.id, $event)"
            ></v-select>
          </td>
          <td>
            <v-select
              v-model="item.status"
              :items="statusList"
              item-title="label"
              item-value="value"
              density="compact"
              variant="outlined"
              hide-details
              class="status-select"
              @update:modelValue="onStatusChange(item.id, $event)"
            ></v-select>
          </td>
          <td class="text-center">
            <div class="d-flex align-items-center justify-center gap-2">
              <!-- Remarks Dialog Trigger -->
              <v-btn
                icon="mdi-comment-edit"
                variant="tonal"
                size="small"
                color="primary"
                title="Update Remarks"
                @click="openRemarksModal(item)"
              ></v-btn>

              <!-- Photo Preview Trigger -->
              <v-btn
                v-if="item.photoUrl && item.photoUrl.startsWith('http')"
                icon="mdi-camera"
                variant="tonal"
                size="small"
                color="amber"
                title="View Photo"
                @click="openImageModal(item.photoUrl)"
              ></v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Remarks Update Modal -->
    <v-dialog v-model="remarksModal" max-width="500">
      <v-card class="premium-card pa-6">
        <div class="d-flex align-items-center justify-space-between mb-4">
          <h3 class="tamil-title text-h6 font-weight-black text-maroon">
            {{ t.admin.remarksModal.title }}
          </h3>
          <v-btn icon="mdi-close" variant="text" @click="remarksModal = false"></v-btn>
        </div>

        <p class="text-caption text-grey-darken-1 mb-4">
          {{ t.admin.remarksModal.desc }} <b>{{ activeItem?.complaintId }}</b>
        </p>

        <v-textarea
          v-model="activeRemarks"
          :label="t.admin.remarksModal.title"
          variant="outlined"
          rows="4"
          color="primary"
          :placeholder="t.admin.remarksModal.placeholder"
        ></v-textarea>

        <div class="d-flex justify-end gap-3 mt-4">
          <v-btn variant="text" color="grey" @click="remarksModal = false">{{ t.admin.remarksModal.cancel }}</v-btn>
          <v-btn color="primary" variant="elevated" class="rounded-pill font-weight-bold px-6" @click="saveRemarks">
            {{ t.admin.remarksModal.save }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Photo Modal -->
    <v-dialog v-model="photoModal" max-width="800">
      <v-card class="bg-dark pa-2">
        <div class="d-flex justify-end pb-2">
          <v-btn icon="mdi-close" color="white" variant="text" @click="photoModal = false"></v-btn>
        </div>
        <v-img :src="activePhotoUrl" max-height="80vh" fit="contain"></v-img>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { useComplaintStore } from "../../../store/complaintStore";
import { translations } from "../../../translations";

export default {
  name: "AdminManagementTable",
  data() {
    return {
      search: "",
      remarksModal: false,
      photoModal: false,
      activeItem: null,
      activeRemarks: "",
      activePhotoUrl: "",
    };
  },
  computed: {
    store() {
      return useComplaintStore();
    },
    complaints() {
      return this.store.complaints;
    },
    lang() {
      return this.store.language;
    },
    t() {
      return translations[this.lang] || translations.ta;
    },
    priorityList() {
      return [
        { label: this.t.common.priority.LOW, value: "LOW" },
        { label: this.t.common.priority.MEDIUM, value: "MEDIUM" },
        { label: this.t.common.priority.HIGH, value: "HIGH" },
      ];
    },
    statusList() {
      return [
        { label: this.t.common.status.PENDING, value: "PENDING" },
        { label: this.t.common.status["IN PROGRESS"], value: "IN PROGRESS" },
        { label: this.t.common.status.RESOLVED, value: "RESOLVED" },
      ];
    },
    filteredTableData() {
      const s = this.search.toLowerCase().trim();
      if (!s) return this.complaints;
      return this.complaints.filter(
        (c) =>
          c.citizenName?.toLowerCase().includes(s) ||
          c.street?.toLowerCase().includes(s) ||
          c.complaintId?.toLowerCase().includes(s) ||
          c.category?.toLowerCase().includes(s)
      );
    },
  },
  methods: {
    formatDate(isoStr) {
      if (!isoStr) return "";
      const date = new Date(isoStr);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
    onStatusChange(id, newVal) {
      this.store.updateStatus(id, newVal);
    },
    onPriorityChange(id, newVal) {
      this.store.updatePriority(id, newVal);
    },
    openRemarksModal(item) {
      this.activeItem = item;
      this.activeRemarks = item.adminRemarks || "";
      this.remarksModal = true;
    },
    saveRemarks() {
      if (this.activeItem) {
        this.store.updateRemarks(this.activeItem.id, this.activeRemarks);
        this.remarksModal = false;
      }
    },
    openImageModal(url) {
      this.activePhotoUrl = url;
      this.photoModal = true;
    },
  },
};
</script>

<style scoped>
.max-w-sm {
  max-width: 384px;
}
.text-maroon {
  color: var(--tvk-maroon) !important;
}
.priority-select,
.status-select {
  min-width: 140px;
}
.hover-row:hover {
  background-color: rgba(255, 215, 0, 0.05);
}
.color-inherit {
  color: inherit !important;
}
</style>
