<script>
import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import PageHeader from "@/components/page-header";
import { tableData } from "./dataAdvancedtable";
import moment from 'moment';
import Swal from "sweetalert2";
import { todoMethods, authFackComputed } from "@/state/helpers";

/**
 * Lending component
 */
export default {
  page: {
    title: "Deposito",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout, PageHeader },
  data() {
    return {
      tableData: tableData,
      title: "Retiros",
      items: [
        {
          text: "",
          active: true,
        },
      ],
      arrBancos: [
        "BANCOLOMBIA",
        "DAVIVIENDA",
        "BBVA",
        "NEQUI",
        "BANCO DE BOGOTA",
        "BANCO ITAU",
        "BANCO AV VILLAS",
        "BANCO DE OCCIDENTE",
        "BANCO FALABELLA",
      ],
      dataModel : {
        tranfervalue : null,
        tranfervaluedolar : null,
        tranferbank : "",
        number_bank : "",
        type_bank : "",
        titular_bank : "",
        document_bank : "",
        number_wallet : "",
        network : "",
      },
      user:{
        wallet: 0
      },
      value: '$0',
      valueW: '$0',
    };
  },
  computed: {
    ...authFackComputed,
    fValue: {
      // getter
      get: function() {
        return this.value;
      },
      // setter
      set: function(newValue) {
        let number = Number(newValue.replace(/[^0-9.-]+/g,""));

        this.value = Number(number).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
        });
        this.dataModel.tranfervalue = number;
      }
    },
    fValue2: {
      // getter
      get: function() {
        return this.valueW;
      },
      // setter
      set: function(newValue) {
        let number = Number(newValue.replace(/[^0-9.-]+/g,""));

        this.valueW = Number(number).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
        });
        this.dataModel.tranfervaluedolar = number;
      }
    }
  },
  mounted() {
    this.fetchUserId({
      userId : this.currentUser._id,
      token: this.$store.state.authfack.user.token,
    }).then(res => {
      this.user = res;
    })
  },
  methods: {
    ...todoMethods,
    money(val){
      return Number(val).toLocaleString("es-CO", { style: "currency",currency: "COP",minimumFractionDigits: 0,})
    },
    clearform(){
      this.dataModel.tranfervalue = null
      this.dataModel.tranferbank = ''
      this.dataModel.number_bank = ''
      this.dataModel.type_bank = ''
      this.dataModel.titular_bank = ''
      this.dataModel.document_bank = ''
      this.dataModel.number_wallet = ''
      this.dataModel.network = ''
    },
    addRetiro(type){
      if(type === 'transferencia'){
        Swal.fire({
          title: "Estas seguro?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor:"#fdc836",
          cancelButtonColor: "#08403e",
          confirmButtonText: "Si, Retirar!"
        }).then(result => {
          if (result.value) {
            let formData = new FormData();

            formData.append( 'date', moment(new Date()).format());
            formData.append( 'valor', this.dataModel.tranfervalue );
            formData.append( 'type_transactions', "retiro" );
            formData.append( 'metodo_transactions',  'banco');
            formData.append( 'banco',  this.dataModel.tranferbank);
            formData.append( 'data',  JSON.stringify({
                  "data_number_bank" : this.dataModel.number_bank,
                  "data_type_bank" : this.dataModel.type_bank,
                  "data_titular_bank" : this.dataModel.titular_bank,
                  "data_document_bank" : this.dataModel.document_bank,
                }));
            formData.append( 'id_user', this.$store.state.authfack.user._id );
            formData.append( 'moneda_transactions', 'COP' );


            this.fetchTransactionCreated({
              data: formData,
              token: this.$store.state.authfack.user.token,
            }).then(res => {
              Swal.fire("Listo!", res.message, "success");
              this.clearform();
              this.$router.push('/historyRetreats');
            })
  
          }
        })
      }else if(type === 'wallet'){
        Swal.fire({
          title: "Estas seguro?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor:"#fdc836",
          cancelButtonColor: "#08403e",
          confirmButtonText: "Si, Transferir!"
        }).then(result => {
          if (result.value) {

            let formData = new FormData();

            formData.append( 'date', moment(new Date()).format());
            formData.append( 'valor', this.dataModel.tranfervaluedolar );
            formData.append( 'type_transactions', "retiro" );
            formData.append( 'metodo_transactions',  'wallet');
            formData.append( 'banco',  'N/A');
            formData.append( 'data',  JSON.stringify({"data_number_bank" : this.dataModel.number_wallet}));
            formData.append( 'id_user', this.$store.state.authfack.user._id );
            formData.append( 'moneda_transactions', 'USDT' );
            formData.append( 'network', this.dataModel.network );


            this.fetchTransactionCreated({
              data: formData,
              token: this.$store.state.authfack.user.token,
            }).then(res => {
              Swal.fire("Listo!", res.message, "success");
              this.clearform();
              this.$router.push('/historyRetreats');
            })
  
          }
        })
      }
    }
  },
};
</script>

<template>
  <Layout>

    <div class="row">
      <div class="col-xl-8">
        <div class="card">
          <div class="card-body">
            <!-- <h4 class="card-title mb-4">Retirar dolares</h4> -->
            <b-tabs pills nav-class="bg-light rounded" content-class="mt-4">
              <b-tab title="Retiros COPS" active>
                <b-card-text>
                  <div class="float-end ms-2">
                    <h5 class="font-size-14">
                      <i
                        class="
                          bx bx-wallet
                          text-primary
                          font-size-16
                          align-middle
                          me-1
                        "
                      ></i>
                      {{money(this.user.wallet)}}
                    </h5>
                  </div>
                  <h5 class="font-size-14 mb-4">Saldo actual</h5>

                  <div>

                    <label>Monto a retirar :</label>
                    <div class="input-group mb-3">
                      <div class="input-group-prepend col-5">
                        <label class="input-group-text"
                          >Valor en pesos</label
                        >
                      </div>
                      <input v-model="fValue" type="text" class="form-control" />
                      <div class="input-group-append">
                        <label class="input-group-text">$</label>
                      </div>
                    </div>

                    <div class="input-group mb-3">
                      <div class="input-group-prepend col-5">
                        <label class="input-group-text"
                          >Numero de cuenta</label
                        >
                      </div>
                      <input v-model="dataModel.number_bank" type="number" class="form-control" />
                    </div>

                    <div class="input-group mb-3">
                      <div class="input-group-prepend col-5">
                        <label class="input-group-text"
                          >Seleccione el banco</label
                        >
                      </div>
                      <select v-model="dataModel.tranferbank" class="form-control select2-search-disable">
                          <option v-for="(item,index) of arrBancos" :key="index" :value="item">{{item}}</option>
                      </select>
                    </div>

                    <div class="input-group mb-3">
                      <div class="input-group-prepend col-5">
                        <label class="input-group-text"
                          >Seleccione tipo de cuenta</label
                        >
                      </div>
                      <select v-model="dataModel.type_bank" class="form-control select2-search-disable">
                          <option value="ahorro">Ahorro</option>
                          <option value="corriesnte">Corriente</option>
                      </select>
                    </div>

                    <div class="input-group mb-3">
                      <div class="input-group-prepend col-5">
                        <label class="input-group-text"
                          >Titular de la cuenta</label
                        >
                      </div>
                      <input v-model="dataModel.titular_bank" type="text" class="form-control" style="text-transform: uppercase;"/>
                    </div>

                    <div class="input-group mb-3">
                      <div class="input-group-prepend col-5">
                        <label class="input-group-text"
                          >Documento ( Cedula o Nit )</label
                        >
                      </div>
                      <input v-model="dataModel.document_bank" type="number" class="form-control" />
                      <span class="col-12 px-1 text-muted">Documento del titular de la cuenta</span>
                    </div>

                    <div class="mt-4 text-center">
                      <button @click="addRetiro('transferencia')" type="button" class="btn btn-success w-md">
                        Retirar
                      </button>
                    </div>
                  </div>
                </b-card-text>
              </b-tab>
              <b-tab title="Retiros Wallet USDT">
                <b-card-text>
                  <div class="float-end ms-2">
                    <h5 class="font-size-14">
                      <i
                        class="
                          bx bx-wallet
                          text-primary
                          font-size-16
                          align-middle
                          me-1
                        "
                      ></i>
                      {{money(this.user.wallet)}}
                    </h5>
                  </div>
                  <h5 class="font-size-14 mb-4">Saldo actual</h5>

                  <div>

                    <label>Monto a retirar :</label>
                    <div class="input-group mb-3">
                      <div class="input-group-prepend col-3">
                        <label class="input-group-text"
                          >Valor en dolares</label
                        >
                      </div>
                      <input v-model="fValue2" type="text" class="form-control col-9" />
                      <div class="input-group-append">
                        <label class="input-group-text">$</label>
                      </div>
                      <label class="p-1 col-12 text-danger"
                          >El retiro minimo es de 50 dolares</label
                        >
                    </div>

                    <div class="input-group mb-3">
                      <div class="input-group-prepend col-3">
                        <label class="input-group-text"
                          >Dirección Wallet</label
                        >
                      </div>
                      <input v-model="dataModel.number_wallet" type="text" class="form-control col-9" />
                    </div>

                    <div class="input-group mb-3">
                      <div class="input-group-prepend col-3">
                        <label class="input-group-text"
                          >Red</label
                        >
                      </div>
                      <input v-model="dataModel.network" type="text" class="form-control col-9" />
                    </div>



                    <div class="mt-4 text-center">
                      <button @click="addRetiro('wallet')" type="button" class="btn btn-success w-md">
                        Transferir
                      </button>
                    </div>
                  </div>
                </b-card-text>
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>

    </div>
    <!-- end row -->
  </Layout>
</template>