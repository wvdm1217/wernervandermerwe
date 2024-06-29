<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-before>
      <h1 id="title" tabindex="-1" class="doc-title">
        {{ $frontmatter.title }}
      </h1>
      <p>
        {{ $frontmatter.date ? new Date($frontmatter.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '' }}
      </p>
    </template>
  </Layout>
</template>

<style>
.doc-title {
  letter-spacing: -0.02em;
  line-height: 40px;
  font-size: 32px;
}
</style>