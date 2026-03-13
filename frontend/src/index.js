
import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import MainPageSkeleton from "./components/skeleton/mainPageSkeleton"
const container = document.getElementById('root');
const root = createRoot(container);
const LazyApp = lazy(() => import('./index2'));


document.body.classList.remove(...document.body.classList);
document.body.classList.add(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'theme-light');

root.render(
    <Suspense fallback={<MainPageSkeleton />}>
        <LazyApp />
    </Suspense>
);

reportWebVitals();