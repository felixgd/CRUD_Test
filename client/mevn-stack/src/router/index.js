import Vue from 'vue'
import Router from 'vue-router'
import BookList from '@/components/Book/BookList'
import ShowBook from '@/components/Book/ShowBook'
import CreateBook from '@/components/Book/CreateBook'
import EditBook from '@/components/Book/EditBook'
import SignUp from '@/components/User/SignUp'
import Login from '@/components/User/Login'
import CustomerList from '@/components/Customer/CustomerList'
import CreateCustomer from '@/components/Customer/CreateCustomer'
import ShowCustomer from '@/components/Customer/ShowCustomer'
import EditCustomer from '@/components/Customer/EditCustomer'
import ShowCustomerLoans from '@/components/Loans/ShowCustomerLoans'
import ShowLoan from '@/components/Loans/ShowLoan'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/book-list',
      name: 'BookList',
      component: BookList
    },
    {
      path: '/show-book/:id',
      name: 'ShowBook',
      component: ShowBook
    },
    {
      path: '/add-book',
      name: 'CreateBook',
      component: CreateBook
    },
    {
      path: '/edit-book/:id',
      name: 'EditBook',
      component: EditBook
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/customer-list',
      name: 'CustomerList',
      component: CustomerList
    },
    {
      path: '/show-customer/:id',
      name: 'ShowCustomer',
      component: ShowCustomer
    },
    {
      path: '/create-customer',
      name: 'CreateCustomer',
      component: CreateCustomer
    },
    {
      path: '/edit-customer/:id',
      name: 'EditCustomer',
      component: EditCustomer
    },
    {
      path: '/loans/:id',
      name: 'ShowCustomerLoans',
      component: ShowCustomerLoans
    },
    {
      path: '/loans/:customerID/:bookLoanID',
      name: 'ShowLoan',
      component: ShowLoan
    }
  ]
})
