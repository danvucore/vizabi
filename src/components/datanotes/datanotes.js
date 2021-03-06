import * as utils from "base/utils";
import Component from "base/component";

import { close as iconClose } from "base/iconset";

const DataNotes = Component.extend({

  init(config, context) {
    const _this = this;

    this.name = "gapminder-datanotes";

    this.model_expects = [{
      name: "marker",
      type: "marker"
    }, {
      name: "locale",
      type: "locale"
    }];

    this.context = context;

    this.model_binds = {
      "translate:locale": function(evt) {
        if (!_this._ready || !_this._readyOnce) return;
        _this.ready();
      }
    };

    //contructor is the same as any component
    this._super(config, context);

    this.close = this.close.bind(this);

    this.hidden = true;
    this.showNotes = false;
    this.pinned = false;
    this.left = 0;
    this.top = 0;
    this.hookName = null;
    this.newHookName = null;
  },

  ready() {
    this.setValues();
  },

  readyOnce() {
    const _this = this;

    this.translator = this.model.locale.getTFunction();
    this.element = d3.select(this.placeholder);

    this.element.selectAll("div").remove();

    const container = this.element;

    container.append("div")
      .html(iconClose)
      .on("click", () => {
        d3.event.stopPropagation();
        _this.close();
      })
      .select("svg")
      .attr("width", "0px")
      .attr("height", "0px")
      .attr("class", "vzb-data-notes-close")
      .classed("vzb-hidden", true);

    container.append("div")
      .attr("class", "vzb-data-notes-body vzb-dialog-scrollable");

    container.append("div")
      .attr("class", "vzb-data-notes-link");

  },

  resize() {
    this.close();
  },

  close() {
    if (!this.hidden) {
      this.pin(false).hide();
    }
  },

  setHook(_hookName) {
    if (!this._readyOnce) return this;
    if (this.pinned) {
      this.newHookName = _hookName;
      return this;
    }
    if (this.hookName) this.model.marker[this.hookName].off("change:which", this.close);
    this.hookName = this.newHookName = _hookName;
    this.model.marker[this.hookName].on("change:which", this.close);

    this.setValues();

    return this;
  },

  setValues() {
    if (!this.hookName) return;
    const hook = this.model.marker[this.hookName];
    const concept = hook.getConceptprops();

    this.element.select(".vzb-data-notes-body")
      .classed("vzb-hidden", !concept.description)
      .text(utils.replaceNumberSpacesToNonBreak(concept.description) || "");

    this.element.select(".vzb-data-notes-link").classed("vzb-hidden", !concept.sourceLink);

    if (concept.sourceLink) {
      const _source = this.translator("hints/source");
      const sourceName = concept.sourceName || "";
      const sourceLink = (concept.sourceLink.indexOf("http://") === 0 || concept.sourceLink.indexOf("http://") === 0) ? concept.sourceLink : "http://" + concept.sourceLink;
      this.element.select(".vzb-data-notes-link").html("<span>" + (sourceName ? (_source + ":") : "") +
        '<a href="' + sourceLink + '" target="_blank">' + (sourceName ? sourceName : _source) + "</a></span>");
    }
    this.showNotes = concept.sourceLink || concept.description;
  },

  setPos(_left, _top, force) {
    this.left = _left;
    this.top = _top;
    if (this.pinned && !force) return this;
    const parentHeight = this.parent.element.offsetHeight;
    const width = this.element.node().offsetWidth;
    const height = this.element.node().offsetHeight;
    let leftMove;
    let topMove;
    let leftPos = this.left - width;
    let topPos = this.top;
    if (leftPos < 10) {
      leftPos = 10;
      leftMove = true;
    }
    if ((topPos + height + 10) > parentHeight) {
      topPos = parentHeight - height - 10;
      topMove = true;
    }

    if (leftMove && topMove) {
      topPos = this.top - height - 30;
    }

    this.element.style("top", topPos + "px");
    this.element.style("left", leftPos + "px");

    return this;
  },

  pin(arg) {
    if (this.hidden) return this;
    this.pinned = !this.pinned;
    if (arg != null) this.pinned = arg;
    this.element.select(".vzb-data-notes-close").classed("vzb-hidden", !this.pinned);
    this.element.classed("vzb-data-notes-pinned", this.pinned);
    if (this.hookName != this.newHookName) this.setHook(this.newHookName);
    this.element.select(".vzb-data-notes-body").node().scrollTop = 0;

    return this.showNotes ?
      this.setPos(this.left, this.top, true) :
      this.hide();
  },

  toggle(arg) {
    if (this.pinned || !this.hookName) return this;
    if (arg == null) arg = !this.hidden;
    this.hidden = arg;
    this.element.classed("vzb-hidden", this.hidden || !this.showNotes);
    return this;
  },

  show() {
    return this.toggle(false);
  },

  hide() {
    return this.toggle(true);
  }

});

export default DataNotes;
