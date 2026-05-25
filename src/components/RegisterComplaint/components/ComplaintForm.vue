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
      <div class="d-flex flex-wrap justify-center align-center gap-4 mt-8 mb-4 w-100 px-2">
        <v-btn
          type="button"
          variant="outlined"
          color="grey-darken-2"
          class="font-weight-bold px-6 py-3 rounded-pill my-1"
          style="min-width: 140px;"
          size="large"
          @click="resetForm"
          :disabled="isLoading"
        >
          <v-icon left class="mr-1">mdi-refresh</v-icon>
          Reset
        </v-btn>

        <v-btn
          type="submit"
          class="btn-tvk-maroon font-weight-black px-8 py-3 rounded-pill my-1 flex-grow-1 flex-sm-grow-0"
          style="min-width: 240px;"
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
  // Primary Arteries & Main Roads
  "மவுண்ட்-பூந்தமல்லி சாலை (Mount-Poonamallee Road)",
  "ராமாபுரம் முதன்மை சாலை (Ramapuram Main Road)",
  "வள்ளுவர் சாலை (Valluvar Salai)",
  "காளாத்தம்மன் கோவில் தெரு (Kalasathamman Koil Street)",
  "நடராஜன் சாலை (Natarajan Road)",
  "கோத்தாரி நகர் முதன்மை சாலை (Kothari Nagar Main Road)",

  // Rayala Nagar Complex
  "ரொயாலா நகர் முதன்மை சாலை (Royala Nagar Main Road)",
  "ரொயாலா நகர் 1வது முதன்மை சாலை (Royala Nagar 1st Main Road)",
  "ரொயாலா நகர் 2வது முதன்மை சாலை (Royala Nagar 2nd Main Road)",
  "ரொயாலா நகர் 3வது முதன்மை சாலை (Royala Nagar 3rd Main Road)",
  "ரொயாலா நகர் 4வது முதன்மை சாலை (Royala Nagar 4th Main Road)",
  "ரொயாலா நகர் 1வது குறுக்குத் தெரு (Royala Nagar 1st Cross Street)",
  "ரொயாலா நகர் 2வது குறுக்குத் தெரு (Royala Nagar 2nd Cross Street)",
  "ரொயாala நகர் 3வது குறுக்குத் தெரு (Royala Nagar 3rd Cross Street)",
  "ரொயாலா நகர் 4வது குறுக்குத் தெரு (Royala Nagar 4th Cross Street)",
  "ரொயாலா நகர் 5வது குறுக்குத் தெரு (Royala Nagar 5th Cross Street)",
  "ரொயாலா நகர் 6வது குறுக்குத் தெரு (Royala Nagar 6th Cross Street)",
  "ரொயாலா நகர் 7வது குறுக்குத் தெரு (Royala Nagar 7th Cross Street)",
  "ரொயாலா நகர் 8வது குறுக்குத் தெரு (Royala Nagar 8th Cross Street)",
  "ரொயாலா நகர் 9வது குறுக்குத் தெரு (Royala Nagar 9th Cross Street)",
  "ரொயாலா நகர் 10வது குறுக்குத் தெரு (Royala Nagar 10th Cross Street)",
  "ரொயாலா நகர் 11வது குறுக்குத் தெரு (Royala Nagar 11th Cross Street)",
  "ரொயாலா நகர் 12வது குறுக்குத் தெரு (Royala Nagar 12th Cross Street)",

  // Senthamizh Nagar Cluster
  "செந்தமிழ் நகர் முதன்மை சாலை (Senthamizh Nagar Main Road)",
  "குறிஞ்சி தெரு (Kurinji Street)",
  "முல்லை தெரு (Mullai Street)",
  "ஜாஸ்மின் தெரு (Jasmine Street)",
  "ஆண்டவர் நகர் முதன்மை சாலை (Aandavar Nagar Main Road)",
  "ஏஞ்சல் தெரு (Angel Street)",

  // Thirumalai Nagar Layout
  "திருமலை நகர் முதன்மை சாலை (Thirumalai Nagar Main Road)",
  "நேதாஜி தெரு (Netaji Street)",
  "மூவேந்தர் தெரு (Moovendar Street)",
  "பெரியார் தெரு (Periyar Street)",
  "கண்ணகி தெரு (Kannagi Street)",
  "வ.உ.சி தெரு (VOC Street)",
  "கிருஷ்ணவேணி தெரு (Krishnaveni Street)",
  "ஜே.ஜே தெரு (JJ Street)",

  // MGR Nagar & Associated Kamaraj/Anna Pockets
  "எம்.ஜி.ஆர் நகர் மத்திய தெரு (MGR Nagar Central Street)",
  "அண்ணா தெரு (Anna Street)",
  "காமராஜர் தெரு (Kamarajar Street)",
  "பாரதி சாலை (Bharathi Salai)",
  "வள்ளுவர் நகர் (Valluvar Nagar)",

  // Royal Nagar & Balaji Avenue
  "ராயல் 1வது முதன்மை சாலை (Royal 1st Main Road)",
  "ராயல் 2வது முதன்மை சாலை (Royal 2nd Main Road)",
  "ராயல் 3வது முதன்மை சாலை (Royal 3rd Main Road)",
  "ராயல் குறுக்குத் தெரு (Royal Cross Street)",
  "கற்பகாம்பாள் சாலை (Karpagambal Salai)",
  "பாலாஜி அவென்யூ 1வது தெரு (Balaji Avenue 1st Street)",
  "பாலாஜி அவென்யூ 2வது தெரு (Balaji Avenue 2nd Street)",
  "பாலாஜி அவென்யூ 3வது தெரு (Balaji Avenue 3rd Street)",
  "குமரன் தெரு (Kumaran Street)",

  // Ganga Nagar & Srinivasa Nagar Grid
  "கங்கா நகர் முதன்மை சாலை (Ganga Nagar Main Road)",
  "கங்கா நகர் 1வது தெரு (Ganga Nagar 1st Street)",
  "கங்கா நகர் 2வது தெரு (Ganga Nagar 2nd Street)",
  "கங்கா நகர் 3வது தெரு (Ganga Nagar 3rd Street)",
  "ஸ்ரீநிவாசா நகர் முதன்மை சாலை (Srinivasa Nagar Main Road)",
  "ஸ்ரீநிவாசா நகர் வடக்கு தெரு (Srinivasa Nagar North Street)",
  "ஸ்ரீநிவாசா நகர் தெற்கு தெரு (Srinivasa Nagar South Street)",
  "அன்னை சத்யா நகர் தெருக்கள் (Annai Sathya Nagar Streets)",

  // Ambal Nagar, Annamalai Nagar & Easwari Nagar
  "அம்பாள் நகர் முதன்மை சாலை (Ambal Nagar Main Road)",
  "அம்பாள் நகர் 1வது தெரு (Ambal Nagar 1st Street)",
  "அம்பாள் நகர் 2வது தெரு (Ambal Nagar 2nd Street)",
  "அம்பாள் நகர் 3வது தெரு (Ambal Nagar 3rd Street)",
  "அம்பாள் நகர் 4வது தெரு (Ambal Nagar 4th Street)",
  "அண்ணாமலை நகர் முதன்மை சாலை (Annamalai Nagar Main Road)",
  "அண்ணாமலை நகர் 1வது குறுக்குத் தெரு (Annamalai Nagar 1st Cross Street)",
  "அண்ணாமலை நகர் 2வது குறுக்குத் தெரு (Annamalai Nagar 2nd Cross Street)",
  "ஈஸ்வரி நகர் முதன்மை சாலை (Easwari Nagar Main Road)",
  "ஈஸ்வரி நகர் 1வது குறுக்குத் தெரு (Easwari Nagar 1st Cross Street)",
  "ஈஸ்வரி நகர் 2வது குறுக்குத் தெரு (Easwari Nagar 2nd Cross Street)",
  "புவனேஸ்வரி நகர் (Bhuvaneshwari Nagar)",

  // Executive Colony & IT Corridor Back-Lanes
  "எக்ஸிகியூட்டிவ் காலனி முதன்மை சாலை (Executive Colony Main Road)",
  "எக்ஸிகியூட்டிவ் காலனி தெரு A (Executive Colony Street A)",
  "எக்ஸிகியூட்டிவ் காலனி தெரு B (Executive Colony Street B)",
  "எக்ஸிகியூட்டிவ் காலனி தெரு C (Executive Colony Street C)",
  "எக்ஸிகியூட்டிவ் காலனி தெரு D (Executive Colony Street D)",
  "சிவானி நகர் தெருக்கள் (Shivani Nagar Streets)",
  "சிவாஜி நகர் தெருக்கள் (Shivaji Nagar Streets)",
  "மூகாம்பிகை நகர் தெருக்கள் (Moogambigai Nagar Streets)",
  "ஸ்ரீ ராம் நகர் 1வது தெரு (Sri Ram Nagar 1st Street)",
  "ஸ்ரீ ராம் நகர் 2வது தெரு (Sri Ram Nagar 2nd Street)",
  "கிரி நகர் 3வது தெரு (Giri Nagar 3rd Street)",

  // Heritage Village & Temple Roads
  "பஜனை கோவில் தெரு (Bajanai Kovil Street)",
  "பிள்ளையார் கோவில் தெரு (Pillaiyar Kovil Street)",
  "மாரியம்மன் கோவில் தெரு (Mariamman Kovil Street)",

  // Fallback Catch-all
  "பிற பகுதி (Other Area in Ward 155)",
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
