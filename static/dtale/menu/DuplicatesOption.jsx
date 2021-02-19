import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";

class DuplicatesOption extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li className="hoverable">
        <span className="toggler-action">
          <button className="btn btn-plain" onClick={this.props.open}>
            <i className="fas fa-clone ml-2 mr-4" />
            <span className="font-weight-bold">{this.props.t("menu:Duplicates")}</span>
          </button>
        </span>
        <div className="hoverable__content menu-description">{this.props.t("menu_description:duplicates")}</div>
      </li>
    );
  }
}
DuplicatesOption.displayName = "DuplicatesOption";
DuplicatesOption.propTypes = {
  open: PropTypes.func,
  t: PropTypes.func,
};

export default withTranslation(["menu", "menu_description"])(DuplicatesOption);
