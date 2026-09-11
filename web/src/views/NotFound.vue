<template>
  <div>
    <section class="sc-hero sc-hero-compact">
      <div class="sc-container">
        <h1 data-testid="notfound-heading">
          {{ $t('notfound.heading') }}
        </h1>
      </div>
    </section>

    <section class="sc-section sc-section-compact">
      <div
        class="sc-container sc-prose"
        style="max-width:820px"
      >
        <p data-testid="notfound-body">
          {{ $t('notfound.body') }}
        </p>
        <p>
          <RouterLink
            class="sc-btn sc-btn-primary"
            to="/"
            data-testid="notfound-home"
          >
            {{ $t('notfound.home') }}
          </RouterLink>
        </p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView'
}
</script>
