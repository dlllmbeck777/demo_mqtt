import React from "react";
import { Designer } from "@grapecity/activereports-react";
import "@grapecity/activereports/styles/ar-js-ui.css";
import "@grapecity/activereports/styles/ar-js-designer.css";

import { selectDrawerItem } from "../../../services/actions/drawerMenu/drawerMenu";

function ReportDesigner() {
  document.title = "Ligeia.ai | Designer";
  selectDrawerItem("Designer");
  const report = {
    Name: "Report",
    Type: "report",
    Width: "9.7215in",
    Body: {
      Name: "Body",
      Type: "section",
      ReportItems: [
        {
          Type: "textbox",
          Name: "textbox1",
          Value: "Hello from ActiveReports",
          Height: "10in",
        },
      ],
    },
  };

  return (
    <div
      className="demo-app"
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <Designer report={report}></Designer>
    </div>
  );
}

export default ReportDesigner;
