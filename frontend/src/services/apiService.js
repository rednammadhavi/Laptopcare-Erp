import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    timeout: 5000,
});

export const apiService = {
    setToken: (token) => {
        if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        else delete api.defaults.headers.common["Authorization"];
    },
    getCustomers: async () => {
        return new Promise((res) =>
            setTimeout(
                () =>
                    res({
                        data: [
                            { id: "c1", name: "D S NARAYANA & CO PVT LTD", phone: "9000000000" },
                            { id: "c2", name: "D KESHAVA RAO", phone: "9000000001" },
                        ],
                    }),
                400
            )
        );
    },
};
