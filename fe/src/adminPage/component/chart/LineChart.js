import React from "react";
import { MDBContainer } from "mdbreact";
import { Line } from "react-chartjs-2";
import 'chart.js/auto'
import moment from "moment";
const LineChart = ({ orders = [] }) => {
    const aggregatedData = orders?.reduce((acc, order) => {
        const date = moment(order.createDate).format('YYYY-MM-DD')
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date] += 1;
        return acc;
    }, {});

    // Chuyển đổi dữ liệu tổng hợp thành định dạng cho biểu đồ
    const labels = Object.keys(aggregatedData);
    const dataValues = Object.values(aggregatedData);

    // Tạo dữ liệu biểu đồ từ dữ liệu tổng hợp
    const data = {
        labels,
        datasets: [
            {
                label: "Số đơn đặt hàng theo ngày",
                data: dataValues,
                fill: true,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)",
            }
        ]
    };

    return (
        <MDBContainer style={{ backgroundColor: "white" }}>
            <Line data={data} />
        </MDBContainer>
    );
}

export default LineChart;
