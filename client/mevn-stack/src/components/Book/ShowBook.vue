<template>
  <b-row>
    <b-col cols="12">
      <h2>
        Edit Book
        <b-link href="#/book-list">(Book List)</b-link>
      </h2>
      <b-jumbotron>
        <template slot="header">
          {{book.title}}
        </template>
        <template slot="lead">
          Bar Code: {{book.barCode}}<br>
          Author: {{book.author}}<br>
          Publisher: {{book.publisher}}<br>
          Quantity: {{book.qty}}<br>
        </template>
        <hr class="my-4">
        <b-btn variant="success" @click.stop="editbook(book.barCode)">Edit</b-btn>
        <b-btn variant="danger" @click.stop="deletebook(book.barCode)">Delete</b-btn>
      </b-jumbotron>
    </b-col>
  </b-row>
</template>

<script>

import axios from 'axios'

export default {
  name: 'ShowBook',
  data () {
    return {
      book: []
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
            authorization: localStorage.getItem("Auth Token")
        }
    })
    .then(response => {
        console.log(response.data);
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
        
        if(e.response.status == 500){
          alert("Error with the server");
          return;
        }
    })
  },
  methods: {
    editbook (bookid) {
      this.$router.push({
        name: 'EditBook',
        params: { id: bookid }
      })
    },
    deletebook (bookid) {
      axios.delete('http://localhost:3000/api/book/delete/' + bookid,{
        headers:{
            authorization:localStorage.getItem("Auth Token")
        }
    })
      .then((result) => {
        this.$router.push({
          name: 'BookList'
        })
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
        
        if(e.response.status == 500){
          alert("Error with the server");
          return;
        }
      })
    }
  }
}
</script>

<style>
  .jumbotron {
    padding: 2rem;
  }
</style>