import { Button, Container } from "react-bootstrap";
import { IoApps } from "react-icons/io5";
import { MdOutlineAccountCircle } from "react-icons/md";
import { LiaProductHunt } from "react-icons/lia";
import { CiShoppingCart } from "react-icons/ci";
import { MdOutlineErrorOutline } from "react-icons/md";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { BiCategory } from "react-icons/bi";

const SideBar = () => {
    const [hoveredButton, setHoveredButton] = useState(null);
    const navigate = useNavigate()

    // Button style
    const buttonStyle = {
        width: "100%",
        color: "#8E92BC",
        backgroundColor: "white",
        border: "none",
        fontSize: "18px",
        display: "flex",
        justifyContent: "start",
        margin: "20px 0",
        transition: "background 0.3s ease, color 0.3s ease" // Smooth transition for background and color
    };

    // Hovered button style
    const hoveredButtonStyle = {
        backgroundColor: "#F5F5F7",
        color: "black"
    };

    // Icon style
    const iconStyle = {
        fontSize: "25px",
        marginRight: "15px"
    };
    const links = [
        "/admin/overview",
        "/admin/accounts",
        "/admin/categories",
        "/admin/products",
        "/admin/orders",
        "/admin/reports"
    ];
    return (
        <Container>
            {["Tổng quan", "Người dùng", "Danh mục", "Sản phẩm", "Đơn hàng", "Báo cáo vi phạm"].map((text, index) => (
                <Button
                    key={index}
                    style={{
                        ...buttonStyle,
                        ...(hoveredButton === index ? hoveredButtonStyle : {})
                    }}
                    onMouseEnter={() => setHoveredButton(index)}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() => navigate(links[index])}
                >
                    {index === 0 && <IoApps style={iconStyle} />}
                    {index === 1 && <MdOutlineAccountCircle style={iconStyle} />}
                    {index === 2 && <BiCategory style={iconStyle} />}
                    {index === 3 && <LiaProductHunt style={iconStyle} />}
                    {index === 4 && <CiShoppingCart style={iconStyle} />}
                    {index === 5 && <MdOutlineErrorOutline style={iconStyle} />}
                    {text}
                </Button>
            ))}
        </Container>
    );
}

export default SideBar;