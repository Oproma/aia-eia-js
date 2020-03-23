<style scoped>
  .btn-start-again, .btn-start-again:active {
    background-color: rgb(24, 166, 137) !important;
  }
</style>

<template>
  <div class="results">
    <!--<PrintButton />-->
    <h1 class="section-header">{{ $t("resultTitle") }}</h1>

    <!-- <p>{{ $t("onThisPage") }}</p>
    <ul>
      <li>
        <a href="#score">{{ $t("riskLevel") }}</a>
      </li>
      <li>
        <a href="#obligations">{{ $t("requirements.title") }}</a>
      </li>
      <li>
        <a href="#mitigationMeasures">{{ $t("resultSectionMeasure") }}</a>
      </li>
      <li>
        <a href="#qA">{{ $t("resultSectionQA") }}</a>
        <ul>
          <li>
            <a href="#projectDetails">{{ $t("resultSectionPD") }}</a>
          </li>
          <li>
            <a href="#riskQA">{{ $t("resultSectionRQA") }}</a>
          </li>
          <li>
            <a href="#mitigationQA">{{ $t("resultSectionMQA") }}</a>
          </li>
        </ul>
      </li>
    </ul> -->

    <!-- <form>
      <ActionButtonBar
        v-on:fileLoaded="fileLoaded($event)"
        v-on:startAgain="startAgain"
      />
      <div style="border-bottom: 1px solid #21737c; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(44, 153, 164); margin-bottom: 0.2em; margin-top: 1em; padding-bottom: 0.2em;"></div>
    </form> -->

  <div class="panel-body">
    <SurveyScore :survey="Survey" />
    <br />
    <div class="d-flex justify-content-center">
      <RadarChart />
    </div>
    <br />
    <div class="container-fluid">
      <div class="row">
        <p>As AI continues to evolve so will the Design Assistant. We are working now to add questions that are more industry specific and tailored for your location. To do this, we can use your help! Share with us the results of your report. Let us know where you need more clarification, and where more guidance might be needed.</p>
        <p>If you weren’t ready to answer all of the questions today, that’s ok, save your report, and you can reload it the next time you return.</p>
        <p>As an open source tool, we will continue to adjust quickly based on our communities needs. Please let us know if you find any issues and we will be happy to update!</p>
        <p>If you are in need of more hands on support, you can directly contact one of our trusted service providers.</p>
        <p>Since we want you to use the Design Assistant early and often, you can click the button below to start over again!</p>
      </div>
      <div class="row">
        <input type="button" value="Start Again" class="btn btn-primary btn-start-again" @click="startAgain" />
      </div>
    </div>
  </div>
    

    <!-- <div class="container-fluid">
      <div class="row">
        <h2 id="mitigationMeasures">Score by Responsible AI Dimension</h2>
      </div>
      <div>
        <div style="display: inline-block;">
          <p>Data Quality and Rights</p>
          <p>Explainability and Interpretability</p>
          <p>Bias and Fairness</p>
          <p>Compliance and Accountability</p>       
          <p>Robustness</p>
        </div>
        <div style="display: inline-block; margin-left: 1rem; text-align: end;">
          <p>{{ ((score[0]/score[5])*100).toFixed(0) }}%</p>
          <p>{{ ((score[1]/score[6])*100).toFixed(0) }}%</p>
          <p>{{ ((score[2]/score[7])*100).toFixed(0) }}%</p>
          <p>{{ ((score[3]/score[8])*100).toFixed(0) }}%</p>
          <p>{{ ((score[4]/score[9])*100).toFixed(0) }}%</p>
        </div>
      </div>

    </div> -->

    <!-- <br /> -->

    <!-- <Score /> -->
    <!-- <Obligations /> -->

    <!-- <div class="container-fluid">
      <div class="row">
        <h2 id="mitigationMeasures">{{ $t("resultSectionMeasure") }}</h2>
      </div>
      <div class="row">
        <p v-for="result in myResults[3]" :key="result.name">
          {{ $t(result.name) }}
        </p>
      </div>

      <div class="row">
        <h2 id="qA">{{ $t("resultSectionQA") }}</h2>
      </div>

      <div class="row">
        <h3 id="projectDetails">{{ $t("resultSectionPD") }}</h3>
      </div>
      <div class="row" v-for="result in myResults[0]" :key="result.name">
        <Result :data="result"></Result>
      </div>

      <div class="row">
        <h3 id="riskQA">{{ $t("resultSectionRQA") }}</h3>
      </div>
      <div class="row" v-for="result in myResults[1]" :key="result.name">
        <Result :data="result"></Result>
      </div>

      <div class="row">
        <h3 id="mitigationQA">{{ $t("resultSectionMQA") }}</h3>
      </div>
      <div class="row" v-for="result in myResults[2]" :key="result.name">
        <Result :data="result"></Result>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import { Model } from "survey-vue";

import showdown from "showdown";

import AssessmentTool from "@/components/AssessmentTool.vue"; // @ is an alias to /src
import Score from "@/components/Score.vue";
import ActionButtonBar from "@/components/ActionButtonBar.vue";
import Result from "@/components/Result.vue";
import SurveyScore from "@/components/SurveyScore.vue";
import RadarChart from "@/components/RadarChart.vue";
import Obligations from "@/components/Obligations.vue";
import SurveyFile from "@/interfaces/SurveyFile";
import i18n from "@/plugins/i18n";
import surveyJSON from "@/survey-enfr.json";

@Component({
  components: {
    ActionButtonBar,
    Result,
    Score,
    SurveyScore,
    RadarChart,
    Obligations
  },
  computed: {
    score: function() {
      return this.$store.getters.calcScore;
    },
    publicPath: function() {
      return process.env.BASE_URL
    }
  }
})
export default class Results extends Vue {
  // myResults = this.$store.getters.resultDataSections;

  Survey: Model = new Model(surveyJSON);

  startAgain() {
    this.Survey.clear(true, true);
    window.localStorage.clear();
    this.$store.commit("resetSurvey");
    this.$router.push("/");
  }
  fileLoaded($event: SurveyFile) {
    this.Survey.data = $event.data;
    this.Survey.currentPageNo = $event.currentPage;
    this.Survey.start();
    this.$store.commit("updateResult", this.Survey);
  }

  created() {
    this.Survey.onComplete.add(result => {
      this.$store.commit("updateResult", result);
    });

    this.Survey.onComplete.add(result => {
      this.$router.push("Results");
    });

    this.Survey.onValueChanged.add(result => {
      this.$store.commit("updateResult", result);
    });

    const converter = new showdown.Converter();

    this.Survey.onTextMarkdown.add(function(survey, options) {
      //convert the markdown text to html
      var str = converter.makeHtml(options.text);
      //set html
      options.html = str;
    });

    // Set locale
    this.Survey.locale = i18n.locale;

    // Remove the default required '*'.
    this.Survey.requiredText = "";

    // Fix all the question labels as they're using <H5> instead of <label>
    // as SurveyJS has open issue as per: https://github.com/surveyjs/surveyjs/issues/928
    this.Survey.onAfterRenderQuestion.add(function(sender, options) {
      let title = options.htmlElement.getElementsByTagName("H5")[0];
      if (title) {
        var questionRequiredHTML = "";

        if (options.question.isRequired) {
          // Should do localization mechanism
          var requiredText = sender.locale == "fr" ? "obligatoire" : "required";
          questionRequiredHTML =
            ' <strong class="required">(' + requiredText + ")</strong>";
        }

        title.outerHTML =
          '<label for="' +
          options.question.inputId +
          '" class="' +
          title.className +
          '"><span class="field-name">' +
          title.innerText +
          "</span>" +
          questionRequiredHTML +
          "</label>";
      }
    });

    //if survey is in progress reload from store
    if (this.$store.getters.inProgress) {
      this.fileLoaded({
        currentPage: this.$store.state.currentPageNo,
        data: this.$store.state.toolData
      } as SurveyFile);
    }
  }
}
</script>
