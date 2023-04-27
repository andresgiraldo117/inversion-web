<script>
import Layout from "../../layouts/main";
import appConfig from "@/app.config";
import PageHeader from "@/components/page-header";
import { tableData } from "./dataAdvancedtable";
import moment from 'moment';
import Swal from "sweetalert2";
import { todoMethods, authFackComputed } from "@/state/helpers";
import simplebar from "simplebar-vue";


/**
 * Lending component
 */
export default {
  page: {
    title: "Transferencias",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout, PageHeader, simplebar },
  data() {
    return {
      tableData: tableData,
      title: "Transferencias",
      items: [
        {
          text: "",
          active: true,
        },
      ],
      tranfervalue: null,
      value: '$0',
      user : {
        wallet: 0
      },
      dismissSecs: 5,
      dismissCountDown: 0,
      addressWallet : 'TCTeZNTDSgMQ9EUUERAbQ9jSa7eLGPP1vU',
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
        this.tranfervalue = number;
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
    addDeposito(){
      if(this.tranfervalue < 50){
        return Swal.fire("Oops...",'El valor de transferencia minimo es de $50 dolares', "error");
      }
      if(this.$refs.fileimage.files.length === 0){
        return Swal.fire("Oops...",'Ningun archivo seleccionado', "error");
      }

      Swal.fire({
        title: "Estas seguro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor:"#fdc836",
        cancelButtonColor: "#08403e",
        confirmButtonText: "Si, Depositar!"
      }).then(result => {
        if (result.value) {
            let formData = new FormData();
            formData.append( 'comprobante', this.$refs.fileimage.files[0] );
            formData.append( 'date', moment(new Date()).format());
            formData.append( 'valor', this.tranfervalue );
            formData.append( 'type_transactions', "deposito" );
            formData.append( 'metodo_transactions',  'wallet');
            formData.append( 'banco',  'N/A');
            formData.append( 'id_user', this.$store.state.authfack.user._id );
            formData.append( 'moneda_transactions', 'USDT');

          this.fetchTransactionCreated({
            data: formData,
            token: this.$store.state.authfack.user.token,
          }).then(res => {
            Swal.fire("Listo!", res.message, "success");
            this.$router.push('/historyDeposit');
          })

        }
      })
    },
    copyAddress(){
      navigator.clipboard.writeText(this.addressWallet)
      this.dismissCountDown = this.dismissSecs;
    }
  },  
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">
      <div class="col-xl-8">
        <div class="card">
          <div class="card-body">
            <b-tabs pills nav-class="bg-light rounded" content-class="mt-4">
              <b-tab title="Transferir dolares" active>
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
                    <div class="form-group mb-3">
                      <label>Direccion de wallet USDT red TRC20 :</label>
                      <div class="input-group mb-3">
                        <input type="text" disabled class="form-control" v-model="addressWallet" />
                        <div class="input-group-append">
                          <button @click="copyAddress" 
                            v-b-tooltip.hover title="Copy to clipboard"
                            class="form-control btn btn-secondary" type="button" id="button-addon2">
                            <i class="bx bx-copy-alt"></i>
                            Copiar
                          </button>
                        </div>
                      </div>
                    </div>

                    <label>Añadir monto consignado :</label>
                    <div class="input-group mb-3">
                      <div class="input-group-prepend">
                        <label class="input-group-text"
                          >Valor de la consignacion en dolares</label
                        >
                      </div>
                      <!-- <input v-model="tranfervalue" type="number" class="form-control" /> -->
                      <input v-model="fValue" type="text" class="form-control" />

                      <div class="input-group-append">
                        <label class="input-group-text">$</label>
                      </div>
                      <label class="p-1 col-12 text-danger"
                          >El deposito minimo es de 50 dolares</label
                        >
                    </div>

                    <div class="mb-3">
                      <label for="inputGroupFile01">
                        Ingrese el comprobante de pago
                      </label>
                      <input
                        type="file"
                        class="form-control"
                        id="inputGroupFile01"
                        ref="fileimage"
                      />
                    </div>

                    <div class="mt-4 text-center">
                      <button @click="addDeposito" type="button" class="btn btn-success w-md">
                        Tranferir
                      </button>
                    </div>
                    <b-alert 
                      class="fixed-bottom"
                      style="left:auto; right: 10px;"
                      variant="secondary"
                      :show="dismissCountDown"
                      @dismissed="dismissCountDown = 0"
                      >Copiado en portapapeles!
                    </b-alert>
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