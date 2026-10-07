<template>
  <div>
    <section class="sc-hero sc-hero-compact">
      <div class="sc-container">
        <h1>{{ $t('nav.articles') }}</h1>
      </div>
    </section>

    <section class="sc-section sc-section-compact">
      <div
        class="sc-container sc-articles"
        data-testid="articles-list"
      >
        <router-link
          v-for="entry in articles"
          :key="entry.slug"
          class="sc-card sc-article-card"
          :to="`/articles/${entry.slug}`"
          :data-testid="`article-${entry.slug}`"
        >
          <span class="sc-article-card-title">{{ entry.title }}</span>
          <span class="sc-article-card-text">{{ entry.description }}</span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import { articles } from '../data/articles'

export default {
  name: 'ArticlesView',
  data () {
    return { articles }
  }
}
</script>

<style scoped>
.sc-articles {
  max-width: 720px;
  display: grid;
  gap: 12px;
}

.sc-article-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px 22px;
  color: inherit;
  text-decoration: none;
}

.sc-article-card:hover {
  border-color: var(--sc-accent, #2563eb);
  color: inherit;
}

.sc-article-card-title {
  font-weight: 600;
  font-size: 1.05rem;
}

.sc-article-card-text {
  color: var(--sc-muted);
  font-size: 0.92rem;
}
</style>
