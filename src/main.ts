import Element from './Element';
import Fragment from './Fragment';
import Store from './store';
import SVGElement from './SVGElement';

export const createRoot = (
    rootElement: HTMLElement,
    app: (string | HTMLElement | DocumentFragment)[] | DocumentFragment
): void => {
    if (Array.isArray(app)) {
        rootElement.append(...app);
    } else {
        rootElement.appendChild(app);
    }
};

export {
    Element,
    Store,
    Fragment,
    SVGElement
};
