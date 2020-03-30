import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import VuexPersistence from "vuex-persist";
import { RootState } from "./types";
import { QuestionSelectBase, SurveyModel, JsonObject } from "survey-vue";
import isEmpty from "lodash.isempty";
import showdown from "showdown";
import Dimensions from "@/enums/Dimensions";

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

function isScored(question: QuestionSelectBase): boolean {
  if (
    question.getType() === "radiogroup" ||
    question.getType() === "checkbox"
  ) {
    // Check the suffix for "-RS" or "-MS" for valid score questions.
    return getScoreDimension(question) !== Dimensions.NOT_SCORED;
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

function getScoreDimension(question: QuestionSelectBase): string {
  if (question.score && question.score.dimension) {
    return question.score.dimension;
  }
  return Dimensions.NOT_SCORED;
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
  const score: any = {};
  const dimensions: any = Dimensions;
  const keys: string[] = Object.keys(Dimensions);
  for (let key in keys) {
    const dimension = dimensions[keys[key]];
    if (dimension === Dimensions.NOT_SCORED) {
      continue;
    }
    score[dimension] = { score: 0, max: 0 };
  }

  questionNames.forEach(name => {
    const question = <QuestionSelectBase>survey.getQuestionByName(name);
    const dimension = getScoreDimension(question);
    const maxScore = getMaxScoreForQuestion(question);
    if (dimension === Dimensions.NOT_SCORED) {
      return;
    }
    score[dimension].score += Math.min(getValue(survey.data[name]), maxScore);
    score[dimension].max += maxScore;
  });
  return score;
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
            return isScored(<QuestionSelectBase>question);
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
      if (state.result === undefined) { 
        return null;
      }
      return calculateFinalScore(state.result, state.questionNames);
    },
    results: state => {
      if (state.result === undefined) {
        return null;
      }
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
        const question = <QuestionSelectBase>state.result!.getQuestionByName(answer.name);
        const dimension = getScoreDimension(question);
        if (dimension == Dimensions.NOT_SCORED) {
          return;
        }
        if (results[dimension] === undefined) {
          results[dimension] = [];
        }
        // rebuild the display value since surveyjs appears to separate the
        // choices with commas
        answer.displayValue = "";
        for (let i = 0; i < answer.data.length; i++) {
          answer.displayValue += answer.data[i].displayValue;
        }
        // push the answer to the results map
        results[dimension].push(answer);
      });
      return results;
    }
  }
};

export default new Vuex.Store<RootState>(store);
