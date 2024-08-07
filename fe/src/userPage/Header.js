import React, { useEffect, useState } from "react";
import { Badge, Container, Row } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { IoCartOutline, IoNotificationsOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Dropdown } from "antd";
import axios from "axios";
import { loadUserFromLocalStorage, logout } from "../redux/Slice/auth";
import { UNREAD } from "../constant/constant";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Header() {
    const [newNoti, setNewNoti] = useState([]);
    const [numberOfCart, setNumberOfCart] = useState(0);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const navigate = useNavigate();

    const textStyle = {
        color: "white",
        textDecoration: "none"
    };

    const items = [
        { label: "Tài khoản của tôi", key: "/user/profile" },
        { label: "Đơn mua", key: "/user/purchaseOrder" },
        { label: "Đăng xuất", key: "logout" },
    ];

    useEffect(() => {
        dispatch(loadUserFromLocalStorage());
    }, [dispatch]);

    useEffect(() => {
        if (user && user.id) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const cartApi = await axios.get(`http://localhost:8080/cart/${user.id}`);
            setNumberOfCart(cartApi.data.length);

            const notiApi = await axios.post(`http://localhost:8080/user/notification?idUser=${user.id}`);
            setNewNoti(notiApi.data.filter(noti => noti.status === UNREAD));
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    const handleDropdownItemClick = (e) => {
        if (e.key === "logout") {
            dispatch(logout());
            navigate('/');
            window.location.reload();
        } else {
            navigate(e.key);
        }
    };

    return (
        <div style={{ background: "#FC5731", paddingTop: "5px" }}>
            <Container>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <Link to="/seller" style={textStyle}>Kênh người bán</Link><span style={textStyle}> | </span>
                        <a href="dddd.com" style={textStyle}>Tải ứng dụng</a><span style={textStyle}> | </span>
                        <span style={textStyle}>Về chúng tôi</span>
                    </div>
                    {isAuthenticated ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <button onClick={() => navigate("/user/notification")} style={{ display: "flex", border: "none", background: "none", marginRight: "10px", position: "relative" }}>
                                <IoNotificationsOutline style={{ color: "white", fontSize: "20px" }} />
                                <div style={{ color: "white" }}>Thông báo</div>
                                {newNoti.length !== 0 && (
                                    <div style={{
                                        position: "absolute",
                                        top: "-4px",
                                        right: "94px",
                                        background: "white",
                                        color: "red",
                                        borderRadius: "50%",
                                        width: "20px",
                                        height: "20px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "12px"
                                    }}>
                                        {newNoti.length}
                                    </div>
                                )}
                            </button>
                            <Dropdown
                                menu={{ onClick: handleDropdownItemClick, items: items }}
                                arrow
                                placement="bottom"
                                style={{ marginTop: "20px" }}
                            >
                                {user.avatar ? (
                                    <Avatar src={user.avatar}></Avatar>
                                ) : (
                                    <Avatar>{user.username[0].toUpperCase()}</Avatar>
                                )}
                            </Dropdown>
                        </div>
                    ) : (
                        <div>
                            <Link to="/signin" style={textStyle}>Đăng nhập</Link><span style={textStyle}> | </span>
                            <Link to="/signupS" style={textStyle}>Đăng ký</Link>
                        </div>
                    )}
                </div>
                <Row>
                    <div className="col-sm-2" style={{ height: "130px", paddingTop: "20px" }}>
                        <Link to="/"><img src="../images/logo.png" alt="Logo" style={{ width: "100%", height: "auto" }} /></Link>
                    </div>
                    <div className="col-sm-8">
                        <div className="input-group" style={{ marginTop: "50px" }}>
                            <input type="text" className="form-control" aria-label="Amount (to the nearest dollar)" />
                            <span className="input-group-text"><CiSearch /></span>
                        </div>
                    </div>
                    <Link to={`/cart/${user?.id}`} className="col-sm-2" style={{ textAlign: "center" }}>
                        <IoCartOutline style={{ color: "white", fontSize: "35px", marginTop: "50px" }} />
                        <Badge pill bg="danger" style={{ position: "absolute", top: "5rem", right: "12rem" }}>
                            {numberOfCart}
                        </Badge>
                    </Link>
                </Row>
            </Container>
        </div>
    );
}
