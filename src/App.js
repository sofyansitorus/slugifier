import { useState, useEffect } from "react";
import slugify from "slugify";
import CopyToClipboard from "react-copy-to-clipboard";
import {
  ThemeProvider,
  Navbar,
  Container,
  Form,
  FormControl,
  InputGroup,
  Button,
  Row,
  Col
} from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

const limitMin = 10;
const limitDefault = 60;
const defaultSeparator = "-";
const allowedSeparators = ["-", "_"];

export default function App() {
  const [text, setText] = useState("");
  const [limit, setLimit] = useState(limitDefault);
  const [separator, setSeparator] = useState(defaultSeparator);
  const [result, setResult] = useState("");

  const onChangeText = (event) => {
    setText(event.target.value);
  };

  const onChangeLimit = (event) => {
    let parsed = parseInt(event.target.value, 10);

    if (!parsed || isNaN(parsed)) {
      parsed = limitDefault;
    }

    setLimit(parsed);
  };

  const onBlurLimit = () => {
    if (limit < limitMin) {
      setLimit(limitMin);
    }
  };

  const onChangeSeparator = (event) => {
    if (-1 === allowedSeparators.indexOf(event.target.value)) {
      setSeparator(defaultSeparator);
    } else {
      setSeparator(event.target.value);
    }
  };

  useEffect(() => {
    const slugified = slugify(text, {
      replacement: separator, // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true, // convert to lower case, defaults to `false`
      strict: true, // strip special characters except replacement, defaults to `false`
      locale: "en", // language code of the locale to use
      trim: true // trim leading and trailing replacement chars, defaults to `true`
    });

    setResult(slugified.substring(0, limit));
  }, [text, limit, separator]);

  return (
    <ThemeProvider breakpoints={["sm", "xs", "xxs"]}>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Slugifier</Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        <Form>
          <Row>
            <Col xs={7}>
              <Form.Group className="mb-3" controlId="textInput">
                <Form.Label>Text</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter text to slugify"
                  size="lg"
                  value={text}
                  onChange={onChangeText}
                />
              </Form.Group>
            </Col>
            <Col xs={2}>
              <Form.Group className="mb-3" controlId="inputLimit">
                <Form.Label>Limit</Form.Label>
                <Form.Control
                  type="number"
                  min="10"
                  placeholder="Limit"
                  size="lg"
                  value={limit}
                  onChange={onChangeLimit}
                  onBlur={onBlurLimit}
                />
              </Form.Group>
            </Col>
            <Col xs={3}>
              <Form.Group className="mb-3" controlId="inputSeparator">
                <Form.Label>Separator</Form.Label>
                <Form.Select
                  aria-label="Slug separator"
                  size="lg"
                  value={separator}
                  onChange={onChangeSeparator}
                >
                  <option value="-">Dash</option>
                  <option value="_">Underscore</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="textResult">
            <Form.Label>Result</Form.Label>
            <InputGroup className="mb-3">
              <FormControl type="text" size="lg" value={result} readOnly />
              <CopyToClipboard text={result}>
                <Button>Copy</Button>
              </CopyToClipboard>
            </InputGroup>
          </Form.Group>
        </Form>
      </Container>
    </ThemeProvider>
  );
}
