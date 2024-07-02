import { useEffect, useState } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import moment from 'moment';
import { GiPenguin } from "react-icons/gi";

const ReviewProduct = ({ rateProduct }) => {
    const [averageStar, setAverageStar] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 2;

    useEffect(() => {
        const totalStar = rateProduct?.reduce((total, star) => total + star.star, 0);
        setAverageStar((totalStar / rateProduct.length).toFixed(1));
    }, [rateProduct]);

    const formatDate = (isoString) => {
        return moment(isoString).format('YYYY-MM-DD HH:mm');
    };

    // Calculate the reviews to display on the current page
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = rateProduct.slice(indexOfFirstReview, indexOfLastReview);

    // Calculate total pages
    const totalPages = Math.ceil(rateProduct.length / reviewsPerPage);

    return (
        <Container style={{ background: "white", padding: "20px" }}>
            <div style={{
                marginLeft: "20px",
                padding: "10px",
            }}>
                {rateProduct?.length > 0 ?
                    (<div>
                        <h6>ĐÁNH GIÁ SẢN PHẨM</h6>
                        <Row style={{ background: "#FFFBF8", color: "#EE4D2D", padding: "15px" }}>
                            <Col xs={2} >
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <h3>{averageStar}</h3>
                                    <span style={{ marginTop: "9px", marginLeft: "10px" }}> điểm</span>
                                </div>
                                <div style={{ textAlign: "center", fontSize: "25px" }}>
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            style={{ color: i < averageStar ? "#F0D24A" : "#e4e5e9" }}
                                        />
                                    ))}
                                </div>
                            </Col>
                            <Col>asfsdf</Col>
                        </Row>
                        <br />
                        {currentReviews.map(rateProduct => (
                            <div key={rateProduct.id} style={{ borderBottom: "solid 1px #F0CBAD", display: "flex", paddingTop: "15px" }}>
                                <div style={{ borderRadius: "50%", overflow: "hidden", width: "80px", height: "80px", padding: "0", margin: "20px" }}>
                                    <img src={`../images/avatar/${rateProduct?.userRate.avatar}`} alt="avatar" width={"100%"}
                                        style={{
                                            objectFit: "cover",
                                            height: "100%"
                                        }} />
                                </div>
                                <div>
                                    <div>{rateProduct?.userRate.name}</div>
                                    <div style={{ fontSize: "12px" }}>
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar
                                                key={i}
                                                style={{ color: i < rateProduct?.star ? "#F0E32B" : "#e4e5e9" }}
                                            />
                                        ))}
                                    </div>
                                    <div style={{ fontSize: "11px", marginBottom: "10px" }}>
                                        {formatDate(rateProduct?.dateReview)}
                                    </div>
                                    <div>
                                        {rateProduct?.review}
                                    </div>
                                </div>
                            </div>
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
                    </div>)
                    :
                    (
                        <div>
                            <h6> Chưa có đánh giá</h6>
                            <div style={{fontSize:"30px"}}><GiPenguin /></div>
                        </div>
                    )}
            </div>
        </Container>
    );
};

export default ReviewProduct;
