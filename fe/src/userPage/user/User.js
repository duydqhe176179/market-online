import { Col, Container, Row } from "react-bootstrap"
import Header from "../Header"
import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { MdContentPaste } from "react-icons/md";
import Profile from "./Profile";
import PurchaseOrder from "./Purchaseorder";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../Footer";
import ChangePhone from "./ChangePhone";
import { IoIosPhonePortrait } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import ChangePassword from "./ChangePassword";
import { IoNotificationsOutline } from "react-icons/io5";
import Notification from "./Notification";

const User = ({ view }) => {
    const [user, setUser] = useState(null);
    const [section, setSection] = useState(view)
    const navigate = useNavigate()
    const location = useLocation();

    useEffect(() => {
        const userLocal = JSON.parse(localStorage.getItem("user"));
        setUser(userLocal);
    }, [user?.id]);

    useEffect(() => {
        if (location.pathname.includes("profile")) {
            setSection("profile");
        } else if (location.pathname.includes("purchaseOrder")) {
            setSection("purchaseOrder");
        } else if (location.pathname.includes("phone")) {
            setSection("phone")
        } else if (location.pathname.includes("password")) {
            setSection("password")
        } else if (location.pathname.includes("notification")) {
            setSection("notification")
        }
    }, [location.pathname]);

    const navLeftStyle = {
        width: "100%",
        border: "none",
        textAlign: "start",
        display: "flex",
        alignItems: 'center',
        background: "none",
        padding: "5px 0"
    }

    const subNavLeft = {
        ...navLeftStyle,
        textAlign: "end"
    }

    const renderSection = () => {
        switch (section) {
            case "profile":
                return <Profile />;
            case "purchaseOrder":
                return <PurchaseOrder />;
            case "phone":
                return <ChangePhone />
            case "password":
                return <ChangePassword />
            case "notification":
                return <Notification/>
            default:
                return <Profile />;
        }
    };



    return (
        <div style={{ background: "#F5F5F5" }}>
            <Header />
            <br />
            <Container >
                <Row>
                    <Col xs={2}>
                        <div style={{ display: "flex", marginBottom: "20px" }}>
                            <div style={{ borderRadius: "50%", overflow: "hidden", width: "80px", height: "80px", padding: "0" }}>
                                <img src={`${user?.avatar}`} alt="avatar" width={"100%"}
                                    style={{
                                        objectFit: "cover",
                                        height: "100%"
                                    }} />
                            </div>
                            <div>
                                <div style={{ paddingLeft: "6px" }}>{user?.name}</div>
                                <button style={{ fontSize: "12px", color: "#888888", border: "none" }}><FiEdit2 /> Sửa hồ sơ</button>
                            </div>
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <td><FaUser /></td>
                                    <td><button onClick={() => {
                                        setSection("profile")
                                        navigate("/user/profile")
                                    }} style={navLeftStyle}> Tài khoản của tôi</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><IoIosPhonePortrait /></td>
                                    <td><button onClick={() => {
                                        setSection("phone")
                                        navigate("/user/phone")
                                    }} style={subNavLeft}>Số điện thoại</button>
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: "solid 1px #D8D8D8" }}>
                                    <td><RiLockPasswordLine /></td>
                                    <td>
                                        <button onClick={() => {
                                            setSection("password")
                                            navigate("/user/password")
                                        }} style={subNavLeft}>Đổi mật khẩu</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><MdContentPaste style={{ marginRight: "3px" }} /></td>
                                    <td>
                                        <button onClick={() => {
                                            setSection("purchaseOrder")
                                            navigate("/user/purchaseOrder")
                                        }} style={navLeftStyle}>Đơn mua</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><IoNotificationsOutline style={{ marginRight: "3px" }} /></td>
                                    <td>
                                        <button onClick={() => {
                                            setSection("notification")
                                            navigate("/user/notification")
                                        }} style={navLeftStyle}>Thông báo</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                    <Col xs={10} style={{ padding: "0" }}>
                        {renderSection()}
                    </Col>
                </Row>
            </Container>
            <br />
            <Footer />
        </div>
    )
}
export default User