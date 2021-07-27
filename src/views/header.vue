<template>
      <nav class="navbar navbar-expand-md navbar-dark bg-dark pt-4 pb-3 mb-5 sticky-top">
        <div class="container-md">
            <a href="#intro" class="navbar-brand">
                <span class="fw-bold fs-2 text-white">
                    Pharma
                </span>
            </a>
            <!-- toggle button for mobile nav    -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-nav"
                aria-controls="main-nav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div id="main-nav" class="collapse navbar-collapse justify-content-end align-bottom">
                <ul class="navbar-nav">
                    <li class="nav-item me-3 fs-5  fw-light">
                        <a href="#" class="nav-link">Inventory</a>
                    </li>
                    <li class="nav-item me-3 fs-5  fw-light">
                        <a href="#" class="nav-link">Notifications</a>
                    </li>
                    <li class="nav-item me-3 fs-5  fw-light">
                        <a class="nav-link" href="#" >Reviews</a>
                    </li>
                   
                    <li class="nav-item dropdown me-3 fs-5  fw-light">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                          Profile
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                          <li><a class="dropdown-item" href="#">Edit Profile</a></li>
                          <li><hr class="dropdown-divider"></li>
                          <li><a class="dropdown-item text-danger" href="#" >Log Out</a></li>
                        </ul>
                      </li>
                </ul>

            </div>


        </div>
    </nav>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap';
export default {

}
</script>

<style>

</style>