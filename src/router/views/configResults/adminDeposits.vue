<script>
import vue2Dropzone from "vue2-dropzone";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import moment from 'moment';
import Swal from "sweetalert2";

import { todoMethods, todoComputed, authFackComputed } from "@/state/helpers";

/**
 * Advanced table component
 */
export default {
  page: {
    title: "admin-depositos",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    Layout,
    PageHeader,
    vueDropzone: vue2Dropzone,
  },
  data() {
    return {
      urlapi: process.env.VUE_APP_API,
      title: "Depósitos",
      items: [],
      totalRows: 1,
      todoTotalRows: 1,
      currentPage: 1,
      todocurrentPage: 1,
      perPage: "10",
      todoperPage: 10,
      selectedYear: "2022",
      pageOptionsYear: ["2022"],
      selected: "",
      pageOptions: [
        { value: '01', text: 'Enero' },
        { value: '02', text: 'Febrero' },
        { value: '03', text: 'Marzo' },
        { value: '04', text: 'Abril' },
        { value: '05', text: 'Mayo' },
        { value: '06', text: 'Junio' },
        { value: '07', text: 'Julio' },
        { value: '08', text: 'Agosto' },
        { value: '09', text: 'Septiembre' },
        { value: '10', text: 'Octubre' },
        { value: '11', text: 'Noviembre' },
        { value: '12', text: 'Diciembre' },
      ],
      selectedMoneda:'',
      pageOptionsMoneda: [
        { value: 'USDT', text: 'USD' },
        { value: 'COP', text: 'COP' },
      ],
      todoOptions: [10, 50, 100, 150, 200],
      filter: null,
      todoFilter: null,
      filterOn: [],
      todofilterOn: [],
      sortBy: "age",
      sortDesc: false,
      fields: [
        {
          key: "fecha",
          sortable: true,
        },
        {
          key: "valor",
          sortable: true,
        },
        {
          key: "metodo",
          sortable: true,
        },
        {
          key: "banco",
          sortable: true,
        },
        {
          key: "comprobante",
          sortable: true,
        },
        {
          key: "estado",
          sortable: true,
        },
      ],
      depositDataHistory: [],
      dataBackup: [],
      urlcomprobante : '',
      valueChange : '',
      idTransactionChange : '',

    };
  },
  computed: {
    ...todoComputed,
    ...authFackComputed,
  },
  mounted() {
    this.load_fetchTransactionList();
  },
  methods: {
    ...todoMethods,
    formaterDate(date){
      return moment(date).locale('es').format('dddd, D MMMM');
    },
    tryToLogIn(url) {
      this.urlcomprobante = this.urlapi + 'transactions/mediafiles/'+ url
      this.$refs['modal-comprobante'].show()
    },

    load_fetchTransactionList(){
      this.fetchTransactionList({
        token: this.$store.state.authfack.user.token,
      }).then(res => {
        res.sort((a,b) => new Date(b.date) - new Date(a.date));

        this.depositDataHistory = res.filter(item => item.type_transactions === 'deposito')
        this.dataBackup = res.filter(item => item.type_transactions === 'deposito')
      });
    },
    loadLiquidation(){
      Swal.fire({
        title: "Estas seguro de liquidar hasta esta fecha?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor:"#fdc836",
        cancelButtonColor: "#08403e",
        confirmButtonText: "Si, liquidar!"
      }).then(result => {
        if (result.value) {
          this.fetchTransactionLiqudation({
            token: this.$store.state.authfack.user.token,
          }).then(res => {
            this.load_fetchTransactionList();
            Swal.fire("Listo!", res.message, "success");
          })
        }
      })
    },
    loadDebitos(){
      Swal.fire({
        title: "Estas seguro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor:"#fdc836",
        cancelButtonColor: "#08403e",
        confirmButtonText: "Si, cargar debitos!"
      }).then(result => {
        if (result.value) {
          this.fetchTransactionLoad({
            token: this.$store.state.authfack.user.token,
          }).then(res => {
            this.load_fetchTransactionList();
            Swal.fire("Listo!", res.message, "success");
          })
        }})
    },
    changeMoney(id){
      this.idTransactionChange = id;
      this.$refs['modal-changemoney'].show()
    },
    changeValueMoney(){
      Swal.fire({
        title: "Estas seguro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor:"#fdc836",
        cancelButtonColor: "#08403e",
        confirmButtonText: "Si, modificar valor!"
      }).then(result => {
        if (result.value) {
          if(this.valueChange < 1){
            return Swal.fire("Oops...",'Valor invalido', "error");
          }else {
            /* let formData = new FormData();
            formData.append( 'valor', this.valueChange );
            formData.append( 'moneda_transactions', 'USDT'); */
            let formData = {
              valor : this.valueChange,
              moneda_transactions : 'USDT'
            }

            this.fetchTransactionusdtUpdate({
              data: formData,
              token: this.$store.state.authfack.user.token,
              id: this.idTransactionChange,
            }).then(res => {
              this.load_fetchTransactionList();
              this.$refs['modal-changemoney'].hide()

              if(res.status === 200){
                Swal.fire("Listo!", res.message, "success");
              }else{
                Swal.fire("Oops...", res.message, "error");
              }
            })
          }
        }
      })
    },
    resetFilter(){
      this.selectedMoneda = ''
      this.selected = ''
      this.selectedYear = ''
      this.depositDataHistory = this.dataBackup
    },
    changeFilter(key){
      if(key === 'moneda'){
        this.depositDataHistory = this.dataBackup.filter(item => item.moneda_transactions === this.selectedMoneda)
      }else if (key === 'month'){
        this.depositDataHistory = this.dataBackup.filter(item => moment(item.date).locale('es').format('M') === moment(this.selected).locale('es').format('M'))
      }else if(key === 'year'){
        this.depositDataHistory = this.dataBackup.filter(item => moment(item.date).locale('es').format('Y') === this.selectedYear )
      }
    },
    loadUserValue(id , userId){
      Swal.fire({
        title: "Estas seguro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor:"#fdc836",
        cancelButtonColor: "#08403e",
        confirmButtonText: "Si, continuar!"
      }).then(result => {
        if (result.value) {

          //let formData = new FormData();
          //formData.append( 'completed', true );
          //formData.append( 'userId', userId );
          let formData = {
            completed : true,
            userId : userId
          }

          this.fetchTransactionLoadByUser({
            data: formData,
            token: this.$store.state.authfack.user.token,
            id: id
          }).then(res => {
            this.load_fetchTransactionList();
            if(res.status === 200){
              Swal.fire("Listo!", res.message, "success");
            }else{
              Swal.fire("Oops...", res.message, "error");
            }
          })
        }
      })
    },
    changeUserStatus(state , id , userId){
      Swal.fire({
        title: "Estas seguro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor:"#fdc836",
        cancelButtonColor: "#08403e",
        confirmButtonText: "Si, continuar!"
      }).then(result => {
        if (result.value) {

          let formData = new FormData();
          formData.append( 'status', state ? 'approved' : 'rejected' );
          
          this.fetchTransactionUpdate({
            data: formData,
            token: this.$store.state.authfack.user.token,
            id: id,
            userId: userId
          }).then(res => {
            this.load_fetchTransactionList();
            if(res.status === 200){
              Swal.fire("Listo!", res.message, "success");
            }else{
              Swal.fire("Oops...", res.message, "error");
            }
          })
        }
      })
    }
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row p-2 mt-4 col-12">
              <!-- Search -->
              <div class="col-md-3">
                <b-form-group
                  class="mb-3"
                  id="example text"
                  label-cols-lg="3"
                  label-cols-sm="3"
                  label="Mes"
                  label-for="text"
                >
                  <b-form-select
                    class="form-select"
                    id="formrow-inputState"
                    :options="pageOptions"
                    v-model="selected"
                    type="text"
                    @change="changeFilter('month')"
                  >
                  </b-form-select>
                </b-form-group>
              </div>
              <div class="col-md-3">
                <b-form-group
                  class="mb-3"
                  id="example text"
                  label-cols-lg="3"
                  label-cols-sm="3"
                  label="Año"
                  label-for="text"
                >
                  <b-form-select
                    class="form-select"
                    id="formrow-inputState"
                    :options="pageOptionsYear"
                    v-model="selectedYear"
                    type="text"
                    @change="changeFilter('year')"
                  >
                  </b-form-select>
                </b-form-group>
              </div>
              <div class="col-md-4">
                <b-form-group
                  class="mb-3"
                  id="example text"
                  label-cols-lg="3"
                  label-cols-sm="3"
                  label="Moneda"
                  label-for="text"
                >
                  <b-form-select
                    class="form-select"
                    id="formrow-inputState"
                    :options="pageOptionsMoneda"
                    v-model="selectedMoneda"
                    type="text"
                    @change="changeFilter('moneda')"
                  >
                  </b-form-select>
                </b-form-group>
              </div>
              <div class="col-md-2">
                <button class="btn btn-primary w-100" @click="resetFilter()">
                  Limpiar
                </button>
              </div>
              <!-- End search -->
            </div>
            <!-- Table -->
            <div class="table-responsive" style="padding-bottom: 5rem">
              <table
                class="table table-nowrap table-centered mb-0 align-middle"
              >
                <thead>
                  <tr>
                    <th scope="col">Acción</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Depósito</th>
                    <th scope="col">Método</th>
                    <th scope="col">Banco</th>
                    <th scope="col">Moneda</th>
                    <th scope="col">Usuario</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Comprobante</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in depositDataHistory" :key="item._id">
                    <th scope="row">
                      <div
                        class="col-12 d-flex align-items-center text-secondary"
                      >
                        <b-dropdown
                          :disabled="item.completed"
                          class=""
                          variant="light"
                          menu-class="dropdown-menu-right"
                        >
                          <template v-slot:button-content>
                            Setting
                            <i class="mdi mdi-chevron-down"></i>
                          </template>
                          <b-dropdown-item
                            v-if="item.moneda_transactions === 'COP'"
                            @click="changeMoney(item._id)"
                            ><i class="text-info bx bx-dollar-circle"></i>
                            Convertir</b-dropdown-item
                          >
                          <b-dropdown-item
                            v-if="!item.completed && item.moneda_transactions !== 'COP' && item.status !== 'approved'"
                            @click="changeUserStatus(true,item._id,item.user[0]._id)"
                            ><i class="text-success bx bx-check-double"></i>
                            Confirmar</b-dropdown-item
                          >
                          <b-dropdown-item
                            v-if="!item.completed && item.moneda_transactions !== 'COP' && item.status === 'approved'"
                            @click="loadUserValue(item._id,item.user[0]._id)"
                            ><i class="text-success bx bx-cloud-upload"></i>
                            Cargar</b-dropdown-item
                          >
                          <b-dropdown-item
                            v-if="!item.completed && item.status !== 'rejected'"
                            @click="changeUserStatus(false,item._id,item.user[0]._id)"
                            ><i class="text-danger bx bx-block"></i>
                            Rechazar</b-dropdown-item
                          >
                        </b-dropdown>
                      </div>
                    </th>
                    <th scope="row">
                      <div class="text-muted text-capitalize ">
                        <span>{{ formaterDate(item.date) }}</span>
                      </div>
                    </th>
                    <th scope="row">
                      <div class="text-muted">{{ Number(item.valor).toLocaleString("es-CO", { style: "currency",currency: "COP",minimumFractionDigits: 0,}) }}</div>
                    </th>
                    <td>
                      <div class="text-muted">{{ item.metodo_transactions }}</div>
                    </td>
                    <td>
                      <div class="text-muted">{{ item.banco }}</div>
                    </td>
                    <td>
                      <div class="text-muted">{{ item.moneda_transactions }}</div>
                    </td>
                    <td>
                      <div class="text-muted">{{ item.user[0].name + ' ' + item.user[0].lastname }}</div>
                    </td>
                    <td v-if="!item.completed">
                      <div v-if="item.status === 'approved'" class="text-warning  m-1">Verificado</div>
                      <div v-if="item.status === 'pending'" class="text-info  m-1">Pendiente</div>
                      <div v-if="item.status === 'rejected'" class="text-danger  m-1">Rechazado</div>
                    </td>
                    <td v-if="item.completed">
                      <div class="text-success  m-1">Cargado</div>
                    </td>
                    <td class="text-center" style="width: 120px;">
                      <button class="btn btn-primary btn-sm" @click="tryToLogIn(item.comprobante)">
                        ver
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
              <b-modal
                    id="modal-scrollable"
                    scrollable
                    centered
                    title="Comprobante"
                    title-class="font-14"
                    ref="modal-comprobante"
                    size="md"
                    hide-footer
                  >
                    <div>
                      <img class="img-fluid mx-auto d-block" :src="urlcomprobante" crossorigin="anonymous" alt="comprobante de transacción">
                    </div>
              </b-modal>
              <b-modal
                    id="modal-scrollable"
                    scrollable
                    centered
                    title="Cambiar a USDT"
                    title-class="font-14"
                    ref="modal-changemoney"
                    size="md"
                    hide-footer
                  >
                    <div>

                    <label>Añadir monto en dolares :</label>
                      <div class="input-group mb-3">
                        <div class="input-group-prepend">
                          <label class="input-group-text"
                            >Valor a cambiar</label
                          >
                        </div>
                        <input v-model="valueChange" type="number" class="form-control" />
                        <div class="input-group-append">
                          <label class="input-group-text">$</label>
                        </div>
                      </div>
                      <div class="w-100 text-center">
                        <button @click="changeValueMoney" class="btn btn-primary btn-md">
                          Cambiar
                        </button>
                      </div>
                    </div>
              </b-modal>
            <div class="row">
              <div class="col">
                <div
                  class="dataTables_paginate paging_simple_numbers float-end"
                >
                  <ul class="pagination pagination-rounded mb-0">
                    <!-- pagination -->
                    <b-pagination
                      v-model="currentPage"
                      :per-page="perPage"
                    ></b-pagination>
                  </ul>
                </div>
              </div>
            </div>
            <button
              class="btn btn-primary mx-2"
              @click="loadDebitos"
              >
              Cargar de saldos manual
            </button>
            <button
              class="btn btn-primary mx-2"
              @click="loadLiquidation"
              >
              Liquidación
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>