import React, { useState, useEffect } from "react";
import { Table, Select } from 'antd';
import './reservaLogica.css';

const { Option } = Select;

const ReservaLogica = (props) => {
    const columns = [
        {
            title: "Utilizador",
            dataIndex: "utilizador",
            key: "utilizador",
            sorter: true,
            render: (text, record) => record.utilizador.nome,
        },
        {
            title: "Livro",
            dataIndex: "livro",
            key: "livro",
            sorter: true,
            render: (text, record) => record.livro.titulo,
        },
        { title: "Data Reserva", dataIndex: "dataReserva", key: "dataReserva", sorter: true },
        { title: "Data Vencimento", dataIndex: "dataVencimento", key: "dataVencimento", sorter: true },
        { title: "Data Devolucao", dataIndex: "dataDevolucao", key: "dataDevolucao", sorter: true },
        { title: "Status", dataIndex: "status", key: "status", sorter: true },
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
            setData(response);
            setPagination({
                current: current,
                pageSize: pageSize,
                total: response.length, 
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
                <Option value="utilizador">Utilizador</Option>
                <Option value="livro">Livro</Option>
                <Option value="dataReserva">Data Reserva</Option>
                <Option value="dataVencimento">Data Vencimento</Option>
                <Option value="dataDevolucao">Data Devolucao</Option>
                <Option value="status">Status</Option>
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
