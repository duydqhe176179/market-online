import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { viewProductDetail } from "../../redux/Slice/product";
import truncateString from "../../function/formatNameProduct"

const AllProduct = ({ allProduct = [], status }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 12;

    // Function to truncate string

    // Function to format number
    const formatNumber = (number) => {
        return new Intl.NumberFormat('de-DE').format(number);
    };

    // Calculate the reviews to display on the current page
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;

    // Filter and slice the products
    const filteredProducts = allProduct.filter(product => product.status === status);
    const currentReviews = filteredProducts.slice(indexOfFirstReview, indexOfLastReview);

    // Calculate total pages
    const totalPages = Math.ceil(filteredProducts.length / reviewsPerPage);

    // Function to view product detail
    const viewDetailProduct = (product) => {
        dispatch(viewProductDetail(product));
        localStorage.setItem("item", JSON.stringify(product));
        navigate(`/product/${product.idProduct}`);
    };

    return (
        <div style={{ background: "#F5F5F5", padding: "10px 0" }}>
            <Container>
                <Row>
                    {currentReviews.map(product => (
                        <Col key={product.idProduct} xs={2} style={{ padding: "5px" }}>
                            <div style={{ background: "white", padding: "10px", cursor: "pointer" }}
                                onClick={() => viewDetailProduct(product)}>
                                <img
                                    src={`${product.image[0]}`}
                                    alt={product.name}
                                    style={{ maxWidth: "100%" }}
                                />
                                <div>
                                    <div style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", lineHeight: "1.5", maxHeight: "3em" }}>
                                        {truncateString(product?.name)}
                                    </div>
                                    <div>
                                        {product?.sale === 0 ? (
                                            <div>
                                                <div style={{ color: "#EE4D2D" }}>
                                                    {formatNumber(product.price)} đ
                                                </div>
                                                <div style={{ color: "white", fontSize: "8px" }}>asds</div>
                                            </div>
                                        ) : (
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <div>
                                                    <div style={{ fontSize: "12px", textDecoration: "line-through" }}>
                                                        {formatNumber(product.price)} đ
                                                    </div>
                                                    <div style={{ background: "#F84A2F", color: "white", fontSize: "12px", padding: "0 2px" }}>Giảm {product?.sale}%</div>
                                                </div>
                                                <div style={{ color: "#EE4D2D", fontSize: "15px" }}>
                                            {formatNumber(Math.ceil(product?.price * (100 - product?.sale) / 100))} đ
                                        </div>
                                            </div>
                                        )}
                                        <div>Đã bán {product?.numberOfSale}</div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
                {totalPages > 1 && (
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
                )}
            </Container>
        </div>
    );
};

export default AllProduct;
