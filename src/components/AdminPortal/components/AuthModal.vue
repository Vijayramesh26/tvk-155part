<template>
  <v-card class="premium-card pa-8 max-w-md w-100 mx-auto text-center">
    <v-avatar size="80" color="rgba(128,0,0,0.1)" class="mb-4 mx-auto border border-gold">
      <v-icon size="40" color="primary">mdi-lock-check</v-icon>
    </v-avatar>

    <h2 class="tamil-title text-h5 font-weight-black text-maroon mb-2">
      {{ t.admin.auth.title }}
    </h2>
    <p class="text-body-2 text-grey-darken-1 mb-6">
      {{ t.admin.auth.subtitle }}
    </p>

    <v-form @submit.prevent="verifyPasscode">
      <v-text-field
        v-model="passcode"
        :label="t.admin.auth.label"
        type="password"
        variant="outlined"
        prepend-inner-icon="mdi-key"
        color="primary"
        :error-messages="errorMessage"
        autofocus
      ></v-text-field>

      <v-btn
        type="submit"
        class="btn-tvk-maroon font-weight-black w-100 py-3 mt-4 rounded-pill"
        size="large"
      >
        <v-icon left class="mr-2">mdi-shield-key</v-icon>
        {{ t.admin.auth.btn }}
      </v-btn>
    </v-form>

    <div class="mt-6 text-caption text-grey">
      {{ t.admin.auth.note }}
    </div>
  </v-card>
</template>

<script>
import { useComplaintStore } from "../../../store/complaintStore";
import { translations } from "../../../translations";

export default {
  name: "AuthModal",
  data() {
    return {
      passcode: "",
      errorMessage: "",
    };
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
  methods: {
    verifyPasscode() {
      this.errorMessage = "";
      if (!this.passcode) {
        this.errorMessage = this.t.admin.auth.emptyError;
        return;
      }
      const success = this.store.authenticateAdmin(this.passcode);
      if (success) {
        this.$emit("authenticated");
      } else {
        this.errorMessage = this.t.admin.auth.error;
        this.passcode = "";
      }
    },
  },
};
</script>

<style scoped>
.max-w-md {
  max-width: 448px;
}
.text-maroon {
  color: var(--tvk-maroon) !important;
}
</style>
