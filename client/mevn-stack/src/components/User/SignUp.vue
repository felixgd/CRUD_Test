<template>
  <b-row>
  <b-col cols="3"></b-col>
    <b-col cols="6" align-self="center" align-h="center">
      <h2>
        Sign Up!
      </h2>
      <b-form @submit="onSubmit">
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Username">
          <b-form-input id="username" :state="state" v-model.trim="user.username"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Email">
          <b-form-input id="email" :state="state" v-model.trim="user.email"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Password">
          <b-form-input id="password" :state="state" v-model.trim="user.password" type="password"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Repeat Password">
          <b-form-input id="rePassword" :state="state" v-model.trim="user.repassword" type="password"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit!</b-button>
      </b-form>
    </b-col>
    <b-col cols="3"></b-col>
  </b-row>
</template>

<script>

import axios from 'axios'

export default {
  name: 'SignUp',
  data () {
    return {
      user: {}
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      axios.post(`http://localhost:3000/api/user/sign_up`, this.user)
      .catch(e => {
        this.errors.push(e)
      })
    }
  }
}
</script>