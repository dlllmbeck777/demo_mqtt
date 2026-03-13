import React from "react";
import { Box } from "@mui/material";
import "../../assets/styles/components/error/componentError.scss";
export class ComponentError extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <Box className="component-error-box">{this.props.errMsg}</Box>;
    }

    return this.props.children;
  }
}
