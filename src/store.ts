import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import VuexPersistence from "vuex-persist";
import { RootState } from "./types";
import { IQuestion, QuestionSelectBase, SurveyModel, JsonObject } from "survey-vue";
import isEmpty from "lodash.isempty";
import showdown from "showdown";

JsonObject.metaData.addProperty("question", "score");
JsonObject.metaData.addProperty("question", "recommendation");
JsonObject.metaData.addProperty("question", "alttext");

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state: RootState) => ({
    toolData: state.toolData,
    currentPageNo: state.currentPageNo
  })
});

function addItemsInArray(val: any[]) {
  let total = 0;
  val.forEach(item => {
    if (typeof item === "number") {
      total = total + item;
    } else if (typeof item === "string") {
      total = total + parseEmbeddedValue(item);
    }
  });
  return total;
}

function hasScore(question: IQuestion): boolean {
  if (
    question.getType() === "radiogroup" ||
    question.getType() === "checkbox" ||
    question.getType() === "dropdown"
  ) {
    // Check the suffix for "-RS" or "-MS" for valid score questions.
    return getScoreType(question) > 1;
  }
  return false;
}

function parseEmbeddedValue(val: String): number {
  var lastHyphenIdx = val.lastIndexOf("-");
  if (lastHyphenIdx !== -1) {
    // Suffix after last "-" could be a number.
    var possibleValue = val.substr(lastHyphenIdx + 1);
    var value = Number(possibleValue);
    return isNaN(value) ? 0 : value;
  }

  return 0;
}

function getValue(val: any) {
  if (val === undefined) {
    return 0;
  }

  if (Array.isArray(val)) {
    return addItemsInArray(val);
  }

  if (typeof val === "string") {
    return parseEmbeddedValue(val);
  }

  if (typeof val !== "number") {
    return 0;
  }

  return val;
}

function getScoreTypeHelper(name: String): Number {
  // 1 - Not Scored, 2 - Raw Score, 3 - Mitigation Score
  if (name) {

    /*if (name.endsWith("-RS")) {
      return 2;
    } else*/ if (name.endsWith("-MS")) {
      return 3;
    } else if (name.endsWith("-NS")) {
      return 1;
    } else if (name.endsWith("-AS")) {
      return 4;
    } else if (name.endsWith("-DQRS")) {
      return 5;
    } else if (name.endsWith("-EIS")) {
      return 6;
    } else if (name.endsWith("-BFS")) {
      return 7;
    } else if (name.endsWith("-RS")) {
      return 8;
    }
  }

  return 0;
}

function getScoreType(question: IQuestion): Number {
  var result = getScoreTypeHelper(question.name);

  if (result > 0) {
    return result;
  }

  result = getScoreTypeHelper(question.parent.name);

  if (result == 0) {
    // Treat at no score.
    return 1;
  }

  return result;
}

function getMaxScoreForQuestion(question: QuestionSelectBase): number {
  var max = 0;
  if (question.score && question.score.max) {
    max = question.score.max;
  } else {
    var questionType = question.getType();
    var value = 0;

    if (questionType == "radiogroup" || questionType == "dropdown") {
      question.choices.forEach(item => {
        value = getValue(item.itemValue);
        if (max < value) {
          max = value;
        }
      });
    } else if (questionType == "checkbox") {
      question.choices.forEach(item => {
        value = getValue(item.itemValue);
        max += value;
      });
    }
  }

  return max;
}

function calculateFinalScore(
  survey: SurveyModel,
  questionNames: string[]
): number[] {
  let rawRiskScore = 0;
  let maxRawRiskScore = 0;
  let maxMitigationScore = 0;
  let mitigationScore = 0;
  let total = 0;
  let percentage = 0.8;
  let deduction = 0.15;
  let level = 0;
  let threshold1 = 0.25;
  let threshold2 = 0.5;
  let threshold3 = 0.75;

  let accountabilityScore = 0;
  let maxAccountabilityscore = 0;
  let dataQualityRightsScore = 0;
  let maxDataQualityRightsScore = 0;
  let explainabilityInterpretabilityScore = 0;
  let maxExplainabilityInterpretabilityScore = 0;
  let biasFairnessScore = 0;
  let maxBiasFairnessScore = 0;
  let robustnessScore = 0;
  let maxRobustnessScore = 0;

  questionNames.forEach(name => {
    const currentQuestion = survey.getQuestionByName(name);
    const currentQuestionType = getScoreType(currentQuestion);
    const currentQuestionMaxScore = getMaxScoreForQuestion(<QuestionSelectBase>(currentQuestion));

    switch (currentQuestionType) {
      case 4: // accountability
        accountabilityScore += Math.min(getValue(survey.data[name]), currentQuestionMaxScore);
        maxAccountabilityscore += currentQuestionMaxScore;
        break;
      case 5: // data quality and rights
        dataQualityRightsScore += Math.min(getValue(survey.data[name]), currentQuestionMaxScore);
        maxDataQualityRightsScore += currentQuestionMaxScore;
        break;
      case 6: // explainability and interpretability
        explainabilityInterpretabilityScore += Math.min(getValue(survey.data[name]), currentQuestionMaxScore);
        maxExplainabilityInterpretabilityScore += currentQuestionMaxScore;
        break;
      case 7: // bias and fairness
        biasFairnessScore += Math.min(getValue(survey.data[name]), currentQuestionMaxScore);
        maxBiasFairnessScore += currentQuestionMaxScore;
        break;
      case 8: // robustness
        robustnessScore += Math.min(getValue(survey.data[name]), currentQuestionMaxScore);
        maxRobustnessScore += currentQuestionMaxScore;
        break;
    }

  //   if (currentQuestionType === 2) {
  //     // no real risk of injection since we are just getting a value, worst case it breaks our score
  //     // eslint-disable-next-line security/detect-object-injection
  //     rawRiskScore += getValue(survey.data[name]);
  //     maxRawRiskScore += getMaxScoreForQuestion(<QuestionSelectBase>(
  //       currentQuestion
  //     ));
  //   } else if (currentQuestionType === 3) {
  //     // no real risk of injection since we are just getting a value, worst case it breaks our score
  //     // eslint-disable-next-line security/detect-object-injection
  //     mitigationScore += getValue(survey.data[name]);
  //     maxMitigationScore += getMaxScoreForQuestion(<QuestionSelectBase>(
  //       currentQuestion
  //     ));
  //   }
  });

  // //maxMitigationScore is divided by 2 because of Design/Implementation fork
  // if (mitigationScore >= percentage * (maxMitigationScore / 2)) {
  //   total = Math.round((1 - deduction) * rawRiskScore);
  // } else {
  //   total = rawRiskScore;
  // }

  // if (total <= maxRawRiskScore * threshold1) {
  //   level = 1;
  // } else if (
  //   total > maxRawRiskScore * threshold1 &&
  //   total <= maxRawRiskScore * threshold2
  // ) {
  //   level = 2;
  // } else if (
  //   total > maxRawRiskScore * threshold2 &&
  //   total <= maxRawRiskScore * threshold3
  // ) {
  //   level = 3;
  // } else {
  //   level = 4;
  // }

  // return [rawRiskScore, mitigationScore, total, level];
  return [dataQualityRightsScore, explainabilityInterpretabilityScore,
    biasFairnessScore, accountabilityScore, robustnessScore, maxDataQualityRightsScore,
    maxExplainabilityInterpretabilityScore, maxBiasFairnessScore, maxAccountabilityscore,
    maxRobustnessScore];
}

const store: StoreOptions<RootState> = {
  plugins: [vuexLocal.plugin],
  state: {
    answerData: [],
    result: undefined,
    currentPageNo: 0,
    toolData: {},
    questionNames: []
  },
  mutations: {
    resetSurvey(state: RootState) {
      state.answerData = [];
      state.result = undefined;
      state.currentPageNo = 0;
      state.toolData = {};
    },
    updateResult(state: RootState, result: SurveyModel) {
      state.result = result;
      state.currentPageNo = result.currentPageNo;
      //freeze this data so we can load from localStorage
      state.toolData = Object.freeze(result.data);
      state.answerData = result.getPlainData({
        includeEmpty: false
      });

      if (state.questionNames.length === 0) {
        state.questionNames = result
          .getAllQuestions()
          .filter(question => {
            return hasScore(question);
          })
          .map(question => {
            return question.name;
          });
      }
    }
  },
  getters: {
    inProgress: state => {
      return !isEmpty(state.toolData);
    },
    calcScore: state => {
      if (state.result === undefined) return [0, 0, 0, 0, 0, 1, 1, 1, 1, 1];
      return calculateFinalScore(state.result, state.questionNames);
    },
    results: state => {
      if (state.result === undefined) {
        return null;
      }
      const getScoreTypeHelper = function (name: string) : string {
        if (name) {
          if (name.endsWith("-NS")) {
            return "not_scored";
          } else if (name.endsWith("-AS")) {
            return "accountability";
          } else if (name.endsWith("-EIS")) {
            return "explainability_interpretability";
          } else if (name.endsWith("-DQRS")) {
            return "data_quality_and_rights";
          } else if (name.endsWith("-BFS")) {
            return "bias_and_fairness";
          } else if (name.endsWith("-RS")) {
            return "robustness";
          }
        }
        return "null";
      };
      const getScoreType = function (question: IQuestion): string {
        var result = getScoreTypeHelper(question.name);
        if (result === "null") {
          result = getScoreTypeHelper(question.parent.name);
        }
        return result;
      };
      // fetch custom data from questions and attach it to the answers
      const converter = new showdown.Converter();
      for (let i = 0; i < state.answerData.length; i++) {
        const question = state.result.getQuestionByName(state.answerData[i].name);
        state.answerData[i].recommendation = question.recommendation;
                state.answerData[i].displayRecommendation = "";
                if (state.answerData[i].recommendation) {
                  state.answerData[i].displayRecommendation = converter.makeHtml(state.answerData[i].recommendation.default);
                }
      }
      // filter results by dimensions and exclude questions that are not scored
      const results: any = {};
      state.answerData.forEach(answer => {
        const question = state.result!.getQuestionByName(answer.name);
        const scoreType = getScoreType(question);
        if (scoreType !== "null" && scoreType !== "not_scored") {
          if (results[scoreType] === undefined) {
            results[scoreType] = [];
          }
          // rebuild the display value since surveyjs appears to separate the
          // choices with commas
          answer.displayValue = "";
          for (let i = 0; i < answer.data.length; i++) {
            answer.displayValue += answer.data[i].displayValue;
          }
          // push the answer to the results map
          results[scoreType].push(answer);
        }
      });
      return results;
    },
    resultDataSections: state => {
      if (state.result === undefined) return {};

      var projectResults: any[] = [];
      var riskResults: any[] = [];
      var mitigationResults: any[] = [];
      var mitigationResultsYes: any[] = [];

      state.answerData.forEach(function(result) {
        var question = state.result!.getQuestionByName(result.name);
        const scoreType = getScoreType(question);

        if (
          scoreType === 1 &&
          question.parent.name === "projectDetailsPanel-NS"
        ) {
          projectResults.push(result);
        } else if (scoreType === 2) {
          riskResults.push(result);
        } else if (scoreType === 3) {
          mitigationResults.push(result);
          if (result.value > 0) {
            mitigationResultsYes.push(result);
          }
          if (typeof result.value === "string") {
            const val = getValue(result.value);
            if (val > 0) {
              mitigationResultsYes.push(result);
            }
          }
        }
      });

      return [
        projectResults,
        riskResults,
        mitigationResults,
        mitigationResultsYes
      ];
    }
  }
};

export default new Vuex.Store<RootState>(store);
