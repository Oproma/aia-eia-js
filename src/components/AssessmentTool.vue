<template>
  <div>
    <!--<h2>Assessment Tool</h2>-->
    <div id="surveyContainer" class="wb-frmvld">
      <survey v-bind:survey="survey"></survey>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Model } from "survey-vue";
import showdown from "showdown";

@Component
export default class AssessmentTool extends Vue {
  @Prop() public survey!: Model;
  Mounted() {
    const converter = new showdown.Converter();
    this.survey.onTextMarkdown.add(function(survey, options) {
      //convert the markdown text to html
      var str = converter.makeHtml(options.text);
      //set html
      options.html = str;
    });
  }
}
</script>
