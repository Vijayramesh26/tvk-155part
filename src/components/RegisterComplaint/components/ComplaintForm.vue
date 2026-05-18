<template>
  <v-card class="premium-card pa-6 pa-md-8">
    <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
      <!-- Citizen Information -->
      <div class="text-subtitle-1 font-weight-bold text-maroon mb-4 d-flex align-items-center">
        <v-icon left color="primary" class="mr-2">mdi-account-details</v-icon>
        {{ t.register.form.nameLabel }}
      </div>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.citizenName"
            :rules="nameRules"
            :label="t.register.form.nameLabel"
            :placeholder="t.register.form.namePlaceholder"
            variant="outlined"
            prepend-inner-icon="mdi-account"
            required
            color="primary"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.phone"
            :rules="phoneRules"
            :label="t.register.form.phoneLabel"
            :placeholder="t.register.form.phonePlaceholder"
            variant="outlined"
            prepend-inner-icon="mdi-whatsapp"
            type="tel"
            maxlength="10"
            required
            color="primary"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- Complaint Location & Category -->
      <div class="text-subtitle-1 font-weight-bold text-maroon mt-4 mb-4 d-flex align-items-center">
        <v-icon left color="primary" class="mr-2">mdi-map-marker-alert</v-icon>
        {{ t.register.form.streetLabel }}
      </div>

      <v-row>
        <v-col cols="12" md="6">
          <v-select
            v-model="formData.street"
            :items="streetOptions"
            :rules="[v => !!v || 'தெரு / பகுதியைத் தேர்ந்தெடுக்கவும்']"
            :label="t.register.form.streetLabel"
            variant="outlined"
            prepend-inner-icon="mdi-home-city"
            required
            color="primary"
          ></v-select>
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="formData.category"
            :items="categoryOptions"
            :rules="[v => !!v || 'பிரச்சினையின் வகையைத் தேர்ந்தெடுக்கவும்']"
            :label="t.register.form.categoryLabel"
            variant="outlined"
            prepend-inner-icon="mdi-tag-alert"
            required
            color="primary"
          ></v-select>
        </v-col>
      </v-row>

      <!-- Priority & Photo -->
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            v-model="formData.priority"
            :items="priorityOptions"
            item-title="label"
            item-value="value"
            :label="t.register.form.priorityLabel"
            variant="outlined"
            prepend-inner-icon="mdi-flag"
            color="primary"
          ></v-select>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.photoUrl"
            :label="t.register.form.photoLabel"
            :placeholder="t.register.form.photoHint"
            variant="outlined"
            prepend-inner-icon="mdi-camera"
            color="primary"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- Description -->
      <div class="text-subtitle-1 font-weight-bold text-maroon mt-4 mb-4 d-flex align-items-center">
        <v-icon left color="primary" class="mr-2">mdi-text-box-edit</v-icon>
        {{ t.register.form.descLabel }}
      </div>

      <v-textarea
        v-model="formData.description"
        :rules="[v => !!v || 'விளக்கத்தை உள்ளிடவும்', v => v.length >= 15 || 'குறைந்தபட்சம் 15 எழுத்துகள் தேவை']"
        :label="t.register.form.descLabel"
        :placeholder="t.register.form.descPlaceholder"
        variant="outlined"
        rows="4"
        required
        color="primary"
      ></v-textarea>

      <!-- Action Buttons -->
      <div class="d-flex flex-column flex-sm-row justify-center align-center gap-3 mt-8 w-100">
        <v-btn
          type="button"
          variant="outlined"
          color="grey-darken-2"
          class="font-weight-bold px-6 py-3 rounded-pill w-100 w-sm-auto my-1"
          size="large"
          @click="resetForm"
          :disabled="isLoading"
        >
          <v-icon left class="mr-1">mdi-refresh</v-icon>
          Reset
        </v-btn>

        <v-btn
          type="submit"
          class="btn-tvk-maroon font-weight-black px-8 py-3 rounded-pill w-100 w-sm-auto my-1"
          size="large"
          :loading="isLoading"
          :disabled="!valid || isLoading"
        >
          <v-icon left class="mr-2">mdi-check-circle</v-icon>
          {{ t.register.form.submitBtn }}
        </v-btn>
      </div>
    </v-form>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="500" persistent>
      <v-card class="pa-6 text-center premium-card">
        <v-avatar size="72" color="success" variant="tonal" class="mx-auto mb-4">
          <v-icon size="40" color="success">mdi-check-decagram</v-icon>
        </v-avatar>

        <h3 class="tamil-title text-h5 font-weight-black text-maroon mb-2">
          {{ t.register.success.title }}
        </h3>

        <p class="text-body-1 mb-4">
          {{ t.register.success.desc }}
        </p>

        <v-alert color="amber" variant="tonal" class="mb-6 font-weight-bold text-maroon py-3">
          {{ t.register.success.idLabel }} <span class="text-h6 font-weight-black ml-1">{{ generatedComplaintId }}</span>
        </v-alert>

        <p class="text-caption text-grey-darken-1 mb-6">
          {{ t.register.success.note }}
        </p>

        <div class="d-flex justify-center gap-3 flex-wrap">
          <v-btn
            color="primary"
            variant="elevated"
            class="font-weight-bold rounded-pill px-6 my-1"
            @click="goToDashboard"
          >
            <v-icon left class="mr-1">mdi-view-dashboard</v-icon>
            {{ t.app.nav.dashboard }}
          </v-btn>

          <v-btn
            variant="text"
            color="grey-darken-3"
            class="font-weight-bold rounded-pill my-1"
            @click="closeSuccessDialog"
          >
            {{ t.register.success.newBtn }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { useComplaintStore } from "../../../store/complaintStore";
import { translations } from "../../../translations";

export default {
  name: "ComplaintForm",
  data() {
    return {
      valid: false,
      successDialog: false,
      generatedComplaintId: "",
      formData: {
        citizenName: "",
        phone: "",
        street: null,
        category: null,
        priority: "MEDIUM",
        description: "",
        photoUrl: "",
      },
      nameRules: [
        v => !!v || "பெயர் கட்டாயம் உள்ளிடப்பட வேண்டும்",
        v => v.length >= 3 || "பெயர் குறைந்தபட்சம் 3 எழுத்துகள் இருக்க வேண்டும்",
      ],
      phoneRules: [
        v => !!v || "தொலைபேசி எண் கட்டாயம்",
        v => /^[6-9]\d{9}$/.test(v) || "சரியான 10 இலக்க இந்திய மொபைல் எண்ணை உள்ளிடவும்",
      ],
      streetOptions: [
        "ரொயாலா நகர் (Royala Nagar)",
        "செந்தமிழ் நகர் (Senthamizh Nagar)",
        "எம்.ஜி.ஆர் நகர் (MGR Nagar)",
        "வள்ளுவர் நகர் (Valluvar Nagar)",
        "பாரதி சாலை (Bharathi Salai)",
        "அம்பாள் நகர் (Ambal Nagar)",
        "புவனேஸ்வரி நகர் (Bhuvaneshwari Nagar)",
        "ஸ்ரீ ராம் நகர் (Sri Ram Nagar)",
        "காமராஜ் நகர் (Kamaraj Nagar)",
        "அண்ணா நகர் (Anna Nagar)",
        "பிற பகுதி (Other Area in Part 155)",
      ],
      categoryOptions: [
        "சாலைகள் / பள்ளங்கள் (Roads/Potholes)",
        "தெருவிளக்குகள் (Streetlights)",
        "குடிநீர் (Drinking Water)",
        "கழிவுநீர் / சாக்கடை (Drainage/Sewage)",
        "சுகாதாரம் / குப்பை (Sanitation/Garbage)",
        "ரேஷன் கடை / பொது விநியோகம் (Ration Shop/PDS)",
        "மின்சாரம் (Electricity)",
        "காவல்துறை / பாதுகாப்பு (Police/Safety)",
        "பிற பிரச்சினைகள் (Others)",
      ],
    };
  },
  computed: {
    store() {
      return useComplaintStore();
    },
    isLoading() {
      return this.store.isLoading;
    },
    lang() {
      return this.store.language;
    },
    t() {
      return translations[this.lang] || translations.ta;
    },
    priorityOptions() {
      return [
        { label: this.t.common.priority.LOW, value: "LOW" },
        { label: this.t.common.priority.MEDIUM, value: "MEDIUM" },
        { label: this.t.common.priority.HIGH, value: "HIGH" },
      ];
    },
  },
  methods: {
    async submitForm() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) return;

      try {
        const newId = await this.store.addComplaint({ ...this.formData });
        this.generatedComplaintId = newId;
        this.successDialog = true;
      } catch (err) {
        alert("Error: " + err.message);
      }
    },
    resetForm() {
      this.$refs.form.reset();
      this.formData.priority = "MEDIUM";
    },
    closeSuccessDialog() {
      this.successDialog = false;
      this.resetForm();
    },
    goToDashboard() {
      this.successDialog = false;
      this.$router.push("/dashboard");
    },
  },
};
</script>

<style scoped>
.text-maroon {
  color: var(--tvk-maroon) !important;
}
</style>
