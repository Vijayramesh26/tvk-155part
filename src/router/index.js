import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "RegisterComplaint",
    component: () => import("../views/RegisterComplaintView.vue"),
    meta: {
      title: "புகார் பதிவு | ராமாபுரம் வட்டம் 155 | TVK",
    },
  },
  {
    path: "/dashboard",
    name: "ComplaintDashboard",
    component: () => import("../views/ComplaintDashboardView.vue"),
    meta: {
      title: "புகார் நேரலை பலகம் | ராமாபுரம் வட்டம் 155 | TVK",
    },
  },
  {
    path: "/secretary",
    name: "SecretaryInfo",
    component: () => import("../views/SecretaryInfoView.vue"),
    meta: {
      title: "வட்டச் செயலாளர் & பொறுப்பாளர்கள் | ராமாபுரம் 155 | TVK",
    },
  },
  {
    path: "/admin",
    name: "AdminPortal",
    component: () => import("../views/AdminPortalView.vue"),
    meta: {
      title: "நிர்வாகி தளம் | ராமாபுரம் 155 | TVK",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "தமிழக வெற்றிக் கழகம் | ராமாபுரம் வட்டம் 155";
  next();
});

export default router;
