import React, { useEffect, useState } from "react";
import MainScreen from "../../modules/CustomerPageModules/Customer/MainScreen";
import axios from "axios";
import { Button, Card, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePurchaseAction,
  updatePurchaseAction,
} from "../../../actions/purchasesActions";
import ErrorMessage from "../../modules/CustomerPageModules/Customer/ErrorMessage";
import Loading from "../../modules/CustomerPageModules/Customer/Loading";
import ReactMarkdown from "react-markdown";
import { useRouteMatch, useHistory } from "react-router-dom";

function SinglePurchase() {
  const match = useRouteMatch();
  const history = useHistory();
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [category, setCategory] = useState();
  const [date, setDate] = useState("");

  const dispatch = useDispatch();

  const purchaseUpdate = useSelector((state) => state.purchaseUpdate);
  const { loading, error } = purchaseUpdate;

  const purchaseDelete = useSelector((state) => state.purchaseDelete);
  const { loading: loadingDelete, error: errorDelete } = purchaseDelete;

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deletePurchaseAction(id));
    }
    history.push("/purchases");
  };

  useEffect(() => {
    const fetching = async () => {
      const { data } = await axios.get(`/api/purchases/${match.params.id}`);
      setTitle(data.title);
      setContent(data.content);
      setCategory(data.category);
      setDate(data.updatedAt);
    };

    fetching();
  }, [match.params.id, date]);

  const resetHandler = () => {
    setTitle("");
    setCategory("");
    setContent("");
  };

  const updateHandler = (e) => {
    e.preventDefault();
    dispatch(updatePurchaseAction(match.params.id, title, content, category));
    if (!title || !content || !category) return;

    resetHandler();
    history.push("/purchases");
  };

  return (
    <MainScreen title="Edit Purchases">
      <Card>
        <Card.Header>Edit your Note</Card.Header>
        <Card.Body>
          <Form onSubmit={updateHandler}>
            {loadingDelete && <Loading />}
            {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
            {errorDelete && (
              <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>
            )}
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="title"
                placeholder="Enter the title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="content">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter the content"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>
            {/*{content && (
              <Card>
                <Card.Header>Note Preview</Card.Header>
                <Card.Body>
                  <ReactMarkdown>{content}</ReactMarkdown>
                </Card.Body>
              </Card>
            )}*/}

            <Form.Group controlId="content">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="content"
                placeholder="Enter the Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>
            {loading && <Loading size={50} />}
            <br />
            <br />
            <Button variant="primary" type="submit">
              Update Note
            </Button>
            <Button
              className="mx-2"
              variant="danger"
              onClick={() => deleteHandler(match.params.id)}
            >
              Delete Note
            </Button>
          </Form>
        </Card.Body>

        <Card.Footer className="text-muted">
          <center>Updated on - {date.substring(0, 10)}</center>
        </Card.Footer>
      </Card>
    </MainScreen>
  );
}

export default SinglePurchase;
