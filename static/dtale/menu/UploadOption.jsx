import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";

class UploadOption extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li className="hoverable">
        <span className="toggler-action">
          <button className="btn btn-plain" onClick={this.props.open}>
            <i className="ico-file-upload" />
            <span className="font-weight-bold">{this.props.t("menu:Load Data")}</span>
          </button>
        </span>
        <div className="hoverable__content menu-description">{this.props.t("menu_description:upload")}</div>
      </li>
    );
  }
}
UploadOption.displayName = "UploadOption";
UploadOption.propTypes = {
  open: PropTypes.func,
  t: PropTypes.func,
};

export default withTranslation(["menu", "menu_description"])(UploadOption);
