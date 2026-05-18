<template>
  <div class="register-complaint-main">
    <v-row class="justify-center mb-8">
      <v-col cols="12" md="8" class="text-center">
        <v-chip color="amber" variant="elevated" class="text-maroon font-weight-bold mb-3 px-4 py-2 uppercase">
          <v-icon left size="18" class="mr-1">mdi-map-marker-radius</v-icon>
          {{ t.register.tag }}
        </v-chip>
        <h1 class="tamil-title text-h4 font-weight-black text-white mb-2 shadow-text">
          {{ t.register.title }}
        </h1>
        <p class="text-body-1 text-grey-lighten-1 mb-0 font-weight-medium">
          {{ t.register.subtitle }}
        </p>
      </v-col>
    </v-row>

    <v-row class="justify-center">
      <v-col cols="12" md="8" lg="7">
        <ComplaintForm />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ComplaintForm from "./components/ComplaintForm.vue";
import { useComplaintStore } from "../../store/complaintStore";
import { translations } from "../../translations";

export default {
  name: "RegisterComplaintMain",
  components: {
    ComplaintForm,
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
