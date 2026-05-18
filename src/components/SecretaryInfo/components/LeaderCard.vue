<template>
  <v-card class="premium-card pa-6 pa-md-10 mb-12">
    <v-row class="align-items-center justify-center">
      <!-- Leader Avatar / Image (R. Akash) -->
      <v-col cols="12" md="5" class="d-flex flex-column justify-center align-items-center mb-6 mb-md-0">
        <div class="text-center">
          <div class="text-caption font-weight-black text-maroon mb-2">
            <v-icon left size="16" color="primary" class="mr-1">mdi-crown</v-icon>
            {{ t.secretary.leader.designation }}
          </div>
          <v-avatar size="240" class="border-4 border-gold shadow-2xl mb-4" color="white">
            <v-img :src="leaderPhoto" cover alt="R. Akash - 155 Vatta Cheyalalar"></v-img>
          </v-avatar>
          <div class="font-weight-black text-h5 text-maroon">{{ t.secretary.leader.name }}</div>
        </div>
      </v-col>

      <!-- Leader Info -->
      <v-col cols="12" md="7">
        <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
          <v-chip color="primary" variant="tonal" class="font-weight-black text-maroon">
            <v-icon left size="16" class="mr-1">mdi-crown</v-icon>
            {{ t.secretary.leader.designation }}
          </v-chip>

          <v-chip color="success" variant="elevated" class="font-weight-black">
            <v-icon left size="14" class="mr-1">mdi-clock-check-outline</v-icon>
            {{ t.secretary.leader.badge }}
          </v-chip>
        </div>

        <h2 class="tamil-title text-h3 font-weight-black text-maroon mb-1">
          {{ t.secretary.leader.name }}
        </h2>
        <div class="text-h6 text-secondary font-weight-bold mb-4">
          {{ t.secretary.leader.constituency }}
        </div>

        <!-- Leader Quote / Message -->
        <blockquote class="bg-grey-lighten-4 pa-4 rounded-lg border-l-4 border-maroon text-body-1 font-italic mb-6">
          {{ t.secretary.leader.quote }}
        </blockquote>

        <!-- Contact & Address Grid -->
        <v-row class="mb-6">
          <v-col cols="12" sm="6" class="d-flex align-items-start mb-3 mb-sm-0">
            <v-icon color="primary" size="24" class="mr-3 mt-1">mdi-phone-classic</v-icon>
            <div>
              <div class="font-weight-bold text-subtitle-1 text-maroon">{{ t.secretary.leader.phoneLabel }}</div>
              <div class="text-body-1 font-weight-bold text-dark">
                +91 74492 15257
              </div>
            </div>
          </v-col>

          <v-col cols="12" sm="6" class="d-flex align-items-start">
            <v-icon color="primary" size="24" class="mr-3 mt-1">mdi-email-alert</v-icon>
            <div>
              <div class="font-weight-bold text-subtitle-1 text-maroon">{{ t.secretary.leader.emailLabel }}</div>
              <div class="text-body-2 font-weight-bold text-grey-darken-3">
                akashdk52@gmail.com
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Direct Connect Buttons -->
        <div class="d-flex flex-wrap gap-3">
          <v-btn
            href="https://wa.me/917449215257"
            target="_blank"
            color="success"
            variant="elevated"
            class="font-weight-black rounded-pill px-6 py-3"
            size="large"
          >
            <v-icon left size="22" class="mr-2">mdi-whatsapp</v-icon>
            {{ t.secretary.leader.waBtn }}
          </v-btn>

          <v-btn
            href="tel:+917449215257"
            color="primary"
            variant="elevated"
            class="font-weight-black rounded-pill px-6 py-3"
            size="large"
          >
            <v-icon left size="22" class="mr-2">mdi-phone-outgoing</v-icon>
            {{ t.secretary.leader.callBtn }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import leaderImg from "../../../assets/image.png";
import { useComplaintStore } from "../../../store/complaintStore";
import { translations } from "../../../translations";

export default {
  name: "LeaderCard",
  data() {
    return {
      leaderPhoto: leaderImg,
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
};
</script>

<style scoped>
.border-4 {
  border: 4px solid var(--tvk-gold) !important;
}
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
</style>
