<template>
  <input type="button" class="custom-btn" />
</template>

<style lang="scss" scoped>
.custom-btn {
  padding: 15px;
  border-radius: 10px;
  font-size: 1em;
  border: none;
  cursor: pointer;
  background-color: #484848;

  &:hover {
    box-shadow: inset #ccc 0 0 15px;
  }

  &:disabled {
    cursor: pointer;
  }
}
</style>
