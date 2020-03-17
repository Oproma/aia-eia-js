interface SurveyMixins {
  isMobile(): boolean;
  saveSurvey(state: any): void;
}

const buildSurveyData = function (state: any): string {
  return JSON.stringify({
      currentPage: state.currentPageNo,
      data: state.toolData
  });
}

export const SurveyMixins: SurveyMixins = {
  isMobile: function() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return true;
    } else {
      return false;
    }
  },
  saveSurvey: function (state: any) {
    const a = document.createElement("a");
    a.download = "SurveyResponses.json";
    
    const saveFile = buildSurveyData(state);
    const blob = new Blob([saveFile], { type: "text/plain" });
    
    a.href = window.URL.createObjectURL(blob);

    a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");

    const e = document.createEvent("MouseEvents");
    e.initEvent("click", true, false);
    a.dispatchEvent(e);
  }
};