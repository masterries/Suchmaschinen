<template>
  <div>
    <b-form-group label="OrderValueRadios" v-slot="{ ariaDescribedby }">
      <b-form-radio-group
        v-model="selected"
        :options="options"
        :aria-describedby="ariaDescribedby"
        name="radios-stacked"
        stacked
      ></b-form-radio-group>
    </b-form-group>

    <div class="mt-3">Selected: <strong>{{ selected }}</strong></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        selected: 'normal',
        options: [
          { text: 'Relevance', value: 'normal' },
          { text: 'Followers', value: 'followers' },
          { text: 'Videos', value: 'videos' }
        ]
      }
    }
  }
</script>