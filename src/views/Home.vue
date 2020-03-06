<template>
  <div class="home">
    <DesignAssistant v-if="isSurveyStarted" :survey="Survey" v-on:startAgain="startAgain" />
    <div v-else>
      <h1>{{ $t("appTitle") }}</h1>
      <div v-html="description"></div>
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
  description: string = "";
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
    // *Hack* fetch description from the json file
    this.description = surveyJSON.pages[0].elements[0].html!["default"];

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
