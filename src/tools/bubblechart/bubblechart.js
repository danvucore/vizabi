import * as utils from 'base/utils';
import Tool from 'base/tool';

import BubbleChartComponent from './bubblechart-component';
import {
  timeslider,
  dialogs,
  buttonlist,
  treemenu,
  datawarning,
  datanotes
} from 'components/_index';

var BubbleChart = Tool.extend('BubbleChart', {

  /**
   * Initializes the tool (Bubble Chart Tool).
   * Executed once before any template is rendered.
   * @param {Object} placeholder Placeholder element for the tool
   * @param {Object} external_model Model as given by the external page
   */
  init: function(placeholder, external_model) {

    this.name = "bubblechart";

    //specifying components
    this.components = [{
      component: BubbleChartComponent,
      placeholder: '.vzb-tool-viz',
      model: ["state.time", "state.entities", "state.marker", "language", "ui"] //pass models to component
    }, {
      component: timeslider,
      placeholder: '.vzb-tool-timeslider',
      model: ["state.time", "state.entities", "state.marker"]
    }, {
      component: dialogs,
      placeholder: '.vzb-tool-dialogs',
      model: ['state', 'ui', 'language']
    }, {
      component: buttonlist,
      placeholder: '.vzb-tool-buttonlist',
      model: ['state', 'ui', 'language']
    }, {
      component: treemenu,
      placeholder: '.vzb-tool-treemenu',
      model: ['state.marker', 'state.marker_tags', 'state.time', 'language']
    }, {
      component: datawarning,
      placeholder: '.vzb-tool-datawarning',
      model: ['language']
    }, {
      component: datanotes,
      placeholder: '.vzb-tool-datanotes',
      model: ['state.marker', 'language']
    }];

    this._super(placeholder, external_model);

  },
  
  validate: function(model){
    model = this.model || model;
    
    this._super(model);
    
    if(model.ui.chart.lockNonSelected) {
       var time = model.state.time.timeFormat.parse("" + model.ui.chart.lockNonSelected);
       if(time < model.state.time.start) model.ui.chart.lockNonSelected = model.state.time.timeFormat(model.state.time.start);
       if(time > model.state.time.end) model.ui.chart.lockNonSelected = model.state.time.timeFormat(model.state.time.end);       
    }
  },

  /**
   * Determines the default model of this tool
   */
  default_model: {
    state: { 
      time: {
      },
      marker: {
        axis_x: { },
        axis_y: { },
        label:  { },
        size:   { },
        color:  { },
        size_label: {
          use: "constant",
          which: "_default",
          scaleType: "ordinal",
          _important: false,
          extent: [0, 0.33]
        },
      }
    },
    language: { },
    ui: {
      chart: {
        whenHovering: {
          showProjectionLineX: true,
          showProjectionLineY: true,
          higlightValueX: true,
          higlightValueY: true
        },
        labels: {
          dragging: true,
          removeLabelBox: false
        },
        trails: true,
        lockNonSelected: 0
      },
      presentation: false,
      adaptMinMaxZoom: false,
      cursorMode: 'arrow',
      zoomOnScrolling: false,
    }
  },
  
  datawarning_content: {
    title: "Some data has uncertainity!",
    body: "Comparing the size of economy across countries and time is not trivial. The methods vary and the prices change. Gapminder has adjusted the picture for many such differences, but still we recommend you take these numbers with a large grain of salt.<br/><br/> Countries on a lower income levels have lower data quality in general, as less resources are available for compiling statistics. Historic estimates of GDP before 1950 are generally also more rough. <br/><br/> Data for child mortality is more reliable than GDP per capita, as the unit of comparison, dead children, is universally comparable across time and place. This is one of the reasons this indicator has become so useful to measure social progress. But the historic estimates of child mortality are still suffering from large uncertainties.<br/><br/> Learn more about the datasets and methods in this <a href='http://www.gapminder.org/news/data-sources-dont-panic-end-poverty' target='_blank'>blog post</a>",
    doubtDomain: [1800, 1950, 2015],
    doubtRange: [1.0, .3, .2]
  }
});

export default BubbleChart;