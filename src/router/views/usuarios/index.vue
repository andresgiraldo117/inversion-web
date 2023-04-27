<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import { todoMethods, authFackComputed } from "@/state/helpers";
import Swal from "sweetalert2";
import moment from 'moment';

/**
 * Contacts-list component
 */
export default {
  page: {
    title: "Usuarios",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      urlapi: process.env.VUE_APP_API,
      tableData: [],
      tableDataActive: 0,
      tableDataInactive: 0,
      title: "Lista de Usuarios",
      capital: 0,
      balance: 0,
      rendimentoPorc: 0,
      listop: [],
      filter: null,
      filterOn: [],
      sortBy: "value",
      sortDesc: false,
      items: [
        {
          text: "",
          active: true
        }
      ],
      urlcomprobante : '',
      totalRows: 1,
      currentPage: 1,
      perPage: 6,
      pageOptions: [10, 25, 50, 100],
      filterOn: [],
      filter: null,

      fields2: [
        {
          key: "opciones",
          label: "Opciones",
          sortable: true,
        },
        {
          key: "name",
          label: "Nombre",
          sortable: true,
        },
        {
          key: "identification_number",
          label: "Documento",
          sortable: true,
        },
        {
          key: "email",
          label: "Correo",
          sortable: true,
        },
        {
          key: "wallet",
          label: "Saldo",
          sortable: true,
          formatter: (value, key, item) => {
            return Number(item.wallet).toLocaleString("es-CO", { style: "currency",currency: "COP",minimumFractionDigits: 0,})
          }
        },
        {
          key: "status",
          label: "Status",
          sortable: true,
        },
      ],
    };
  },
  computed: {
    ...authFackComputed,
  },
  methods: {
    ...todoMethods,
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    formaterDate(date){
      if(date){
        return moment(date).locale('es').format('dddd, D MMMM');
      }else return "no tiene fecha de inicio"
    },
    sum(array, key) {
        let tot = 0;
        tot = (array.reduce((a, b) => a + (b[key] || 0), 0))
        return tot;
    },
    tryToLogIn(url) {
      this.urlcomprobante = this.urlapi + 'users/documents/'+ url
      this.$refs['modal-comprobante'].show()
    },
    load_fetchUserList(){
      this.fetchUserList({
        token: this.$store.state.authfack.user.token,
      }).then(res => {
        //let re = res.filter(item => item.role === 'cliente' && item._id === '62fe77807f0f0d46a17e25f3')
        let re = res.filter(item => item.role === 'cliente');
        this.totalRows = res.length;

        re.sort(( a, b ) => {
            if ( a.name < b.name ){
              return -1;
            }
            if ( a.name > b.name ){
              return 1;
            }
            return 0;
        });
        this.tableData = re
        this.capital = this.sum(re, 'wallet');
        
        this.fetchOperationList({
          token: this.$store.state.authfack.user.token,
        }).then(async respon => {

          let listarr = [];
          respon.filter(async it => {
            if(moment(it.date) > moment(this.$store.state.authfack.user.operation_date) && moment(it.date) < moment(new Date())){
              return listarr.push(it)
            } 
          })

          let balanceSum = 0;
          re.map(userClient => {
            let client_ordersDataToday = listarr.filter(it =>moment(it.date) > moment(userClient.operation_date) && moment(it.date) < moment(new Date()));
            let client_balance = ( (userClient.backup_win + userClient.wallet) + (userClient.wallet * this.sum(client_ordersDataToday, 'porcentaje'))/100);
            balanceSum += client_balance
          })

          this.listop = listarr
          this.balance = balanceSum;

          this.rendimentoPorc = (  this.sum(listarr, 'porcentaje')).toFixed(2);

        })

        setTimeout(() => {
          this.tableDataActive = (re.filter(it => it.status === "active")).length
          this.tableDataInactive = re.filter(it => it.status === "inactive").length
        }, 1000);


      })
    },
    deletedUserStatus(userId){
      Swal.fire({
        title: "Estas seguro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor:"#fdc836",
        cancelButtonColor: "#08403e",
        confirmButtonText: "Si, eliminar!"
      }).then(result => {
        if (result.value) {
          this.fetchUserDeleted({
            token: this.$store.state.authfack.user.token,
            userId: userId
          }).then(res => {
            this.load_fetchUserList();
            Swal.fire("Listo!", res.message, "success");
          })
        }
      })
    },
    changeUserStatus(state , userId){
      Swal.fire({
        title: "Estas seguro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor:"#fdc836",
        cancelButtonColor: "#08403e",
        confirmButtonText: "Si, cambiar estado!"
      }).then(result => {
        if (result.value) {
          let data = {
            status : state ? 'inactive' : 'active'
          }
          this.fetchUserUpdate({
            data: data,
            token: this.$store.state.authfack.user.token,
            userId: userId
          }).then(res => {
            this.load_fetchUserList();
            Swal.fire("Listo!", res.message, "success");
          })
        }
      })
    }
  },
  mounted() {
    this.load_fetchUserList()
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-9">
        <div class="card">
          <div class="card-body p-1">
            <div class="table-responsive">

              <b-table
                thead-class="bg-light"
                :items="tableData" 
                :fields="fields2" 
                responsive="sm" 
                :per-page="perPage" 
                :current-page="currentPage" 
                :sort-by.sync="sortBy" 
                :sort-desc.sync="sortDesc" 
                :filter="filter" 
                :filter-included-fields="filterOn" 
                @filtered="onFiltered">

                <template #cell(name)="data">
                  <div class="d-flex align-items-center my-2">
                    <h5 class="font-size-14 mb-1">
                      <a :href="'contacts/profile/'+data.item._id" class="text-dark">{{data.item.name + ' ' + data.item.lastname}}</a>
                    </h5>
                  </div>
                </template>

                <template #cell(opciones)="data">
                  <div
                    class="col-12 d-flex align-items-center text-secondary"
                  >
                    <b-dropdown
                      class=""
                      variant="light"
                      menu-class="dropdown-menu-right"
                    >
                      <template v-slot:button-content>
                        <i class="mdi mdi-chevron-down"></i>
                      </template>
                      <b-dropdown-item
                        @click="changeUserStatus(false,data.item._id)"
                        ><i class="text-success bx bx-check-double"></i>
                        Activar</b-dropdown-item
                      >
                      <b-dropdown-item
                        @click="deletedUserStatus(data.item._id)"
                        ><i class="text-danger bx bx-block"></i>
                        Eliminar</b-dropdown-item
                      >
                    </b-dropdown>
                  </div>
                </template>

                <template #cell(identification_number)="data">
                  <div class="d-flex justify-content-between align-items-center" :id="'link-category-'+ data.item._id">
                    <span class="w-75">
                    {{data.item.identification_number}} 
                    </span>
                    <i @click="tryToLogIn(data.item.document_file)" role="button" class="p-2 mdi mdi-card-account-details text-primary"></i>
                    <b-popover 
                      :target="'link-category-'+ data.item._id" 
                      placement="top"
                      triggers="hover" 
                      custom-class="bg-primary bg-gradient">
                      <div>{{data.item.name + ' ' + data.item.lastname}}</div>
                      <div>Fecha de operación : {{ formaterDate(data.item.operation_date)}}</div>
                    </b-popover>
                  </div>
                </template>

                <template #cell(status)="data">
                  <div>
                    <div v-if="data.item.status === 'active'" class="badge badge-soft-success font-size-11 m-1 w-75">Activo</div>
                    <div v-if="data.item.status === 'inactive'" class="badge badge-soft-danger font-size-11 m-1 w-75">Inactivo</div>
                  </div>
                </template>
                
              </b-table>

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
                <div class="dataTables_paginate paging_simple_numbers float-end">
                  <ul class="pagination pagination-rounded mb-0">
                    <!-- pagination -->
                    <b-pagination v-model="currentPage" :total-rows="tableData.length" :per-page="perPage">
                    </b-pagination>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-3 px-0">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-3">Detalles generales</h4>

            <div class="table-responsive">
              <table class="table mb-0">
                <tbody>
                  <tr>
                    <td style="width: 45%">Capital Total :</td>
                    <td style="width: 55%">{{ Number(this.capital).toLocaleString("es-CO", { style: "currency",currency: "COP",minimumFractionDigits: 0,})}}</td>
                  </tr>
                  <tr>
                    <td>Balance Total :</td>
                    <td>{{ Number(this.balance).toLocaleString("es-CO", { style: "currency",currency: "COP",minimumFractionDigits: 0,}) }}</td>
                  </tr>
                  <tr>
                    <td>Rendimiento acumulado :</td>
                    <td>{{ this.rendimentoPorc + ' %' }}</td>
                  </tr>
                  <tr>
                    <td>Usuarios Activos :</td>
                    <td>{{this.tableDataActive}}</td>
                  </tr>
                  <tr>
                    <td>Usuarios Inactivos :</td>
                    <td>{{this.tableDataInactive}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- end table-responsive -->
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>