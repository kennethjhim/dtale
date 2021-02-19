import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";

import actions from "../../actions/dtale";
import { exports as gu } from "../gridUtils";
import serverStateManagement from "../serverStateManagement";

class ReactThemeOption extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { setTheme, theme, t } = this.props;
    const updateTheme = newTheme => () => serverStateManagement.updateTheme(newTheme, () => setTheme(newTheme));
    return (
      <li className="hoverable" style={{ color: "#565b68" }}>
        <span className="toggler-action">
          <i className="fas fa-adjust" />
        </span>
        <span className="font-weight-bold pl-2">Theme</span>
        <div className="btn-group compact ml-auto mr-3 font-weight-bold column-sorting">
          {_.map(gu.THEMES, value => (
            <button
              key={value}
              style={{ color: "#565b68" }}
              className={`btn btn-primary ${value === theme ? "active" : ""} font-weight-bold`}
              onClick={value === theme ? _.noop : updateTheme(value)}>
              {t(`menu:${_.capitalize(value)}`)}
            </button>
          ))}
        </div>
        <div className="hoverable__content menu-description">{t("menu_description:theme")}</div>
      </li>
    );
  }
}
ReactThemeOption.displayName = "ReactThemeOption";
ReactThemeOption.propTypes = {
  setTheme: PropTypes.func,
  theme: PropTypes.string,
  t: PropTypes.func,
};

const TranslatedReactThemeOption = withTranslation(["menu", "menu_description"])(ReactThemeOption);
const ReduxThemeOption = connect(
  ({ theme }) => ({ theme }),
  dispatch => ({ setTheme: theme => dispatch(actions.setTheme(theme)) })
)(TranslatedReactThemeOption);

export { ReduxThemeOption as ThemeOption, TranslatedReactThemeOption as ReactThemeOption };
