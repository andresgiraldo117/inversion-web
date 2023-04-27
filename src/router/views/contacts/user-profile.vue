<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";

import { revenueChart } from "./data-profile";
import Stat from "@/components/widgets/stat";
import { todoMethods, authFackComputed } from "@/state/helpers";
import DatePicker from "vue2-datepicker";
import moment from 'moment';
import Swal from "sweetalert2";


/**
 * Contacts-Profile component
 */
export default {
  page: {
    title: "User profile",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader, Stat, DatePicker },
  data() {
    return {
      revenueChart: revenueChart,
      title: "Perfil",
      items: [
        {
          text: "Cuenta",
          href: "/"
        },
        {
          text: "Perfil",
          active: true
        },
      ],
      user: {},
      statusOpdate: false,
      newOperation_date : '',
      value1: null,
      showTimePanel: false,
    };
  },
  computed: {
    ...authFackComputed,
  },
  methods: {
    ...todoMethods,
    toggleTimePanel() {
      this.showTimePanel = !this.showTimePanel;
    },
    handleSaveChange() {
        this.$refs.datepicker.closePopup()
        Swal.fire({
            title: "Estas seguro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor:"#fdc836",
            cancelButtonColor: "#08403e",
            confirmButtonText: "Si, modificar fecha!"
        }).then(result => {
            if (result.value) {

                this.showTimePanel = false;

                let data = {
                    operation_date : moment(this.value1).format()
                }
                this.fetchUserUpdate({
                    data: data,
                    token: this.$store.state.authfack.user.token,
                    userId: this.$route.params.id
                }).then(res => {
                    this.load_fetchUserId();
                    this.statusOpdate = false
                    Swal.fire("Listo!", res.message, "success");
                })
            }
        })
    },

    handleOpenChange() {
        this.showTimePanel = false;
    },

    load_fetchUserId(){
        this.fetchUserId({
        userId : this.$route.params.id,
        token: this.$store.state.authfack.user.token,
        }).then(res => {
        this.user = res;
        this.value1 = new Date(res.operation_date)
        this.dateinit = moment(res.operation_date).locale('es').format('D MMMM YYYY, h:mm:ss a');
        })
    }
  },
  mounted() {
    this.load_fetchUserId()
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-xl-9">
        <!-- end card -->
        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4">Información Personal</h4>
            <div class="table-responsive ">
              <table class="table table-nowrap mb-0">
                <tbody>
                  <tr>
                    <th scope="row">Nombre :</th>
                    <td>{{user.name + ' ' + user.lastname}}</td>
                  </tr>
                  <tr>
                    <th scope="row">Identificación :</th>
                    <td>{{user.type_identification_number + ' ' +user.identification_number }}</td>
                  </tr>
                  <tr>
                    <th scope="row">Telefono :</th>
                    <td>{{user.phone}}</td>
                  </tr>
                  <tr>
                    <th scope="row">Correo :</th>
                    <td>{{user.email}}</td>
                  </tr>
                  <tr>
                    <th scope="row">Ciudad :</th>
                    <td>{{user.city}}</td>
                  </tr>
                  <tr>
                    <th scope="row">Estado :</th>
                    <td>{{user.state}}</td>
                  </tr>
                  <tr>
                    <th scope="row">Pais :</th>
                    <td>{{user.country}}</td>
                  </tr>
                  <tr>
                    <th scope="row">Saldo :</th>
                    <td>{{Number(user.wallet).toLocaleString("es-CO", { style: "currency",currency: "COP",minimumFractionDigits: 0,})}}</td>
                  </tr>
                  <tr>
                    <th scope="row">Fecha de operación:</th>
                    <td class="d-flex align-items-center">
                        <div v-if="!statusOpdate" class="ml-3 w-100">{{this.dateinit }}</div>
                        <div v-if="statusOpdate"  class="ml-3 w-100">
                            <date-picker
                                :initial-date="new Date()"
                                v-model="value1"
                                type="datetime"
                                ref="datepicker"
                                placeholder="Seleccionar fecha"
                                :show-time-panel="showTimePanel"
                                @close="handleOpenChange"
                            >
                                <template v-slot:footer>
                                    <button class="mx-btn mx-btn-text" @click="toggleTimePanel">
                                        {{ showTimePanel ? 'fecha' : 'hora' }}
                                    </button>
                                    <button class="mx-btn mx-btn-text text-primary" @click="handleSaveChange">
                                        {{ 'Confirmar' }}
                                    </button>
                                </template>
                            </date-picker>
                        </div>
                        <div class="mx-3 w-100">
                            <b-button v-if="!statusOpdate" @click="() => this.statusOpdate = true" class="" variant="primary" size="sm" >Modificar</b-button>
                            <b-button v-if="statusOpdate" @click="() => this.statusOpdate = false" class="" variant="danger" size="sm" >Cancelar</b-button>
                        </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- end card -->
      </div>

    </div>
    <!-- end row -->
  </Layout>
</template>