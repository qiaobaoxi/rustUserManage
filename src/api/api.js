import axios from 'axios';

let base1 = process.env.NODE_ENV === 'production'? '': '/api'
export const login = params => { return axios.post(`${base1}/login`, params).then(res =>  res.data); };
export const saveUser = params => { return axios.post(`${base1}/saveUser`, params).then(res =>  res.data); };
export const getAllUser = params => { return axios.get(`${base1}/getAllUser`, {params:params}).then(res =>  res.data); };
export const getUser = params => { return axios.get(`${base1}/getUser`, {params:params}).then(res =>  res.data); };
export const updateUser = params => { return axios.post(`${base1}/updateUser`, params).then(res =>  res.data); };
export const deleteUser = params => { return axios.post(`${base1}/deleteUser`, params).then(res =>  res.data); };
export const deleteFile = params => { return axios.post(`${base1}/deleteFile`, params).then(res =>  res.data); };

export const addEquipment = params => { return axios.post(`${base1}/addEquipment`, params).then(res =>  res.data); };
export const getAllEquipment = params => { return axios.get(`${base1}/getAllEquipment`, {params:params}).then(res =>  res.data); };
export const relevanceEquipment = params => { return axios.post(`${base1}/relevanceEquipment`, params).then(res =>  res.data); };
export const deleteUserAssociatedDevice = params => { return axios.post(`${base1}/deleteUserAssociatedDevice`, params).then(res =>  res.data); };
export const downToExcel = params => { return axios.post(`${base1}/downToExcel`, params).then(res =>  res.data); };
export const getEquipmentData = params => { return axios.get(`${base1}/getEquipmentData`, {params:params}).then(res =>  res.data); };
//company
export const saveCompany = params => { return axios.post(`${base1}/saveCompany`, params).then(res =>  res.data); };
export const getAllCompany = params => { return axios.get(`${base1}/getAllCompany`, {params:params}).then(res =>  res.data); };
export const getCompany = params => { return axios.get(`${base1}/getCompany`, {params:params}).then(res =>  res.data); };
export const updateCompany= params => { return axios.post(`${base1}/updateCompany`, params).then(res =>  res.data); };
export const deleteCompany = params => { return axios.post(`${base1}/deleteCompany`, params).then(res =>  res.data); };

export const saveEquipment = params => { return axios.post(`${base1}/saveEquipment`, params).then(res =>  res.data); };
export const deleteEquipment = params => { return axios.post(`${base1}/deleteEquipment`, params).then(res =>  res.data); };
