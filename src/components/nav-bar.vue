<script>
import axios from "axios";
import simplebar from "simplebar-vue";

import i18n from "../i18n";
import { authFackComputed, todoMethods } from "@/state/helpers";
import moment from 'moment';

/**
 * Nav-bar Component
 */
export default {
  data() {
    return {
      languages: [
        {
          flag: require("@/assets/images/flags/us.jpg"),
          language: "en",
          title: "English",
        },
        {
          flag: require("@/assets/images/flags/french.jpg"),
          language: "fr",
          title: "French",
        },
        {
          flag: require("@/assets/images/flags/spain.jpg"),
          language: "es",
          title: "Spanish",
        },
        {
          flag: require("@/assets/images/flags/chaina.png"),
          language: "zh",
          title: "Chinese",
        },
        {
          flag: require("@/assets/images/flags/arabic.png"),
          language: "ar",
          title: "Arabic",
        },
      ],
      lan: i18n.locale,
      text: null,
      flag: null,
      value: null,
      myVar: 1,
      user: {},
      notification: false,
      notificationList: [],
    };
  },
  components: { simplebar },
  mounted() {
    this.value = this.languages.find((x) => x.language === i18n.locale);
    this.text = this.value.title;
    this.flag = this.value.flag;

    this.load_fetchUserId();

    this.$root.$on('bv::dropdown::show', bvEvent => {
      if(bvEvent.componentId === 'dropdown-notify' && this.notification){

        let data = {
            notification : false
        }
        this.fetchUserUpdate({
            data: data,
            token: this.$store.state.authfack.user.token,
            userId: this.user._id,
        }).then(res => {
            this.load_fetchUserId();
            this.notification = false;
        })
      }
    })

  },
  methods: {
    ...todoMethods,

    formaterDate(date){
      return moment(date).locale('es').format('dddd, D MMMM h:mm a');
    },

    load_fetchUserId(){
      this.fetchUserId({
        userId : this.currentUser._id,
        token: this.$store.state.authfack.user.token,
      }).then(res => {
        this.user = res;
        this.notification = this.user.notification;
      });

      this.fetchNotificationList({
        token: this.$store.state.authfack.user.token,
      }).then(res => {
        res.sort((a,b) => new Date(b.date) - new Date(a.date));

        if(this.$store.state.authfack.user.role === 'admin'){
            this.notificationList = res;
        }else if(this.$store.state.authfack.user.role === 'cliente'){
            this.notificationList = res.filter(it => it.id_user == this.$store.state.authfack.user._id)
        }
      })
    },
    toggleMenu() {
      this.$parent.toggleMenu();
    },
    toggleRightSidebar() {
      this.$parent.toggleRightSidebar();
    },
    initFullScreen() {
      document.body.classList.toggle("fullscreen-enable");
      if (
        !document.fullscreenElement &&
        /* alternative standard method */ !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(
            Element.ALLOW_KEYBOARD_INPUT
          );
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    },
    setLanguage(locale, country, flag) {
      this.lan = locale;
      this.text = country;
      this.flag = flag;
      i18n.locale = locale;
    },
    logoutUser() {
      // eslint-disable-next-line no-unused-vars
      axios.get("http://127.0.0.1:8000/api/logout").then((res) => {
        this.$router.push({
          name: "default",
        });
      });
    },
  },
  computed: {
    ...authFackComputed,
  },

};
</script>

<template>
  <header id="page-topbar">
    <div class="navbar-header">
      <div class="d-flex">
        <!-- LOGO -->
        <div class="navbar-brand-box">
          <router-link to="/" class="logo logo-dark">
            <span class="logo-sm">
              <img src="@/assets/images/logo-skandar.svg" alt height="22" />
            </span>
            <span class="logo-lg">
              <img src="@/assets/images/logo-dark.png" alt height="17" />
            </span>
          </router-link>

          <router-link to="/" class="logo logo-light">
            <span class="logo-sm">
              <img src="@/assets/images/Logo-SYV-Management-03.svg" alt height="32" />
            </span>
            <span class="logo-lg">
              <img src="@/assets/images/Logo-SYV-Management-03.svg" alt height="69" />
            </span>
          </router-link>
        </div>

        <button
          id="vertical-menu-btn"
          type="button"
          class="btn btn-sm px-3 font-size-16 header-item"
          @click="toggleMenu"
        >
          <i class="fa fa-fw fa-bars"></i>
        </button>
      </div>

      <div class="d-flex">

        <b-dropdown
          ref="dropdown-notify"
          id="dropdown-notify"
          right
          menu-class="dropdown-menu-lg p-0 dropdown-menu-end"
          toggle-class="header-item noti-icon"
          variant="black"
        >
          <template v-slot:button-content>
            <i class="bx bx-bell bx-tada"></i>
            <span v-if="notification" class="badge bg-danger rounded-pill">1</span>
          </template>

          <div class="p-3">
            <div class="row align-items-center">
              <div class="col">
                <h6 class="m-0">
                  {{ $t("navbar.dropdown.notification.text") }}
                </h6>
              </div>
            </div>
          </div>
          <simplebar style="max-height: 230px">
            <a v-for="item in notificationList" :key="item._id"  href="javascript: void(0);" class="text-reset notification-item">
              <div class="d-flex">
                <div class="avatar-xs me-3">
                  <span
                    class="avatar-title bg-primary rounded-circle font-size-16"
                  >
                    <i class="bx bx-info-circle"></i>
                  </span>
                </div>
                <div class="flex-grow-1">
                  <h6 class="mt-0 mb-1">
                    {{item.title}}
                  </h6>
                  <div class="font-size-12 text-muted">
                    <p class="mb-1">
                      {{item.description}}
                    </p>
                    <p class="mb-1">
                      {{item.user[0].name + ' ' + item.user[0].lastname}}
                    </p>
                    <p class="mb-0 text-capitalize">
                      <i class="mdi mdi-clock-outline"></i>
                      {{ formaterDate(item.date) }}
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </simplebar>
          
        </b-dropdown>

        <b-dropdown
          right
          variant="black"
          toggle-class="header-item"
          menu-class="dropdown-menu-end"
        >
          <template v-slot:button-content>
            <img
              class="rounded-circle header-profile-user"
              src="@/assets/images/users/avatar.png"
              alt="Header Avatar"
            />
            <span class="d-none d-xl-inline-block ms-1">
              <div v-if="currentUser">
               {{currentUser.name + ' ' + currentUser.lastname}}
              </div>
              </span
            >
            <i class="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
          </template>
          <!-- item-->
          <b-dropdown-item :href="currentUser.role !== 'admin' ? '/contacts/profile' : `/contacts/profile/${currentUser._id}`">
            <router-link :to="currentUser.role !== 'admin' ? '/contacts/profile' : `/contacts/profile/${currentUser._id}`" v-slot="{ navigate }" custom>
              <span @click="navigate" @keypress.enter="navigate">
                <i class="bx bx-user font-size-16 align-middle me-1"></i>
                Perfil
              </span>
            </router-link>
          </b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <a href="/logout" class="dropdown-item text-danger">
            <i
              class="bx bx-power-off font-size-16 align-middle me-1 text-danger"
            ></i>
            Salir
          </a>
        </b-dropdown>
      </div>
    </div>
  </header>
</template>
