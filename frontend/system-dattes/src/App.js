import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Login from './componentLogin/PageLogin';
import SignUp from './componentLogin/PageSIngUp';

import Ajouter from './componentprincipale/ajouterProduit';
import Funmigation from './componentprincipale/funmigation';
import Stockage from './componentprincipale/stockage';
import StockageEntre from './componentprincipale/stockage entree';
import Triage from './componentprincipale/triage';

import TableProduit from './consulter de produit/table produit';
import TableFumigation from './consulter de produit/tableFumigation';
import TableChambre1 from './consulter de produit/table chambre 1';
import TableTriage from './consulter de produit/table de triage';
import Fournisseur from './componentprincipale/fournisseurs';
import TableFournisseur from './consulter de produit/table fournisseur';
import StockageSortie from './componentprincipale/stockage sortie';
import Tablechambre2 from './consulter de produit/tablechambre2';
import Tablechambre3 from './consulter de produit/table chambre3';
import Consulter from './componentprincipale/consulter';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />

                <Route path="/ajouter" element={<MainLayout><Ajouter /></MainLayout>} />
                <Route path="/fumigation" element={<MainLayout><Funmigation /></MainLayout>} />
                <Route path="/stockage" element={<MainLayout><Stockage /></MainLayout>} />
                <Route path="/stockageEntre" element={<MainLayout><StockageEntre /></MainLayout>} />
                <Route path="/triage" element={<MainLayout><Triage /></MainLayout>} />

                <Route path="/tabletriage" element={<MainLayout><TableTriage /></MainLayout>} />
                <Route path="/tableproduit" element={<MainLayout><TableProduit /></MainLayout>} />
                <Route path="/tablefumigation" element={<MainLayout><TableFumigation /></MainLayout>} />
                <Route path="/tablechambre1" element={<MainLayout><TableChambre1 /></MainLayout>} />
                <Route path="/fournisseurs" element={<MainLayout><Fournisseur /></MainLayout>} />
                <Route path="/tablefournisseur" element={<MainLayout><TableFournisseur /></MainLayout>} />
                <Route path="/stockagesortie" element={<MainLayout><StockageSortie /></MainLayout>} />
                <Route path="/tablechambre2" element={<MainLayout><Tablechambre2 /></MainLayout>} />
                <Route path="/tablechambre3" element={<MainLayout><Tablechambre3 /></MainLayout>} />
                <Route path="/consulter" element={<MainLayout><Consulter /></MainLayout>} />
            </Routes>
        </Router>
    );
}

export default App;
