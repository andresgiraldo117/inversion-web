import store from "@/state/store";

export default [
  {
    path: "/",
    name: "default",
    meta: {
      authRequired: true,
    },
    component: () => import("./views/mi-cuenta/index"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./views/account/login"),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters["auth/loggedIn"]) {
          // Redirect to the home page instead
          next({ name: "default" });
        } else {
          // Continue to the login page
          next();
        }
      },
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("./views/account/register"),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters["auth/loggedIn"]) {
          // Redirect to the home page instead
          next({ name: "default" });
        } else {
          // Continue to the login page
          next();
        }
      },
    },
  },
  {
    path: "/forgot-password",
    name: "Forgot password",
    component: () => import("./views/account/forgot-password"),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters["auth/loggedIn"]) {
          // Redirect to the home page instead
          next({ name: "default" });
        } else {
          // Continue to the login page
          next();
        }
      },
    },
  },
  {
    path: "/logout",
    name: "logout",
    meta: {
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
          store.dispatch("auth/logOut");
        } else {
          store.dispatch("authfack/logout");
        }
        const authRequiredOnPreviousRoute = routeFrom.matched.some((route) =>
          route.push("/login")
        );
        // Navigate back to previous page, or home as a fallback
        next(
          authRequiredOnPreviousRoute ? { name: "default" } : { ...routeFrom }
        );
      },
    },
  },
  {
    path: "/404",
    name: "404",
    component: require("./views/utility/404").default,
  },
  // Redirect any unmatched routes to the 404 page. This may
  // require some server configuration to work in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  {
    path: "*",
    redirect: "404",
  },
  {
    path: "/micuenta",
    name: "Mi cuenta",
    meta: { authRequired: true },
    component: () => import("./views/mi-cuenta/index"),
  },
  {
    path: "/results",
    name: "Resultados",
    meta: { authRequired: true },
    component: () => import("./views/mi-cuenta/results"),
  },
  {
    path: "/historyDeposit",
    name: "Historial",
    meta: { authRequired: true },
    component: () => import("./views/mi-cuenta/historyDeposit"),
  },
  {
    path: "/deposit",
    name: "Deposito",
    meta: { authRequired: true },
    component: () => import("./views/mi-cuenta/deposit"),
  },
  {
    path: "/transfers",
    name: "Transferencia",
    meta: { authRequired: true },
    component: () => import("./views/mi-cuenta/transfers"),
  },
  {
    path: "/retreats",
    name: "Retiros",
    meta: { authRequired: true },
    component: () => import("./views/mi-cuenta/retreats"),
  },
  {
    path: "/historyRetreats",
    name: "Historial",
    meta: { authRequired: true },
    component: () => import("./views/mi-cuenta/historyRetreats"),
  },
  {
    path: "/users",
    name: "Usuarios",
    meta: { authRequired: true },
    component: () => import("./views/usuarios/index"),
  },
  {
    path: "/configResults",
    name: "Configuracion",
    meta: { authRequired: true },
    component: () => import("./views/configResults/index"),
  },
  {
    path: "/adminRetreats",
    name: "admin-retiros",
    meta: { authRequired: true },
    component: () => import("./views/configResults/adminRetreats"),
  },
  {
    path: "/adminDeposits",
    name: "admin-depositos",
    meta: { authRequired: true },
    component: () => import("./views/configResults/adminDeposits"),
  },
  {
    path: "/contacts/profile/",
    name: "Profile",
    meta: { authRequired: true },
    component: () => import("./views/contacts/contacts-profile"),
  },
  {
    path: "/contacts/profile/:id",
    name: "User profile",
    meta: { authRequired: true },
    component: () => import("./views/contacts/user-profile"),
  }
];