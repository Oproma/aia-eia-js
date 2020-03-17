<style scoped>
  table.score {
    border-spacing: 0.2rem;
    border-collapse: separate;
  }
  .report-card thead th div {
    padding: 0.75rem;
    border: 1px solid #dee2e6;
    border-bottom-width: 2px;
    margin: -1px -1px -2px;
  }
  .report-card thead th {
    width: 33%;
  }
  .score thead th:not(:first-child) {
    width: 25%;
  }
  thead th:not(:first-child),
  .report-card thead th  {
    background-color: #D0E0E3;
  }
  .report-card thead th {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 0px;
    padding: 0;
  }
  .score thead th:first-child {
    vertical-align: top;
  }
  .score th:first-child {
    background-color:#EFEFEF;
  }
  .report-card tbody tr:last-child td {
    border-bottom: 0;
  }
  table input[type=radio] {
    transform: scale(2);
    pointer-events: none;
  }
  .table-responsive {
    margin-bottom: 0;
  }
  .tabs .tab-pane .table-responsive {
    max-height: 350px;
    overflow: auto;
  }
  .nav.flip {
    border-top: 1px solid #dee2e6;
    border-bottom: 0;
  }
  .nav.flip .nav-item {
    margin-top: -1px;
    margin-bottom: 0;
  }
  .nav.flip .nav-item .nav-link.active {
    border-color: #fff #dee2e6 #dee2e6;
  }
  .nav.flip .nav-item .nav-link {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }
  .btn-export {
    float: right;
    margin-top: -0.2rem;
    margin-bottom: -3rem !important;
    padding: .5em !important;
  }
</style>
<template>
  <b-container>
    <input type="button" value="Export" class="btn btn-primary btn-export"/>
    <b-tabs content-class="mt-3">
      <b-tab title="Score" active>
        <div class="table-responsive">
          <b-table-simple class="score" borderless>
            <b-thead>
              <b-tr>
                <b-th>Dimensions</b-th>
                <b-th>Needs to improve</b-th>
                <b-th>Acceptable</b-th>
                <b-th>Proficient</b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="item in items" v-bind:key="item.dimensions">
                <b-th>{{ item.dimensions }}</b-th>
                <b-td class="text-center"><input type="radio" :checked="item.needs_to_improve"/></b-td>
                <b-td class="text-center"><input type="radio" :checked="item.acceptable"/></b-td>
                <b-td class="text-center"><input type="radio" :checked="item.proficient"/></b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </div>
      </b-tab>
      <b-tab title="Report Card">
        <div class="table-responsive">
          <b-table-simple class="report-card" bordered>
            <b-thead>
              <b-tr>
                <b-th><div>Question</div></b-th>
                <b-th><div>Your Response</div></b-th>
                <b-th><div>Recommendation</div></b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="result in results[target]" v-bind:key="result.name">
                <b-td>{{ result.title }}</b-td>
                <b-td v-html="result.displayValue"></b-td>
                <b-td></b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </div>
        <b-nav tabs class="flip">
          <b-nav-item :active="target === 'accountability'" @click="target = 'accountability'">Accountability</b-nav-item>
          <b-nav-item :active="target === 'explainability_interpretability'" @click="target = 'explainability_interpretability'">Explainability</b-nav-item>
          <b-nav-item :active="target === 'data_quality_and_rights'" @click="target = 'data_quality_and_rights'">Data quality and right</b-nav-item>
          <b-nav-item :active="target === 'bias_and_fairness'" @click="target = 'bias_and_fairness'">Bias and fairness</b-nav-item>
          <b-nav-item :active="target === 'robustness'" @click="target = 'robustness'">Robustness</b-nav-item>
        </b-nav>
      </b-tab>
    </b-tabs>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Model } from "survey-vue";

@Component({
  computed: {
    items: function() {
      const dimensions: {[key: string]: number} = {
        "Accountability": 0,
        "Explainability": 1,
        "Data quality and rights": 2,
        "Bias and fairness": 3,
        "Robustness": 4
      }
      const score = this.$store.getters.calcScore;
      const items = [];
      for (var dimension in dimensions) {
        const perc: number = ((score[dimensions[dimension]]/score[5 + dimensions[dimension]])*100);
        items.push({
          dimensions: dimension, needs_to_improve: perc < 50, acceptable: perc >= 50 && perc < 75, proficient: perc >= 75 && perc <= 100 
        });
      }
      return items;
    },
    results: function () {
      return this.$store.getters.results;
    }
  }
})
export default class SurveyScore extends Vue {
  @Prop() public survey!: Model;
  public target: string = "accountability";
}
</script>