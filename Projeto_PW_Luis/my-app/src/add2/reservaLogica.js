import React, { useState, useEffect } from "react";
import { Table, Select } from 'antd';
import qs from 'query-string';
import './reservaLogica.css';
import { useLocalStorage } from 'react-use-storage';
import { getPreferencesUrlToStorage, preferencesToStorage } from './utilis/localStorage';

const { Option } = Select;

const ReservaLogica = (props) => {
    const columns = [
        { title: "utilizador", dataIndex: "utilizador", key: "utilizador", sorter: true },
        { title: "livro", dataIndex: "livro", key: "livro", sorter: true },
        { title: "dataReserva", dataIndex: "dataReserva", key: "dataReserva", sorter: true },
        { title: "dataVencimento", dataIndex: "dataVencimento", key: "dataVencimento", sorter: true },
        { title: "dataDevolucao", dataIndex: "dataDevolucao", key: "dataDevolucao", sorter: true },
        { title: "status", dataIndex: "status", key: "status", sorter: true },
    ];

    const [loading, setLoading] = useState(true);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchApi = (pageSize, current, sortField, sortOrder) => {
        setLoading(true);
        const url = `/reservas/reserva?limit=${pageSize}&skip=${(current - 1) * pageSize}&sort=${sortField}&order=${sortOrder}`;

        fetch(url, {
            headers: { Accept: "application/json" },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((response) => {
            console.log('Response:', response);
            // Directly use response since it's an array of books
            const reserva = response;
            setData(reserva);
            setPagination({
                current: current,
                pageSize: pageSize,
                total: reserva.length, // Assuming response length for total (this might need to be adjusted)
            });
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching data:", err);
            setLoading(false);
        });
    };

    const handleTableChange = (pagination, filters, sorter) => {
        const { field, order } = sorter;
        setSortField(field);
        setSortOrder(order);
        fetchApi(pagination.pageSize, pagination.current, field, order);
    };

    useEffect(() => {
        fetchApi(pagination.pageSize, pagination.current, sortField, sortOrder);
    }, [pagination.current, pagination.pageSize, sortField, sortOrder]);

    return (
        <div>
            <Select
                style={{ marginBottom: 16 }}
                placeholder="Sort By"
                onChange={(value) => setSortField(value)}
                value={sortField}
            >
                <Option value="utilizador">utilizador</Option>
                <Option value="livro">livro</Option>
                <Option value="dataReserva">dataReserva</Option>
                <Option value="dataVencimento">dataVencimento</Option>
                <Option value="dataDevolucao">dataDevolucao</Option>
                <Option value="status">status</Option>
            </Select>
            <Table
                columns={columns}
                rowKey={(record) => record._id}
                dataSource={data}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
            />
        </div>
    );
};

export default ReservaLogica;
