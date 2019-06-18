<template>
  <b-row>
  <b-col cols="3"></b-col>
    <b-col cols="6" align-self="center" align-h="center">
      <h2>
        Edit Book
        <router-link :to="{ name: 'ShowBook', params: { id: book.barCode } }">(Show Book)</router-link>
      </h2>
      <b-form @submit="onSubmit">
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Bar Code">
          <b-form-input id="barCode" :state="state" v-model.trim="book.barCode" disabled></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Title">
          <b-form-input id="title" :state="state" v-model.trim="book.title"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Author">
          <b-form-input id="author" :state="state" v-model.trim="book.author"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Publisher">
          <b-form-input id="publisher" :state="state" v-model.trim="book.publisher"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Quantity">
          <b-form-input id="qty" :state="state" v-model.trim="book.qty" type="number" min="0"></b-form-input>
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
  name: 'EditBook',
  data () {
    return {
      book: {}
    }
  },
  created () {
      if(!localStorage.getItem('Auth Token')){
        this.$router.push({
              name: 'Login'
        })
      }
    axios.get(`http://localhost:3000/api/book/` + this.$route.params.id,{
        headers:{
            authorization:localStorage.getItem("Auth Token")
        }
    })
    .then(response => {
      this.book = response.data
    })
    .catch(e => {
      if(e.response.status == 400){
          alert("Invalid Authentication Token");
          return;
        }

        if(e.response.status == 404){
          alert("This book was not found");
          return;
        }
    })
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      if(this.book.qty<0){
        alert("Quantity has to be 0 or more!");
        return;
      }
      axios.post(`http://localhost:3000/api/book/edit`, this.book,{
          headers:{
            authorization:localStorage.getItem("Auth Token")
        }
      })
      .then(response => {
        this.$router.push({
          name: 'ShowBook',
          params: { id: this.$route.params.id }
        })
      })
      .catch(e => {
        if(e.response.status == 400){
          alert("Invalid Authentication Token");
          return;
        }

        if(e.response.status == 500){
          alert("Error with the server");
          return;
        }

        if(e.response.status == 422){
          alert("Fields missing");
          return;
        }

        if(e.response.status == 400){
          alert("This book was not found");
          return;
        }
      })
    }
  }
}
</script>