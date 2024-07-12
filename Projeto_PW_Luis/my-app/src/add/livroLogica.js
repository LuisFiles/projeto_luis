import React, { useState, useEffect } from "react";
import { Table, Select } from 'antd';
import qs from 'query-string';
import './livroLogica.css';
import { useLocalStorage } from 'react-use-storage';
import { getPreferencesUrlToStorage, preferencesToStorage } from './utilis/localStorage';

const { Option } = Select;

const LivroLogica = (props) => {
    const columns = [
        { title: "titulo", dataIndex: "titulo", key: "titulo", sorter: true },
        { title: "autor", dataIndex: "autor", key: "autor", sorter: true },
        { title: "ano", dataIndex: "ano", key: "ano", sorter: true },
        { title: "categoria", dataIndex: "categoria", key: "categoria", sorter: true },
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
        const url = `/api/livro?limit=${pageSize}&skip=${(current - 1) * pageSize}&sort=${sortField}&order=${sortOrder}`;

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
            const livro = response;
            setData(livro);
            setPagination({
                current: current,
                pageSize: pageSize,
                total: livro.length, // Assuming response length for total (this might need to be adjusted)
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
                <Option value="titulo">titulo</Option>
                <Option value="autor">autor</Option>
                <Option value="ano">ano</Option>
                <Option value="categoria">categoria</Option>
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

export default LivroLogica;
