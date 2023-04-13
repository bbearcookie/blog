import styled from "styled-components"

import Header from "./Header"
import Series from "./Series"
import Body from "./Body"
import Footer from "./Footer"

const Article = styled.article`
.gatsby-highlight-code-line {
  background-color: #022a4b;
  display: block;
  margin-right: -1.2em;
  margin-left: -1.2em;
  padding-right: 1em;
  padding-left: .87em;
  border-left: .35em solid #0687f0;
}
`

Article.Header = Header
Article.Series = Series
Article.Body = Body
Article.Footer = Footer

export default Article
