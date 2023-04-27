<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";

import { revenueChart } from "./data-profile";
import Stat from "@/components/widgets/stat";
import { todoMethods, authFackComputed } from "@/state/helpers";


/**
 * Contacts-Profile component
 */
export default {
  page: {
    title: "Profile",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader, Stat },
  data() {
    return {
      revenueChart: revenueChart,
      title: "Perfil",
      items: [
        {
          text: "",
          active: true
        },
      ],
      user: {
        name: '',
        lastname: '',
        type_identification_number: '',
        identification_number: '',
        phone: '',
        email: '',
        city: '',
        state: '',
        country: '',
        wallet: '',
      },
    };
  },
  computed: {
    ...authFackComputed,
  },
  methods: {
    ...todoMethods,
  },
  mounted() {
    this.fetchUserId({
      userId : this.currentUser._id,
      token: this.$store.state.authfack.user.token,
    }).then(res => {
      this.user = res;
    })
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-xl-9">
        <!-- end card -->
        <div class="card">
          <div class="card-body">
            <h4 class="card-title mb-4">Información Personal</h4>
            <div class="table-responsive ">
              <table class="table table-nowrap mb-0">
                <tbody>
                  <tr>
                    <th scope="row">Nombre :</th>
                    <td>{{user.name + ' ' + user.lastname}}</td>
                  </tr>
                  <tr>
                    <th scope="row">Identificación :</th>
                    <td>{{user.type_identification_number + ' ' +user.identification_number }}</td>
                  </tr>
                  <tr>
                    <th scope="row">Telefono :</th>
                    <td>{{user.phone}}</td>
                  </tr>
                  <tr>
                    <th scope="row">Correo :</th>
                    <td>{{user.email}}</td>
                  </tr>
                  <tr>
                    <th scope="row">Ciudad :</th>
                    <td>{{user.city}}</td>
                  </tr>
                  <tr>
                    <th scope="row">Estado :</th>
                    <td>{{user.state}}</td>
                  </tr>
                  <tr>
                    <th scope="row">Pais :</th>
                    <td>{{user.country}}</td>
                  </tr>
                  <tr>
                    <th scope="row">Saldo :</th>
                    <td>{{Number(user.wallet).toLocaleString("es-CO", { style: "currency",currency: "COP",minimumFractionDigits: 0,})}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- end card -->
      </div>

    </div>
    <!-- end row -->
  </Layout>
</template>