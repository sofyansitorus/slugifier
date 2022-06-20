import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState, useRef } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  Navbar,
  Row,
  Spinner,
  ThemeProvider,
  Card
} from "react-bootstrap";
import { CheckCircleFill, Github } from "react-bootstrap-icons";
import CopyToClipboard from "react-copy-to-clipboard";
import slug from "slug";
import "./styles.css";

const limitMin = 10;
const limitDefault = 60;
const defaultSeparator = "-";
const allowedSeparators = ["-", "_"];

const trim = (str, chars) => str.split(chars).filter(Boolean).join(chars);

export default function App() {
  const [text, setText] = useState("");
  const [limit, setLimit] = useState(limitDefault);
  const [separator, setSeparator] = useState(defaultSeparator);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const disableSpinnerTimer = useRef();
  const toggleCopiedTimer = useRef();

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

  const onCopy = () => {
    if (disableSpinnerTimer.current) {
      clearTimeout(disableSpinnerTimer.current);
    }

    if (toggleCopiedTimer.current) {
      clearTimeout(toggleCopiedTimer.current);
    }

    setCopied(true);
    setSpinning(true);
  };

  useEffect(() => {
    const textCleaned = text.replace(/-|_/gi, " ");
    const textSlugified = slug(textCleaned, separator);
    const textLimited = textSlugified.substring(0, limit);
    const textTrimmed = trim(textLimited, separator);

    setResult(textTrimmed);
  }, [text, limit, separator]);

  useEffect(() => {
    if (copied) {
      const disableSpinner = () => {
        return new Promise((resolve) => {
          disableSpinnerTimer.current = setTimeout(() => {
            setSpinning(false);
            resolve();
          }, 300);
        });
      };

      disableSpinner().then(() => {
        toggleCopiedTimer.current = setTimeout(() => {
          setCopied(false);
        }, 1000);
      });
    }
  }, [copied]);

  useEffect(() => {
    return () => {
      if (disableSpinnerTimer.current) {
        clearTimeout(disableSpinnerTimer.current);
      }

      if (toggleCopiedTimer.current) {
        clearTimeout(toggleCopiedTimer.current);
      }
    };
  }, []);

  const getCopyText = () => {
    if (copied) {
      if (spinning) {
        return <Spinner animation="border" size="sm" />;
      }

      return <CheckCircleFill size={24} />;
    }

    return "Copy";
  };

  const textIsEmpty = 1 > text.length;
  const copyDisabled = copied || textIsEmpty;
  const copyVariant = textIsEmpty ? "secondary" : "primary";

  return (
    <ThemeProvider breakpoints={["sm", "xs", "xxs"]}>
      <Navbar bg="light" expand="lg" className="mb-5">
        <Container>
          <Navbar.Brand href="#home">Slugifier</Navbar.Brand>
          <Navbar.Text className="justify-content-end">
            <a
              href="https://github.com/sofyansitorus/slugifier/fork"
              title="Fork on GitHub"
            >
              <Github />
            </a>
          </Navbar.Text>
        </Container>
      </Navbar>
      <Container>
        <Card className="p-5">
          <Form>
            <Row>
              <Col
                xs={{
                  span: 12,
                  order: 3
                }}
                md={7}
              >
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
              <Col
                xs={{
                  span: 6,
                  order: 2
                }}
                md={2}
              >
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
              <Col
                xs={{
                  span: 6,
                  order: 1
                }}
                md={3}
              >
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
                <CopyToClipboard
                  text={result}
                  onCopy={onCopy}
                  disabled={copyDisabled}
                >
                  <Button
                    style={{
                      width: "80px"
                    }}
                    variant={copyVariant}
                  >
                    {getCopyText()}
                  </Button>
                </CopyToClipboard>
              </InputGroup>
            </Form.Group>
          </Form>
        </Card>
      </Container>
    </ThemeProvider>
  );
}
