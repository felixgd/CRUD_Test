<template>
  <b-row>
  <b-col cols="3"></b-col>
    <b-col cols="6" align-self="center" align-h="center">
      <h2>
        Forgot Password
      </h2>
      <router-link :to="{ name: 'SignUp'}">Don't have an Account? Sign Up here!</router-link>
      <b-form @submit="onSubmit">
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Password">
          <b-form-input id="email" :state="state" v-model.trim="user.password" type="password"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Re enter Password">
          <b-form-input id="email" :state="state" v-model.trim="user.repassword" type="password"></b-form-input>
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
  name: 'Login',
  data () {
    return {
      user: {}
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      this.user.token = this.$route.params.token;
      axios.post(`http://localhost:3000/api/user/reset/`, this.user)
      .then((response)=>{
            this.$router.push({
              name: 'Login'
            })
      })
      .catch(e => {
        if(e.response.status == 422){
          alert("Passwords does not match");
        }

        if(e.response.status == 404){
          alert("Passwords does not match");
        }
      })
    }
  }
}
</script>