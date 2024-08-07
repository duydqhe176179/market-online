import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import formatDate from "../../function/formatDate";
import { READED, UNREAD } from "../../constant/constant";
import { useNavigate } from "react-router-dom";

const Notification = () => {
    const [user] = useState(JSON.parse(localStorage.getItem("user")));
    const [noti, setNoti] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [notiPerPage] = useState(5); // Number of notifications per page
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const notiApi = await axios.post(`http://localhost:8080/user/notification?idUser=${user?.id}`);
            setNoti(notiApi.data.reverse());
            console.log(notiApi.data);
        } catch (error) {
            console.log(error);
        }
    };

    const readAllNoti = async () => {
        const notiUnread = noti?.filter(noti => noti.status === UNREAD);
        const notiDto = [];
        notiUnread.forEach(noti => {
            notiDto.push({ id: noti?.id });
        });

        try {
            const response = await axios.post("http://localhost:8080/readAllNoti", notiDto);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
        fetchData();
    };

    const clickNoti = async (idNoti, url) => {
        const notiDto = [];
        notiDto.push({ id: idNoti });
        try {
            const response = await axios.post("http://localhost:8080/readAllNoti", notiDto);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
        fetchData();
        navigate(url);
    };

    // Calculate notifications to display
    const indexOfLastNoti = currentPage * notiPerPage;
    const indexOfFirstNoti = indexOfLastNoti - notiPerPage;
    const currentNoti = noti.slice(indexOfFirstNoti, indexOfLastNoti);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Move to the previous page
    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // Move to the next page
    const nextPage = () => {
        if (currentPage < Math.ceil(noti.length / notiPerPage)) setCurrentPage(currentPage + 1);
    };

    return (
        <Container style={{ background: "white", padding: "20px 20px" }}>
            <div style={{ textAlign: "end", borderBottom: "1px solid #F5F5F5", paddingBottom: "10px" }}>
                <button onClick={() => readAllNoti()} style={{ border: "none", background: "none" }}>Đánh dấu đã đọc tất cả</button>
            </div>
            {currentNoti?.map(noti => (
                <button onClick={() => clickNoti(noti?.id, noti?.url)} key={noti?.id} style={{ width: "100%", display: "flex", padding: "10px 0", border: "none", backgroundColor: noti?.status === READED ? "white" : "" }}>
                    <div style={{ width: "100px", height: "100px", padding: "15px" }}>
                        <img src={`${noti?.image}`} alt="error" style={{ width: "70px" }} />
                    </div>
                    <div style={{ textAlign: "start" }}>
                        <div>{noti?.title}</div>
                        <div style={{ color: "#917B7B" }}>{noti?.content}</div>
                        <div style={{ color: "#917B7B" }}>{formatDate(noti?.date)}</div>
                    </div>
                </button>
            ))}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", alignItems: "center" }}>
                <Button variant="secondary" onClick={prevPage} disabled={currentPage === 1} style={{ margin: "0 5px" }}>{'<'}</Button>
                {Array.from({ length: Math.ceil(noti.length / notiPerPage) }, (_, index) => (
                    <Button key={index + 1} onClick={() => paginate(index + 1)}
                        style={{
                            margin: "0 5px", backgroundColor: currentPage === index + 1 ? "#F75530" : "white",
                            color: currentPage === index + 1 ? "white" : "black",
                            border: currentPage === index + 1 ? "none" : "1px solid #ccc"
                        }}>
                        {index + 1}
                    </Button>
                ))}
                <Button variant="secondary" onClick={nextPage} disabled={currentPage === Math.ceil(noti.length / notiPerPage)} style={{ margin: "0 5px" }}>{'>'}</Button>
            </div>
        </Container>
    );
};

export default Notification;
