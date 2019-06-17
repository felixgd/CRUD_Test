<template>
  <b-row>
    <b-col cols="12">
      <h2>
        Customer List
        <b-link href="#/create-customer">(Create Customer)</b-link>
        <b-link href="#/book-list">(Book List)</b-link>
      </h2>
      <b-table striped hover :items="customers" :fields="fields">
        <template slot="actions" scope="row">
          <b-btn size="sm" @click.stop="details(row.item)">Details</b-btn>
        </template>
      </b-table>
      <ul v-if="errors && errors.length">
        <li v-for="error of errors">
          {{error.message}}
        </li>
      </ul>
    </b-col>
  </b-row>
</template>

<script>

import axios from 'axios'

export default {
  name: 'CustomerList',
  data () {
    return {
      fields: {
        ID: { label: 'ID', sortable: true, 'class': 'text-center' },
        firstName: { label: 'First Name', sortable: true },
        secondName: { label: 'Second Name', sortable: true },
        lastName: { label: 'Last Name', sortable: true },
        email:{ label: 'Email', sortable:true, 'class': 'text-center'},
        actions: { label: 'Action', 'class': 'text-center' }
      },
      customers: [],
      errors: []
    }
  },
  created () {
    if(!localStorage.getItem('Auth Token')){
        this.$router.push({
              name: 'Login'
        })
    }
    axios.get(`http://localhost:3000/api/customer`,{
        headers:{
            authorization:localStorage.getItem("Auth Token")
        }
    })
    .then(response => {
      this.customers = response.data
    })
    .catch(e => {
      this.errors.push(e)
    })
  },
  methods: {
    details (customer) {
      this.$router.push({
        name: 'ShowCustomer',
        params: { id: customer.ID }
      })
    }
  }
}
</script>