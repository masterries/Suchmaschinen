<template>
  <div>
    <b-form-group
      label="Individual stacked checkboxes (default)"
      v-slot="{ ariaDescribedby }"
    >
      <b-form-checkbox
        v-for="option in options"
        v-model="selected"
        :key="option.value"
        :value="option.value"
        :aria-describedby="ariaDescribedby"
        name="flavour-3a"
      >
        {{ option.text }}
      </b-form-checkbox>
    </b-form-group>
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
        selected: [], // Must be an array reference!
        options: [
          { text: 'Music', value: 'Music' },
          { text: 'Entertainment', value: 'Entertainment' },
          { text: 'Gaming', value: 'Gaming' },
          { text: 'People & Blogs', value: 'People & Blogs' },
          { text: 'Howto & Style', value: 'Howto & Style' },
          { text: 'Education', value: 'Education' },
          { text: 'Film and Animation', value: 'Film and Animation' },
          { text: 'Sports', value: 'Sports' },
          { text: 'Science & Technology', value: 'Science & Technology' },
          { text: 'Comedy', value: 'Comedy' },
          { text: 'Autos & Vehicles', value: 'Autos & Vehicles' },
          { text: 'News & Politics', value: 'News & Politics' },
          { text: 'Travel & Events', value: 'Travel & Events' },
          { text: 'Pets & Animals', value: 'Pets & Animals' }
        ]
      }
    }
  }
</script>