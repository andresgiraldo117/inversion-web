<script>
import appConfig from "@/app.config";

import { notificationMethods } from "@/state/helpers";

export default {
  name: "app",
  page: {
    // All subcomponent titles will be injected into this template.
    titleTemplate(title) {
      title = `S • YUNES`;
      return title;
      //return title ? `S • YUNES` : appConfig.title;
    },
  },
  mounted() {
    // document.querySelector("html").setAttribute('dir', 'rtl')
  },
  watch: {
    /**
     * Clear the alert message on route change
     */

    $route(to, from) {
      // clear alert on location change
      this.clearNotification();
    },
  },
  methods: {
    clearNotification: notificationMethods.clear,
  },
};
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>
