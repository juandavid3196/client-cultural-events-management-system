import axios from 'axios';

const BASE_URL = 'http://localhost:8007/api';

const createItem = async (resource, data) => {
    try {
        const response = await axios.post(`${BASE_URL}/${resource}`, data);
        console.log(response);
        return response;
    } catch (error) {
        throw error;
    }
};

const fetchItems = async (resource) => {
    try {
        const response = await axios.get(`${BASE_URL}/${resource}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const fetchItemById = async (resource, id) => {
    try {
        const response = await axios.get(`${BASE_URL}/${resource}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateItem = async (resource, id, data) => {
    try {
        const response = await axios.patch(`${BASE_URL}/${resource}/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteItem = async (resource, id) => {

    const confirm = window.confirm("¿Esta seguro de eliminar este elemento?");

    if (confirm) {
        try {
            const response = await axios.delete(`${BASE_URL}/${resource}/${id}`);
            return true;
        } catch (error) {
            throw error;
        }
    } else {
        return false;
    }
};

export default {
    createItem,
    fetchItems,
    fetchItemById,
    updateItem,
    deleteItem,
};
