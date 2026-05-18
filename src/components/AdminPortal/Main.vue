<template>
  <div class="admin-portal-main">
    <!-- Unauthenticated State: Show Passcode Modal -->
    <div v-if="!isAuthenticated" class="min-h-[60vh] d-flex align-items-center justify-center">
      <AuthModal @authenticated="onAuthenticated" />
    </div>

    <!-- Authenticated State: Show Admin Dashboard -->
    <div v-else>
      <v-row class="align-items-center justify-space-between mb-8">
        <v-col cols="12" md="8">
          <v-chip color="amber" variant="elevated" class="font-weight-bold mb-2 text-maroon uppercase px-4 py-1">
            <v-icon left size="16" class="mr-1">mdi-shield-crown</v-icon>
            {{ t.admin.tag }}
          </v-chip>
          <h1 class="tamil-title text-h4 font-weight-black text-white mb-1 shadow-text">
            {{ t.admin.title }}
          </h1>
          <p class="text-body-1 text-grey-lighten-1 mb-0 font-weight-medium">
            {{ t.admin.subtitle }}
          </p>
        </v-col>

        <v-col cols="12" md="4" class="text-md-right">
          <v-btn
            color="amber"
            variant="elevated"
            class="font-weight-bold text-maroon rounded-pill px-6 py-2 my-1"
            @click="handleLogout"
          >
            <v-icon left class="mr-1">mdi-logout</v-icon>
            {{ t.admin.logout }}
          </v-btn>
        </v-col>
      </v-row>

      <!-- Advanced Management Table -->
      <AdminManagementTable />
    </div>
  </div>
</template>

<script>
import AuthModal from "./components/AuthModal.vue";
import AdminManagementTable from "./components/AdminManagementTable.vue";
import { useComplaintStore } from "../../store/complaintStore";
import { translations } from "../../translations";

export default {
  name: "AdminPortalMain",
  components: {
    AuthModal,
    AdminManagementTable,
  },
  computed: {
    store() {
      return useComplaintStore();
    },
    isAuthenticated() {
      return this.store.isAdminAuthenticated;
    },
    lang() {
      return this.store.language;
    },
    t() {
      return translations[this.lang] || translations.ta;
    },
  },
  methods: {
    onAuthenticated() {
      this.store.fetchComplaints();
    },
    handleLogout() {
      this.store.logoutAdmin();
    },
  },
};
</script>

<style scoped>
.text-maroon {
  color: var(--tvk-maroon) !important;
}
.shadow-text {
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}
</style>
