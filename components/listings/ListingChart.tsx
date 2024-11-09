"use client";

import { useCallback, useEffect, useRef } from "react";
import { AverageData } from "@/actions/listings/listingsQueries";

type ListingChartProps = {
  average: AverageData;
};

const ListingChart: React.FC<ListingChartProps> = ({ average }) => {
  const pieEl = useRef<HTMLDivElement>(null);

  const drawChart = useCallback(() => {
    const data = new google.visualization.DataTable();
    const options = {
      title: "The average price of rent for the amount of people in this city",
      width: 600,
      height: 400,
      legend: { position: "bottom" as const, textStyle: { color: "#FFFFFF" } },
      backgroundColor: "#1E1E1E",
      colors: ["#FFA500"],
      titleTextStyle: {
        color: "#FFFFFF",
      },
      hAxis: {
        format: "0",
        title: "The maximum capacity", // Y-axis title
        titleTextStyle: {
          color: "#FFFFFF", // Y-axis title text color
        },
        textStyle: {
          color: "#FFFFFF", // Y-axis tick label text color
        },
      },
      vAxis: {
        format: "0",
        title: "Average Price", // Y-axis title
        titleTextStyle: {
          color: "#FFFFFF", // Y-axis title text color
        },
        textStyle: {
          color: "#FFFFFF", // Y-axis tick label text color
        },
      },
    };

    data.addColumn("number", "Count of maximum guests");
    data.addColumn("number", "Average price");
    const rows = Object.entries(average!).map(([guestCount, averagePrice]) => [
      parseInt(guestCount, 10), // Convert the keys to numbers
      averagePrice,
    ]);
    data.addRows(rows);

    const pieChart = new google.visualization.LineChart(
      pieEl.current as HTMLDivElement
    );

    pieChart.draw(data, options);
  }, [average]);

  useEffect(() => {
    console.log("Component mounted");
    const onLoadCallback = () => {
      // Move the drawChart call here
      drawChart();
    };

    // Load Google Charts library using next/script
    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/charts/loader.js";
    script.async = true;
    script.onload = () => {
      // Load the Google Charts library
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(onLoadCallback);
    };
    document.head.appendChild(script);

    // Cleanup the script tag when the component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, [drawChart]);

  return (
    <section className="relative z-0">
      <div ref={pieEl}></div>
    </section>
  );
};

export default ListingChart;
