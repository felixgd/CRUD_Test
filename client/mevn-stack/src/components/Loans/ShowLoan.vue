<template>
  <b-row>
    <b-col cols="12">
      <h2>
        Customer Loans
        <b-link href="#/customer-list">(Customer List)</b-link>
        <b-link href="#/book-list">(Book List)</b-link>
      </h2>
      <div style="margin-bottom:0.5%">
        <b-btn variant="success" size="sm" @click.stop="completeLoan()">Complete Loan</b-btn>
        <b-btn variant="info" v-b-modal.changeDateModal size="sm">Change Return Date</b-btn>
        <b-btn variant="danger" size="sm" @click.stop="deleteBookLoan()">Delete Loan</b-btn>
      </div>
      <b-table striped hover :items="books" :fields="fields"  :key="books.barCode">
        <template slot="actions" scope="row">
          <b-btn variant="danger" size="sm" @click.stop="deleteBookFromLoan(row.item)">Delete Book</b-btn>
        </template>
      </b-table>
      <ul v-if="errors && errors.length">
        <li v-for="error of errors">
          {{error.message}}
        </li>
      </ul>
    </b-col>
    <b-modal id="changeDateModal" title="Create Loan" size="lg" ref="loanModal">
      <b-row>
        <b-col>
          <span>New Return Date:</span>
          <b-form-input type="date" v-model="newDate" @change="verifyDate()"></b-form-input>
        </b-col>
      </b-row>
      <div slot="modal-footer" class="w-100">
        <b-button
          variant="success"
          size="md"
          class="float-right"
          @click="changeReturnDate()"
        >
          Save
        </b-button>
      </div>
    </b-modal>
  </b-row>
</template>

<script>

import axios from 'axios'

export default {
  name: 'ShowBook',
  data () {
    return {
      fields: {
        barCode: { label: 'Bar Code', sortable: true, 'class': 'text-center' },
        title: { label: 'Title', sortable: true },
        author: { label: 'Author', sortable: true },
        publisher: { label: 'Publisher', sortable: true },
        qty: { label: 'Quantity on this Loan', 'class': 'text-center' },
        actions: { label: 'Action', 'class': 'text-center' }
      },
      loan: [],
      books: [],
      errors: [],
      newDate:''
    }
  },
  created () {
      if(!localStorage.getItem('Auth Token')){
        this.$router.push({
              name: 'Login'
        })
      }
    axios.get(`http://localhost:3000/api/bookloan/` + this.$route.params.customerID+'/'+this.$route.params.bookLoanID,{
        headers:{
            authorization: localStorage.getItem("Auth Token")
        }
    })
    .then(response => {
      this.loan = response.data;
      for(let i = 0; i<response.data.books.length;i++){
          response.data.books[i].bookRef.qty = response.data.books[i].qty;
          this.books.push(response.data.books[i].bookRef);
      }
    })
    .catch(e => {
      if(e.response.status == 401){
          this.$router.push({
              name: 'Login'
        })
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
    deleteBookFromLoan (book) {
      axios.delete('http://localhost:3000/api/bookloan/delete/' + this.$route.params.customerID +"/"+ this.$route.params.bookLoanID +"/"+book.barCode,{
        headers:{
            authorization:localStorage.getItem("Auth Token")
        }
    })
      .then((result) => {
        this.$router.go();
      })
      .catch(e => {
        if(e.response.status == 401){
          this.$router.push({
              name: 'Login'
        })
        }

        if(e.response.status == 404){
          alert("This Book was not found");
          return;
        }
        
        if(e.response.status == 500){
          alert("Error with the server");
          return;
        }
      })
    },
    deleteBookLoan () {
      axios.delete('http://localhost:3000/api/bookloan/delete/' + this.$route.params.customerID +"/"+ this.$route.params.bookLoanID,{
        headers:{
            authorization:localStorage.getItem("Auth Token")
        }
    })
      .then((result) => {
        this.$router.push({
        name: 'CustomerList'
        })
      })
      .catch(e => {
        if(e.response.status == 401){
          this.$router.push({
              name: 'Login'
        })
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
    changeReturnDate () {let dateToday = new Date();
        let dateAux = new Date(this.shouldReturnAt);
        let month = '';
        let day = '';
        let year = '';
        dateToday.setHours(0,0,0);
        dateAux.setHours(23,59,59);
        if (dateAux > dateToday) {
          month = dateAux.getMonth() + 1;
          day = dateAux.getDate();
          year = dateAux.getFullYear();
          this.newDate = month+"-"+day+"-"+year;
        } else {
          alert("Invalid Date!");
          return;
        }

        let data = {
            shouldReturnAt:this.newDate
        }

        axios.post('http://localhost:3000/api/bookloan/edit/' + this.$route.params.customerID +"/"+ this.$route.params.bookLoanID, data,{
            headers:{
              authorization:localStorage.getItem("Auth Token")
            }
    })
      .then((result) => {
        this.$router.go();
      })
      .catch(e => {
        if(e.response.status == 401){
          this.$router.push({
              name: 'Login'
        })
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
    verifyDate(){
        let dateToday = new Date();
        let dateAux = new Date(this.newDate);
        let month = '';
        let day = '';
        let year = '';
        dateToday.setHours(0,0,0);
        dateAux.setHours(23,59,59);
        if (dateAux >= dateToday) {
          month = dateAux.getMonth() + 1;
          day = dateAux.getDate();
          year = dateAux.getFullYear();
          this.shouldReturnAt = month+"/"+day+"/"+year;
        } else {
          alert("Invalid Date!");
        }
    },
    completeLoan () {
      if(!localStorage.getItem('Auth Token')){
        this.$router.push({
              name: 'Login'
        })
      }
    axios.post(`http://localhost:3000/api/bookloan/complete/` + this.$route.params.customerID+'/'+this.$route.params.bookLoanID,'',{
        headers:{
              authorization:localStorage.getItem("Auth Token")
            }
    })
    .then(response => {
      this.$router.push({
        name: 'CustomerList'
      })
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
  }
}
</script>

<style>
  .jumbotron {
    padding: 2rem;
  }
</style>