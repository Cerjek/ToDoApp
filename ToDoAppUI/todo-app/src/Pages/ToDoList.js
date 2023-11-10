// TodoList.js
import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Trash, Pencil, PlusSquare } from 'react-bootstrap-icons';
import MessageDisplay from './MessageDisplay';
import ErrorMessageDisplay from './ErrorMessageDisplay';
import { setMessage } from '../utils';

const TodoList = () => {
    const [todoItems, setTodoItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState('');

    const nav = useNavigate();

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        
        const fetchTodoItems = async () => {
            try {
                const response = await axios.get(`https://localhost:5001/api/ToDoItem/${userId}/GetItems`);
                setTodoItems(response.data);
                setLoading(false);
            } catch (error) {
                setResponse(`Error fetching todo items: ${error.response.data}`);
                setLoading(false);
            }
        };

        if (userId) {
            fetchTodoItems();
        } else {
            setResponse('User ID not found.');
            setLoading(false);
        }
    }, []); // Empty dependency array ensures the effect runs only once on mount

    const handleCheckboxChange = async (itemId) => {
        try {
            const userId = sessionStorage.getItem('userId');
            // Find the item by ID
            const updatedItems = todoItems.map((item) =>
                item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
            );

            // Update the UI optimistically
            setTodoItems(updatedItems);

            // Make the API call to update the item
            const response = await axios.put('https://localhost:5001/api/ToDoItem', {
                id: itemId,
                name: updatedItems.find((item) => item.id === itemId).name,
                dueDate: updatedItems.find((item) => item.id === itemId).dueDate,
                isCompleted: updatedItems.find((item) => item.id === itemId).isCompleted,
                description: updatedItems.find((item) => item.id === itemId).description,
                userId: userId,
            });
            
            console.log(response);
        } catch (error) {
            console.error('Error updating todo item', error);
        }
    };

    const onLogout = () => {
        sessionStorage.clear();
        nav("/");
    };

    const handleDelete = async (itemId) => {
        try {
            // Make the DELETE request to delete the item
            const response = await axios.delete(`${process.env.REACT_APP_API_DOMAIN}/api/ToDoItem/${itemId}`);

            // Update the UI by removing the deleted item
            setTodoItems((prevItems) => prevItems.filter((item) => item.id !== itemId));

            setMessage(response.data);
        } catch (error) {
            setResponse(`Error deleting todo item: ${error.response.data}`);
        }
    };

    const handleCreate = () => {
        nav(`/edittodoitem`, {state: {}});
    }

    const handleEdit = (item) => {
        //sessionStorage.setItem('editItem', item);
        nav('/edittodoitem', { state: { id: item.id } });
    }

    return (
        <div className="container">
            <MessageDisplay hidden={!response} />
            <ErrorMessageDisplay message={response} />
            <div>
                <h2>ToDo Items List</h2>
                <br />
                {loading ? (
                    <p>Loading...</p>
                ) : (<div className="ns-checkboxes">
                    {todoItems.map((item) => (
                        <div className="ns-checkboxes__item" key={item.id}>
                            <input className="ns-checkboxes__input" id={item.id} name={item.name} type="checkbox" value={item.isCompleted} onChange={() => handleCheckboxChange(item.id)} />
                            <label className="ns-label ns-checkboxes__label" htmlFor={item.id}>
                                <span className="ns-label-span">{item.name}</span>
                            </label>
                            <button onClick={() => handleEdit(item)}>
                                <Pencil />
                            </button>
                            <button onClick={() => handleDelete(item.id)}>
                                <Trash />
                            </button>
                        </div>
                    ))}
                    <div className="alert-block" aria-label="alert" role="alert" hidden={todoItems.length > 0}>
                        <i className="fa fa-info-circle" aria-hidden="true"></i>
                        <div className="alert-message">
                            <p>No items present! Click the + to create a new item!</p>
                        </div>
                    </div>
                </div>
                )
                }
                <button className="btn-lg btn-default" onClick={() => handleCreate()}>
                    <PlusSquare />
                </button> &nbsp;&nbsp;&nbsp;
                <button className="btn-lg btn-default" onClick={onLogout}>Log out</button>
            </div>
        </div>
    );
};

export default TodoList;
