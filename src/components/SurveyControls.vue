<style scoped>
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
.btn-save {
  background-color: #007bff !important;
}
</style>
<template>
  <b-container class="sticky sv_main sv_bootstrapmaterial_css">
    <b-row class="stickyPanel" :no-gutters="true" v-if="!isMobile()">
      <b-col class="d-flex justify-content-start">
        <input type="button" value="Reset" class="btn btn-primary" v-on:click="reset" />
      </b-col>
      <b-col class="d-flex justify-content-center">
        <input type="button" value="Previous" class="btn btn-primary mr-2" v-on:click="prevPage" :disabled="this.survey.isFirstPage" />
        <input type="button" value="Next" class="btn btn-primary" v-on:click="nextPage" :disabled="this.survey.isLastPage" />
      </b-col>
      <b-col class="d-flex justify-content-end">
        <input type="button" value="Save" class="btn btn-primary btn-save mr-2" v-on:click="save()" />
        <input type="button" value="Finish" class="btn btn-primary" v-on:click="finish" />
      </b-col>
    </b-row>
    <b-row class="stickyPanel" :no-gutters="true" v-if="isMobile()">
      <b-col>
        <b-row>
          <b-col class="d-flex justify-content-between">
            <input type="button" value="Previous" class="btn btn-primary" v-on:click="prevPage" :disabled="this.survey.isFirstPage" />
            <input type="button" value="Next" class="btn btn-primary" v-on:click="nextPage" :disabled="this.survey.isLastPage" />
          </b-col>
        </b-row>
        <br />
        <b-row>
          <b-col class="d-flex justify-content-between">
            <input type="button" value="Reset" class="btn btn-primary" v-on:click="reset" />
            <input type="button" value="Finish" class="btn btn-primary" v-on:click="finish" />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Model } from "survey-vue";
import { SurveyMixins } from "@/mixins/SurveyMixins";

@Component({
  methods: {
    isMobile: SurveyMixins.isMobile,
    save: function () {
      SurveyMixins.saveSurvey(this.$store.state);
    } 
  }
})
export default class SurveyControls extends Vue {
  @Prop() public survey!: Model;

  reset() {
    this.$bvModal
      .msgBoxConfirm("Please confirm that you want to reset everything and start over.", {
        title: "Please Confirm",
        size: "md",
        buttonSize: "sm",
        okVariant: "danger",
        okTitle: "YES",
        cancelTitle: "NO",
        footerClass: "p-2",
        hideHeaderClose: false,
        centered: true
      })
      .then(value => {
        if (value === true) {
          this.$emit('startAgain');
        }
      });
  }
  prevPage() {
    this.survey.prevPage();
  }
  nextPage() {
    this.survey.nextPage();
  }
  finish() {
    this.$bvModal
      .msgBoxConfirm("Do you want to save your responses?", {
        title: "Thank you for completing the survey!",
        size: "md",
        buttonSize: "sm",
        okTitle: "YES",
        cancelTitle: "NO",
        footerClass: "p-2",
        hideHeaderClose: false,
        centered: true
      })
      .then(value => {
        if (value === null) {
          return;
        }
        if (value === true) {
          SurveyMixins.saveSurvey(this.$store.state); 
        }
        this.survey.doComplete();
      });
    
  }
}
</script>
