<template>
  <div id="chart"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
const d3 = require("d3");

@Component
export default class RadarChart extends Vue {
  mounted() {
    const dimensions: { [key: string]: number } = {
      Accountability: 0,
      Explainability: 1,
      "Data quality and rights": 2,
      "Bias and fairness": 3,
      Robustness: 4
    };
    const score = this.$store.getters.calcScore;
    const data: any[] = [[]];
    for (let dimension in dimensions) {
      let value =
        score[dimensions[dimension]] / score[5 + dimensions[dimension]];
      data[0].push({
        axis: dimension,
        value: value
      });
    }

    const margin = { top: 55, right: 65, bottom: 20, left: 55 };
    const width =
      Math.min(500, window.innerWidth - 10) - margin.left - margin.right;
    const height = Math.min(
      width,
      window.innerHeight - margin.top - margin.bottom - 50
    );
    const options = {
      w: width,
      h: height,
      margin: margin,
      maxValue: 1,
      levels: 5,
      roundStrokes: true
    };
    this.draw("#chart", data, options);
  }

  draw(id: string, d: any, options: any) {
    const cfg: any = {
      w: 600,
      h: 600,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      levels: 3,
      maxValue: 0,
      labelFactor: { x: 1.19, y: 1.2 },
      wrapWidth: 70,
      opacityArea: 0.3,
      strokeWidth: 2,
      roundStrokes: false,
      color: "#1f77b4"
    };

    if ("undefined" !== typeof options) {
      for (let i in options) {
        if ("undefined" !== typeof options[i]) {
          cfg[i] = options[i];
        }
      }
    }

    const maxValue = Math.max(
      cfg.maxValue,
      d3.max(d, (i: any) => {
        return d3.max(
          i.map((o: any) => {
            return o.value;
          })
        );
      })
    );
    const allAxis = d[0].map((i: any, j: any) => {
      return i.axis;
    });
    const total = allAxis.length;
    const radius = Math.min(cfg.w / 2, cfg.h / 2);
    const angleSlice = (Math.PI * 2) / total;

    const rScale = d3
      .scaleLinear()
      .range([0, radius])
      .domain([0, maxValue]);

    d3.select(id)
      .select("svg")
      .remove();

    const g = d3
      .select(id)
      .append("svg")
      .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
      .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
      .append("g")
      .attr(
        "transform",
        `translate(${cfg.w / 2 + cfg.margin.left}, ${cfg.h / 2 +
          cfg.margin.top})`
      );

    // Draw circular segments
    for (let j = 0; j <= cfg.levels; j++) {
      g.append("circle")
        .attr("class", "gridCircle")
        .attr("r", (radius / cfg.levels) * j)
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-opacity", "0.88")
        .style("stroke-width", "0.6px")
        .style("fill-opacity", "0");
    }

    //Wrapper for the grid & axes
    // var axisGrid = g.append("g").attr("class", "axisWrapper");

    const axis = g
      .selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");
    // Append the lines
    axis
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d: any, i: any) => {
        return rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2);
      })
      .attr("y2", (d: any, i: any) => {
        return rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2);
      })
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-opacity", "1")
      .style("stroke-width", "0.8px");
    // Append the labels at each axis
    axis
      .append("text")
      .attr("class", "legend")
      .style("font-size", "11px")
      .style("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (d: any, i: any) => {
        return (
          rScale(maxValue * cfg.labelFactor.x) *
          Math.cos(angleSlice * i - Math.PI / 2)
        );
      })
      .attr("y", (d: any, i: any) => {
        return (
          rScale(maxValue * cfg.labelFactor.y) *
          Math.sin(angleSlice * i - Math.PI / 2)
        );
      })
      .text((d: any) => {
        return d;
      })
      .call(this.wrap, cfg.wrapWidth);

    // The radial line function
    const radarLine = d3
      .lineRadial()
      .curve(d3.curveLinearClosed)
      .radius((d: any) => {
        return rScale(d.value);
      })
      .angle((d: any, i: any) => {
        return i * angleSlice;
      });

    if (cfg.roundStrokes) {
      radarLine.curve(d3.curveCardinalClosed);
    }

    // Create blob
    g.selectAll(".radarWrapper")
      .data(d)
      .enter()
      .append("g")
      .attr("class", "radarWrapper")
      // Outline and background
      .append("path")
      .attr("class", "radarArea")
      .attr("d", (d: any, i: any) => {
        return radarLine(d);
      })
      .style("stroke-width", cfg.strokeWidth + "px")
      .style("stroke", cfg.color)
      .style("fill", cfg.color)
      .style("fill-opacity", cfg.opacityArea);
  }

  //Wraps SVG text
  wrap(text: any, width: any) {
    text.each(function(this: any) {
      var text = d3.select(this),
        words = text
          .text()
          .split(/\s+/)
          .reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.4, // ems
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text
          .text(null)
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", dy + "em");

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }
    });
  }
}
</script>
