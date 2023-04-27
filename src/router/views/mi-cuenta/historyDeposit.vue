<script>

import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import moment from 'moment';

import { todoMethods, todoComputed, authFackComputed } from "@/state/helpers";

/**
 * Advanced table component
 */
export default {
  page: {
    title: "Historial",
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
      urlapi: process.env.VUE_APP_API,
      title: "Depósitos",
      items: [
        {
          text: "Depósitos",
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
      pageOptionsYear: ['2022'],
      selected: '',
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
      editableTablefields: [
        { key: "fecha", label: "Fecha", type: "text", editable: true},
        { key: "valor", label: "Deposito", type: "number", editable: true },
        { key: "metodo", label: "Metodo", type: "text", editable: true },
        { key: "banco", label: "Banco", type: "text", editable: true },
        { key: "comprobante", label: "Comprobante", type: "text", editable: true },
        { key: "estado", label: "Estado", type: "text", editable: true },
      ],
       editableDataItems: [
         {
            fecha: '1 de Julio del 2022',
            valor: '1000',
            metodo: 'Transferencia',
            banco: 'Bancolombia',
            estado: 'Confirmado',
            comprobante: '',
         },
         {
            fecha: '3 de Julio del 2022',
            valor: '1500',
            metodo: 'Transferencia',
            banco: 'Bancolombia',
            comprobante: '',
            estado: 'Confirmado',
         },
         {
            fecha: '12 de Julio del 2022',
            valor: '1500',
            metodo: 'Transferencia',
            banco: 'BBVA',
            comprobante: '',
            estado: 'Pendiente',
         },
        ],
        depositDataHistory: [],
        dataBackup: [],
        urlcomprobante : '',
    };
  },
  computed: {
    ...authFackComputed,
    ...todoComputed,
    /**
     * Total no. of records
     */
    rows() {
      return this.editableDataItems.length;
    },

    /**
     * Todo list of records
     */
    todoList() {
      return this.todos.length;
    },
  },
  mounted() {
    this.fetchTransactionListbyId({
      userId : this.currentUser._id,
      token: this.$store.state.authfack.user.token,
    }).then(res => {
      res.transaccion.sort((a,b) => new Date(b.date) - new Date(a.date));
      this.depositDataHistory = res.transaccion.filter(item => item.type_transactions === 'deposito')
      this.dataBackup = res.transaccion.filter(item => item.type_transactions === 'deposito')
    })
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
    /**
     * Search the table data with search input
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    todoFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.todoTotalRows = filteredItems.length;
      this.todocurrentPage = 1;
    },

    handleInput(value, data) {
      this.editableDataItems[data.index][data.field.key] = value;
    }
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" />

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row mt-4 col-12">
              <!-- Search -->
              <div class="col-md-3">
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
            <div class="table-responsive">
              <table class="table table-nowrap table-centered mb-0 align-middle">
                <thead>
                  <tr>
                    <th scope="col">Fecha</th>
                    <th scope="col">Deposito</th>
                    <th scope="col">Metodo</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Banco</th>
                    <th scope="col">Moneda</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Comprobante</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in depositDataHistory" :key="item._id">
                    <th scope="row">
                      <div class="d-flex align-items-center text-capitalize">
                        <span>{{formaterDate(item.date)}}</span>
                      </div>
                    </th>
                    <th scope="row">
                        <div class="text-muted">{{ Number(item.valor).toLocaleString("es-CO", { style: "currency",currency: "COP",minimumFractionDigits: 0,})}}</div>
                    </th>
                    <td>
                      <div class="text-muted text-capitalize">{{item.metodo_transactions}}</div>
                    </td>
                    <td>
                      <div class="text-muted text-capitalize">{{item.type_transactions}}</div>
                    </td>
                    <td>
                      <div class="text-muted text-capitalize">{{item.banco}}</div>
                    </td>
                    <td>
                      <div class="text-muted">{{item.moneda_transactions }}</div>
                    </td>
                    <td v-if="!item.completed">
                      <div v-if="item.status === 'approved'" class="text-warning  m-1">Verificado</div>
                      <div v-if="item.status === 'pending'" class="text-info  m-1">Pendiente</div>
                      <div v-if="item.status === 'rejected'" class="text-danger  m-1">Rechazado</div>
                    </td>
                    <td v-if="item.completed">
                      <div class="text-success  m-1">Cargado</div>
                    </td>
                    <td style="width: 120px;">
                      <button :disabled="item.comprobante === ''" class="btn btn-primary btn-sm w-xs" @click="tryToLogIn(item.comprobante)">
                        Ver
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
            <div class="row">
              <div class="col">
                <div
                  class="dataTables_paginate paging_simple_numbers float-end"
                >
                  <ul class="pagination pagination-rounded mb-0">
                    <!-- pagination -->
                    <b-pagination
                      v-model="currentPage"
                      :total-rows="rows"
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