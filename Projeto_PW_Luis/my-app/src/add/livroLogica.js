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

    const getCurrentPage = () => {
        const queryParams = qs.parse(props.url?.search || '');
        const current = queryParams.current;
        return current ? Number(current) : 1;
    };

    const getPageSize = () => {
        const queryParams = qs.parse(props.url?.search || '');
        const pageSize = queryParams.pageSize;
        return pageSize ? Number(pageSize) : 5;
    };

    const preferences = getPreferencesUrlToStorage("table");
    const [preferencesStorage, setPreferencesToStorage] = useLocalStorage(preferences, {
        current: preferences[preferencesToStorage.PAGE_TABLE] || 1
    });

    const [data, setData] = useState({
        livro: [],
        pagination: {
            current: getCurrentPage(),
            pageSize: getPageSize(),
            total: 0
        },
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
            const { livro = [], pagination = {} } = response.livro;
            setData({
                livro: livro,
                pagination: {
                    current: current || 1,
                    pageSize: pagination.pageSize || pageSize,
                    total: pagination.total || 0,
                },
            });

            setPreferencesToStorage({
                current: current
            });
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching data:", err);
            setLoading(false);
        });
    };

    const handleTableChange = (pagination, filters, sorter) => {
        const { field, order } = sorter || {};
        console.log('Sorter:', field, order);
        setSortField(field);
        setSortOrder(order);
        fetchApi(pagination.pageSize, pagination.current, field, order);
    };

    useEffect(() => {
        fetchApi(data.pagination.pageSize, data.pagination.current, sortField, sortOrder);
    }, [data.pagination.pageSize, data.pagination.current, sortField, sortOrder]);

    const { livro, pagination } = data;

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
                dataSource={livro}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
            />
        </div>
    );
};

export default LivroLogica;
