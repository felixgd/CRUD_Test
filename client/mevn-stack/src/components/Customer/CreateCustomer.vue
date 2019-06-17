<template>
  <b-row>
  <b-col cols="3"></b-col>
    <b-col cols="6" align-self="center" align-h="center">
      <h2>
        Create Customer
        <b-link href="#/customer-list">(Customer List)</b-link>
      </h2>
      <b-form @submit="onSubmit">
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter First Name">
          <b-form-input id="barCode" :state="state" v-model.trim="customer.firstName"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Second Name">
          <b-form-input id="title" :state="state" v-model.trim="customer.secondName"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Last Name">
          <b-form-input id="author" :state="state" v-model.trim="customer.lastName"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter ID">
          <b-form-input id="publisher" :state="state" v-model.trim="customer.ID"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Email">
          <b-form-input id="publisher" :state="state" v-model.trim="customer.email"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Create</b-button>
      </b-form>
    </b-col>
    <b-col cols="3"></b-col>
  </b-row>
</template>

<script>

import axios from 'axios'

export default {
  name: 'Createcustomer',
  data () {
    return {
      customer: {}
    }
  },
  created() {
      if(!localStorage.getItem('Auth Token')){
        this.$router.push({
              name: 'Login'
        })
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      console.log(localStorage.getItem("Auth Token"));
      axios.post(`http://localhost:3000/api/customer/create`,this.customer,{
          headers:{
            authorization:localStorage.getItem("Auth Token")
        }
      })
      .then(response => {
        this.$router.push({
          name: 'Showcustomer',
          params: { id: customer.ID }
        })
      })
      .catch(e => {
        this.errors.push(e)
      })
    }
  }
}
</script>