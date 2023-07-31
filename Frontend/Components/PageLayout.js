import React from "react";
import Header from "./Header";
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

const PageLayout = (props) => {
  return (
    <div>
      <Header></Header>
      <Container>{props.children}</Container>
    </div>
  );
};
export default PageLayout;