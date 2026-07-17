import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactModal from 'react-modal';

import { CrmApp } from './CrmApp';
import './styles.css';

ReactModal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <CrmApp />
);
