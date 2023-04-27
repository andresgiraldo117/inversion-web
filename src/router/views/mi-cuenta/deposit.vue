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
    title: "Deposito",
    meta: [{ name: "description", content: appConfig.description }],
  },
  components: { Layout, PageHeader, simplebar },
  data() {
    return {
      tableData: tableData,
      title: "Deposito",
      items: [
        {
          text: "Deposito",
          active: true,
        },
      ],
      value: '$0',
      tranfervalue: null,
      tranferbank: "",
      user : {
        wallet: 0
      }
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
      if(this.$refs.fileimage.files.length === 0){
        return Swal.fire("Error!",'Ningun archivo seleccionado', "error");
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
          formData.append( 'metodo_transactions',  'banco');
          formData.append( 'banco',  this.tranferbank);
          formData.append( 'id_user', this.$store.state.authfack.user._id );
          formData.append( 'moneda_transactions', 'COP' );


          this.fetchTransactionCreated({
            data: formData,
            token: this.$store.state.authfack.user.token,
          }).then(res => {
            Swal.fire("Listo!", res.message, "success");
            this.$router.push('/historyDeposit');
          })

        }
      })
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
            <b-tabs pills nav-class="bg-light rounded" content-class="mt-4">
              <b-tab title="Comprar dolares" active>
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
                      <label>Metodo de pago :</label>
                      <select disabled class="form-select">
                        <option>Transferencia</option>
                      </select>
                    </div>

                    <label>Añadir monto consignado :</label>
                    <div class="input-group mb-3">
                      <div class="input-group-prepend">
                        <label class="input-group-text"
                          >Valor de la consignacion en pesos</label
                        >
                      </div>
                      <input v-model="fValue" type="text" class="form-control" />
                      <div class="input-group-append">
                        <label class="input-group-text">$</label>
                      </div>
                      <label class="p-1 col-12 text-danger"
                          >El deposito minimo es de 50 dolares</label
                        >
                    </div>

                    <div>
                      <label> Seleccione la cuenta bancaria : </label>
                      <div class="row">
                        <div class="col-xl-4 col-sm-4">
                          <div class="mb-3">
                            <label class="card-radio-label mb-2">
                              <input
                                v-model="tranferbank" 
                                value="Bancolombia"
                                type="radio"
                                name="currency"
                                id="buycurrencyoption1"
                                class="card-radio-input"
                                checked=""
                              />

                              <div class="card-radio">
                                <div>
                                  <span class="rounded-circle bg-white">
                                    <img
                                      src="@/assets/images/bancolombia.png"
                                      alt
                                      height="34"
                                    />
                                  </span>
                                  <span>Bancolombia</span>
                                </div>
                              </div>
                            </label>

                            <div>
                              <p class="text-muted mb-1">Nº de cuenta :</p>
                              <h5 class="font-size-16">78900001361</h5>
                              <p class="text-muted mb-1">Cuenta corriente</p>
                              <p class="text-muted mb-1">Nit: 901499468</p>
                            </div>
                          </div>
                        </div>

                        <!-- <div class="col-xl-4 col-sm-4">
                          <div class="mb-3">
                            <label class="card-radio-label mb-2">
                              <input
                                v-model="tranferbank" 
                                value="Davivienda"
                                type="radio"
                                name="currency"
                                id="buycurrencyoption2"
                                class="card-radio-input"
                                checked=""
                              />

                              <div class="card-radio">
                                <div>
                                  <span class="rounded-circle bg-white">
                                    <img
                                      src="@/assets/images/davivienda.png"
                                      alt
                                      height="34"
                                    />
                                  </span>
                                  <span>Davivienda</span>
                                </div>
                              </div>
                            </label>

                            <div>
                              <p class="text-muted mb-1">Nº de cuenta :</p>
                              <h5 class="font-size-16">08565896520</h5>
                            </div>
                          </div>
                        </div>

                        <div class="col-xl-4 col-sm-4">
                          <div class="mb-3">
                            <label class="card-radio-label mb-2">
                              <input
                                v-model="tranferbank" 
                                value="BBVA"
                                type="radio"
                                name="currency"
                                id="buycurrencyoption3"
                                class="card-radio-input"
                                checked=""

                              />

                              <div class="card-radio">
                                <div>
                                  <span class="rounded-circle bg-white">
                                    <img
                                      src="@/assets/images/bbva.png"
                                      alt
                                      height="34"
                                    />
                                  </span>
                                  <span>BBVA</span>
                                </div>
                              </div>
                            </label>

                            <div>
                              <p class="text-muted mb-1">Nº de cuenta :</p>
                              <h5 class="font-size-16">08536956312</h5>
                            </div>
                          </div>
                        </div> -->
                      </div>
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
                        Comprar
                      </button>
                    </div>
                  </div>
                </b-card-text>
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
      <div class="col-xl-4">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4">Información para el deposito</h4>
            <simplebar style="max-height: 310px">
              <ul class="verti-timeline list-unstyled">
                <li class="event-list">
                  <div class="event-timeline-dot">
                    <i class="bx bx-right-arrow-circle font-size-18"></i>
                  </div>
                  <div class="d-flex">
                    <div class="me-3">
                      <h5 class="font-size-14">
                        1
                        <i
                          class="
                            bx bx-right-arrow-alt
                            font-size-16
                            text-primary
                            align-middle
                            ms-2
                          "
                        ></i>
                      </h5>
                    </div>
                    <div class="flex-grow-1">
                      <div>Ingrese el monto consignado</div>
                    </div>
                  </div>
                </li>
                <li class="event-list">
                  <div class="event-timeline-dot">
                    <i class="bx bx-right-arrow-circle font-size-18"></i>
                  </div>
                  <div class="d-flex">
                    <div class="me-3">
                      <h5 class="font-size-14">
                        1
                        <i
                          class="
                            bx bx-right-arrow-alt
                            font-size-16
                            text-primary
                            align-middle
                            ms-2
                          "
                        ></i>
                      </h5>
                    </div>
                    <div class="flex-grow-1">
                      <div>Seleccione la cuenta del deposito</div>
                    </div>
                  </div>
                </li>
                <li class="event-list">
                  <div class="event-timeline-dot">
                    <i class="bx bx-right-arrow-circle font-size-18"></i>
                  </div>
                  <div class="d-flex">
                    <div class="me-3">
                      <h5 class="font-size-14">
                        1
                        <i
                          class="
                            bx bx-right-arrow-alt
                            font-size-16
                            text-primary
                            align-middle
                            ms-2
                          "
                        ></i>
                      </h5>
                    </div>
                    <div class="flex-grow-1">
                      <div>Adjunte el comprobante del pago</div>
                    </div>
                  </div>
                </li>
                <li class="event-list">
                  <div class="event-timeline-dot">
                    <i class="bx bx-right-arrow-circle font-size-18"></i>
                  </div>
                  <div class="d-flex">
                    <div class="me-3">
                      <h5 class="font-size-14">
                        1
                        <i
                          class="
                            bx bx-right-arrow-alt
                            font-size-16
                            text-primary
                            align-middle
                            ms-2
                          "
                        ></i>
                      </h5>
                    </div>
                    <div class="flex-grow-1">
                      <div>Cree la orden de deposito</div>
                    </div>
                  </div>
                </li>
                <li class="event-list">
                  <div class="event-timeline-dot">
                    <i class="bx bx-right-arrow-circle font-size-18"></i>
                  </div>
                  <div class="d-flex">
                    <div class="me-3">
                      <h5 class="font-size-14">
                        1
                        <i
                          class="
                            bx bx-right-arrow-alt
                            font-size-16
                            text-primary
                            align-middle
                            ms-2
                          "
                        ></i>
                      </h5>
                    </div>
                    <div class="flex-grow-1">
                      <div>
                        Estado del deposito
                        <span>
                          <router-link
                            to="/historyDeposit"
                            class="fw-medium text-primary"
                            >aqui</router-link
                          >
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </simplebar>
          </div>
        </div>
      </div>
    </div>
    <!-- end row -->
  </Layout>
</template>