<script>

import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import moment from 'moment';

import { todoMethods, todoComputed, authFackComputed } from "@/state/helpers";

import { tableData } from "./dataAdvancedtable";

/**
 * Advanced table component
 */
export default {
  page: {
    title: "results",
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
  },
  data() {
    return {
      tableData: [],
      title: "Historial de Resultados",
      items: [
        {
          text: "",
          active: true,
        },
      ],
      totalRows: 1,
      todoTotalRows: 1,
      currentPage: 1,
      todocurrentPage: 1,
      perPage: '10',
      todoperPage: 10,
      selectedYear: '2022',
      pageOptionsYear: [
        '2022'
      ],
      selected: 'Julio',
      pageOptions: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],
      selectedMoneda:'COP',
      pageOptionsMoneda: [
          'USD',
          'COP'
      ],
      todoOptions: [10, 50, 100, 150, 200],
      filter: null,
      todoFilter: null,
      filterOn: [],
      todofilterOn: [],
      sortBy: "age",
      sortDesc: false,
      listop:[],
      fields: [
        {
          key: "date",
          label: "Fecha",
          sortable: true,
          formatter: (value, key, item) => {
            return moment(value).locale('es').format('dddd, D MMMM')
          }
        },
        {
          key: "type",
          label: "Tipo de movimiento",
          sortable: true,
        },
        {
          key: "coin",
          label: "Tipo de moneda",
          sortable: true,
        },
        {
          key: "porcentaje",
          label: "Rendimiento %",
          sortable: true,
        },
      ],
    };
  },
  computed: {
    ...todoComputed,
    ...authFackComputed,
  },
  mounted() {
    this.fetchBalanceList({
      token: this.$store.state.authfack.user.token,
    }).then(res => {
        res.sort((a,b) => new Date(b.date) - new Date(a.date));
        this.tableData = res;
    })
  },
  methods: {
    ...todoMethods,

    money(val){
      return Number(val).toLocaleString("es-CO", { style: "currency",currency: "COP",minimumFractionDigits: 0,})
    },

    tryToDetalle(date) {

      this.fetchOperationList({
        token: this.$store.state.authfack.user.token,
      }).then(res => {
        res.sort((a,b) => new Date(b.date) - new Date(a.date));
        this.listop = res.filter(it =>{
          if(moment(date).format() > moment(it.date).format()) return it
        })
        this.$refs['modal-detalles'].show()
      })
    },
    changeDate(date){
      return moment(date).locale('es').format('MMMM YYYY');
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
            <div class="row mt-4 col-12">
              <!-- Search -->
              <div class="col-md-4">
                <b-form-group
                  class="mb-3"
                  id="example text"
                  label-cols-lg="3"
                  label="Mes"
                  label-for="text"
                >
                  <b-form-select
                    class="form-select"
                    id="formrow-inputState"
                    :options="pageOptions"
                    v-model="selected"
                    type="text"
                  >
                  </b-form-select>
                </b-form-group>
              </div>
              <div class="col-md-4">
                <b-form-group
                  class="mb-3"
                  id="example text"
                  label-cols-lg="3"
                  label="Año"
                  label-for="text"
                >
                  <b-form-select
                    class="form-select"
                    id="formrow-inputState"
                    :options="pageOptionsYear"
                    v-model="selectedYear"
                    type="text"
                  >
                  </b-form-select>
                </b-form-group>
              </div>
              <!-- End search -->
            </div>
            <!-- Table -->
            <div class="table-responsive">
              <table class="table table-nowrap table-centered mb-0 align-middle">
                <thead>
                  <tr>
                    <th scope="col">Dia</th>
                    <th scope="col">Capital Inicial</th>
                    <th scope="col">Rendimiento en %</th>
                    <th scope="col">Rendimiento en $</th>
                    <!-- <th scope="col">Adiciones</th>
                    <th scope="col">Retiros</th> -->
                    <th scope="col">Balance</th>
                    <th scope="col">Operaciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in tableData" :key="item._id">
                    <th scope="row">
                      <div class="d-flex align-items-center text-capitalize">
                        <span>{{ changeDate(item.date)}}</span>
                      </div>
                    </th>
                    <th scope="row">
                        <div class="text-muted">{{item.capital}}</div>
                    </th>
                    <td>
                      <div class="text-muted">{{item.rendimiento_aco_porcentaje}}%</div>
                    </td>
                    <td>
                      <div class="text-muted">{{money(item.rendimiento_aco_moneda)}}</div>
                    </td>
                    <!-- <td>
                      <div class="text-muted">{{item.adiciones}}</div>
                    </td>
                    <td>
                      <div class="text-muted">{{item.retiros}}</div>
                    </td> -->
                    <td>
                      <div class="text-muted">{{money(item.capital + (item.capital * item.rendimiento_aco_porcentaje)/100)}}</div>
                    </td>
                    <td style="width: 120px;">
                      <button class="btn btn-primary btn-sm w-xs" @click="tryToDetalle(item.date)">
                        Detalles
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
                title="Operaciones"
                title-class="font-14"
                ref="modal-detalles"
                size="lg"
                hide-footer
              >
                <div>
                  <div class="table-responsive mt-3 mb-0">
                      <b-table :items="listop" :fields="fields" responsive="sm" :per-page="perPage" :current-page="currentPage" >
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
                          <template #cell(status)="data">
                            <span v-if="data.item.status">
                            Completa
                            </span>
                            <span v-if="!data.item.status">
                            <i class="bx bx-down-arrow-alt text-danger font-size-18 "></i>
                            Completa
                            </span>
                          </template>
                      </b-table>
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
          </div>
        </div>
      </div>
    </div>

  </Layout>
</template>