<template>
  <div>
    <SurveyProgress :survey="survey" />
    <div id="surveyContainer" class="wb-frmvld">
      <survey v-bind:survey="survey"></survey>
    </div>
    <SurveyControls :survey="survey" v-on:startAgain="$emit('startAgain')" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Model } from "survey-vue";
import SurveyControls from "@/components/SurveyControls.vue";
import SurveyProgress from "@/components/SurveyProgress.vue";
import showdown from "showdown";

@Component({
  components: {
    SurveyControls,
    SurveyProgress
  }
})
export default class DesignAssistant extends Vue {
  @Prop() public survey!: Model;
  mounted() {
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
