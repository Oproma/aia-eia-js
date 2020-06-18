<style scoped>
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
    background-color: #bfbfbf;
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
  .fa-circle {
    color: lightgray;
  }
</style>
<template>
  <b-container>
    <input type="button" value="Export" class="btn btn-primary btn-export" @click="exportReport" />
    <b-tabs content-class="mt-3">
      <b-tab title="Score" active>
        <div class="table-responsive">
          <b-table-simple id="score" class="score" bordered>
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
                <b-td class="text-center"><i :class="`far fa-lg ${item.needs_to_improve}`"></i></b-td>
                <b-td class="text-center"><i :class="`far fa-lg ${item.acceptable}`"></i></b-td>
                <b-td class="text-center"><i :class="`far fa-lg ${item.proficient}`"></i></b-td>
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
                <b-td v-html="result.displayRecommendation"></b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </div>
        <b-nav tabs class="flip">
          <b-nav-item :active="target === Dimensions.ACCOUNTABILITY" @click="target = Dimensions.ACCOUNTABILITY">Accountability</b-nav-item>
          <b-nav-item :active="target === Dimensions.EXPLAINABILITY_AND_INTERPRETABILITY" @click="target = Dimensions.EXPLAINABILITY_AND_INTERPRETABILITY">Explainability</b-nav-item>
          <b-nav-item :active="target === Dimensions.DATA_QUALITY_AND_RIGHTS" @click="target = Dimensions.DATA_QUALITY_AND_RIGHTS">Data quality and rights</b-nav-item>
          <b-nav-item :active="target === Dimensions.BIAS_AND_FAIRNESS" @click="target = Dimensions.BIAS_AND_FAIRNESS">Bias and fairness</b-nav-item>
          <b-nav-item :active="target === Dimensions.ROBUSTNESS" @click="target = Dimensions.ROBUSTNESS">Robustness</b-nav-item>
        </b-nav>
      </b-tab>
    </b-tabs>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Dimensions from "@/enums/Dimensions";
import { Model } from "survey-vue";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Component({
  computed: {
    items: function() {
      const dimensions: {[key: string]: string} = {
        "Accountability": Dimensions.ACCOUNTABILITY,
        "Explainability": Dimensions.EXPLAINABILITY_AND_INTERPRETABILITY,
        "Data quality and rights": Dimensions.DATA_QUALITY_AND_RIGHTS,
        "Bias and fairness": Dimensions.BIAS_AND_FAIRNESS,
        "Robustness": Dimensions.ROBUSTNESS
      }
      const score = this.$store.getters.calcScore;
      const items = [];
      for (let name in dimensions) {
        const dimension = dimensions[name];
        const perc = (score[dimension].score / score[dimension].max) * 100;
        items.push({
          dimensions: name,
          needs_to_improve: (perc < 50 ? 'fa-check-circle' : 'fa-circle'),
          acceptable: (perc >= 50 && perc < 75 ? 'fa-check-circle' : 'fa-circle'),
          proficient: (perc >= 75 && perc <= 100 ? 'fa-check-circle' : 'fa-circle')
        });
      }
      return items;
    },
    results: function () {
      return this.$store.getters.results;
    }
  },
  data: function() {
    return {
      Dimensions: Dimensions
    }
  }
})
export default class SurveyScore extends Vue {
  @Prop() public survey!: Model;
  public target: string = Dimensions.ACCOUNTABILITY;

  addHeader(doc: any, y: number): number {
    const title = "Responsible AI Design Report Card";
    const img = new Image();
    img.src = 'img/aiglobal-logo.jpg';
    const iw = 1403, ih = 507, ratio = 0.025;
    doc.addImage(img, 'jpg', 10, 10, Math.floor(iw * ratio), Math.floor(ih * ratio));
    doc.setFontSize(24);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, y, null, null, "center");
    y += doc.getTextDimensions(title).h + 5; // padding
    return y;
  }

  addAbout(doc: any, y: number): number {
    const title = "About the Design Assistant";
    doc.setFontSize(16);
    doc.text(title, 10, y);
    y += 1; // Padding between title and horizontal line.
    doc.setDrawColor(0, 0, 0);
    doc.line(10, y, 200, y);  // Horizontal line.
    y += doc.getTextDimensions(title).h + 1; // Padding between title.
    doc.setFontSize(10);
    // Custom add text function.
    const addText = (text: string, x: number, y: number) => {
      const length = 118;
      const words = text.split(" ");
      let tmpY = y;
      let line = "";
      const add = () => {
        doc.text(line, x, tmpY);
        tmpY += doc.getTextDimensions(line).h + 1;
        line = "";
      };
      const addLink = (tmp: string) => {
        let match;
        do {
            let match = /(\[(?:\[??[^\[]*?\]))(\((?:\(??[^\(]*?\)))/g.exec(tmp);
            if (match) {
              const text = match[1].substring(1, match[1].length - 1);
              const newTmp = tmp.replace(match[0], text);
              if (newTmp.length >= length) {
                break;
              }
              tmp = newTmp;
              const url = match[2].substring(1, match[2].length - 1);
              doc.textWithLink(text, x + doc.getTextDimensions(tmp.substring(0, tmp.indexOf(text))).w, tmpY, { url: url });
            }
        } while (match);
        return tmp;
      };
      let tmpBeforeLink = "";
      let linkFound = false;
      let index = -1;
      for (let i = 0; i < words.length; i++) {
        let tmp = line;
        if (words[i].charAt(0) === "[") {
          tmpBeforeLink = tmp;
          linkFound = true;
          index = i - 1;
        }
        if (words[i].charAt(words[i].length - 1) === ")") {
          linkFound = false;
        }
        tmp += words[i];
        if (i < words.length - 1) {
          tmp += " ";
        }
        tmp = addLink(tmp);
        if (tmp.length >= length) {
          if (linkFound) {
            i = index;
            line = tmpBeforeLink;
            linkFound = false;
          } else {
            i--;
          }
          add();
        } else {
          line = tmp;
        }
      }
      if (line !== "") {
        line = addLink(line);
        add();
      }
      return tmpY - y;
    };
    // Add about text to pdf.
    const text = [
      "As AI continues to evolve so will the Design Assistant. We are working now to add questions that are more industry specific and tailored for your location. To do this, we can use your help! Share with us the results of your report. Let us know where you need more clarification, and where more guidance might be needed. If you weren't ready to answer all of the questions today, that's ok, save your report, and you can reload it the next time you return.",
      "As an open source tool, we will continue to adjust quickly based on our communities needs. Please let us know if you find any issues and we will be happy to update!",
      "If you are wondering what to do with your results, and how you can improve, check out the [Responsible AI Design Assistant Guide](https://docs.google.com/document/d/1eEMZkY139xO557Tv8rV7zlahycZUdkarr-YJftwkU20/edit#heading=h.l9n4rt31jkfh) that includes definitions and lots of additional information. If you are in need of additional support, contact us, and we can put you in touch with a trusted service provider.",
      "Since we want you to use the Design Assistant early and often, you can click the button below to start over again!"
    ];
    for (let i = 0; i < text.length; i++) {
      y += addText(text[i], 15, y);
      if (i < text.length - 1) {
        y += 2;
      }
    }
    y += 10;
    return y;
  }

  addScore(doc: any, y: number): number {
    const title = "Results Overview";
    doc.setFontSize(16);
    doc.text(title, 10, y);
    y += 1; // Padding between title and horizontal line.
    doc.setDrawColor(0, 0, 0);
    doc.line(10, y, 200, y);  // Horizontal line.
    y += doc.getTextDimensions(title).h + 1; // Padding between title.
    // Base64 FontAwesomes icons.
    const faCheckCircle = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAoAAAAKABXX67owAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHfSURBVDiNldTPb01REAfwT5s+RFpEYtPyamXVVztBJMSGjd/8AVLpRizaf0HKwk4sxY/uRMRKEQn9E7T8B3hLBO1rRDyLMzf39r17b/Wb3Jw7c2a+Z87MmRlQjxGcxgRGQ/cFH/EaPzfw78M45rGGbsW3hsdolhEMlOimcRdbQ17CIj6FvA8ncDDkNdzA/bpIbxcieoFWjW0rbDL7uSrD6TD4g5m603swGz5dTPVu7pfnczOkGWbCt6Mn5/Py628G2wv/C8HxMFOMyKOty2kvDuEbboU8WYh6GK6E4v0mSA/je4Fod+iXQndpUHr88O4/SY9IzbFTuukFfI29xVhbg9Z3VIYJ3MGWHtKjeIUdEen5kDN8jnV0qCSiXXiLPTggpeo3jkkFGgnSc3hTda1BtON/b6w/5Gk5iyc4iZdBuoozFaQZRxsu6y/eEJ7Ku+pvrCtxSBWWw+4i1c+tgWcF8l/SjKhC33ODR8obpIHn0ng8XkNK3iAPisrxOKmspRsY24B0NnxXpem3DtfkQ2h2A6Je0mwIXa0ympPndEHKWxUm5dfv4mZxs2zQT+EetoW8bP2gb0pFzArdwXWF4VOHplTQLO9lX0cqVF9OqyIuYhinIrqxIGzjg9TKK1WO/wBzvo3rvEdWdAAAAABJRU5ErkJggg==";
    const faCircle = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAYAAADgKtSgAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAqAAAAKgBefSzxgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGoSURBVEiJrdXLThRBFAbgj3bYsVEYXCgTFmoyE4kujRslPII+A8o7kIkP5EPoxstGNIrXCRth4Q1BlkrGRVVlKk332M7wJ53qU1XnP1V1qv4z49+4htu4iLP4ic94jFcN/E9gFhvYwXDMt4P7aFWRzFT09fAQ3Wgf4wkG+IpFXMJNnIlz3uFObGuxhsO4qkNsYr5m7gL6+BXnH0T/SvQy4hdYGreKDB1sZQG65QmzeJsRzzUkTpjLAmwr5WDD6CiarriMjtER3csH0q3YnJA4oR95Bqnjeuz4IyRpGszjd+RbKXArDjzF9ynJf+B5/F8thJcHH6YkTvgY2wsFzkVj/5TI0+4XCmEr1D+W/0U7tt8K7EXjyimRJ549guql29Ku82iIxcgzxNXUme55f0ryB0r3nCCbQ+GFdSYkXsZR5FnPB1pG2rJlMm15Gf3fqND3rqBqKUDTHSxnxJWqmLCWBTgSclCX5LZwxukoTuh5VSXqCpWoF+1jPMMnfMF5XMYNo0q0jbt4X7fqHC1BNgfG19CBkLzGNbSMFaH6LwnVfx+7eITX4xz/ApJjdwVAbpi0AAAAAElFTkSuQmCC";
    // Add table to pdf. 
    autoTable(doc, {
        startY: y,
        columnStyles: {
          0: { cellWidth: 66 },
          1: { cellWidth: 39 },
          2: { cellWidth: 39 },
          3: { cellWidth: 39 }
        },
        html: '#score',
        didParseCell: (data) => {
          // Style cells.
          if (data.section === "head") {
            data.cell.styles.textColor = "#000000";
            if (data.cell.text[0] === "Dimensions") {
              data.cell.styles.fillColor = "#BFBFBF";
            } else {
              data.cell.styles.fillColor = "#D0E0E3";
            }
          } else if (data.section === "body" && data.column.index === 0) {
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.textColor = "#000000";
          }
        },
        didDrawCell: (data) => {
          console.log(data.column.width);
          // Draw cell border
          doc.setDrawColor(222, 226, 230);
          doc.line(data.cell.x, data.cell.y, data.cell.x + data.column.width, data.cell.y);
          doc.line(data.cell.x, data.cell.y, data.cell.x, data.cell.y + data.row.height);
          doc.line(data.cell.x + data.column.width, data.cell.y, data.cell.x + data.column.width, data.cell.y + data.row.height);
          doc.line(data.cell.x, data.cell.y + data.row.height, data.cell.x + data.column.width, data.cell.y + data.row.height);
          // Add images
          const td: any = data.cell.raw;
          const img = td.getElementsByTagName('i')[0];
          if (img !== undefined) {
            const dim = data.cell.height - data.cell.padding('vertical');
            const textPos = data.cell.textPos;
            if (img.classList.value.indexOf('fa-check-circle') !== -1) {
              doc.addImage(faCheckCircle, textPos.x + data.cell.width / 2 - dim, textPos.y, dim, dim)
            } else if (img.classList.value.indexOf('fa-circle') !== -1) {
              doc.addImage(faCircle, textPos.x + data.cell.width / 2 - dim, textPos.y, dim, dim)
            }
          }
        }
    });
    y += 60;
    return y;
  }

  addReportCard(doc: any, y: number): number {
    const title = "Detailed Report";
    doc.setFontSize(16);
    doc.text(title, 10, y);
    y += 1; // Padding between title and horizontal line.
    doc.setDrawColor(0, 0, 0);
    doc.line(10, y, 200, y);  // Horizontal line.
    y += doc.getTextDimensions(title).h + 2; // Padding between title.
    const parser = new DOMParser();
    const dimensions: {[key: string]: string} = {
      "Accountability": Dimensions.ACCOUNTABILITY,
      "Explainability": Dimensions.EXPLAINABILITY_AND_INTERPRETABILITY,
      "Data quality and rights": Dimensions.DATA_QUALITY_AND_RIGHTS,
      "Bias and fairness": Dimensions.BIAS_AND_FAIRNESS,
      "Robustness": Dimensions.ROBUSTNESS
    };
    for (let name in dimensions) {
      const data: any = [];
      const dimension = dimensions[name];
      const results = this.$store.getters.results[dimension];
      for (let i = 0; i < results.length; i++) {
        const row: any[] = [];
        row.push(results[i].title);
        row.push(results[i].displayValue);
        row.push(results[i].displayRecommendation);
        data.push(row);
      }
      doc.setFontSize(14);
      doc.text(name, 12, y);
      y += doc.getTextDimensions(name).h;
      doc.setFontSize(10);
      // Add table to pdf.
      autoTable(doc, {
        startY: y,
        columnStyles: {
          0: { cellWidth: 61 },
          1: { cellWidth: 61 },
          2: { cellWidth: 61 }
        },
        head: [['Question', 'Your Response', 'Recommendation']],
        body: data,
        didParseCell: (data) => {
          // Style cells.
          if (data.section === "head") {
            data.cell.styles.textColor = "#000000";
            data.cell.styles.fillColor = "#D0E0E3";
          } else if (data.section === "body") {
            data.cell.styles.textColor = "#000000";
            data.cell.styles.fillColor = "#FFFFFF";
            // Parses html elements with readable text
            if (data.column.index > 0) {
              const raw: any = data.cell.raw;
              const htmlDoc = parser.parseFromString(raw, "text/html");
              const nodes = htmlDoc.querySelectorAll("body > *");
              const newText: any[] = [];
              for (let j = 0; j < nodes.length; j++) {
                if (nodes[j].nodeName === "UL") {
                  newText.pop();
                  for (let k = 0; k < nodes[j].childNodes.length; k++) {
                    if (nodes[j].childNodes[k].nodeName === "LI") {
                      newText.push("    - " + nodes[j].childNodes[k].textContent);
                    }
                  }
                } else {
                  newText.push(nodes[j].textContent);
                  if (j < nodes.length - 1) {
                    newText.push("");
                  }
                }
              }
              data.cell.text = newText;
            }
          }
        },
        didDrawCell: (data) => {
          // Draw cell border.
          doc.setDrawColor(222, 226, 230);
          doc.line(data.cell.x, data.cell.y, data.cell.x + data.column.width, data.cell.y);
          doc.line(data.cell.x, data.cell.y, data.cell.x, data.cell.y + data.row.height);
          doc.line(data.cell.x + data.column.width, data.cell.y, data.cell.x + data.column.width, data.cell.y + data.row.height);
          doc.line(data.cell.x, data.cell.y + data.row.height, data.cell.x + data.column.width, data.cell.y + data.row.height);
        },
        didDrawPage: (data) => {
          // Reset y position.
          doc.pageNumber++;
          y = 20;
        }
      })
      y += doc.previousAutoTable.finalY; // Padding for next table.
    }
    return y;
  }

  exportReport() {
    const doc: any = new jsPDF();
    let y = 35;
    y = this.addHeader(doc, y);
    y = this.addAbout(doc, y);
    y = this.addScore(doc, y);
    y = this.addReportCard(doc, y);

    doc.save('Responsible AI Design Report Card.pdf')
  }
}
</script>