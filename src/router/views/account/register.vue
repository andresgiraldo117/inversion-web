<script>
import axios from "axios";
import DatePicker from "vue2-datepicker";

import {
  authMethods,
  authFackMethods,
  notificationMethods,
  todoMethods,
} from "@/state/helpers";
import Layout from "../../layouts/auth";
import appConfig from "@/app.config";
import { mapState } from "vuex";
import vue2Dropzone from "vue2-dropzone";
import Swal from "sweetalert2";

/**
 * Register component
 */
export default {
  page: {
    title: "Register",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: { vueDropzone: vue2Dropzone, Layout, DatePicker },
  data() {
    return {
      user: {
        name: "",
        lastname: "",
        type_identification_number: "Cédula",
        identification_number: "",
        email: "",
        birthdate: new Date(),
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        password: "",
        document_file : "",
      },
      submitted: false,
      regError: null,
      tryingToRegister: false,
      isRegisterError: false,
      registerSuccess: false,
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 150,
        maxFilesize: 0.5,
        headers: { "My-Awesome-Header": "header value" }
      },
      listDocuments: [
        'Cédula',
        'Cédula extranjería',
        'Pasaporte',
      ]
    };
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
    ...todoMethods,
    // Try to register the user in with the email, username
    // and password they provided.
    tryToLogInModal() {
      this.$refs['modal-condi'].show()
    },
    tryToRegisterIn() {
      if(this.$refs.fileimage.files.length === 0){
        return Swal.fire("Error!",'Ningun documento adjuntado', "error");
      }
      Swal.fire({
        title: "Estas seguro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#fdc836",
        cancelButtonColor: "#08403e",
        confirmButtonText: "Si, Registrarme!"
      }).then(result => {
        if (result.value) {
            console.log(process.env.VUE_APP_DEFAULT_AUTH)

            let formData = new FormData();
            formData.append( 'document_file', this.$refs.fileimage.files[0] );
            formData.append( 'name', this.user.name.toUpperCase());
            formData.append( 'lastname', this.user.lastname.toUpperCase());
            formData.append( 'type_identification_number', this.user.type_identification_number.toUpperCase());
            formData.append( 'identification_number', this.user.identification_number);
            formData.append( 'email', this.user.email);
            formData.append( 'birthdate', this.user.birthdate);
            formData.append( 'phone', this.user.phone);
            formData.append( 'address', this.user.address);
            formData.append( 'city', this.user.city.toUpperCase());
            formData.append( 'state', this.user.state.toUpperCase());
            formData.append( 'country', this.user.country.toUpperCase());
            formData.append( 'password', this.user.password);

            this.fetchUserCreated({
              data: formData
            }).then(res => {
              Swal.fire("Listo!", res.message, "success");
              this.$router.push('/login');
            })
        }
      })
    },
  },
};
</script>

<template>
    <div class="row justify-content-center py-3 bg-soft bg-secondary">
      <div class="col-md-8 col-lg-6 col-xl-5">
        <div class="card overflow-hidden">
          <div class="bg-secondary ">
            <div class="row">
              <div class="col-12 text-center">
                <img src="@/assets/images/Logo-SYV-Management-04.svg" height="174"  />
              </div>
            </div>
          </div>
          <div class="card-body ">

            <b-alert v-model="registerSuccess" class="mt-3" variant="success" dismissible>Registration successfull.
            </b-alert>

            <b-alert v-model="isRegisterError" class="mt-3" variant="danger" dismissible>{{ regError }}</b-alert>

            <div v-if="notification.message" :class="'alert ' + notification.type">
              {{ notification.message }}
            </div>

            <b-form class="p-2 row" @submit.prevent="tryToRegisterIn">

              <b-form-group class="mb-3" id="email-group" label="Nombres" label-for="name">
                <b-form-input id="name" v-model="user.name" type="text" placeholder="Nombres" class="text-uppercase" :class="{
                  'is-invalid': submitted && $v.user.name.$error,
                }"></b-form-input>
                <div v-if="submitted && !$v.user.name.required" class="invalid-feedback">
                  Nombre es requerido.
                </div>
              </b-form-group>

              <b-form-group class="mb-3" id="email-group" label="Apellidos" label-for="lastname">
                <b-form-input id="lastname" v-model="user.lastname" type="text" placeholder="Apellidos" class="text-uppercase" :class="{
                  'is-invalid': submitted && $v.user.lastname.$error,
                }"></b-form-input>
                <div v-if="submitted && !$v.user.lastname.required" class="invalid-feedback">
                  Apellido es requerido.
                </div>
              </b-form-group>

              <b-form-group class="mb-3 col-6" id="email-group" label="Tipo de documento" label-for="type_identification_number">
                <!-- <b-form-input id="type_identification_number" v-model="user.type_identification_number" type="text"
                  placeholder="Ingrese el tipo de documento" :class="{
                    'is-invalid': submitted && $v.user.type_identification_number.$error,
                  }"></b-form-input> -->
                  <select v-model="user.type_identification_number" class="form-control select2-search-disable">
                      <option v-for="(item,index) of listDocuments" :key="index" :value="item">{{item}}</option>
                  </select>
                <div v-if="submitted && !$v.user.type_identification_number.required" class="invalid-feedback">
                  Tipo de Documento es requerido.
                </div>
              </b-form-group>

              <b-form-group class="mb-3 col-6" id="email-group" label="Número de documento" label-for="identification_number">
                <b-form-input id="identification_number" v-model="user.identification_number" type="text"
                  placeholder="Ingrese el numero de documento" :class="{
                    'is-invalid': submitted && $v.user.identification_number.$error,
                  }"></b-form-input>
                <div v-if="submitted && !$v.user.identification_number.required" class="invalid-feedback">
                  Numero de Documento es requerido.
                </div>
              </b-form-group>

              <b-form-group class="mb-3" id="fullname-group" label="Correo electronico" label-for="email">
                <b-form-input id="email" v-model="user.email" type="email" placeholder="Ingrese el correo electronico"
                  :class="{ 'is-invalid': submitted && $v.user.email.$error }"></b-form-input>
                <div v-if="submitted && $v.user.email.$error" class="invalid-feedback">
                  <span v-if="!$v.user.email.required">Email is required.</span>
                  <span v-if="!$v.user.email.email">Please enter valid email.</span>
                </div>
              </b-form-group>

              <b-form-group class="mb-3 col-6" id="email-group" label="Fecha de nacimiento" label-for="birthdate">
                  <date-picker 
                  :initial-date="new Date()"
                  input-class="inputdatepickerReg mx-input"
                  v-model="user.birthdate" :first-day-of-week="1" lang="es">
                  </date-picker>
                <div v-if="submitted && !$v.user.birthdate.required" class="invalid-feedback">
                  Fecha de Nacimiento es requerido.
                </div>
              </b-form-group>

              <b-form-group class="mb-3 col-6" id="email-group" label="Celular" label-for="phone">
                <b-form-input id="phone" v-model="user.phone" type="text"
                  placeholder="Ingrese el número de celular" :class="{
                    'is-invalid': submitted && $v.user.phone.$error,
                  }"></b-form-input>
                <div v-if="submitted && !$v.user.phone.required" class="invalid-feedback">
                  Celular es requerido.
                </div>
              </b-form-group>

              <b-form-group class="mb-3" id="email-group" label="Direccion" label-for="address">
                <b-form-input id="address" v-model="user.address" type="text"
                  placeholder="Ingrese la direccion de residencia" class="text-uppercase"></b-form-input>
                <div v-if="submitted && !$v.user.address.required" class="invalid-feedback">
                  Dirección es requerido.
                </div>
              </b-form-group>

              <b-form-group class="mb-3 col-6" id="email-group" label="Ciudad" label-for="city">
                <b-form-input id="city" v-model="user.city" type="text" placeholder="Ingrese la ciudad" class="text-uppercase"></b-form-input>
                <div v-if="submitted && !$v.user.city.required" class="invalid-feedback">
                  Ciudad es requerido.
                </div>
              </b-form-group>

              <b-form-group class="mb-3 col-6" id="email-group" label="Departamento" label-for="state">
                <b-form-input id="state" v-model="user.state" type="text" placeholder="Ingrese el departamento" class="text-uppercase"></b-form-input>
                <div v-if="submitted && !$v.user.state.required" class="invalid-feedback">
                  Estado es requerido.
                </div>
              </b-form-group>

              <b-form-group class="mb-3" id="email-group" label="Pais" label-for="country">
                <b-form-input id="country" v-model="user.country" type="text" placeholder="Ingrese el pais" class="text-uppercase"></b-form-input>
                <div v-if="submitted && !$v.user.country.required" class="invalid-feedback">
                  Pais es requerido.
                </div>
              </b-form-group>

              <b-form-group class="mb-3" id="password-group" label="Contraseña" label-for="password">
                <b-form-input id="password" v-model="user.password" type="password"
                  placeholder="Ingrese su nueva contraseña" :class="{
                    'is-invalid': submitted && $v.user.password.$error,
                  }"></b-form-input>
                <div v-if="submitted && !$v.user.password.required" class="invalid-feedback">
                  Contraseña es requerida.
                </div>
              </b-form-group>

              <div class="col-12">
                <div class="card">
                  <div class="card-body">
                    <h4 class="card-title">Identificación</h4>
                    <p class="card-title-desc">
                      Adjunta un documento que te identifique.</p>

                      <input
                        type="file"
                        class="form-control"
                        id="inputGroupFile01"
                        ref="fileimage"
                      />
                  </div>
                  <!-- end card-body -->
              <div class="text-center">
                <p class="mb-0">
                  Al registrarte aceptas las 
                  <a role="button" @click="tryToLogInModal" class="text-primary">condiciones de uso</a>
                </p>
              </div>
                </div>
                <!-- end card -->
              </div>

              <div class="mt-4 d-grid">
                <b-button type="submit" variant="primary" class="btn-block">Registrarse</b-button>
              </div>


        <div class="mt-4 text-center">
          <p>
            Ya tiene una cuenta ?
            <router-link to="/login" class="fw-medium text-primary">Ingresar</router-link>
          </p>
        </div>
            </b-form>
          </div>
          <!-- end card-body -->
        </div>
        <!-- end card -->
      </div>
        <b-modal
                    id="modal-scrollable-old"
                    scrollable
                    title="TERMINOS Y CONDICIONES"
                    title-class="font-14"
                    body-class="terminosycondiciones"
                    ref="modal-condi"
                    size="lg"
                    @ok="tryToLogInModal"
                    ok-title="Aceptar y continuar"
                  >
                    <div>
<p dir="ltr"><span>SYV MANAGEMENT S.A.S</span></p>
<p dir="ltr"><span>Power of Attorney for Individuals</span></p>
<p><span><span>&nbsp;</span></span></p>
<p dir="ltr"><span>Important: </span><span>This Power of Attorney is a legally binding document provided in accordance with the terms and conditions contained in the Service Agreement.</span></p>
<p><span><span>&nbsp;</span></span></p>
<ol>
<li dir="ltr">
<p dir="ltr"><span>General</span></p>
</li>
</ol>
<p><span><span>&nbsp;</span></span></p>
<ol>
<li dir="ltr">
<p dir="ltr"><span>By signing this Power of Attorney (&lsquo;POA&rsquo;), the Client agrees to authorize the Representative to act as his/ her/ their attorney-in-fact and in- law for the purposes described below, regarding the services offered by SYV MANAGEMENT S.A.S.</span></p>
</li>
</ol>
<p><span><span>&nbsp;</span></span></p>
<ol start="2">
<li dir="ltr">
<p dir="ltr"><span>This POA becomes effective once received and accepted as valid, by the Back-Office Department but not before the Back Office Department has approved the Client and has completed all the relevant Know-your- Customer and Anti-Money Laundering procedures.</span></p>
</li>
</ol>
<p><span><span>&nbsp;</span></span></p>
<ol start="3">
<li dir="ltr">
<p dir="ltr"><span>The Client has already entered or will enter into a binding Agreement with SYV MANAGEMENT S.A.S by accepting the Service Agreement, which includes, inter alia, the Terms and Conditions, the Client Agreement and any attached Annexes, the &lsquo;Order Execution Policy&rsquo; and any other documentation uploaded on the Firm&rsquo;s website, as from time to time amended by SYV MANAGEMENT S.A.S (collectively referred to &lsquo;Service Agreement&rsquo;).</span></p>
</li>
</ol>
<p><span><span>&nbsp;</span></span></p>
<ol start="4">
<li dir="ltr">
<p dir="ltr"><span>The Client understands that SYV MANAGEMENT S.A.S does not participate, in any way, in trading and/or other decisions made by the Representative and/or does not make any representations or warranties and/or assumes any obligations with regard to the actions and/or omissions of the Representative, either made negligently, innocently and/or fraudulently. The Client understands that he/she/they shall have no claim whatsoever against SYV MANAGEMENT S.A.S for any actions of the Representative.</span></p>
</li>
</ol>
<p><span><span>&nbsp;</span></span></p>
<ol start="5">
<li dir="ltr">
<p dir="ltr"><span>The Client shall seek independent legal and/or financial and/or tax advice in relation to the content(s) of this POA and/or any other document associated with this POA. Nothing in this POA constitutes a recommendation, or offer to buy or sell in an investment, or an inducement to trade and SYV MANAGEMENT S.A.S shall not be held liable for any losses incurred by the Client.</span></p>
</li>
</ol>
<p><span><span>&nbsp;</span></span></p>
<ol start="2">
<li dir="ltr">
<p dir="ltr"><span>Power of Attorney</span></p>
</li>
</ol>
<p><span><span>&nbsp;</span></span></p>
<ol>
<li dir="ltr">
<p dir="ltr"><span>The Client understands and accepts that the Representative shall be entitled to have the powers granted herein below, in accordance with the Service Agreement. The Client agrees to ratify such instructions, as if performed by themselves. Therefore, the Firm, prior to execution, is under no responsibility to confirm such instructions with neither the Representative nor the Client. The Client understands that SYV MANAGEMENT S.A.S </span><span>will facilitate the above transactions without further direction and/or confirmation from the Client.</span></p>
</li>
</ol>
<p><span><span>&nbsp;</span></span></p>
<ol start="2">
<li dir="ltr">
<p dir="ltr"><span>The Client agrees that he/she/they shall indemnify and hold harmless the Firm, its officers, directors, employees, advisors, consultants or other partners from and against any loss and/ or liability that may arise in relation to this POA.</span></p>
</li>
</ol>
<p><span><span>&nbsp;</span></span></p>
<ol start="3">
<li dir="ltr">
<p dir="ltr"><span>The Client declares that his/ her/their decision for appointing an Representative for his/ her/ their behalf, is an informed one taken after carefully considering the risks involved in trading CFDs.</span></p>
</li>
</ol>
<p><span><span>&nbsp;</span></span></p>
<ol start="4">
<li dir="ltr">
<p dir="ltr"><span>The Client consents and authorizes the Firm to disclose to the Representative any personal information and trading related information necessary under this POA.</span></p>
</li>
</ol>
<p><span><span>&nbsp;</span></span></p>
<ol start="5">
<li dir="ltr">
<p dir="ltr"><span>All customers connected to this POA, cannot migrate to another strategy within FxWinning, during the next 12 months as from the date of customers resignation. In case of reversing this POA, this clause will remain in force during the above mentioned period. All clients who wish to make internal transfers to an account with a different strategy (MAMM) than the actually one and/or unverified accounts, will be debited a 30% commission on the amount to be transferred.</span></p>
</li>
</ol>
<p><span><span>&nbsp;</span></span></p>
<ol start="6">
<li dir="ltr">
<p dir="ltr"><span>RISK WARNING: </span><span>Contracts for Difference (&lsquo;CFDs&rsquo;) are complex financial products that are traded on margin. Trading CFDs carries a high level of risk since leverage can work both to your advantage and disadvantage. As a result, CFDs may not be suitable for all investors because you may lose all your invested capital. You should not risk more than you are prepared to lose. Before deciding to trade, you need to ensure that you understand the risks involved taking into account your investment objectives, level of experience and personal financial situation. Past performance of CFDs is not a reliable indicator of future results. Most CFDs have no set maturity date. Hence, a CFD position matures on the date you choose to close an existing open position. Seek independent advice, if necessary. SYV MANAGEMENT S.A.S does not provide any investment advice and/or investment recommendation.</span></p>
</li>
</ol>
<p><span><span>&nbsp;</span></span></p>
<ol start="3">
<li dir="ltr">
<p dir="ltr"><span>Revocation of this Limited Power of Attorney</span></p>
</li>
</ol>
<p><span><span>&nbsp;</span></span></p>
<ol>
<li dir="ltr">
<p dir="ltr"><span>This POA is for an infinitive period of time, unless terminated in accordance with the Service Agreement and/or this POA and/or any other agreement effective between the parties. The Client acknowledges that this POA may be revoked by SYV MANAGEMENT</span></p>
</li>
</ol>
<p dir="ltr"><span>S.A.S at any given time, for any or no reason, including but not limited to instances where the Service Agreement is terminated. The Client may, at any time, request the revocation of this POA by completing the relevant revocation form(s) and transmitting them via e- mail through their registered e-mail, given that there are no open positions. It is the sole</span><span><br /></span></p>
<p><span><span>&nbsp;</span></span></p>
<p dir="ltr"><span>responsibility of the Client to communicate the revocation of this POA to SYV MANAGEMENT S.A.S and request the closure of any open positions, if any. Such revocation of the POA will become effective once received by the Back Office Department of SYV MANAGEMENT S.A.S, provided that the above mentioned conditions, are met. Revocation of this POA shall not relieve the Client of any liability which has arisen, for any transaction initiated prior to such revocation.</span></p>
<p><span><span>&nbsp;</span></span></p>
<ol start="2">
<li dir="ltr">
<p dir="ltr"><span>The Client understands and accepts that if, at the time of the revocation of this POA, there are any funds available in the Client&rsquo;s trading account(s) then the Firm have the right to transfer such funds to the Client&rsquo;s Account.</span></p>
</li>
</ol>
<p><span><span>&nbsp;</span></span></p>
<p dir="ltr"><span>6.3. The client understands that if 10% loss ocurs, the client`s account will be automatically disconnected form SYV MANAGEMENT S.A.S.</span></p>
<p><span><span>&nbsp;</span></span></p>
<ol start="4">
<li dir="ltr">
<p dir="ltr"><span>Powers Granted to the Attorney</span></p>
</li>
</ol>
<p dir="ltr"><span>I, the Client, hereby ratify and confirm all and any of the following acts to be performed by the Representative as having been performed by myself. *Tick either (a) or (b)</span></p>
<p><span><span>&nbsp;</span></span></p>
<p dir="ltr"><span>The Representative shall have:</span></p>
<p><span><span>&nbsp;</span></span></p>
<p dir="ltr"><span>a.)</span><span>Funding activities:</span></p>
<ul>
<li dir="ltr">
<p dir="ltr"><span>Depositing and/or withdrawing money to and from my account with SYV MANAGEMENT S.A.S, with</span></p>
</li>
<li dir="ltr">
<p dir="ltr"><span>Permitting SYV MANAGEMENT S.A.S to disclose to the Representative any account related information.</span></p>
</li>
</ul>
<p><span><span>&nbsp;</span></span></p>
<ol start="5">
<li dir="ltr">
<p dir="ltr"><span>I authorize to SYV MANAGEMENT S.A.S to manage my trading account and a 50% management fees.</span></p>
</li>
</ol>
<p><span><span>&nbsp;</span></span></p>
<p dir="ltr"><span>I hereby confirm that I have carefully read and understood the content of this POA in addition to the Service Agreement and other documentation received during the on-boarding process, including any subsequent amendments and agree to be legally bound by them.</span></p>
<p><span>&nbsp;</span></p>
                    </div>
                  </b-modal>

        <b-modal
                    id="modal-scrollable"
                    scrollable
                    title="TERMINOS Y CONDICIONES"
                    title-class="font-14"
                    body-class="p-0"
                    ref="modal-condi"
                    size="lg"
                    @ok="tryToLogInModal"
                    ok-title="Aceptar y continuar"
                  >
        <img
          class="w-100"
          src="@/assets/images/tyc-1.jpg"
        />
        <img
          class="w-100"
          src="@/assets/images/tyc-2.jpg"
        />
        <img
          class="w-100"
          src="@/assets/images/tyc-3.jpg"
        />
        <img
          class="w-100"
          src="@/assets/images/tyc-4.jpg"
        />

        </b-modal>
      <!-- end col -->
    </div>
    <!-- end row -->
</template>