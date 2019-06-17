<template>
  <b-row>
    <b-col cols="12">
      <h2>
        Book List
        <b-link href="#/add-book">(Add Book)</b-link>
        <b-link href="#/customer-list">(Customer List)</b-link>
      </h2>
      <b-table striped hover :items="books" :fields="fields">
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
  name: 'BookList',
  data () {
    return {
      fields: {
        barCode: { label: 'Bar Code', sortable: true, 'class': 'text-center' },
        title: { label: 'Book Title', sortable: true },
        author: { label: 'Author', sortable: true },
        qty:{ label: 'Quantity', sortable:true, 'class': 'text-center'},
        actions: { label: 'Action', 'class': 'text-center' }
      },
      books: [],
      errors: []
    }
  },
  created () {
    if(!localStorage.getItem('Auth Token')){
        this.$router.push({
              name: 'Login'
        })
    }
    axios.get(`http://localhost:3000/api/book`,{
        headers:{
            authorization:localStorage.getItem("Auth Token")
        }
    })
    .then(response => {
      this.books = response.data
    })
    .catch(e => {
      this.errors.push(e)
    })
  },
  methods: {
    details (book) {
      this.$router.push({
        name: 'ShowBook',
        params: { id: book.barCode }
      })
    }
  }
}
</script>