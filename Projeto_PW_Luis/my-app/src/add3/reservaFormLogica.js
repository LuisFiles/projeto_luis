import React, { useState, useEffect } from "react";
import { Table, Select, Button, Form, Input } from 'antd';
import './reservaFormLogica.css';

const { Option } = Select;

const ReservaFormLogica = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchReservas = (pageSize, current, sortField, sortOrder) => {
        setLoading(true);
        const url = `/api/reserva?limit=${pageSize}&skip=${(current - 1) * pageSize}&sort=${sortField}&order=${sortOrder}`;

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
                total: response.length, // Adjust this based on actual total count from API
            });
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching data:", err);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchReservas(pagination.pageSize, pagination.current, sortField, sortOrder);
    }, [pagination.current, pagination.pageSize, sortField, sortOrder]);

    const handleTableChange = (pagination, filters, sorter) => {
        const { field, order } = sorter;
        setSortField(field);
        setSortOrder(order);
        fetchReservas(pagination.pageSize, pagination.current, field, order);
    };

    const handleSubmit = (values) => {
        setLoading(true);
        fetch('/api/reserva', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(values)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            form.resetFields();
            setLoading(false);
            fetchReservas(pagination.pageSize, pagination.current, sortField, sortOrder);
        })
        .catch((error) => {
            console.error('Error:', error);
            setLoading(false);
        });
    };

    const columns = [
        { title: "Utilizador", dataIndex: ["utilizador", "nome"], key: "utilizador", sorter: true },
        { title: "Livro", dataIndex: ["livro", "titulo"], key: "livro", sorter: true },
        { title: "Data Reserva", dataIndex: "dataReserva", key: "dataReserva", sorter: true },
        { title: "Data Vencimento", dataIndex: "dataVencimento", key: "dataVencimento", sorter: true },
        { title: "Data Devolucao", dataIndex: "dataDevolucao", key: "dataDevolucao", sorter: true },
        { title: "Status", dataIndex: "status", key: "status", sorter: true },
    ];

    return (
        <div className="form-container">
            <Form
                form={form}
                className="form"
                onFinish={handleSubmit}
            >
                <h2>Registar Reserva</h2>
                <Form.Item
                    label="Utilizador"
                    name="utilizador"
                    rules={[{ required: true, message: 'Por favor, insira o ID do utilizador!' }]}
                >
                    <Input placeholder="Nome do Utilizador" />
                </Form.Item>
                <Form.Item
                    label="Livro"
                    name="livro"
                    rules={[{ required: true, message: 'Por favor, insira o ID do livro!' }]}
                >
                    <Input placeholder="Titulo do Livro" />
                </Form.Item>
                <Form.Item
                    label="Data de Reserva"
                    name="dataReserva"
                    rules={[{ required: true, message: 'Por favor, insira a data de reserva!' }]}
                >
                    <Input type="date" />
                </Form.Item>
                <Form.Item
                    label="Data de Vencimento"
                    name="dataVencimento"
                    rules={[{ required: true, message: 'Por favor, insira a data de vencimento!' }]}
                >
                    <Input type="date" />
                </Form.Item>
                <Form.Item
                    label="Data de Devolução"
                    name="dataDevolucao"
                    rules={[{ required: true, message: 'Por favor, insira a data de devolução!' }]}
                >
                    <Input type="date" />
                </Form.Item>
                <Form.Item
                    label="Status"
                    name="status"
                >
                    <Select
                        placeholder="Status"
                        onChange={(value) => form.setFieldsValue({ status: value })}
                        value={form.getFieldValue('status')}
                    >
                        <Option value="reservado">Reservado</Option>
                        <Option value="emprestado">Emprestado</Option>
                        <Option value="devolvido">Devolvido</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Registar Reserva
                    </Button>
                </Form.Item>
            </Form>
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

export default ReservaFormLogica;
