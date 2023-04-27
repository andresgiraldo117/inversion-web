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
    title: "admin-retiros",
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
      title: "Retiros",
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
      retreatsDataHistory: [],
      dataBackup: [],
      selecteddata: {},
      urlcomprobante : '',
      valueChange : '',
      idTransactionChange : '',

    };
  },
  computed: {
    ...todoComputed,
    ...authFackComputed,

    /**
     * Total no. of records
     */
    rows() {
      return this.retreatsDataHistory.length;
    },

  },
  mounted() {
    this.load_fetchTransactionList();
  },
  methods: {
    ...todoMethods,

    formaterDate(date){
      return moment(date).locale('es').format('dddd, D MMMM');
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
    tryToLogIn(url) {
      this.urlcomprobante = this.urlapi + 'transactions/mediafiles/'+ url
      this.$refs['modal-comprobante'].show()
    },

    load_fetchTransactionList(){
      this.fetchTransactionList({
        token: this.$store.state.authfack.user.token,
      }).then(res => {
        res.sort((a,b) => new Date(b.date) - new Date(a.date));

        this.retreatsDataHistory = res.filter(item => item.type_transactions === 'retiro');
        this.dataBackup = res.filter(item => item.type_transactions === 'retiro');
        this.retreatsDataHistory.map(it => {
          it.data = JSON.parse(it.data);
        })
        this.totalRows = this.retreatsDataHistory.length;

      });
    },
    resetFilter(){
      this.selectedMoneda = ''
      this.selected = ''
      this.selectedYear = ''
      this.retreatsDataHistory = this.dataBackup
    },
    changeFilter(key){
      if(key === 'moneda'){
        this.retreatsDataHistory = this.dataBackup.filter(item => item.moneda_transactions === this.selectedMoneda)
      }else if (key === 'month'){
        this.retreatsDataHistory = this.dataBackup.filter(item => moment(item.date).locale('es').format('M') === moment(this.selected).locale('es').format('M'))
      }else if(key === 'year'){
        this.retreatsDataHistory = this.dataBackup.filter(item => moment(item.date).locale('es').format('Y') === this.selectedYear )
      }
    },
    changeUserStatus(state , id){
      Swal.fire({
        title: "Estas seguro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor:"#fdc836",
        cancelButtonColor: "#08403e",
        confirmButtonText: "Si, continuar!"
      }).then(result => {
        if (result.value) {

          let data = new FormData();
          data.append( 'status', state ? 'approved' : 'rejected' );

          this.fetchTransactionUpdate({
            data: data,
            token: this.$store.state.authfack.user.token,
            id: id
          }).then(res => {
            this.load_fetchTransactionList();
            Swal.fire("Listo!", res.message, "success");
          })
        }
      })
    },
    sendInfo(item) {
        this.selecteddata = item;
        this.$refs.fileimage.click();
    },
    uploadfile(){
      if(this.$refs.fileimage.files.length === 0){
        return Swal.fire("Error!",'Ningun archivo seleccionado', "error");
      }
      Swal.fire({
        title: "Estas seguro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor:"#fdc836",
        cancelButtonColor: "#08403e",
        confirmButtonText: "Si, cargar!"
      }).then(result => {
        if (result.value) {

          let formData = new FormData();
          formData.append( 'comprobante', this.$refs.fileimage.files[0] );
          formData.append( 'id_user', this.selecteddata.id_user );

          this.fetchTransactionUpdate({
            id: this.selecteddata._id,
            token: this.$store.state.authfack.user.token,
            data: formData
          }).then(res => {
            res.sort((a,b) => new Date(b.date) - new Date(a.date));
            this.load_fetchTransactionList();
            Swal.fire("Listo!", res.message, "success");
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
            <div class="row mt-4">
              <!-- Search -->
              <div class="col-md-3">
                <b-form-group
                  class="mb-3"
                  id="example text"
                  label-cols-lg="3"
                  label-cols-sm="3"
                  label-cols-xs="12"
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
                  label-cols-xs="12"
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
                  label-cols-xs="12"
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
              <table
                class="table table-nowrap table-centered mb-0 align-middle"
              >
                <thead>
                  <tr>
                    <th scope="col">Acción</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Usuario</th>
                    <th scope="col">Retiro</th>
                    <th scope="col">Método</th>
                    <th scope="col">Banco</th>
                    <th scope="col">Moneda</th>
                    <th scope="col">Nº de Cuenta</th>
                    <th scope="col">Titular</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Documento</th>
                    <th scope="col">Comprobante</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in retreatsDataHistory" :key="item._id">
                    <th scope="row">
                      <div
                        class="col-12 d-flex align-items-center text-secondary"
                      >
                        <b-dropdown
                          :disabled="item.status !== 'pending'"
                          class="w-xs"
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
                            @click="changeUserStatus(true,item._id)"
                            ><i class="text-success bx bx-check-double"></i>
                            Confirmar</b-dropdown-item
                          >
                          <b-dropdown-item
                            v-if="!item.completed"
                            @click="changeUserStatus(false,item._id)"
                            ><i class="text-danger bx bx-block"></i>
                            Rechazar</b-dropdown-item
                          >
                        </b-dropdown>
                      </div>
                    </th>
                    <td v-if="!item.completed">
                      <div v-if="item.status === 'approved'" class="text-success  m-1">Aprobado</div>
                      <div v-if="item.status === 'pending'" class="text-info  m-1">Pendiente</div>
                      <div v-if="item.status === 'rejected'" class="text-danger  m-1">Rechazado</div>
                    </td>
                    <td v-if="item.completed">
                      <div class="text-success  m-1">Cargado</div>
                    </td>
                    <th scope="row">
                      <div class="text-muted text-capitalize">
                        <span>{{ formaterDate(item.date) }}</span>
                      </div>
                    </th>
                    <th scope="row">
                      <div class="text-muted">
                        <span>{{ item.user[0].name + ' ' + item.user[0].lastname }}</span>
                      </div>
                    </th>
                    <th scope="row">
                      <div class="text-muted">{{ Number(item.valor).toLocaleString("es-CO", { style: "currency",currency: "COP",minimumFractionDigits: 0,})}}</div>
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
                      <div class="text-muted">{{ item.data.data_number_bank }}</div>
                    </td>
                    <td>
                      <div class="text-muted">{{ item.data.data_titular_bank }}</div>
                    </td>
                    <td>
                      <div class="text-muted">{{ item.data.data_type_bank }}</div>
                    </td>
                    <td>
                      <div class="text-muted">{{ item.data.data_document_bank }}</div>
                    </td>
                    <td class="text-center">
                      <b-button
                        v-if="item.comprobante === ''"
                        size="sm"
                        variant="outline-primary"
                        class="px-4 w-100"
                        @click="sendInfo(item)"
                      >
                        Subir
                      </b-button>
                      <button 
                      v-if="item.comprobante !== ''"
                      class="btn btn-primary btn-sm w-100" @click="tryToLogIn(item.comprobante)">
                        Ver
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <input
              type="file"
              class="d-none"
              id="inputGroupFile01"
              ref="fileimage"
              @change="uploadfile"
            />
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
              id="modal-sm"
              size="sm"
              title="Subir comprobante"
              title-class="font-18"
              hide-footer
            >
              <div class="row">
                <div class="col-12">
                  <div class="card">
                    <div class="card-body">
                      <!-- file upload -->
                      <div class="mb-3">
                      <label for="inputGroupFile01">
                        Ingrese el comprobante de pago
                      </label>
                    </div>
                      <div class="text-center mt-4">
                        <button type="button" class="btn btn-primary">
                          Subir archivo
                        </button>
                      </div>
                    </div>
                    <!-- end card-body -->
                  </div>
                  <!-- end card -->
                </div>
                <!-- end col -->
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