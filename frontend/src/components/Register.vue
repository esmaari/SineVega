<template>

<div class="container">
      <div class="row">
        <div class="offset-4 col-4">
          <div class="text-center">
            <img 
            src="../assets/SV Logo.png"
            style="width: 100px;"
            class="mb-4"/>
            <h2>Create an account</h2>
            <p>Start your journey!</p>
          </div>

            <p class="text-bg-warning small mt-3">
              Please do not enter your real or sensitive personal information. This is a demo environment. See our <router-link to="/privacy">Privacy Policy</router-link> for details on how demo data is handled.<br />
              Instead, you can go to the <router-link to="/login">Login</router-link> page and use the test account provided there.
            </p>

        
          <form @submit.prevent="handleRegister" class="mt-3">
            <div class="d-grid mb-4">
              <label for="username" class="pb-2">Username</label>
              <input type="text" id="username" v-model="newUser.username" required />
            </div>
      
            <div class="d-grid mb-4">
              <label for="password" class="pb-2">Email</label>
              <input type="email" id="email" v-model="newUser.email" required />
            </div>

            <div class="d-grid mb-4">
              <label for="password" class="pb-2">Password</label>
              <input type="password" id="password" v-model="newUser.password" required />
            </div>
      
            <div class="d-grid">
              <button class="btn bg-secondary-dark text-white" type="submit">Get Started</button>
              <p class="mt-4 text-danger" v-if="errorMessages">{{ errorMessages }}</p>
            </div>

            <div class="text-center mt-4">
            <p class="m-0">Already have an account?</p><RouterLink class="btn btn-link" to="/login">Log in</RouterLink>
          </div>
        
          </form>
        </div>

      </div>
      
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const newUser = ref({
  username: '',
  email: '',
  password: '',
});

const errorMessages = ref('');

const handleRegister = async () => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username: newUser.value.username,
      email: newUser.value.email,
      password: newUser.value.password,
    });

    console.log('Registration successful:', response.data);
    alert('Registration successful! Redirecting to login page.');
    window.location.href = '/login'; 

  } catch (error: any) {
    errorMessages.value = 'Oops! Something went wrong. This user might already be registered.';

    if (error.response && error.response.status === 400) {
   
     alert(error.response.data.error);
      
    }
    
    console.error(error);
  }
};
</script>
