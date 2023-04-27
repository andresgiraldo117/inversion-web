<script>
import DatePicker from "vue2-datepicker";

import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import PageHeader from "@/components/page-header";
import moment from 'moment';
import { todoMethods, authFackComputed } from "@/state/helpers";
import Swal from "sweetalert2";

import { ordersDataHistory } from "./data";

/**
 * Orders component
 */
export default {
  page: {
    title: "Orders",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    DatePicker,
    Layout,
    PageHeader,
  },
  data() {
    return {
      ordersData: [],
      ordersDataHistory: [],
      ordersDataHistoryAll: [],
      title: "Resultados",
      items: [
        {
          text: "",
          active: true,
        },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "value",
      sortDesc: false,
      fields: [
        {
          key: "date",
          sortable: true,
          label: "Fecha",
          class:"text-capitalize",
          formatter: (value, key, item) => {
            return moment(item.date).locale('es').format('dddd, D MMMM')

          }
        },
        {
          key: "type",
          label: "Tipo de operación",
          sortable: true,
        },
        {
          key: "coin",
          label: "Moneda",
          sortable: true,
        },
        {
          key: "porcentaje",
          label: "Porcentaje %",
          sortable: true,
          formatter: (value, key, item) => {
            return item.porcentaje + '%'
          }
        },
        {
          key: "accion",
          label: "Acción",
          sortable: true,
        },
      ],
      fields2: [
        {
          key: "date",
          sortable: true,
          label: "Fecha",
          class:"text-capitalize",
          formatter: (value, key, item) => {
            return moment(item.date).locale('es').format('dddd, D MMMM')

          }
        },
        {
          key: "type",
          label: "Tipo de operación",
          sortable: true,
        },
        {
          key: "coin",
          label: "Moneda",
          sortable: true,
        },
        {
          key: "porcentaje",
          label: "Porcentaje %",
          sortable: true,
          formatter: (value, key, item) => {
            return item.porcentaje + '%'
          }
        },
      ],
      typeValue:'',
      porceValue:'',
      moneyselet : '',
      arrMoneda:[
        "EURUSD",
        "USDJPY",
        "GBPUSD",
        "AUDUSD",
        "USDCAD",
        "USDCHF",
        "NZDUSD",
        "EURJPY",
        "EURGBP",
        "EURAUD",
        "EURCAD",
        "EURCHF",
        "EURNZD",
        "GBPJPY",
        "GBPAUD",
        "GBPCAD",
        "GBPCHF",
        "GBPNZD",
        "AUDCHF",
        "AUDNZD",
        "AUDJPY",
        "AUDCAD",
        "CADCHF",
        "NZDCAD",
        "CADJPY",
        "CHFNZD",
        "CHFJPY",
        "NZDJPY",
        "XAUUSD"
      ],
      coinvalue: "",
      statusValue: "",
      typeValue: null,
      datepickervalue: "",
      updateform : false,
      itemselect : {},
    };
  },
  computed: {
    ...authFackComputed,
    /**
     * Total no. of records
     */
    rows() {
      return this.ordersData.length;
    },
  },
  mounted() {
    this.fetchOperationList({
      token: this.$store.state.authfack.user.token,
    }).then(res => {
      res.sort((a,b) => new Date(b.date) - new Date(a.date));
      this.ordersDataHistory = res.filter(item => {
        if(moment(item.date).format('MMMM') === moment(this.today).format('MMMM')) return item
      })
      this.ordersDataHistoryAll = res
    })
    // Set the initial number of items
    this.totalRows = this.items.length;
    this.datepickervalue = new Date();
    this.today = new Date()

  },
  methods: {
    ...todoMethods,

    disabledAfterToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today
    },

    tryToEdit(item){

      this.itemselect = item;
      this.updateform = true;

      this.datepickervalue = new Date(item.date)
      this.typeValue = item.type;
      this.moneyselet = item.coin;
      this.porceValue = item.porcentaje;
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    updateResult(){
      if(!this.typeValue || 
        !this.moneyselet || 
        !this.datepickervalue || 
        !this.porceValue){
        return Swal.fire("Error!", 'Campos incompletos', "error");
      }else{
        Swal.fire({
          title: "Estas seguro?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor:"#fdc836",
          cancelButtonColor: "#08403e",
          confirmButtonText: "Si, Modificar!"
        }).then(result => {
          if (result.value) {
            let data = {
              date: moment(this.datepickervalue).format(),
              type: this.typeValue,
              coin: this.moneyselet,
              porcentaje: this.porceValue
            }
            this.fetchOperationUpdated({
              data: data,
              token: this.$store.state.authfack.user.token,
              id: this.itemselect._id
            }).then(res => {
              Swal.fire("Listo!", res.message, "success");
              this.fetchOperationList({
                token: this.$store.state.authfack.user.token,
              }).then(res => {
                res.sort((a,b) => new Date(b.date) - new Date(a.date));
                this.ordersDataHistory = res
              })
              this.clearform();
            })
          }
        })
      }
    },
    addResult(){
      if(!this.typeValue || 
        !this.moneyselet || 
        !this.datepickervalue || 
        !this.porceValue){
        return Swal.fire("Error!", 'Campos incompletos', "error");
      }else{
        Swal.fire({
          title: "Estas seguro?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor:"#fdc836",
          cancelButtonColor: "#08403e",
          confirmButtonText: "Si, Crear!"
        }).then(result => {
          if (result.value) {
            let data = {
              status: true,
              date: moment(this.datepickervalue).format(),
              type: this.typeValue,
              coin: this.moneyselet,
              porcentaje: this.porceValue
            }
            //this.ordersData.push(res)
            this.fetchOperationCreated({
              data: data,
              token: this.$store.state.authfack.user.token,
            }).then(res => {
              Swal.fire("Listo!", res.message, "success");
              this.fetchOperationList({
                token: this.$store.state.authfack.user.token,
              }).then(res => {
                res.sort((a,b) => new Date(b.date) - new Date(a.date));
                this.ordersDataHistory = res
              })
              this.clearform();
              //this.ordersDataHistory = res
            })
          }})
      }
    },
    clearform(){
      this.updateform = false;
      this.moneyselet = ""
      this.porceValue = ""
      this.typeValue = null
      this.datepickervalue = new Date();

    },
  },
};
</script>

<template lang="en">

<Layout>
  <PageHeader :title="title" :items="items" />
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <b-tabs content-class="p-3" nav-class="nav-tabs-custom">
                        <b-tab title="Crear resultado" active>
                            <form>
                                <div class="row">
                                    <div class="col-xl col-sm-6">
                                        <div class="form-group mt-3 mb-0">
                                            <label>Fecha: </label>
                                            <date-picker 
                                            v-model="datepickervalue" 
                                            :first-day-of-week="1" 
                                            lang="en"
                                            :disabled-date="disabledAfterToday">
                                            </date-picker>
                                        </div>
                                    </div>

                                    <div class="col-xl col-sm-6">
                                        <div class="form-group mt-3 mb-0">
                                            <label>Moneda</label>
                                            <select v-model="moneyselet" class="form-control select2-search-disable">
                                                <option v-for="(item,index) of arrMoneda" :key="index" :value="item">{{item}}</option>
                                            </select>
                                        </div>
                                    </div>


                                     <div class="col-xl col-sm-6">
                                        <div class="form-group mt-3 mb-0">
                                            <label>Tipo</label>
                                            <select v-model="typeValue" class="form-control select2-search-disable">
                                                <option value="Compra">Compra</option>
                                                <option value="Venta">Venta</option>
                                            </select>
                                        </div>
                                    </div>

                                     <div class="col-xl col-sm-6">
                                        <div class="form-group mt-3 mb-0">
                                            <label>Porcentaje</label>
                                            <input v-model="porceValue" class="form-control" type="number">
                                        </div>
                                    </div>


                                    <div class="col-xl col-sm-6 align-self-end">
                                        <div class="p-1 d-flex align-items-center">
                                            <a v-if="!updateform" @click="addResult" role="button" class="btn btn-primary w-md">
                                                Añadir resultado
                                            </a>
                                            <a v-if="updateform" @click="updateResult" role="button" class="btn btn-secondary w-md">
                                                Modificar
                                            </a>
                                            <a v-if="updateform" @click="clearform" role="button" class="btn btn-danger w-md mx-1">
                                                Cancelar
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <!-- Table -->
                            <div class="table-responsive mt-3 mb-0">
                                <b-table :items="ordersDataHistory" :fields="fields" responsive="sm">
                                  <template #cell(type)="data">
                                    <span v-if="data.item.type === 'Compra'">
                                    <i class="bx bx-up-arrow-alt text-success font-size-18"></i>
                                    Compra
                                    </span>
                                    <span v-if="data.item.type === 'Venta'">
                                    <i class="bx bx-down-arrow-alt text-danger font-size-18 "></i>
                                    Venta
                                    </span>
                                  </template>
                                  <template #cell(accion)="data">
                                    <button class="btn btn-outline-secondary btn-sm" @click="tryToEdit(data.item)">
                                      Editar
                                    </button>
                                  </template>
                                </b-table>
                            </div>
                            <div class="row" v-if="ordersDataHistory.length >= 10">
                              <div class="col">
                                <div class="dataTables_paginate paging_simple_numbers float-end">
                                  <ul class="pagination pagination-rounded mb-0">
                                    <!-- pagination -->
                                    <b-pagination v-model="currentPage" :total-rows="ordersDataHistory.length" :per-page="perPage">
                                    </b-pagination>
                                  </ul>
                                </div>
                              </div>
                            </div>
                        </b-tab>
                        <b-tab title="Historial">
                            <div class="table-responsive mt-3 mb-0">
                                <b-table :key="" :items="ordersDataHistoryAll" :fields="fields2" responsive="sm" :per-page="perPage" :current-page="currentPage" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :filter="filter" :filter-included-fields="filterOn" @filtered="onFiltered">
                                  <template #cell(type)="data">
                                    <span v-if="data.item.type === 'Compra'">
                                      <i class="bx bx-up-arrow-alt text-success font-size-18"></i>
                                      Compra
                                    </span>
                                    <span v-if="data.item.type === 'Venta'">
                                      <i class="bx bx-down-arrow-alt text-danger font-size-18 "></i>
                                      Venta
                                    </span>
                                  </template>
                                </b-table>
                                
                            </div>
                            <div class="row" v-if="ordersDataHistoryAll.length >= 10">
                              <div class="col">
                                <div class="dataTables_paginate paging_simple_numbers float-end">
                                  <ul class="pagination pagination-rounded mb-0">
                                    <!-- pagination -->
                                    <b-pagination v-model="currentPage" :total-rows="ordersDataHistoryAll.length" :per-page="perPage">
                                    </b-pagination>
                                  </ul>
                                </div>
                              </div>
                            </div>
                        </b-tab>
                    </b-tabs>
                </div>
            </div>
        </div>
    </div>
</Layout>
</template>
