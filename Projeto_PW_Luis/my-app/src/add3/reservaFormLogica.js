import React, { useState } from "react";
import { Select, Button, Form, Input } from 'antd';
import './reservaFormLogica.css';

const { Option } = Select;

const ReservaFormLogica = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

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
        })
        .catch((error) => {
            console.error('Error:', error);
            setLoading(false);
        });
    };

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
        </div>
    );
};

export default ReservaFormLogica;
