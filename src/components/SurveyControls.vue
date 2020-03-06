<style>
.stickyPanel {
  padding: 10px 15px;
  background-color: #f5f5f5;
  border-top: 1px solid #ddd;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
  border-radius: 0.25rem;
}
.sticky {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  bottom: 1rem;
}
</style>
<template>
  <b-container class="sticky sv_main sv_bootstrapmaterial_css">
    <b-row class="stickyPanel" :no-gutters="true" v-if="!isMobile()">
      <b-col class="d-flex justify-content-start">
        <input type="button" value="Reset" class="btn sv_prev_btn btn-primary" v-on:click="$emit('startAgain')" />
      </b-col>
      <b-col class="d-flex justify-content-center">
        <input type="button" value="Previous" class="btn sv_prev_btn btn-primary mr-2" v-on:click="prevPage" :disabled="this.survey.isFirstPage" />
        <input type="button" value="Next" class="btn sv_prev_btn btn-primary" v-on:click="nextPage" :disabled="this.survey.isLastPage" />
      </b-col>
      <b-col class="d-flex justify-content-end">
        <input type="button" value="Finish" class="btn sv_prev_btn btn-primary" v-on:click="finish" />
      </b-col>
    </b-row>
    <b-row class="stickyPanel" :no-gutters="true" v-if="isMobile()">
      <b-col>
        <b-row>
          <b-col class="d-flex justify-content-between">
            <input type="button" value="Previous" class="btn sv_prev_btn btn-primary" v-on:click="prevPage" :disabled="this.survey.isFirstPage" />
            <input type="button" value="Next" class="btn sv_prev_btn btn-primary" v-on:click="nextPage" :disabled="this.survey.isLastPage" />
          </b-col>
        </b-row>
        <br />
        <b-row>
          <b-col class="d-flex justify-content-between">
            <input type="button" value="Reset" class="btn sv_prev_btn btn-primary" v-on:click="$emit('startAgain')" />
            <input type="button" value="Finish" class="btn sv_prev_btn btn-primary" v-on:click="finish" />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Model } from "survey-vue";

// define a mixin object
var myMixin = {
  methods: {
    isMobile: function() {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
      } else {
        return false;
      }
    }
  }
};

@Component({
  mixins: [myMixin]
})
export default class SurveyControls extends Vue {
  @Prop() public survey!: Model;

  prevPage() {
    this.survey.prevPage();
  }
  nextPage() {
    this.survey.nextPage();
  }
  finish() {
    this.survey.doComplete();
  }
}
</script>
