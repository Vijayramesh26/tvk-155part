<template>
  <div class="team-grid-container mb-12">
    <div class="text-center mb-8">
      <h3 class="tamil-title text-h5 font-weight-black text-maroon mb-1">
        {{ t.secretary.team.title }}
      </h3>
      <div class="border-b-2 border-gold w-24 mx-auto mb-2"></div>
      <p class="text-caption text-grey-darken-1">
        {{ t.secretary.team.subtitle }}
      </p>
    </div>

    <v-row>
      <v-col cols="12" sm="6" md="3" v-for="(member, idx) in teamMembers" :key="idx">
        <v-card class="premium-card text-center pa-6 h-100 d-flex flex-column justify-space-between team-card-hover">
          <div>
            <v-avatar size="120" class="border-2 border-gold mb-4 mx-auto shadow" color="grey-lighten-4">
              <v-img :src="member.photo" cover :alt="member.name"></v-img>
            </v-avatar>

            <v-chip size="small" color="secondary" variant="tonal" class="font-weight-black mb-2">
              {{ member.wing }}
            </v-chip>

            <h4 class="tamil-title text-h6 font-weight-black text-maroon mb-1">
              {{ member.name }}
            </h4>
            <div class="text-caption text-grey-darken-1 mb-4">
              {{ member.role }}
            </div>
          </div>

          <div class="border-t border-grey-lighten-3 pt-3">
            <v-btn
              :href="'tel:' + member.phone"
              variant="tonal"
              color="primary"
              class="rounded-pill font-weight-bold w-100"
            >
              <v-icon left size="16" class="mr-1">mdi-phone</v-icon>
              {{ t.secretary.team.callBtn }}
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { useComplaintStore } from "../../../store/complaintStore";
import { translations } from "../../../translations";

export default {
  name: "TeamGrid",
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
    teamMembers() {
      const raw = this.t.secretary.team.members;
      return [
        {
          name: raw[0].name,
          wing: raw[0].wing,
          role: raw[0].role,
          phone: "+919840022334",
          phoneDisplay: "98400 22334",
          photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        },
        {
          name: raw[1].name,
          wing: raw[1].wing,
          role: raw[1].role,
          phone: "+919840033445",
          phoneDisplay: "98400 33445",
          photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        },
        {
          name: raw[2].name,
          wing: raw[2].wing,
          role: raw[2].role,
          phone: "+919840044556",
          phoneDisplay: "98400 44556",
          photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        },
        {
          name: raw[3].name,
          wing: raw[3].wing,
          role: raw[3].role,
          phone: "+919840055667",
          phoneDisplay: "98400 55667",
          photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        },
      ];
    },
  },
};
</script>

<style scoped>
.text-maroon {
  color: var(--tvk-maroon) !important;
}
.border-2 {
  border: 2px solid var(--tvk-gold) !important;
}
.w-24 {
  width: 96px;
}
.team-card-hover {
  transition: transform 0.3s ease;
}
.team-card-hover:hover {
  transform: translateY(-8px);
}
</style>
