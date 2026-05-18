<template>
  <v-app>
    <!-- Top Premium Banner -->
    <v-app-bar app color="#800000" elevation="4" height="84" class="px-1 px-sm-4 d-flex align-center">
      <v-container class="d-flex align-center justify-space-between fill-height py-0 max-w-7xl h-100 px-1 px-md-4 my-auto">
        <div class="d-flex align-center gap-2 py-1 my-auto flex-grow-1" style="max-width: 70%;">
          <v-avatar :size="$vuetify?.display?.xs ? 42 : 56" class="border-2 border-gold mr-1 mr-sm-3 flex-shrink-0 shadow my-auto" color="white">
            <v-img :src="vijayPhoto" cover alt="Thalapathy Vijay"></v-img>
          </v-avatar>
          <div class="d-flex flex-column justify-center my-auto pt-1 pt-sm-0 flex-grow-1">
            <div class="text-subtitle-2 text-sm-h6 font-weight-black text-white tamil-title line-height-tight mb-n1 app-bar-title">
              {{ t.app.title }}
            </div>
            <div class="text-caption text-gold font-weight-bold d-flex align-center mt-1">
              <v-icon size="14" color="amber" class="mr-1 flex-shrink-0">mdi-map-marker-star</v-icon>
              <span class="text-truncate">{{ t.app.ward }}</span>
            </div>
          </div>
        </div>

        <!-- Desktop & Tablet Navigation Tabs -->
        <div class="d-none d-sm-flex align-center gap-3 my-auto flex-shrink-0">
          <v-btn
            v-for="tab in navigationTabs"
            :key="tab.route"
            :to="tab.route"
            variant="text"
            class="text-white font-weight-bold px-4 py-2 mx-1 rounded-pill nav-btn-hover text-body-1 my-auto"
            :class="{ 'active-tab': $route.path === tab.route }"
          >
            <v-icon left size="22" class="mr-2">{{ tab.icon }}</v-icon>
            {{ tab.label }}
          </v-btn>
        </div>

        <!-- Language Toggle Button & Mobile Menu Toggle -->
        <div class="d-flex align-center flex-shrink-0 ml-2 ml-sm-4 my-auto">
          <v-btn
            variant="outlined"
            color="amber"
            class="rounded-pill font-weight-black text-white my-auto px-4"
            :size="$vuetify?.display?.xs ? 'small' : 'default'"
            @click="toggleLang"
          >
            <v-icon left size="16" class="mr-1">mdi-translate</v-icon>
            {{ t.app.toggleLang }}
          </v-btn>

          <v-app-bar-nav-icon
            class="d-sm-none text-white font-weight-bold ml-1 my-auto"
            @click="drawer = !drawer"
          ></v-app-bar-nav-icon>
        </div>
      </v-container>
    </v-app-bar>

    <!-- Navigation Drawer for Mobile -->
    <v-navigation-drawer v-model="drawer" location="right" temporary class="mobile-drawer" color="#ffffff">
      <div class="pa-4 gradient-header text-center py-6">
        <v-avatar size="80" color="white" class="mb-3 mx-auto shadow border-2 border-gold">
          <v-img :src="vijayPhoto" cover alt="Thalapathy Vijay"></v-img>
        </v-avatar>
        <h3 class="text-white font-weight-bold tamil-title">{{ t.app.ward }}</h3>
        <p class="text-caption text-gold mb-0">{{ t.app.tagline }}</p>
      </div>
      <v-list class="pt-4 pa-2">
        <v-list-item
          v-for="tab in navigationTabs"
          :key="tab.route"
          :to="tab.route"
          @click="drawer = false"
          active-color="primary"
          class="my-2 rounded-lg font-weight-bold"
        >
          <template v-slot:prepend>
            <v-icon :icon="tab.icon" color="primary" class="mr-3"></v-icon>
          </template>
          <v-list-item-title class="font-weight-black text-body-1 text-maroon">
            {{ tab.label }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <div class="pa-4 absolute bottom-0 left-0 right-0 text-center text-caption text-grey">
        {{ t.app.ward }} © 2026
      </div>
    </v-navigation-drawer>

    <!-- Mobile Bottom Navigation (Always accessible on phones) -->
    <v-bottom-navigation
      bg-color="#800000"
      class="d-sm-none position-fixed bottom-0 z-50 shadow-lg border-t border-gold"
      grow
    >
      <v-btn
        v-for="tab in navigationTabs"
        :key="tab.route"
        :to="tab.route"
        :value="tab.route"
        class="text-white my-1"
        :class="{ 'text-gold': $route.path === tab.route }"
      >
        <v-icon size="22">{{ tab.icon }}</v-icon>
        <span class="text-caption font-weight-bold mt-1">{{ tab.shortLabel }}</span>
      </v-btn>
    </v-bottom-navigation>

    <!-- Main Content Body with Rich Dark Maroon TVK Election Background -->
    <v-main
      class="pt-12 pt-md-16 mt-4 pb-16 min-h-screen"
      :style="{
        backgroundImage: `linear-gradient(135deg, rgba(128, 0, 0, 0.88) 0%, rgba(20, 0, 0, 0.95) 100%), url(${electionBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        paddingTop: '100px !important'
      }"
    >
      <v-container class="max-w-7xl animate-fade-in pa-4 pa-md-6 mt-4 mt-md-8">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>

    <!-- Premium Footer with padding-bottom to clear mobile bottom navigation -->
    <v-footer class="gradient-header text-white py-8 flex-column text-center footer-padding">
      <v-container class="max-w-7xl pa-4 pa-md-6">
        <v-row class="align-center justify-space-between">
          <v-col cols="12" md="4" class="text-md-left mb-4 mb-md-0">
            <div class="d-flex align-center justify-center justify-md-start mb-2">
              <v-avatar size="44" color="white" class="mr-2 border border-gold">
                <v-img :src="vijayPhoto" cover alt="Thalapathy Vijay"></v-img>
              </v-avatar>
              <h4 class="font-weight-black text-h6 mb-0 tamil-title">{{ t.app.ward }}</h4>
            </div>
            <p class="text-caption text-grey-lighten-2 mb-0">
              {{ t.app.footer.desc }}
            </p>
          </v-col>
          <v-col cols="12" md="4" class="mb-4 mb-md-0">
            <div class="text-body-2 font-weight-bold mb-2">{{ t.app.footer.emergency }}</div>
            <v-btn
              href="https://wa.me/917449215257"
              target="_blank"
              color="amber"
              variant="elevated"
              class="font-weight-bold text-maroon rounded-pill px-6 my-1"
            >
              <v-icon left class="mr-2">mdi-whatsapp</v-icon>
              {{ t.app.footer.secretaryWa }}
            </v-btn>
          </v-col>
          <v-col cols="12" md="4" class="text-md-right text-caption text-grey-lighten-1">
            <div>{{ t.app.footer.copyright }}</div>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import vijayImg from "./assets/image copy.png";
import electionBgImg from "./assets/election_bg.png";
import { useComplaintStore } from "./store/complaintStore";
import { translations } from "./translations";

export default {
  name: "App",
  data() {
    return {
      drawer: false,
      vijayPhoto: vijayImg,
      electionBg: electionBgImg,
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
    navigationTabs() {
      return [
        { label: this.t.app.nav.register, shortLabel: this.t.app.nav.registerShort, route: "/", icon: "mdi-form-select" },
        { label: this.t.app.nav.dashboard, shortLabel: this.t.app.nav.dashboardShort, route: "/dashboard", icon: "mdi-view-dashboard" },
        { label: this.t.app.nav.secretary, shortLabel: this.t.app.nav.secretaryShort, route: "/secretary", icon: "mdi-account-star" },
      ];
    },
  },
  methods: {
    toggleLang() {
      this.store.language = this.store.language === "ta" ? "en" : "ta";
      localStorage.setItem("tvk_155_lang", this.store.language);
    },
  },
};
</script>

<style scoped>
.text-maroon {
  color: var(--tvk-maroon) !important;
}

.text-gold {
  color: var(--tvk-gold) !important;
}

.border-gold {
  border-color: var(--tvk-gold) !important;
}

.max-w-7xl {
  max-width: 1280px !important;
  margin: 0 auto;
}

.app-bar-title {
  white-space: normal !important;
  word-break: break-word;
  line-height: 1.15 !important;
}

.footer-padding {
  padding-bottom: 96px !important;
}

@media (min-width: 600px) {
  .footer-padding {
    padding-bottom: 32px !important;
  }
}

.active-tab {
  background: rgba(255, 215, 0, 0.25) !important;
  border-bottom: 3px solid var(--tvk-gold) !important;
  color: var(--tvk-gold) !important;
}

.nav-btn-hover:hover {
  background: rgba(255, 255, 255, 0.15);
}

.line-height-tight {
  line-height: 1.2 !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
