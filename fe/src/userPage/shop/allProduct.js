import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

const AllProduct = ({ allProduct }) => {
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 6;
    const productStyle = {
        padding: "5px",
    }
    const truncateString = (str) => {
        if (!str || str.length <= 44) {
            return str;
        }
        return str.substring(0, 44) + "...";
    };
    const formatNumber = (number) => {
        return new Intl.NumberFormat('de-DE').format(number);
    };
    // Calculate the reviews to display on the current page
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = allProduct?.slice(indexOfFirstReview, indexOfLastReview);

    // Calculate total pages
    const totalPages = Math.ceil(allProduct?.length / reviewsPerPage);

    return (
        <div style={{ background: "#F5F5F5", padding: "20px 0 20px 0" }}>
            <Container>
                <Row>
                    {currentReviews?.map(product => (
                        <Col key={product.idProduct} xs={2} style={productStyle} onClick={() => navigate(`/product/${product.idProduct}`)}>
                            <img
                                src={`../images/product/${product.image}`}
                                alt={product.name}
                                style={{ maxWidth: "100%", }} />
                            <div style={{ background: "white", padding: "10px" }}>
                                <div>{truncateString(product?.name)}</div>
                                <div style={{ display: "flex", marginTop: "10px", justifyContent: "space-between" }}>
                                    <div style={{ color: "#EE4D2D" }}>{formatNumber(product?.price)} đ</div>
                                    <div>Đã bán {product?.numberOfSale}</div>
                                </div>
                            </div>
                        </Col>
                    ))}
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                        <Button
                            variant="secondary"
                            onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                            disabled={currentPage === 1}
                            style={{ margin: "0 5px" }}
                        >
                            {"<"}
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <Button
                                key={i}
                                variant="primary"
                                onClick={() => setCurrentPage(i + 1)}
                                style={{
                                    margin: "0 5px",
                                    backgroundColor: currentPage === i + 1 ? "#F75530" : "white",
                                    color: currentPage === i + 1 ? "white" : "black",
                                    border: currentPage === i + 1 ? "none" : "1px solid #ccc"
                                }}
                            >
                                {i + 1}
                            </Button>
                        ))}
                        <Button
                            variant="secondary"
                            onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            style={{ margin: "0 5px" }}
                        >
                            {">"}
                        </Button>
                    </div>
                </Row>
            </Container>
        </div>
    )
}
export default AllProduct