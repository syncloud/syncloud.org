<template>
  <div>
    <section class="sc-hero sc-hero-compact">
      <div class="sc-container">
        <h1 data-testid="article-title">
          {{ entry.title }}
        </h1>
        <p class="sc-article-date">
          {{ published }}
        </p>
      </div>
    </section>

    <section class="sc-section sc-section-compact">
      <article
        class="sc-container sc-article"
        data-testid="article-body"
      >
        <component :is="body" />
        <p class="sc-article-back">
          <router-link
            to="/articles"
            data-testid="article-back"
          >
            {{ $t('nav.articles') }}
          </router-link>
        </p>
      </article>
    </section>
  </div>
</template>

<script>
import { article } from '../data/articles'
import SyncloudOnOdroid from '../articles/SyncloudOnOdroid.vue'

const BODIES = {
  'syncloud-on-odroid': SyncloudOnOdroid
}

export default {
  name: 'ArticleView',
  computed: {
    entry () {
      return article(this.$route.meta.article)
    },
    body () {
      return BODIES[this.entry.slug]
    },
    published () {
      return new Date(`${this.entry.date}T00:00:00Z`)
        .toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    }
  }
}
</script>

<style scoped>
.sc-article {
  max-width: 720px;
  line-height: 1.65;
}

.sc-article-date {
  margin: 8px 0 0;
  color: var(--sc-muted);
  font-size: 0.9rem;
}

.sc-article :deep(h2) {
  margin: 34px 0 10px;
  font-size: 1.25rem;
}

.sc-article :deep(p) {
  margin: 0 0 14px;
}

.sc-article :deep(ul),
.sc-article :deep(ol) {
  margin: 0 0 14px;
  padding-inline-start: 22px;
}

.sc-article :deep(li) {
  margin-bottom: 6px;
}

.sc-article :deep(img) {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 18px 0;
  border-radius: 12px;
  border: 1px solid var(--sc-border-soft);
}

.sc-article-back {
  margin-top: 36px;
  padding-top: 18px;
  border-top: 1px solid var(--sc-border-soft);
}
</style>
