import { Container, Row } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import "bootstrap/dist/css/bootstrap.min.css"
import { Link } from "react-router-dom";


export default function Header() {
    const textStyle = {
        color: "white",
        textDecoration: "none"
    }


    return (
        <div style={{ background: "#FC5731" }}>
            <Container >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <a href="google.com" style={textStyle}>Kênh người bán</a><span style={textStyle}> | </span>
                        <a href="dddd.com" style={textStyle}>Tải ứng dụng</a><span style={textStyle}> | </span>
                        <span style={textStyle}>Về chúng tôi </span>
                    </div>
                    <div>
                        <Link to={"/signin"} style={textStyle}>Đăng nhập</Link><span style={textStyle}> | </span>
                        <Link to={"/signupS"} style={textStyle}>Đăng ký</Link>
                    </div>
                </div>
                <Row>
                    <div className="col-sm-2" style={{ height: "130px" }}>
                        <Link to="/"><img src="../images/logo.png" alt="Logo" style={{ height: "90%" }} /></Link>
                    </div>
                    <div className="col-sm-8 ">
                        <div className="input-group " style={{ marginTop: "50px" }}>
                            <input type="text" className="form-control" aria-label="Amount (to the nearest dollar)" />
                            <span className="input-group-text"><CiSearch /></span>
                        </div>
                    </div>
                    <div className="col-sm-2" style={{ textAlign: "center" }}>
                        <IoCartOutline style={{ color: "white", fontSize: "35px", marginTop: "50px" }} />
                    </div>
                </Row>
            </Container>
        </div>
    )
}