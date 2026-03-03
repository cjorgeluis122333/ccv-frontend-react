import api from "../../../lib/axios";
import type { BoardResponse, BoardYear } from "../types/board";

export const getBoardData = async (): Promise<BoardYear[]> => {
    const { data } = await api.get<BoardResponse>("/board");
    return data.data;
};
