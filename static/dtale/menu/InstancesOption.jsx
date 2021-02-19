import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";

import app from "../../reducers/dtale";

class InstancesOption extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const processCt = app.getHiddenValue("processes");
    return (
      <li className="hoverable">
        <span className="toggler-action">
          <button className="btn btn-plain" onClick={this.props.open}>
            <i className="ico-apps" />
            <span className="font-weight-bold">
              {`${this.props.t("menu:Instances")} `}
              <span className="badge badge-secondary">{processCt}</span>
            </span>
          </button>
        </span>
        <div className="hoverable__content menu-description">
          <span>{this.props.t("menu_description:instances")}</span>
        </div>
      </li>
    );
  }
}
InstancesOption.displayName = "InstancesOption";
InstancesOption.propTypes = {
  open: PropTypes.func,
  t: PropTypes.func,
};

export default withTranslation(["menu", "menu_description"])(InstancesOption);
