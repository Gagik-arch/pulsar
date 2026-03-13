import { mergeAttributes, setupInnerHtml } from '../utils';
import type {
    Children
} from './types';

function keyedDiff(dom: HTMLElement, newChildren: HTMLElement[]) {
    const children = [ ...dom.children ];
    const oldKeys = children.map(c => c.getAttribute('key'));
    const newKeys = newChildren.map(c => c.getAttribute('key'));

    children.forEach(child => {
        if (!newKeys.includes(child.getAttribute('key'))) {
            child.remove();
        }
    });

    for (let i = 0; i < newChildren.length; i++) {
        const newChild = newChildren[i];
        const oldChild = dom.children[i] as HTMLElement;

        if (!oldKeys.includes(newChild.getAttribute('key'))) {
            dom.insertBefore(newChild, dom.children[i]);
        } else {
            if (!oldChild.isEqualNode(newChild)) { 
                setupInnerHtml(oldChild, newChild);
                mergeAttributes(oldChild, newChild);
            } 
        }
    }
}

function unKeyedDiff(dom: HTMLElement, newChildren: HTMLElement[]) {
    const oldChildren = Array.from(dom.childNodes);

    const max = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < max; i++) {
        const oldNode = oldChildren[i] as HTMLElement | undefined;
        const newNode = newChildren[i] as HTMLElement | undefined;

        if (!oldNode && newNode) {
            dom.append(newNode);
        } else if (oldNode && !newNode) {
            dom.removeChild(oldNode);
        } else if (
            oldNode
            && newNode
            && oldNode.nodeType === Node.ELEMENT_NODE
            && !oldNode.isEqualNode(newNode)
        ) {
            oldNode.replaceWith(newNode);
        }
    }
}

export function setupChildren<T extends HTMLElement>(
    children: ((childNodes: Set<ChildNode>) => Set<ChildNode>) | Children[] | undefined,
    dom: T,
    isForceUpdate: boolean
) {
    if (children) {
        const newChildren
            = typeof children === 'function'
                ? Array.from(children(new Set(dom.childNodes)))
                : children;

        const extracted = newChildren.filter(Boolean) as HTMLElement[];

        if (isForceUpdate) {
            dom.replaceChildren(...extracted);
        } else {
            const isAvailableKey = [ ...dom.children ][0]?.getAttribute('key');

            if (isAvailableKey) {
                keyedDiff(dom, extracted); //  NOTE: key in element
            } else { //  NOTE: not key in element
                unKeyedDiff(dom, extracted);
            }
        }
    }
}
