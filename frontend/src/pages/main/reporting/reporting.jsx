import React from "react";
import { Viewer } from "@grapecity/activereports-react";
import "@grapecity/activereports/styles/ar-js-ui.css";
import "@grapecity/activereports/styles/ar-js-viewer.css";
import { selectDrawerItem } from "../../../services/actions/drawerMenu/drawerMenu";
function App() {
  document.title = "Ligeia.ai | Viewer";
  selectDrawerItem("Viewer");
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
    <div className="demo-app" style={{ height: "100%" }}>
      <Viewer report={{ Uri: report }} />
    </div>
  );
}

export default App;
