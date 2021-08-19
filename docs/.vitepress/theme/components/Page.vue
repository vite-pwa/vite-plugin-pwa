<template>
  <main class="page">
    <div class="container">
      <slot name="top" />

      <div class="content">
        <Content />
      </div>

      <PageFooter />

      <NextAndPrevLinks />

      <slot name="bottom" />
    </div>
  </main>
</template>

<style scoped>
.page {
  padding-top: var(--header-height);
}

@media (min-width: 780px) {
  .page {
    margin-left: var(--sidebar-width);
  }
}

.container {
  margin: 0 auto;
  padding: 0 1.5rem 4rem;
  max-width: 48rem;
}

.content {
  padding-bottom: 1.5rem;
}
</style>
