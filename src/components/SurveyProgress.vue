<template>
  <b-container fluid>
    <b-row>
      <b-col class="d-flex justify-content-center">
        Page {{ currentPageNo() }} of {{ maxPageNo() }}
      </b-col>
    </b-row>
    <b-row>
      <b-col class="d-flex justify-content-center">
        <b-progress striped :value="perc()" variant="primary" class="mt-2"></b-progress>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Model } from "survey-vue";

@Component
export default class SurveyProgress extends Vue {
  @Prop() public survey!: Model;

  currentPageNo(): number {
    return this.survey.currentPageNo + 1;
  }
  maxPageNo(): number {
    return this.survey.pageCount - 1;
  }
  perc(): number {
    return (this.currentPageNo() / this.maxPageNo()) * 100;
  }
}
</script>
