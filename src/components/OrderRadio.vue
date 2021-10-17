<template>
  <div>
    <b-form-group label="OrderRadios" v-slot="{ ariaDescribedby }">
      <b-form-radio-group
        :options="options"
        :aria-describedby="ariaDescribedby"
        name="radios-stacked-order"
        stacked
      ></b-form-radio-group>
    </b-form-group>

    <div class="mt-3">Selected: <strong>{{ sort }}</strong></div>
  </div>
</template>

<script>
  export default {
      methods: {
    onSubmit(event) {
      event.preventDefault();
      this.$emit('submit');
    }
  },
    data() {
      return {
        options: [
          { text: 'Ascending', value: 'asc' },
          { text: 'Descending', value: 'desc' }
        ]
      }
    }
  }
</script>