<template>
    <div class="container">
      <div class="row">
        <div class="offset-4 col-4">
          <div class="text-center">
            <img 
            src="../assets/SV Logo.png"
            style="width: 100px;"
            class="mb-4"/>
            <h2>Log in to your account</h2>
            <p>Welcome back! Please enter your details.</p>
          </div>
        
          <form @submit.prevent="handleLogin" class="mt-3">
            <div class="d-grid mb-4">
              <label for="username" class="pb-2">Username</label>
              <input type="text" id="username" placeholder="Enter your email" v-model="user.username" required />
            </div>
      
            <div class="d-grid mb-4">
              <label for="password" class="pb-2">Password</label>
              <input type="password" id="password" placeholder="Password" v-model="user.password" required />
            </div>
      
            <div class="d-grid text-center">
              <button class="btn bg-secondary-dark text-white" type="submit">Log in</button>
              <p class="mt-4 text-danger" v-if="errorMessage">{{ errorMessage }}</p>
            </div>

            <div class="text-center mt-4">
            <p class="m-0">Don’t have an account?</p><RouterLink class="btn btn-link" to="/register">Register</RouterLink>
          </div>
        
        </form>

        <div class="text-center">
          <p class="text-muted small mt-3">
            You can test the login functionality using the account below.<br />
            There's no need to use your real personal information.
          </p>

          <p class="text-muted small">
            <strong>Test Account:</strong><br />
            Email: <code>sinevega_user</code><br />
            Password: <code>User@1234</code>
          </p>

        </div>
         
        </div>

      </div>
      
    </div>
  </template>
  


<script setup lang="ts">

import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from '../stores/useUserStore'

const API_URL = import.meta.env.VITE_API_URL || "/api";

const user = ref({
    username: '',
    password: '',
});

const errorMessage = ref('');
const userStore = useUserStore()

const handleLogin = async () => {

  try {

    const response = await axios.post(`${API_URL}/login`, {
      username: user.value.username,
      password: user.value.password,
    });
   
   userStore.setUser(response.data);

   window.location.href = '/';

  } catch (error) {
    errorMessage.value = "Incorrect email or password.";
    console.error(error);
  }

}


</script>