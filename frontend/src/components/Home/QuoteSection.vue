<template>
    <section class="quote-section bg-white d-flex  align-items-center">

         <div class="container">
            <blockquote class="blockquote text-center">
                <h2 class="fw-semibold">{{ quote.text }}</h2>
                <footer class="blockquote-footer text-muted mt-2">{{ quote.author }}</footer>
            </blockquote>
        </div>

    </section>
</template>

<script setup lang="ts">
    import { quotes } from '../../data/quotes';

    const randomIndex = Math.floor(Math.random() * quotes.length)
    const quote = quotes[randomIndex]

</script>


<style scoped>
    .quote-section {
        min-height: 28vh; 
    }
</style>