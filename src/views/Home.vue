<template>
  <div class="home">
    <DesignAssistant v-if="isSurveyStarted" :survey="Survey" v-on:startAgain="startAgain" />
    <div v-else>
      <h1 class="section-header">{{ $t("appTitle") }}</h1>
      <div style="padding: 1em;">
        <p>Welcome‌ ‌to‌ ‌the‌ ‌Responsible‌ ‌Design‌ ‌Assistant‌ ‌beta.‌ ‌This‌ ‌is‌ ‌a‌ ‌virtual‌ ‌guide‌ ‌to‌ ‌help‌ ‌those‌ designing,‌ ‌developing,‌ ‌and‌ ‌implementing‌ ‌AI‌ ‌systems‌ ‌do‌ ‌so‌ ‌in‌ ‌a‌ ‌responsible‌ ‌way.‌</p>
        <p>Committed‌ ‌to‌ ‌making‌ ‌responsible‌ ‌AI‌ ‌systems,‌ ‌we’ve‌ ‌done‌ ‌the‌ ‌hard‌ ‌work‌ ‌of‌ ‌deciphering‌ the‌ ‌best‌ ‌practices,‌ ‌policies,‌ ‌and‌ ‌principles‌ ‌and‌ ‌put‌ ‌them‌ ‌into‌ ‌a‌ ‌simple‌ ‌online‌ ‌survey.‌</p>
        <p>With‌ ‌our‌ ‌esteemed‌ ‌community‌ ‌of‌ ‌subject‌ ‌matter‌ ‌experts‌ ‌ranging‌ ‌from‌ ‌engineers,‌ ‌to‌ ethicists,‌ ‌to‌ ‌policy‌ ‌makers,‌ ‌we‌ ‌have‌ ‌taken‌ ‌the‌ ‌most‌ ‌cited‌ ‌principles,‌ ‌whitepapers,‌ ‌and‌ policy‌ ‌documents‌ ‌published‌ ‌by‌ ‌academics,‌ ‌standards‌ ‌organizations,‌ ‌and‌ ‌companies‌ and‌ ‌translated‌ ‌them‌ ‌into‌ ‌comprehensive‌ ‌questions.‌</p>
        <p>Based‌ ‌on‌ ‌our‌ ‌research‌ ‌and‌ ‌experience‌ ‌we‌ ‌have‌ ‌created‌ ‌a‌ ‌comprehensive‌ ‌evaluation‌ looking‌ ‌at‌ ‌the‌ ‌following‌ ‌dimensions‌ ‌of‌ ‌a‌ ‌trusted‌ ‌AI‌ ‌program:‌</p>
        <ol style="font-weight: bold;">
          <li>Accountability</li>
          <li>Explainability and Interpretability</li>
          <li>Data Quality</li>
          <li>Bias and Fairness</li>
          <li>Robustness</li>
        </ol>
        <p>Our‌ ‌hope‌ ‌is‌ ‌that‌ ‌you‌ ‌will‌ ‌work‌ ‌with‌ ‌your‌ ‌colleagues‌ ‌who‌ ‌are‌ ‌responsible‌ ‌for‌ ‌different‌ aspects‌ ‌of‌ ‌your‌ ‌business‌ ‌to‌ ‌fill‌ ‌out‌ ‌the‌ ‌Design‌ ‌Assistant.‌ ‌Whether‌ ‌you‌ ‌are‌ ‌just‌ ‌thinking‌ about‌ ‌how‌ ‌to‌ ‌integrate‌ ‌AI‌ ‌tools‌ ‌into‌ ‌your‌ ‌business,‌ ‌or‌ ‌you‌ ‌have‌ ‌already‌ ‌deployed‌ several‌ ‌models,‌ ‌this‌ ‌tool‌ ‌is‌ ‌for‌ ‌you.‌ ‌We‌ ‌do‌ ‌think‌ ‌that‌ ‌these‌ ‌questions‌ ‌are‌ ‌best‌ ‌to‌ ‌think‌ about‌ ‌at‌ ‌the‌ ‌start‌ ‌of‌ ‌your‌ ‌project,‌ ‌however,‌ ‌we‌ ‌do‌ ‌think‌ ‌that‌ ‌the‌ ‌Design‌ ‌Assistant‌ ‌can‌ ‌be‌ used‌ ‌throughout‌ ‌the‌ ‌lifecycle‌ ‌of‌ ‌your‌ ‌project!‌</p>
        <p>To‌ ‌learn‌ ‌more‌ ‌about‌ ‌the‌ ‌background‌ ‌of‌ ‌this‌ ‌project,‌ ‌check‌ ‌out‌ ‌our‌ ‌post‌ ‌about‌ ‌the‌ creation‌ ‌of‌ ‌the‌ ‌Design‌ ‌Assistant‌ ‌on‌ ‌‌<a target="_blank" href="https://ai-global.org/2020/04/28/creating-a-responsible-ai-trust-index-a-unified-assessment-to-assure-the-responsible-design-development-and-deployment-of-ai/">ai-global.org</a></p>
        <p>For‌ ‌more‌ ‌information‌ ‌on‌ ‌how‌ ‌to‌ ‌use‌ ‌the‌ ‌Design‌ ‌Assistant,‌ ‌including‌ ‌FAQ’s,‌ ‌check‌ ‌out‌ our <a target="_blank" href="https://docs.google.com/presentation/d/1EDPhyRhIsiOrujLcHQv_fezXfgOz4Rl7a8lyOM_guoA/edit#slide=id.p1">Guide</a></p>
      </div>
      <div class="row sv_main sv_bootstrapmaterial_css" style="padding: 25px;">
        <div class="col-sm-6">
          <div class="card h-100">
            <div class="card-header">Design assistant</div>
            <div class="card-body d-flex justify-content-center h-100">
              <div>
                <input type="button" value="Start measuring your AI Trust Index now!" class="btn sv_start_btn btn-primary" v-on:click="startSurvey" />
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="card h-100">
            <div class="card-header">Continue existing survey</div>
            <div class="card-body d-flex justify-content-center h-100">
              <ActionButtonBar v-on:fileLoaded="fileLoaded($event)" v-on:startAgain="startAgain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Model } from "survey-vue";
import showdown from "showdown";
import $ from "jquery";
import "bootstrap";

import DesignAssistant from "@/components/DesignAssistant.vue"; // @ is an alias to /src
import ActionButtonBar from "@/components/ActionButtonBar.vue";
import SurveyFile from "@/interfaces/SurveyFile";
import i18n from "@/plugins/i18n";
import { RootState } from "@/types";
import surveyJSON from "@/survey-enfr.json";

@Component({
  components: {
    DesignAssistant,
    ActionButtonBar,
  }
})
export default class Home extends Vue {
  isSurveyStarted: boolean = false;
  Survey: Model = new Model(surveyJSON);

  startSurvey() {
    this.isSurveyStarted = true;
    this.Survey.start();
  }
  startAgain() {
    this.isSurveyStarted = false;
    this.Survey.clear(true, true);
    window.localStorage.clear();
    this.$store.commit("resetSurvey");
  }
  fileLoaded($event: SurveyFile) {
    this.Survey.data = $event.data;
    this.Survey.currentPageNo = $event.currentPage;
    this.Survey.start();
    this.isSurveyStarted = true;
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

    this.Survey.startSurveyText = "Start now!";

    // Remove the default required '*'.
    this.Survey.requiredText = "";

    this.Survey.onAfterRenderPage.add((sender, options) => {
      const node = options.htmlElement.getElementsByTagName("h4")[0];
      if (node) {
        node.classList.add('section-header');
      }
      $('[data-toggle="tooltip"').tooltip({
        boundary: 'viewport'
      });
    });

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
        
        // add tooltip for question
        let altTextHTML = "";
        if (options.question.alttext && options.question.alttext.hasOwnProperty("default")) {
          let altText = converter.makeHtml(options.question.alttext.default.replace(/"/g, "&quot;"));
          altText = `<div class="text-justify">${altText}</div>`.replace(/"/g, "&quot;");
          altTextHTML = `<i class="fas fa-info-circle ml-2" data-toggle="tooltip" data-html="true" title="${altText}"></i>`;
        }

        title.outerHTML =
          '<label for="' +
          options.question.inputId +
          '" class="' +
          title.className +
          '"><span class="field-name">' +
          title.innerText +
          "</span>" +
          altTextHTML +
          questionRequiredHTML +
          "</label>";
      }

      // add tooltip for answers
      options.htmlElement.querySelectorAll("input").forEach((element: any) => {
        if (options.question.alttext && options.question.alttext.hasOwnProperty(element.value)) {
          const div = element.closest("div");
          div.classList.add("d-flex");
          const i = document.createElement("span");
          let altText = converter.makeHtml(options.question.alttext[element.value].default.replace(/"/g, "&quot;"));
          altText = `<div class="text-justify">${altText}</div>`.replace(/"/g, "&quot;");
          i.innerHTML = `<i class="fas fa-info-circle ml-2" data-toggle="tooltip" data-html="true" title="${altText}"></i>`;
          div.appendChild(i);
        }
      });
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
