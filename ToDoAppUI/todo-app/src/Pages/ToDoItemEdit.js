// TodoEdit.js
import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import '../salitre.css';
import '../input-field-group.css';
import '../global-form-styles.css';
import { setMessage } from '../utils';
import ErrorMessageDisplay from './ErrorMessageDisplay';

const ToDoItemEdit = () => {

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        dueDateDay: '',
        dueDateMonth: '',
        dueDateYear: '',
        isCompleted: false,
    });
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState('');

    const nav = useNavigate();
    const loc = useLocation();

    useEffect(() => {
        const fetchToDoItem = async () => {
            const userId = sessionStorage.getItem('userId');
            const itemId = loc.state.id;
            
            if(itemId)
            {   
                const response = await axios.get(`${process.env.REACT_APP_API_DOMAIN}/api/ToDoItem/${userId}/GetItem/${itemId}`);
                const itemObj = response.data;

                setFormData({
                    ...formData,
                    name: itemObj.name,
                    description: itemObj.description,
                    isCompleted: itemObj.isCompleted,
                });

                if (itemObj.dueDate) {
                    let dueDate = new Date(itemObj.dueDate);
                    setFormData({
                        ...formData,
                        dueDateDay: dueDate.getDay(),
                        dueDateMonth: dueDate.getMonth(),
                        dueDateYear: dueDate.getFullYear(),
                    })
                }

            }            
            setLoading(false);
        };
        fetchToDoItem();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCheckboxChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.checked,
        });
    };

    const getDueDate = () => {
        let dueDate;
        if (formData.dueDateDay && formData.dueDateMonth && formData.dueDateYear) {
            dueDate = new Date(`${formData.dueDateYear}-${formData.dueDateMonth}-${formData.dueDateDay}`);

            if (!isNaN(dueDate.getTime())) {
                dueDate = null;
            }
        }
        return dueDate;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            const itemId = loc.state.id;
            const userId = sessionStorage.getItem('userId');

            if (itemId) {
                const updateObj = {
                    id: itemId,
                    name: formData.name,
                    description: formData.description,
                    dueDate: getDueDate(),
                    userId: userId,
                    isCompleted: formData.isCompleted,
                };
                // Make the PUT request to update the item
                response = await axios.put(`${process.env.REACT_APP_API_DOMAIN}/api/ToDoItem`, updateObj);
            }
            else {
                const updateObj = {
                    name: formData.name,
                    description: formData.description,
                    dueDate: getDueDate(),
                    isCompleted: formData.isCompleted,
                    userId: userId,
                };
                // Make the POST request to create the item
                response = await axios.post(`${process.env.REACT_APP_API_DOMAIN}/api/ToDoItem`, updateObj);
            }
            setMessage(response.data);
            // Leave the edit form
            nav('/todoitems');
        } catch (error) {
            setResponse(`Error updating todo item: ${error.response.data}`);
        }
    };

    return (
        <div className="container">            
        <ErrorMessageDisplay message={response}/>
        {loading ? (
            <p>Loading...</p>
        ) : (
            <div>
            <h2>Edit Todo Item</h2>
            <form onSubmit={handleSubmit}>
                <label className="ns-label" htmlFor="name">
                    Name:
                </label>
                <div id="name-hint" className="ns-hint">
                    Please enter a short name for your item.
                </div>
                <input className="ns-input fw-30" id="name" type="text" name="name" value={formData.name} onChange={handleChange} />
                <br />
                <br />
                <label className="ns-label" htmlFor="description">
                    Description:
                </label>
                <div id="description-hint" className="ns-hint">
                    Please enter a description for your item.
                </div>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} />
                <br />
                <br />
                <div className="ns-form-group">
                    <fieldset className="ns-form-group" aria-describedby="fieldset-hint2">
                        <legend className="ns-fieldset__legend noBorder label">Due Date</legend>
                        <div id="fieldset-hint2" className="ns-hint">Enter Day Month Year. For example, 17 11 2020.</div>
                        <div className="row">
                            <div className="col-auto pr-0">
                                <label className="ns-label" htmlFor="dueDateDay">DD</label>
                                <input type="text" id="dueDateDay" name="dueDateDay" className="ns-input fw-2" pattern="[0-9]*" inputMode="numeric" maxLength="2" value={formData.dueDateDay} onChange={handleChange}></input>
                            </div>
                            <div className="col-auto pr-0">
                                <label className="ns-label" htmlFor="dueDateMonth">MM</label>
                                <input type="text" id="dueDateMonth" name="dueDateMonth" className="ns-input fw-2" pattern="[0-9]*" inputMode="numeric" maxLength="2" value={formData.dueDateMonth} onChange={handleChange}></input>
                            </div>
                            <div className="col-auto">
                                <label className="ns-label" htmlFor="dueDateYear">YYYY</label>
                                <input type="text" id="dueDateYear" name="dueDateYear" className="ns-input fw-4" pattern="[0-9]*" inputMode="numeric" maxLength="4" value={formData.dueDateYear} onChange={handleChange}></input>
                            </div>
                        </div>
                    </fieldset>
                </div>
                <br />
                <div className="ns-checkboxes__item">
                    <input className="ns-checkboxes__input" id="completed" name="completed" type="checkbox" value={formData.isCompleted} onChange={handleCheckboxChange} />
                    <label className="ns-label ns-checkboxes__label" htmlFor="completed">
                        <span className="ns-label-span">Completed</span>
                    </label>
                </div>
                <br />
                <button className="btn-lg btn-default" type="submit">Save</button> &nbsp;&nbsp;&nbsp;
                <button className="btn-lg btn-default" type="button" onClick={() => nav('/todoitems')}>Cancel</button>
            </form>
            </div>)}
        </div>
    );
};

export default ToDoItemEdit;
