import Footer from "./Footer";
import React, { useState } from 'react';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBIcon,
    MDBInput
}
    from 'mdb-react-ui-kit';
import { Link, useNavigate } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";
import axios from "axios";

export default function SignupE() {
    const nav = useNavigate()
    const [account, setAccount] = useState({
        "email": "",
        "password": ""
    })
    const { email, password } = account
    const onInputChange = (e) => {
        setAccount({ ...account, [e.target.name]: e.target.value })
    }

    const signup = async (e) => {
        e.preventDefault()
        const response = await axios.post("http://localhost:8080/signup", account)
        console.log(response);
        nav("/")
    }
    return (
        <div>
            <div style={{ backgroundColor: "#FBFBFB", padding: "15px" }}>
                <Container>
                    <div style={{ display: "flex" }}>
                        <Link to="/"><img src="../images/logo.png" alt="Logo" style={{ height: "70px" }} /></Link>
                        <h4 className="fw-normal mb-3 ps-5 " style={{ marginTop: "20px" }}>Trang đăng ký</h4>

                    </div>
                </Container>
            </div>
            <MDBContainer fluid>
                <MDBRow>

                    <MDBCol sm='5'>

                        <div className='d-flex flex-row ps-5 pt-5'>
                            <MDBIcon fas icon="crow fa-3x me-3" style={{ color: '#709085' }} />

                        </div>

                        <Form onSubmit={signup} className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>

                            <h3 className="fw-normal mb-3 ps-5 pb-3" style={{ letterSpacing: '1px' }}>Đăng ký bằng Email</h3>

                            <MDBInput wrapperClass='mb-4 mx-5 w-100' name="email" value={email} onChange={onInputChange} type='email' size="lg" placeholder="Email" />
                            <MDBInput wrapperClass='mb-4 mx-5 w-100' name="password" value={password} onChange={onInputChange} type='password' size="lg" placeholder="Mật khẩu" />

                            <Button className="mb-4 px-5 mx-5 w-100" style={{ backgroundColor: '#FC5731', color: 'white' }} color='info' size='lg' type="submit">Đăng ký</Button>
                            <p className="small mb-5 pb-lg-3 ms-5"><Link className="text-muted" to="/signupS">Đăng ký với số điện thoại</Link></p>
                            <p className='ms-5'>Đã có tài khoản? <Link to={"/signin"} className="link-info">Đăng nhập</Link></p>

                        </Form>

                    </MDBCol>

                    <MDBCol sm='7' className='d-none d-sm-block px-0'>
                        <img src="./images/background.jpg"
                            alt="Login" className="w-100" style={{ objectFit: 'cover', objectPosition: 'left' }} />
                    </MDBCol>

                </MDBRow>

            </MDBContainer>
            <br /><br />
            <Footer />
        </div>
    )
}