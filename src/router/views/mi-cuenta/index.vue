<script>
import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import PageHeader from "@/components/page-header";
import { todoMethods, authFackComputed } from "@/state/helpers";

import moment from 'moment';

/**
 * Lending component
 */
export default {
  page: {
    title: "Mi cuenta",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout, PageHeader },
  data() {
    return {
      user: {
        backup_win: 0,
        backup_porcentaje: 0,
        wallet: 0,
        
      },
      tableData: [],
      title: "",
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
          key: "key",
          label: "Fecha",
          sortable: true,
          class: "text-capitalize",
          formatter: (value, key, item) => {
            return moment(value).locale('es').format('dddd D')
          }
        },
        {
          key: "saldo",
          label: "Capital",
          sortable: true,
          formatter: (value, key, item) => {
            return this.money(value)
          }
        },
        {
          key: "rendimentoPorc",
          label: "Rendimiento %",
          sortable: true,
          formatter: (value, key, item) => {
            return value + '%'
          }
        },
        {
          key: "detalles",
          label: "Detalles",
          sortable: true,
        },
      ],
      fields2: [
        {
          key: "date",
          sortable: true,
          label: "Fecha",
          class: "text-capitalize",
          formatter: (value, key, item) => {
            return moment(item.date).locale('es').format('dddd D')

          }
        },
        {
          key: "type",
          label: "Tipo de operación",
          sortable: true,
        },
        {
          key: "porcentaje",
          label: "Porcentaje %",
          sortable: true,
          variant: 'primary',
          formatter: (value, key, item) => {
            return value + '%'
          }
        },
        {
          key: "coin",
          label: "Moneda",
          sortable: true,
        },
      ],
      monthnow : moment().locale('es').format('MMMM'),
      ordersDataToday: [],
      capital: 0,
      balance: 0,
      rendimentoPorc: 0,
      rendimentoMoney: 0,
      dataAd : [],
      dataRe : [],
      adiciones : 0,
      retiros : 0,
      listop:[],
      listopdays:[],
      listopdaysAll:[],
      userselect: {},
      dateinit: '',
      opModalData: {},
      stutusLoanding: true,
    };
  },
  methods: {
    ...todoMethods,
    tryToLogIn(item){
      this.opModalData = item.op
      this.$refs['modal-op'].show()
    },
    async operationByday(item, array) {
      let listarr = array.filter(it => {
        if(moment(it.updatedAt).format('MM-DD-YYYY') <= moment(item.key).format('MM-DD-YYYY')) return it
      });
      let valuedayData = this.sumSaldoDay(listarr, 'valor')
      item.saldo = valuedayData
      item.balance = ( valuedayData + (valuedayData * this.sum(item.op, 'porcentaje'))/100)
      item.tr = listarr;
        item.rendimentoPorc = ( await this.sum(item.op, 'porcentaje')).toFixed(2);
        return item
    },

    async sum(array, key) {
        let tot = 0;
        tot = (array.reduce((a, b) => a + (b[key] || 0), 0))
        return tot;
    },
    sumSaldoDay(array, key) {
        let deb = array.filter(it => it.type_transactions === 'deposito' && it.completed === true)
        let ret = array.filter(it => it.type_transactions === 'retiro' && it.completed === true)

        let debresul = (deb.reduce((a, b) => a + (b[key] || 0), 0))
        let retresul = (ret.reduce((a, b) => a + (b[key] || 0), 0))
        return debresul - retresul
    },
    money(val){
      if(!isNaN(val) && val !== null && val !== undefined){
        return Number(val).toLocaleString("es-CO", { style: "currency",currency: "COP",minimumFractionDigits: 0,})
      }else{
        return '...'
      }
    },
  },
  computed: {
    ...authFackComputed,
  },
  mounted() {

    this.fetchOperationListToday({
      userId : this.currentUser._id,
      token: this.$store.state.authfack.user.token,
    }).then(async res => {
      this.userselect = res.user;
      res.operation.filter(it => moment(it.date) > moment(this.userselect.operation_date))

      this.dateinit = moment(this.userselect.createdAt).locale('es').format('MMMM Do YYYY, h:mm:ss a');
      this.listop = res.operation.filter(it =>{
        if(moment(it.date).format() > moment(this.userselect.operation_date).format() && moment(it.date) < moment(new Date())) return it
      })

      const callItemsObject = res.operation.reduce( ( acc, item ) => {
        let key = moment( item.date ).format( 'YYYY-MM-DD' );

        ( acc[ key ] ) ? acc[ key ].push( item ): ( acc[ key ] = [ item ] );

        return acc;
      }, {} );

      const arrayReverseObj = obj => Object.keys(obj).sort().reverse().map(key=> ({key:key,op:obj[key]}) );

      this.listopdays = arrayReverseObj(callItemsObject);
      
      this.listopdays.map(async item =>  {
        let resutItem = await this.operationByday(item, res.transactions)
        this.listopdaysAll.push(resutItem)
      }); 
    }),

    this.fetchOperationListToday({
      userId : this.currentUser._id,
      token: this.$store.state.authfack.user.token,
    }).then(async res => {
      this.capital = res.user.wallet;

      this.ordersDataToday = res.operation.filter(it =>moment(it.date) > moment(res.user.operation_date) && moment(it.date) < moment(new Date()));

      //res.transactions2 = res.transactions.filter( it =>  moment(it.date).format('MMMM') === moment(new Date).format('MMMM'));

      if(res.transactions.length === 0 ){
        this.stutusLoanding = false;
        return
      }

      this.dataAd = res.transactions.filter( it => it.type_transactions === 'deposito' && it.completed === true && moment(it.date).format('MMMM') === moment(new Date).format('MMMM'));
      this.dataRe = res.transactions.filter( it => it.type_transactions === 'retiro' && it.completed === true && moment(it.date).format('MMMM') === moment(new Date).format('MMMM'));
      this.adiciones = await this.sum(this.dataAd,'valor');
      this.retiros = await this.sum(this.dataRe,'valor');
      this.balance = ( (res.user.backup_win + res.user.wallet) + (res.user.wallet * await this.sum(this.ordersDataToday, 'porcentaje'))/100);
      this.rendimentoPorc = (res.user.backup_porcentaje + Number( await this.sum(this.ordersDataToday, 'porcentaje'))).toFixed(2);
      this.rendimentoMoney = ( Number(res.user.backup_win)  + (Number(res.user.wallet) * await this.sum(this.ordersDataToday, 'porcentaje'))/100);
      
      setTimeout(() => {
        this.stutusLoanding = false;
      }, 2000);
    });
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">
      <span class="col-xl-12 p-2 mb-2">
        Inicio de operación: <span class="text-primary text-capitalize">{{this.dateinit}}</span>
      </span>

      <div class="row col-sm-12">
        <div class="col-sm-4">
          <div class="card bg-soft bg-secondary">
            <div>
              <div class="row">
                <div class="col-7">
                  <div class=" p-3">
                    <h5 class="text-secondary">¡Bienvenido de nuevo!</h5>
                    <p class="">{{this.currentUser.name}}</p>
                  </div>
                </div>
                <div class="col-5 align-self-end">
                  <img
                    src="@/assets/images/profile-img.png"
                    alt
                    class="img-fluid"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="avatar-xs me-3">
                  <span
                    class="
                      avatar-title
                      rounded-circle
                      bg-soft bg-primary
                      text-primary
                      font-size-18
                    "
                  >
                    <i class="bx bx-purchase-tag-alt"></i>
                  </span>
                </div>
                <h5 class="font-size-14 mb-0">Rendimiento acumulado %</h5>
              </div>
              <div class="text-muted mt-4">
                <h4 v-if="!stutusLoanding">{{this.rendimentoPorc}}%</h4>
                <b-spinner
                  v-else
                  class="m-2"
                  variant="primary"
                  role="status"
                ></b-spinner>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="avatar-xs me-3">
                  <span
                    class="
                      avatar-title
                      rounded-circle
                      bg-soft bg-primary
                      text-primary
                      font-size-18
                    "
                  >
                    <i class="bx bx-purchase-tag-alt"></i>
                  </span>
                </div>
                <h5 class="font-size-14 mb-0">Rendimiento acumulado $</h5>
              </div>
              <div class="text-muted mt-4">
                <h4 v-if="!stutusLoanding">{{money(this.rendimentoMoney)}}</h4>
                <b-spinner
                  v-else
                  class="m-2"
                  variant="primary"
                  role="status"
                ></b-spinner>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="avatar-xs me-3">
                  <span
                    class="
                      avatar-title
                      rounded-circle
                      bg-soft bg-primary
                      text-primary
                      font-size-18
                    "
                  >
                    <i class="bx bx-purchase-tag-alt"></i>
                  </span>
                </div>
                <h5 class="font-size-14 mb-0">Capital</h5>
              </div>
              <div class="text-muted mt-4">
                <h4 v-if="!stutusLoanding">{{money(this.capital)}}</h4>
                <b-spinner
                  v-else
                  class="m-2"
                  variant="primary"
                  role="status"
                ></b-spinner>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="avatar-xs me-3">
                  <span
                    class="
                      avatar-title
                      rounded-circle
                      bg-soft bg-primary
                      text-primary
                      font-size-18
                    "
                  >
                    <i class="bx bx-purchase-tag-alt"></i>
                  </span>
                </div>
                <h5 class="font-size-14 mb-0">Balance</h5>
              </div>
              <div class="text-muted mt-4">
                <h4 v-if="!stutusLoanding">{{money(this.balance)}}</h4>
                <b-spinner
                  v-else
                  class="m-2"
                  variant="primary"
                  role="status"
                ></b-spinner>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="avatar-xs me-3">
                  <span
                    class="
                      avatar-title
                      rounded-circle
                      bg-soft bg-primary
                      text-primary
                      font-size-18
                    "
                  >
                    <i class="bx bx-purchase-tag-alt"></i>
                  </span>
                </div>
                <h5 class="font-size-14 mb-0">Adiciones</h5>
              </div>
              <div class="text-muted mt-4">
                <h4 v-if="!stutusLoanding">{{money(this.adiciones)}}</h4>
                <b-spinner
                  v-else
                  class="m-2"
                  variant="primary"
                  role="status"
                ></b-spinner>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="avatar-xs me-3">
                  <span
                    class="
                      avatar-title
                      rounded-circle
                      bg-soft bg-primary
                      text-primary
                      font-size-18
                    "
                  >
                    <i class="bx bx-purchase-tag-alt"></i>
                  </span>
                </div>
                <h5 class="font-size-14 mb-0">Retiros</h5>
              </div>
              <div class="text-muted mt-4">
                <h4 v-if="!stutusLoanding">{{money(this.retiros)}}</h4>
                <b-spinner
                  v-else
                  class="m-2"
                  variant="primary"
                  role="status"
                ></b-spinner>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4">
              Mes en curso: <span class="text-primary text-uppercase ">{{this.monthnow}}</span>
            </h4>

            <div class="table-responsive mt-3 mb-0">
                <b-table :items="this.listopdaysAll" :fields="fields" responsive="sm" :per-page="perPage" :current-page="currentPage" >
                <template #cell(detalles)="data">
                  <div class="px-3">
                    <button class="btn btn-primary btn-sm w-50" @click="tryToLogIn(data.item)">
                      Ver
                    </button>
                  </div>
                </template>
                </b-table>
            </div>

            <b-modal
                  id="modal-scrollable"
                  scrollable
                  centered
                  title="Operaciones"
                  title-class="font-14"
                  ref="modal-op"
                  size="lg"
                  hide-footer
                >
                  <div>
                      <div class="table-responsive mb-0 p-3">
                        <b-table striped hover :items="this.opModalData" :fields="fields2" responsive="sm">
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
                          </template>
                        </b-table>
                    </div>
                  </div>
            </b-modal>

          </div>
        </div>
      </div>
    </div>
    <!-- end row -->
  </Layout>
</template>