<template>
  <footer class="sv-footer bg-primary-light text-white py-4 mt-5">
    <div class="container d-flex flex-column justify-content-between h-100">
      
      <div class="pt-5">
        <span class="fw-bold h2">SineVega</span>
      </div>

 
      <div class="row">
        <div class="col-5">
          <p class="text-muted small">
            Designed & developed by <a href="https://esmaari.github.io/" target="_blank">Esma Ari</a>
          </p>

          <small>© 2025 Cinema Name. All rights reserved.</small>
        </div>
        <div class="col-7 d-flex justify-content-end gap-3">
          <router-link to="/about">About</router-link>
          <router-link to="/terms">Terms of Service</router-link>
          <router-link to="/privacy">Privacy Policy</router-link>
          <router-link to="/impressum">Impressum (Legal Notice)</router-link>
        </div>
      </div>

    </div>
  </footer>
</template>

<style scoped>
.sv-footer {
  height: 28vh;
}
</style>
