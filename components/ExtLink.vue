<template>
  <a
    :href="to"
    rel="noopener"
    class="text-decoration-none"
    :target="newTab ? '_blank' : '_self'"
  >
    <slot></slot>
  </a>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'ExtLink',

  props: {
    to: {
      type: Object as PropType<string>,
      required: true,
    },
    newTab: {
      type: Object as PropType<boolean>,
      default: true,
    },
  },
})
</script>