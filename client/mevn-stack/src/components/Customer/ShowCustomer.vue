<template>
  <b-row>
    <b-col cols="12">
      <h2>
        Edit customer
        <b-link href="#/customer-list">(customer List)</b-link>
      </h2>
      <b-jumbotron>
        <template slot="header">
          {{customer.firstName}} {{customer.secondName}} {{customer.lastName}}
        </template>
        <template slot="lead">
          ID: {{customer.ID}}<br>
          email: {{customer.email}}<br>
          Is Flagged: {{customer.isFlagged}}<br>
          Loans: {{customer.loans.length}}<br>
        </template>
        <hr class="my-4">
        <b-btn variant="success" @click.stop="editcustomer(customer.ID)">Edit</b-btn>
        <b-btn v-b-modal.loanModal variant="info">Create Loan</b-btn>
        <b-btn variant="info" @click.stop="customerLoans(customer.ID)">Show Loans</b-btn>
        <b-btn variant="danger" @click.stop="deletecustomer(customer.ID)">Delete</b-btn>
      </b-jumbotron>
    </b-col>
    <b-modal id="loanModal" title="Create Loan" size="lg" ref="loanModal">
      <b-row>
        <b-col>
          <b-dropdown text="Select Books to Loan">
            <template v-for="book in books">
              <b-dropdown-item v-b-modal.qtyModal @click="selectBookQty(book)">{{book.barCode}}, {{book.title}}</b-dropdown-item>
            </template>
          </b-dropdown>
        </b-col>
        <b-col>
          <span>Books on Loan List:</span><br>
          <template v-for="bookToLoan in booksToLoan">
          <div style="margin-bottom:5%">
            <span v-if="booksToLoan.length>0" class="align-middle">{{bookToLoan.barCode}}, {{bookToLoan.title}} x {{bookToLoan.qty}}</span> <b-button  variant="danger"  size="sm"  class="float-right align-middle"  @click="deleteBookFromLoanList(bookToLoan.barCode)">Delete</b-button>
          </div>
          </template>
          <span>Should Return At:</span>
          <b-form-input type="date" v-model="selectedDate" @change="verifyDate()"></b-form-input>
        </b-col>
      </b-row>
      <div slot="modal-footer" class="w-100">
        <b-button
          variant="success"
          size="md"
          class="float-right"
          @click="createLoan()"
        >
          Create Loan
        </b-button>
      </div>
    </b-modal>
    <b-modal id="qtyModal" title="Select Quantity" ref="qtyModal">
      <b-row>
        <b-col>
        <template>
          <div>
            <label for="range-1">How many Books?</label>
            <b-form-input id="range-1" v-model="value" type="range" min="1" :max="max_value"></b-form-input>
            <div class="mt-2">Quantity: {{ value }}</div>
          </div>
        </template>
        </b-col>
      </b-row>
      <div slot="modal-footer" class="w-100">
        <b-button
          variant="primary"
          size="sm"
          class="float-right"
          @click="addBookToLoan()"
        >
          Add
        </b-button>
      </div>
    </b-modal>
  </b-row>
</template>

<script>

import axios from 'axios'

export default {
  name: 'ShowCustomer',
  data () {
    return {
      customer: [],
      books:[],
      booksToLoan:[],
      bookToLoan:{
        barCode:'',
        qty:0,
        title:'',
        bookRef:''
      },
      selectedDate:'',
      shouldReturnAt:'',
      value:1,
      max_value:0
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
            authorization: localStorage.getItem("Auth Token")
        }
    })
    .then(response => {
        console.log(response.data);
        this.customer = response.data;
        this.getBooks();
    })
    .catch(e => {
      if(e.response.status == 401){
          this.$router.push({
              name: 'Login'
        })
        }

        if(e.response.status == 404){
          alert("This Costumer was not found");
          return;
        }
    });
  },
  methods: {
    getBooks(){
      axios.get('http://localhost:3000/api/book/toLoan',{
        headers:{
            authorization:localStorage.getItem("Auth Token")
        }
      })
      .then(response => {
        this.books = response.data;
        console.log(this.books);
      })
      .catch(e => {
        if(e.response.status == 401){
          this.$router.push({
              name: 'Login'
        })
        }

        if(e.response.status == 404){
          alert("This Customer was not found");
          return;
        }
        
        if(e.response.status == 500){
          alert("Error with the server");
          return;
        }
      });
    },
    editcustomer (customerid) {
      this.$router.push({
        name: 'EditCustomer',
        params: { id: customerid }
      })
    },
    customerLoans (customerid) {
      this.$router.push({
        name: 'ShowCustomerLoans',
        params: { id: customerid }
      })
    },
    deletecustomer (customerid) {
      axios.delete('http://localhost:3000/api/customer/delete/' + customerid,{
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
          alert("This Customer was not found");
          return;
        }
        
        if(e.response.status == 500){
          alert("Error with the server");
          return;
        }
      })
    },
    selectBookQty (bookToLoan) {
      this.value = 1;
      this.max_value = bookToLoan.qty;
      this.bookToLoan = bookToLoan
    },
    addBookToLoan () {
      this.bookToLoan.qty = this.value;
      this.bookToLoan.bookRef = this.bookToLoan._id;
      this.booksToLoan.push(this.bookToLoan);
      for(let i = 0; i<this.books.length;i++){
        if(this.bookToLoan.barCode == this.books[i].barCode){
          this.books.splice(i, 1);
          break;
        }
      }
      this.$refs['qtyModal'].hide();
    },
    deleteBookFromLoanList (barCode) {
      axios.get(`http://localhost:3000/api/book/` + barCode,{
        headers:{
            authorization: localStorage.getItem("Auth Token")
        }
      })
      .then(response => {        
        this.books.push(response.data);
        for(let i = 0; i<this.booksToLoan.length;i++){
        if(response.data.barCode == this.booksToLoan[i].barCode){
          this.booksToLoan.splice(i, 1);
          break;
        }
      }    
      })
      .catch(e => {
        if(e.response.status == 401){
          this.$router.push({
              name: 'Login'
        })
        }

        if(e.response.status == 404){
          alert("This Customer was not found");
          return;
        }
        
        if(e.response.status == 500){
          alert("Error with the server");
          return;
        }
      })
    },
    createLoan(){
      let dateToday = new Date();
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
        this.shouldReturnAt = month+"-"+day+"-"+year;
      } else {
        alert("Invalid Date!");
        return;
      }

      if(this.booksToLoan.length == 0){
        alert("Please select a Book");
        return;
      }

      if(!this.customer.ID){
        alert("Please select a Customer");
        return;
      }

      let data={
        books: this.booksToLoan,
        customerID:this.customer.ID,
        shouldReturnAt:this.shouldReturnAt
      }

      axios.post(`http://localhost:3000/api/bookloan/create`, data,{
          headers:{
            authorization:localStorage.getItem("Auth Token")
        }
      })
      .then(response => {
        this.$router.go();
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

        if(e.response.status == 400){
          alert("A Loan With the Same ID was Found");
          return;
        }
      })
    },
    verifyDate(){
      let dateToday = new Date();
      let dateAux = new Date(this.selectedDate);
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

    }
  }
}
</script>

<style>
  .jumbotron {
    padding: 2rem;
  }
</style>