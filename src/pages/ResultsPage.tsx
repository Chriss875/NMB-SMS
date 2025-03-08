import React from 'react';
import MainLayout from '../components/layout/MainLayout';

const ResultsPage: React.FC = () => {
  return (
    <MainLayout>
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Academic Results</h1>
      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-500 text-center py-8">
          No results have been uploaded yet. Your semester results will appear here when available.
        </p>
      </div>
    </MainLayout>
  );
};

export default ResultsPage;