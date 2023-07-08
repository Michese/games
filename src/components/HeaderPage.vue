<template>
  <header class="header-page">
    <slot />
  </header>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.header-page {
  position: sticky;
  padding: 15px;
  top: 0;
  width: 100%;
  box-sizing: content-box;
  background-color: #242424;
  z-index: 1;
}
</style>
