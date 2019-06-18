<template>
  <b-row>
  <b-col cols="3"></b-col>
    <b-col cols="6" align-self="center" align-h="center">
      <h2>
        Edit customer
        <router-link :to="{ name: 'CustomerList' }">(Customer List)</router-link>
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
          <b-form-input id="publisher" :state="state" v-model.trim="customer.ID"  disabled></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Email">
          <b-form-input id="publisher" :state="state" v-model.trim="customer.email"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Update</b-button>
      </b-form>
    </b-col>
    <b-col cols="3"></b-col>
  </b-row>
</template>

<script>

import axios from 'axios'

export default {
  name: 'Editcustomer',
  data () {
    return {
      customer: {}
    }
  },
  created () {
      if(!localStorage.getItem('Auth Token')){
        this.$router.push({
              name: 'Login'
        })
      }
    axios.get(`http://localhost:3000/api/customer/` + this.$route.params.id,{
        headers:{
            authorization:localStorage.getItem("Auth Token")
        }
    })
    .then(response => {
      this.customer = response.data
    })
    .catch(e => {
      this.errors.push(e)
    })
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      axios.post(`http://localhost:3000/api/customer/edit`, this.customer,{
          headers:{
            authorization:localStorage.getItem("Auth Token")
        }
      })
      .then(response => {
        this.$router.push({
          name: 'ShowCustomer',
          params: { id: this.$route.params.id }
        })
      })
      .catch(e => {
        if(e.response.status == 401){
          this.$router.push({
              name: 'Login'
        })
        }

        if(e.response.status == 500){
          alert("Error with the server");
          return;
        }

        if(e.response.status == 422){
          alert("Fields missing");
          return;
        }

        if(e.response.status == 404){
          alert("This Costumer was not found");
          return;
        }
      })
    }
  }
}
</script>