import { useEffect, useState } from "react";
import type { BoardYear } from "../types/board";
import { getBoardData } from "../service/boardService";

export const useBoard = () => {
    const [boards, setBoards] = useState<BoardYear[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                setLoading(true);
                const data = await getBoardData();
                setBoards(data);
                if (data.length > 0) {
                    // Default to the most recent year
                    const latestYear = Math.max(...data.map((b) => b.year));
                    setSelectedYear(latestYear);
                }
            } catch (err) {
                console.error("Error fetching board data:", err);
                setError("Error al cargar los datos de la junta directiva.");
            } finally {
                setLoading(false);
            }
        };

        fetchBoard();
    }, []);

    const selectedBoard = boards.find((b) => b.year === selectedYear) || null;
    const availableYears = boards.map((b) => b.year).sort((a, b) => b - a);

    return {
        boards,
        loading,
        error,
        selectedYear,
        setSelectedYear,
        selectedBoard,
        availableYears,
    };
};
