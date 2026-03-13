import './style.css'
import { createRoot } from '../../src/main.ts';
import App from './root.ts';

const root = document.getElementById('app');

createRoot(root!, App());
