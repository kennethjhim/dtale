import $ from "jquery";
import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";

import ConditionalRender from "../../ConditionalRender";
import { openChart } from "../../actions/charts";
import bu from "../backgroundUtils";
import DescribeOption from "./DescribeOption";
import DuplicatesOption from "./DuplicatesOption";
import HeatMapOption from "./HeatMapOption";
import InstancesOption from "./InstancesOption";
import LowVarianceOption from "./LowVarianceOption";
import MergeOption from "./MergeOption";
import NetworkOption from "./NetworkOption";
import RangeHighlightOption from "./RangeHighlightOption";
import { ThemeOption } from "./ThemeOption";
import UploadOption from "./UploadOption";
import { XArrayOption } from "./XArrayOption";
import menuFuncs from "./dataViewerMenuUtils";

class ReactDataViewerMenu extends React.Component {
  render() {
    const { hideShutdown, dataId, menuOpen, backgroundMode, pythonVersion, t } = this.props;
    const iframe = global.top !== global.self;
    const buttonHandlers = menuFuncs.buildHotkeyHandlers(this.props);
    const { openTab, openPopup } = buttonHandlers;
    const refreshWidths = () =>
      this.props.propagateState({
        columns: _.map(this.props.columns, c => _.assignIn({}, c)),
      });
    const bgState = bgType => ({
      backgroundMode: backgroundMode === bgType ? null : bgType,
      triggerBgResize: _.includes(bu.RESIZABLE, backgroundMode) || _.includes(bu.RESIZABLE, bgType),
    });
    const toggleBackground = bgType => () => this.props.propagateState(bgState(bgType));
    const toggleOutlierBackground = () => {
      const updatedState = bgState("outliers");
      if (updatedState.backgroundMode === "outliers") {
        updatedState.columns = _.map(this.props.columns, bu.buildOutlierScales);
      }
      this.props.propagateState(updatedState);
    };
    const exportFile = tsv => () =>
      window.open(
        `${menuFuncs.fullPath("/dtale/data-export", dataId)}?tsv=${tsv}&_id=${new Date().getTime()}`,
        "_blank"
      );
    const closeMenu = () => {
      $(document).unbind("click.gridActions");
      this.props.propagateState({ menuOpen: false });
    };
    return (
      <div
        className="column-toggle__dropdown"
        hidden={!menuOpen}
        style={{ minWidth: "13.65em", top: "1em", left: "0.5em" }}>
        {menuOpen && <GlobalHotKeys keyMap={{ CLOSE_MENU: "esc" }} handlers={{ CLOSE_MENU: closeMenu }} />}
        <header className="title-font">D-TALE</header>
        <ul>
          <XArrayOption columns={_.reject(this.props.columns, { name: "dtale_index" })} />
          <DescribeOption open={buttonHandlers.DESCRIBE} />
          <li className="hoverable">
            <span className="toggler-action">
              <button className="btn btn-plain" onClick={buttonHandlers.FILTER}>
                <i className="fa fa-filter ml-2 mr-4" />
                <span className="font-weight-bold">{t("menu:Custom Filter")}</span>
              </button>
            </span>
            <div className="hoverable__content menu-description">{t("menu_description:filter")}</div>
          </li>
          <li className="hoverable">
            <span className="toggler-action">
              <button className="btn btn-plain" onClick={buttonHandlers.BUILD}>
                <i className="ico-build" />
                <span className="font-weight-bold">{t("menu:Build Column")}</span>
              </button>
            </span>
            <div className="hoverable__content menu-description">{t("menu_description:build")}</div>
          </li>
          <MergeOption open={() => window.open(menuFuncs.fullPath("/dtale/popup/merge"), "_blank")} />
          <li className="hoverable">
            <span className="toggler-action">
              <button className="btn btn-plain" onClick={openPopup("reshape", 400, 770)}>
                <i className="fas fa-tools ml-2 mr-4" />
                <span className="font-weight-bold">{t("menu:Summarize Data")}</span>
              </button>
            </span>
            <div className="hoverable__content menu-description">{t("menu_description:reshape")}</div>
          </li>
          <DuplicatesOption open={buttonHandlers.DUPLICATES} />
          <li className="hoverable">
            <span className="toggler-action">
              <button className="btn btn-plain" onClick={openTab("correlations")}>
                <i className="ico-bubble-chart" />
                <span className="font-weight-bold">{t("menu:Correlations")}</span>
              </button>
            </span>
            <div className="hoverable__content menu-description">{t("menu_description:corr")}</div>
          </li>
          {(!pythonVersion || (pythonVersion[0] >= 3 && pythonVersion[1] >= 6)) && (
            <li className="hoverable">
              <span className="toggler-action">
                <button className="btn btn-plain" onClick={openTab("pps")}>
                  <i className="ico-bubble-chart" />
                  <span className="font-weight-bold">{t("menu:Predictive Power Score")}</span>
                </button>
              </span>
              <div className="hoverable__content menu-description">{t("menu_description:pps")}</div>
            </li>
          )}
          <li className="hoverable">
            <span className="toggler-action">
              <button className="btn btn-plain" onClick={buttonHandlers.CHARTS}>
                <i className="ico-show-chart" />
                <span className="font-weight-bold">{t("menu:Charts")}</span>
              </button>
            </span>
            <div className="hoverable__content menu-description">{t("menu_description:charts")}</div>
          </li>
          <NetworkOption open={buttonHandlers.NETWORK} />
          <HeatMapOption backgroundMode={backgroundMode} toggleBackground={toggleBackground} />
          <li className="hoverable">
            <span className="toggler-action">
              <button className="btn btn-plain" onClick={toggleBackground("dtypes")}>
                <div style={{ display: "inherit" }}>
                  <div className={`bg-icon dtype-bg${backgroundMode === "dtypes" ? " spin" : ""}`} />
                  <span className="font-weight-bold pl-4">{t("menu:Highlight Dtypes")}</span>
                </div>
              </button>
            </span>
            <div className="hoverable__content menu-description">{t("menu_description:highlight_dtypes")}</div>
          </li>
          <li className="hoverable">
            <span className="toggler-action">
              <button className="btn btn-plain" onClick={toggleBackground("missing")}>
                <div style={{ display: "inherit" }}>
                  <div className={`bg-icon missing-bg${backgroundMode === "missing" ? " spin" : ""}`} />
                  <span className="font-weight-bold pl-4">{t("menu:Highlight Missing")}</span>
                </div>
              </button>
            </span>
            <div className="hoverable__content menu-description">{t("menu_description:highlight_missings")}</div>
          </li>
          <li className="hoverable">
            <span className="toggler-action">
              <button className="btn btn-plain" onClick={toggleOutlierBackground}>
                <div style={{ display: "inherit" }}>
                  <div className={`bg-icon outliers-bg${backgroundMode === "outliers" ? " spin" : ""}`} />
                  <span className="font-weight-bold pl-4">{t("menu:Highlight Outliers")}</span>
                </div>
              </button>
            </span>
            <div className="hoverable__content menu-description">{t("menu_description:highlight_outliers")}</div>
          </li>
          <RangeHighlightOption {...this.props} />
          <LowVarianceOption
            toggleLowVarianceBackground={toggleBackground("lowVariance")}
            backgroundMode={backgroundMode}
          />
          <InstancesOption open={openPopup("instances", 450, 750)} />
          <li className="hoverable">
            <span className="toggler-action">
              <button className="btn btn-plain" onClick={buttonHandlers.CODE}>
                <i className="ico-code" />
                <span className="font-weight-bold">{t("menu:Code Export")}</span>
              </button>
            </span>
            <div className="hoverable__content menu-description">{t("menu_description:code")}</div>
          </li>
          <li className="hoverable" style={{ color: "#565b68" }}>
            <span className="toggler-action">
              <i className="far fa-file" />
            </span>
            <span className="font-weight-bold pl-2">{t("menu:Export")}</span>
            <div className="btn-group compact ml-auto mr-3 font-weight-bold column-sorting">
              {_.map(
                [
                  ["CSV", "false"],
                  ["TSV", "true"],
                ],
                ([label, tsv]) => (
                  <button
                    key={label}
                    style={{ color: "#565b68" }}
                    className="btn btn-primary font-weight-bold"
                    onClick={exportFile(tsv)}>
                    {t(`menu:${label}`)}
                  </button>
                )
              )}
            </div>
            <div className="hoverable__content menu-description">{t("menu_description:export")}</div>
          </li>
          <UploadOption open={openPopup("upload", 450)} />
          <li className="hoverable">
            <span className="toggler-action">
              <button className="btn btn-plain" onClick={refreshWidths}>
                <i className="fas fa-columns ml-2 mr-4" />
                <span className="font-weight-bold">{t("menu:Refresh Widths")}</span>
              </button>
            </span>
            <div className="hoverable__content menu-description">{t("menu_description:widths")}</div>
          </li>
          <li className="hoverable">
            <span className="toggler-action">
              <button
                className="btn btn-plain"
                onClick={() =>
                  this.props.openChart({
                    type: "about",
                    size: "sm",
                    backdrop: true,
                  })
                }>
                <i className="fa fa-info-circle la-lg mr-4 ml-1" />
                <span className="font-weight-bold">{t("menu:About")}</span>
              </button>
            </span>
            <div className="hoverable__content menu-description">{t("menu_description:about")}</div>
          </li>
          <ThemeOption />
          <li className="hoverable">
            <span className="toggler-action">
              <button className="btn btn-plain" onClick={() => window.location.reload()}>
                <i className="ico-sync" />
                <span className="font-weight-bold">{t("menu:Reload Data")}</span>
              </button>
            </span>
            <div className="hoverable__content menu-description">{t("menu_description:reload_data")}</div>
          </li>
          <ConditionalRender display={iframe}>
            <li>
              <span className="toggler-action">
                <button className="btn btn-plain" onClick={() => window.open(window.location.pathname, "_blank")}>
                  <i className="ico-open-in-new" />
                  <span className="font-weight-bold">{t("menu:Open In New Tab")}</span>
                </button>
              </span>
            </li>
          </ConditionalRender>
          <ConditionalRender display={hideShutdown == false}>
            <li className="hoverable">
              <span className="toggler-action">
                <a className="btn btn-plain" href="/shutdown">
                  <i className="fa fa-power-off ml-2 mr-4" />
                  <span className="font-weight-bold">{t("menu:Shutdown")}</span>
                </a>
              </span>
              <div className="hoverable__content menu-description">{t("menu_description:shutdown")}</div>
            </li>
          </ConditionalRender>
        </ul>
      </div>
    );
  }
}
ReactDataViewerMenu.displayName = "ReactDataViewerMenu";
ReactDataViewerMenu.propTypes = {
  columns: PropTypes.array,
  menuOpen: PropTypes.bool,
  propagateState: PropTypes.func,
  openChart: PropTypes.func,
  backgroundMode: PropTypes.string,
  rangeHighlight: PropTypes.object,
  hideShutdown: PropTypes.bool,
  dataId: PropTypes.string.isRequired,
  pythonVersion: PropTypes.arrayOf(PropTypes.number),
  t: PropTypes.func,
};

const TranslatedReactDataViewMenu = withTranslation(["menu", "menu_description"])(ReactDataViewerMenu);
const ReduxDataViewerMenu = connect(
  state => _.pick(state, ["dataId", "hideShutdown", "pythonVersion"]),
  dispatch => ({ openChart: chartProps => dispatch(openChart(chartProps)) })
)(TranslatedReactDataViewMenu);

export { ReduxDataViewerMenu as DataViewerMenu, TranslatedReactDataViewMenu as ReactDataViewerMenu };
