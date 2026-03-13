import './style.css'
import { createRoot } from 'pulsar';
import App from './root.ts';

const root = document.getElementById('app');

createRoot(root!, App());
