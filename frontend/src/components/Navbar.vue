<template>
  <div class="text-center">
        <p class="m-0 text-bg-warning text-muted">
        Note: This is a portfolio demo. Favorites stay in this tab and disappear when you refresh. No account data is collected.
      </p>
  </div>
  
  <nav class="navbar navbar-expand-lg bg-secondary-dark mb-5">
    <div class="container container-fluid">

      <!-- Sol taraf -->
      <div class="d-flex align-items-center">
        <RouterLink class="navbar-brand fs-1 text-white" to="/"><img src="../assets/SV Logo.png" style="width: 100px;"/></RouterLink>
        <ul class="navbar-nav flex-row gap-3 ms-3">
          <li class="nav-item">
            <RouterLink class="nav-link text-white fs-4" to="/">Home</RouterLink>
          </li>
        </ul>
      </div>

    </div>
  </nav>
</template>