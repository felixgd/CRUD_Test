<template>
  <b-row>
    <b-col cols="12">
      <h2>
        Customer Loans
        <b-link href="#/customer-list">(Customer List)</b-link>
        <b-link href="#/book-list">(Book List)</b-link>
      </h2>
      <b-table striped hover :items="loans" :fields="fields">
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
  name: 'ShowCustomerLoans',
  data () {
    return {
      fields: {
        _id: { label: 'Loan ID', sortable: true, 'class': 'text-center' },
        createdAt: { label: 'Created At', sortable: true },
        shouldReturnAt: { label: 'Should Return At', sortable: true },
        isFined: { label: 'Is Flagged', sortable: true },
        totalBooks:{ label: 'Total Books Loaned', sortable:true, 'class': 'text-center'},
        actions: { label: 'More Details', 'class': 'text-center' }
      },
      loans: [],
      errors: []
    }
  },
  created () {
    if(!localStorage.getItem('Auth Token')){
        this.$router.push({
              name: 'Login'
        })
    }
    axios.get(`http://localhost:3000/api/bookloan/`+this.$route.params.id,{
        headers:{
            authorization:localStorage.getItem("Auth Token")
        }
    })
    .then(response => {
      console.log(response.data);
      let totalBooks = 0;
      for(let i = 0; i<response.data.length; i++){
        for(let j = 0; j<response.data[i].books.length; j++){
          totalBooks += response.data[i].books[j].qty;
        }
        response.data[i].totalBooks = totalBooks;
        totalBooks = 0;
      }
      this.loans = response.data
    })
    .catch(e => {
      if(e.response.status == 400){
          alert("Invalid Authentication Token");
          return;
        }

        if(e.response.status == 404){
          alert("This Loan was not found");
          return;
        }
        
        if(e.response.status == 500){
          alert("Error with the server");
          return;
        }
    })
  },
  methods: {
    details (loan) {
      this.$router.push({
        name: 'ShowLoan',
        params: {
          customerID: this.$route.params.id,
          bookLoanID: loan._id
        }
      })
    }
  }
}
</script>