import api from '../../../api/axios';

export const getPortfolioOverview = () => api.get('/api/v1/dashboard/StartInSeconds');

export const getPerformanceData = () => api.get('/api/v1/dashboard/ControlInvestment');

export const getPotentialData = () => api.get('/api/v1/dashboard/MeasurePotential');

export const getDiversificationData = (type) =>
  api.get(`/api/v1/dashboard/ManageDiversification/${type}`);

export const getRiskAssessment = () =>
  api.get('/api/v1/dashboard/RiskAssessment', {
    timeout: 15000,
  });

export const getBalanceData = () => api.get('/api/v1/dashboard/Trade/Balance');
