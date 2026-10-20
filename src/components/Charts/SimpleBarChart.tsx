import { useEffect, useRef, useState } from "react";
import LeftArrow from "../assets/../../assets/icons/LeftArrow.svg?react";
import RightArrow from "../assets/../../assets/icons/RightArrow.svg?react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ButtonIcon from "../IconButton";

interface BarChartDataItem {
  name: string;
  value: number;
}

interface SimpleBarChartProps {
  data: BarChartDataItem[];
}

export default function SimpleBarChart({ data }: SimpleBarChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [isCompact, setIsCompact] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) {
      return;
    }

    const updateLayout = () => {
      setIsCompact(container.clientWidth < 520);
    };

    updateLayout();

    const observer = new ResizeObserver(updateLayout);
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  const activePage = isCompact ? Math.min(currentPage, totalPages - 1) : 0;

  const chartData = isCompact
    ? data.slice(activePage * itemsPerPage, (activePage + 1) * itemsPerPage)
    : data;

  const showPageControl = isCompact && totalPages > 1;
  const isLastPage = activePage === totalPages - 1;

  const handlePageControlClick = () => {
    if (isLastPage) {
      setCurrentPage((previousPage) => Math.max(previousPage - 1, 0));
      return;
    }

    setCurrentPage((previousPage) =>
      Math.min(previousPage + 1, totalPages - 1),
    );
  };

  return (
    <div
      ref={chartContainerRef}
      className="relative w-full h-60 rounded-lg pt-2 **:outline-none"
      tabIndex={-1}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 18, left: -8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#fff" }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#fff" }}
          />

          <Tooltip
            cursor={false}
            contentStyle={{
              backgroundColor: "#1f1f1f",
              border: "1px solid #307b90",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "12px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.25)",
            }}
            labelStyle={{
              color: "#fff",
              fontWeight: 600,
            }}
            itemStyle={{
              color: "#8ccfe0",
            }}
          />

          <Bar dataKey="value" fill="#8ccfe0" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {showPageControl && (
        <ButtonIcon
          size="md"
          variant="chartPagination"
          icon={isLastPage ? LeftArrow : RightArrow}
          className={`absolute top-1/2 -translate-y-1/2 z-10 ${
            isLastPage ? "-left-3.5" : "-right-4.5"
          }`}
          aria-label={isLastPage ? "Página anterior" : "Próxima página"}
          onClick={handlePageControlClick}
        />
      )}
    </div>
  );
}
