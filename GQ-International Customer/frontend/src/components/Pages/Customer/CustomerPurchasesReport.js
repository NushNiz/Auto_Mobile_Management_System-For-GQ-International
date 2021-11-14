import { Accordion, Badge, Button, Card } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import jsPDF from "jspdf";
import MainScreen from "../../modules/CustomerPageModules/Customer/MainScreen";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePurchaseAction,
  listPurchases,
} from "../../../actions/purchasesActions";
import Loading from "../../modules/CustomerPageModules/Customer/Loading";
import ErrorMessage from "../../modules/CustomerPageModules/Customer/ErrorMessage";
import context from "react-bootstrap/esm/AccordionContext";
import gqheader from "../../../images/gqheader.jpg";
import "./CustomerPurchasesReport.css";

const Mypurchases = ({ search }) => {
  const dispatch = useDispatch();

  const purchaseList = useSelector((state) => state.purchaseList);
  const { loading, purchases, error } = purchaseList;

  const customerLogin = useSelector((state) => state.customerLogin);
  const { customerInfo } = customerLogin;

  const purchaseCreate = useSelector((state) => state.purchaseCreate);
  const { success: successCreate } = purchaseCreate;

  const purchaseUpdate = useSelector((state) => state.purchaseUpdate);
  const { success: successUpdate } = purchaseUpdate;

  const purchaseDelete = useSelector((state) => state.purchaseDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = purchaseDelete;

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deletePurchaseAction(id));
    }
  };

  console.log(purchases);

  const history = useHistory();

  useEffect(() => {
    dispatch(listPurchases());
    if (!customerInfo) {
      history.push("/");
    }
  }, [
    dispatch,
    successCreate,
    history,
    customerInfo,
    successUpdate,
    successDelete,
  ]);

  function pdfGenerate(title, category, content, updatedAt) {
    var doc = new jsPDF("landscape", "px", "a4", "false");
    doc.setFont("Helvertica", "bold");
    doc.text(60, 60, "Title :");
    doc.text(60, 80, "Category :");
    doc.text(60, 100, "Content :");
    doc.text(60, 120, "Purchased on :");
    doc.setFont("Helvertica", "normal");
    doc.text(100, 60, title);
    doc.text(140, 80, category);
    doc.text(120, 100, content);
    doc.text(160, 120, updatedAt.substring(0, 10));
    doc.save("purchase.pdf");
  }

  function generatePDF() {
    const doc = new jsPDF("p", "pt", [1800, 1500]); //(p,pt= points (mm,cm),page size)
    doc.html(document.querySelector("#cuspurchrepo"), {
      callback: function (pdf) {
        const pageCount = doc.internal.getNumberOfPages(0);
        pdf.save("GQ-International Purchase History");
      },
    });
  }

  return (
    <div class="downloadbtncontainer">
      <Button
        variant="warning"
        style={{ marginLeft: 1100 }}
        onClick={generatePDF}
      >
        Download Full Purchase History
      </Button>
      <div id="cuspurchrepo">
        <MainScreen title={`${customerInfo.name} Purchase History`}>
          {errorDelete && (
            <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>
          )}
          {loadingDelete && <loading />}
          {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
          {loading && <Loading />}
          {purchases?.map((purchase) => (
            <Accordion key={purchase._id} id="content">
              <Card style={{ margin: 10 }}>
                <Card.Header style={{ background: "#D3D3D3", display: "flex" }}>
                  <span
                    style={{
                      color: "black",
                      textDecoration: "none",
                      flex: 1,
                      cursor: "pointer",
                      alignSelf: "center",
                      fontSize: 18,
                    }}
                  >
                    {purchase.title}
                  </span>
                </Card.Header>
                <Card.Body style={{ background: "#FFF" }}>
                  <h6 style={{ color: "green" }}>{purchase.content}</h6>
                </Card.Body>
                <Card.Body style={{ background: "#FFF" }}>
                  <h4>
                    <Badge>Category - {purchase.category}</Badge>
                  </h4>

                  <blockquote className="blackquote mb-0">
                    <br />
                    <footer className="blockquote-footer">
                      <b style={{ color: "black" }}>
                        Purchased on :
                        <cite title="Source Title">
                          {purchase.updatedAt.substring(0, 10)}
                        </cite>
                      </b>
                    </footer>
                  </blockquote>
                </Card.Body>
              </Card>
            </Accordion>
          ))}
        </MainScreen>
        <img src={gqheader} alt="" height="250" width="1520" />
      </div>
    </div>
  );
};

export default Mypurchases;
