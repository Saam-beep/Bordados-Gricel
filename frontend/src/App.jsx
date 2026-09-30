import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import { Login, Register } from './pages/Auth';
import CustomerPortal from './pages/CustomerPortal';
import NewOrder from './pages/NewOrder';
import OrderDetail from './pages/OrderDetail';
import Admin from './pages/Admin';

export default function App(){return <BrowserRouter><Layout><Routes><Route path="/" element={<Home/>}/><Route path="/login" element={<Login/>}/><Route path="/registro" element={<Register/>}/><Route path="/portal" element={<ProtectedRoute><CustomerPortal/></ProtectedRoute>}/><Route path="/nuevo-pedido" element={<ProtectedRoute><NewOrder/></ProtectedRoute>}/><Route path="/pedido/:id" element={<ProtectedRoute><OrderDetail/></ProtectedRoute>}/><Route path="/admin" element={<ProtectedRoute admin><Admin/></ProtectedRoute>}/></Routes></Layout></BrowserRouter>}
