import { Badge, Container, Row } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import "bootstrap/dist/css/bootstrap.min.css"
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Dropdown } from "antd";
import { loadUserFromLocalStorage, logout } from "../redux/Slice/auth"
import { useEffect, useState } from "react";
import axios from "axios";

export default function Header() {
    const textStyle = {
        color: "white",
        textDecoration: "none"
    }
    const items = [
        {
            label: "Tài khoản của tôi",
            key: "/user/profile",
        },
        {
            label: "Đơn mua",
            key: "/user/purchaseOrder",
        },
        {
            label: "Đăng xuất",
            key: "logout",
        },
    ];
    const user = useSelector((state) => state.auth.user)
    const [numberOfCart, setNumberOfCart] = useState()
    const dispatch = useDispatch()
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
    const navigate = useNavigate()
    const handleDropdownItemClick = (e) => {
        if (e.key === "logout") {
            dispatch(logout());
            navigate('/'); // Redirect to the signin page
            window.location.reload();
        } else {
            navigate(e.key);
        }
    };

    useEffect(() => {
        dispatch(loadUserFromLocalStorage());
        fetchData()
    }, [dispatch]);

    const fetchData = async () => {
        try {
            const cartApi = await axios.get(`http://localhost:8080/cart/${user.id}`)
            setNumberOfCart(cartApi.data.length)
        } catch (error) {

        }
    }
    return (
        <div style={{ background: "#FC5731" }}>
            <Container >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <Link to="/seller" style={textStyle}>Kênh người bán</Link><span style={textStyle}> | </span>
                        <a href="dddd.com" style={textStyle}>Tải ứng dụng</a><span style={textStyle}> | </span>
                        <span style={textStyle}>Về chúng tôi </span>
                    </div>
                    {isAuthenticated ?
                        (
                            <div>
                                <Dropdown
                                    menu={{ onClick: handleDropdownItemClick, items: items }}
                                    arrow
                                    placement="bottom"
                                    style={{
                                        marginTop: "20px"
                                    }}
                                >
                                    {user.avatar ? (
                                        <Avatar src={user?.avatar}></Avatar>
                                    ) : (
                                        <Avatar>{user.username[0].toUpperCase()}</Avatar>
                                    )}
                                </Dropdown>
                            </div>
                        )
                        : (
                            <div>
                                <Link to={"/signin"} style={textStyle}>Đăng nhập</Link><span style={textStyle}> | </span>
                                <Link to={"/signupS"} style={textStyle}>Đăng ký</Link>
                            </div>
                        )}
                </div>
                <Row>
                    <div className="col-sm-2" style={{ height: "130px", paddingTop: "20px" }}>
                        <Link to="/"><img src="../images/logo.png" alt="Logo" style={{ width: "100%", height: "auto" }} /></Link>
                    </div>
                    <div className="col-sm-8 ">
                        <div className="input-group " style={{ marginTop: "50px" }}>
                            <input type="text" className="form-control" aria-label="Amount (to the nearest dollar)" />
                            <span className="input-group-text"><CiSearch /></span>
                        </div>
                    </div>
                    <Link to={`/cart/${user?.id}`} className="col-sm-2" style={{ textAlign: "center" }} >
                        <IoCartOutline style={{ color: "white", fontSize: "35px", marginTop: "50px" }} />
                        <Badge pill bg="danger" style={{ position: "absolute", top: "5rem", right: "12rem" }} >
                            {numberOfCart}
                        </Badge>
                    </Link>
                </Row>
            </Container>
        </div>
    )
}