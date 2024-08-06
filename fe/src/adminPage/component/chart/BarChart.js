import React from "react";
import { MDBContainer } from "mdbreact";
import { Bar } from "react-chartjs-2";
import 'chart.js/auto'
import moment from "moment";

const BarChart = ({ orders = [] }) => {
	const aggregatedData = orders?.reduce((acc, order) => {
		const date = moment(order.createDate).format('YYYY-MM-DD')
		if (!acc[date]) {
			acc[date] = 0;
		}
		acc[date] += order?.totalOrder * 5 / 100;
		return acc;
	}, {});

	// Chuyển đổi dữ liệu tổng hợp thành định dạng cho biểu đồ
	const labels = Object.keys(aggregatedData);
	const dataValues = Object.values(aggregatedData);
	// Sample data 
	const data = {
		labels,
		datasets: [
			{
				label: "Lợi nhuận theo ngày",
				data: dataValues,
				backgroundColor: "#02b844",
				borderWidth: 1,
				borderColor: "#000000",
			}
		]
	}

	return (
		<MDBContainer style={{backgroundColor:"white"}}>
			<Bar data={data}
				style={{ maxHeight: '600px' }}
			/>
		</MDBContainer>
	);
}

export default BarChart;
