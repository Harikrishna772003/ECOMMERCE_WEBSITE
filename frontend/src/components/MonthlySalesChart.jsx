import { useEffect, useState } from "react";
import API from "../api/api";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function MonthlySalesChart() {

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        fetchChart();
    }, []);

    const fetchChart = async () => {

        try {

            const response = await API.get(
                "/api/admin/dashboard/monthly-sales"
            );

            const labels = response.data.map(item => item.month);

            const sales = response.data.map(item => item.sales);

            setChartData({

                labels,

                datasets: [

                    {

                        label: "Monthly Sales",

                        data: sales,

                        backgroundColor: "#2563eb"

                    }

                ]

            });

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div
            style={{
                width: "100%",
                background: "#fff",
                padding: "30px",
                borderRadius: "15px",
                marginTop: "40px",
                boxShadow: "0 5px 20px rgba(0,0,0,.08)"
            }}
        >

            <h2
                style={{
                    textAlign: "center",
                    marginBottom: "25px"
                }}
            >
                Monthly Sales
            </h2>

            <Bar data={chartData} />

        </div>

    );

}

export default MonthlySalesChart;