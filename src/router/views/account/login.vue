<script>
import axios from "axios";
import {
  authMethods,
  authFackMethods,
  notificationMethods,
} from "@/state/helpers";
import { mapState } from "vuex";

import appConfig from "@/app.config";
import { required, email } from "vuelidate/lib/validators";
import Swal from "sweetalert2";

/**
 * Login-2 component
 */
export default {
  page: {
    title: "Login 2",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  data() {
    return {
      email: "",
      password: "",
      submitted: false,
      authError: null,
      tryingToLogIn: false,
      isAuthError: false,
    };
  },
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
    },
  },
  computed: {
    ...mapState("authfack", ["status"]),
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  methods: {
    ...authMethods,
    ...authFackMethods,
    ...notificationMethods,

    tryToLogIn() {
      this.$refs['modal-condi'].show()
    },
    tryToLogInModal() {
      this.submitted = true;

      this.$v.$touch();

      if (this.$v.$invalid) {
        return;
      } else {
        if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
          this.tryingToLogIn = true;

          this.authError = null;
          return (
            this.logIn({
              email: this.email,
              password: this.password,
            })
              .then((token) => {
                this.tryingToLogIn = false;
                this.isAuthError = false;
                // Redirect to the originally requested page, or to the home page
                this.$router.push(
                  this.$route.query.redirectFrom || {
                    name: "default",
                  }
                );
              })
              .catch((error) => {
                this.tryingToLogIn = false;
                this.authError = error ? error : "";
                this.isAuthError = true;
              })
          );
        } else if (process.env.VUE_APP_DEFAULT_AUTH === "fakebackend") {
          const { email, password } = this;
          if (email && password) {
            
            this.login({
              email,
              password,
            });
          }
        } else if (process.env.VUE_APP_DEFAULT_AUTH === "authapi") {
          const { email, password } = this;
          if (email && password) {
              this.login({
                email,
                password,
              })
          }
        }
      }
    },
  },
  mounted() {
    document.body.classList.add("auth-body-bg");
  },
};
</script>

<template>
  <div>
    <div class="container-fluid p-0">
      <div class="row g-0">
        <iframe
          class="w-100"
          style="
            background-color: #323333;
            box-sizing: border-box;
            height: 45px;
          "
          src="https://s.tradingview.com/embed-widget/ticker-tape/?locale=br#%7B%22symbols%22%3A%5B%7B%22proName%22%3A%22FOREXCOM%3ASPXUSD%22%2C%22title%22%3A%22S%26P%20500%22%7D%2C%7B%22proName%22%3A%22FOREXCOM%3ANSXUSD%22%2C%22title%22%3A%22Nasdaq%201000%22%7D%2C%7B%22proName%22%3A%22FX_IDC%3AEURUSD%22%2C%22title%22%3A%22EUR%2FUSD%22%7D%2C%7B%22proName%22%3A%22BITSTAMP%3ABTCUSD%22%2C%22title%22%3A%22BTC%2FUSD%22%7D%2C%7B%22description%22%3A%22XAU%2FUSD%22%2C%22proName%22%3A%22OANDA%3AXAUUSD%22%7D%2C%7B%22description%22%3A%22GBP%2FUSD%22%2C%22proName%22%3A%22OANDA%3AGBPUSD%22%7D%2C%7B%22description%22%3A%22USD%2FCAD%22%2C%22proName%22%3A%22OANDA%3AUSDCAD%22%7D%2C%7B%22description%22%3A%22EUR%2FJPY%22%2C%22proName%22%3A%22OANDA%3AEURJPY%22%7D%2C%7B%22description%22%3A%22GOLD%22%2C%22proName%22%3A%22TVC%3AGOLD%22%7D%2C%7B%22description%22%3A%22SILVER%22%2C%22proName%22%3A%22TVC%3ASILVER%22%7D%2C%7B%22description%22%3A%22IBOVESPA%22%2C%22proName%22%3A%22INDEX%3AIBOV%22%7D%2C%7B%22description%22%3A%22DOW%20JONES%22%2C%22proName%22%3A%22FOREXCOM%3ADJI%22%7D%5D%2C%22showSymbolLogo%22%3Atrue%2C%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Atrue%2C%22displayMode%22%3A%22adaptive%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A44%2C%22utm_source%22%3A%22www-fxwinning-pro.filesusr.com%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22ticker-tape%22%7D"
        ></iframe>
        <div class="col-xl-12">
          <div class="auth-full-bg">
            <div class="w-100 ">
              <div class="bg-overlay"></div>
              <div class="d-flex h-100  ">
                <div class="m-auto h-100">
                  <div class="row justify-content-center h-100">
                    <div class="col-lg-12 h-100 ">
                      <div
                        class="card pb-3 px-3 h-100"
                        style="background-color: rgb(255 255 255 / 91%)"
                      >
                        <div style="width:300px">
                          <div class="d-block flex-column">
                            <div class="col-md-12">
                              <router-link to="/" class="d-block auth-logo py-5">
                                <span
                                  class="avatar-title rounded-circle bg-transparent"
                                >
                                  <img
                                    src="@/assets/images/skandar-logo3.png"
                                    alt
                                    height="90"
                                  />
                                </span>
                              </router-link>
                            </div>
                            <div class="my-auto">
                              <div class="p-3">
                                <b-form @submit.prevent="tryToLogIn">
                                  <b-form-group
                                    class="mb-3"
                                    id="input-group-1"
                                    label="Correo"
                                    label-for="input-1"
                                  >
                                    <b-form-input
                                      id="input-1"
                                      v-model="email"
                                      type="text"
                                      placeholder="Ingrese el correo electronico"
                                      :class="{
                                        'is-invalid':
                                          submitted && $v.email.$error,
                                      }"
                                    ></b-form-input>
                                    <div
                                      v-if="submitted && $v.email.$error"
                                      class="invalid-feedback"
                                    >
                                      <span v-if="!$v.email.required"
                                        >Email is required.</span
                                      >
                                      <span v-if="!$v.email.email"
                                        >Please enter valid email.</span
                                      >
                                    </div>
                                  </b-form-group>

                                  <b-form-group
                                    class="mb-3"
                                    id="input-group-2"
                                    label="Contraseña"
                                    label-for="input-2"
                                  >
                                    <b-form-input
                                      id="input-2"
                                      v-model="password"
                                      type="password"
                                      placeholder="Ingrese la contraseña"
                                      :class="{
                                        'is-invalid':
                                          submitted && $v.password.$error,
                                      }"
                                    ></b-form-input>
                                    <div
                                      v-if="submitted && !$v.password.required"
                                      class="invalid-feedback"
                                    >
                                      Password is required.
                                    </div>
                                  </b-form-group>
                                  <b-form-checkbox
                                    class="form-check"
                                    id="customControlInline"
                                    name="checkbox-1"
                                    value="accepted"
                                    unchecked-value="not_accepted"
                                  >
                                    Recordarme
                                  </b-form-checkbox>
                                  <div class="mt-3 d-grid">
                                    <b-button
                                      type="submit"
                                      variant="primary"
                                      class="btn-block"
                                      >Ingresar</b-button
                                    >
                                  </div>
                                  <div class="mt-4 text-center">
                                    <router-link
                                      to="/forgot-password"
                                      class="text-muted"
                                    >
                                      <i class="mdi mdi-lock me-1"></i> Olvide
                                      mi contraseña?
                                    </router-link>
                                  </div>
                                </b-form>
                                <div class="mt-1 text-center mt-5">
                                  <p>
                                    No estas registrado ?
                                    <router-link
                                      to="/register"
                                      class="fw-medium text-primary"
                                      >Registrame</router-link
                                    >
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- end col -->
      </div>
      <!-- end row -->
    </div>
    <!-- end container-fluid -->
  <b-modal
                    id="modal-scrollable"
                    scrollable
                    centered
                    title="POLITICA DE RETIRO"
                    title-class="font-14"
                    ref="modal-condi"
                    size="md"
                    @ok="tryToLogInModal"
                    ok-title="Aceptar y continuar"
                  >
                    <p>
                      El cliente puede realizar solicitudes de retiro semanalmente, las cuales serán
                      recibidas hasta el día miércoles 16:00H zona horaria de Colombia de cada semana.
                      Todas las solicitudes de retiro recibidas hasta el día miércoles 16:00H zona horaria
                      de Colombia de cada semana, serán procesadas y retiradas de la cuenta de
                      inversión el día viernes al culminar la operativa en los mercados y serán entregadas
                      los días lunes y martes de la siguiente semana. Todo con el objetivo de no
                      interrumpir la operativa programada.
                    </p>
                  </b-modal>
  </div>
</template>

<style lang="scss" scoped>
::v-deep .carousel-caption {
  position: relative !important;
  right: 0;
  bottom: 1.25rem;
  left: 0;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  color: #495057;
  text-align: center;
}

::v-deep .carousel-indicators li {
  background-color: rgba(85, 110, 230, 0.25);
}
</style>