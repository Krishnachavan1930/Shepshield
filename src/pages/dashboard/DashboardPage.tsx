
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import DashboardHome from './DashboardHome';
import PatientsList from './patients/PatientsList';
import PatientsAdd from './patients/PatientsAdd';
import PatientView from './patients/PatientView';
import Analytics from './Analytics';
import Settings from './Settings';
import NotFound from '../NotFound';
import UploadReports from './UploadReports';
import Monitoring from './Monitoring';
import HelpSupport from './HelpSupport';

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="patients" element={<PatientsList />} />
        <Route path="patients/add" element={<PatientsAdd />} />
        <Route path="patients/:id" element={<PatientView />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="upload" element={<UploadReports />} />
        <Route path="monitoring" element={<Monitoring />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<HelpSupport />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardPage;
