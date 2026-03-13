import type {
    ElementPropsType, ElementConstructorType, HTMLElementTags, EventType,
    Children
} from './types';
import {
    setupClassName, setupStyle
} from '../utils';
import { setupChildren } from './utils';

class Element<T extends HTMLElementTags> {
    public dom: T;
    readonly #events: EventType<T> = {};

    public constructor({
        tagName,
        props: {
            children,
            className,
            style,
            events,
            key,
            ...props
        },
        rootElement,
    }: ElementConstructorType<T>) {
        this.dom = document.createElement(tagName) as T;
        
        if (key) {
            this.dom.setAttribute('key', key);
        }

        if (rootElement) {
            rootElement.appendChild(this.dom);
        }

        if (events) {
            this.#events = events;
        }

        this.setProps(
            {
                className,
                children,
                style,
                ...props,
            } as Omit<ElementPropsType<T>, 'className' | 'children'> & {
                className?: ((classList: DOMTokenList) => void) | string | undefined;
                children?: ((childNodes: Set<ChildNode>) => Set<ChildNode>) | Children[] | undefined;
            }
        );

        Object.entries<EventType<T>[keyof EventType<T>]>(this.#events)
            .forEach(([
                type,
                listener
            ]) => {
                const event = type.replace('on', '');

                this.dom.addEventListener(event, listener as EventListener);
            });
    }

    public setProps(
        {
            className,
            children,
            style,
            ...props
        }: Omit<ElementPropsType<T>, 'className' | 'children'> & {
            className?: ((classList: DOMTokenList) => void) | string | undefined;
            children?: ((childNodes: Set<ChildNode>) => Set<ChildNode>) | Children[] | undefined;
        },
        isForceUpdate = false
    ) {
        setupClassName(className, this.dom);
        setupStyle(style, this.dom);
        setupChildren(children, this.dom, isForceUpdate);

        Object.entries(props)
            .forEach(([
                name,
                value
            ]) => {
                if ( typeof value !== 'function' && this.dom[name as keyof T] !== value) {
                    this.dom.setAttribute(name, value as string);
                    this.dom[name as keyof T] = value;
                }
            });

        return this;
    }

    public replaceChild(index: number, newChild: null | undefined | HTMLElement | string) {
        const oldChild = this.dom.childNodes[index] as (ChildNode | undefined);

        if (oldChild === newChild) return;

        if (!newChild) {
            if (index > -1 && oldChild) this.dom.removeChild(oldChild);
        } else {
            if (oldChild !== undefined) {
                oldChild.replaceWith(newChild);
            } else {
                this.dom.append(newChild);
            }
        }
    }

    public remove() {
        this.dom.remove();
    }

    public onMount(callback: (e: this) => void) {
        const check = () => {
            if (document.body.contains(this.dom)) {
                callback(this);
            } else {
                requestAnimationFrame(check);
            }
        };

        check();
        
        return this;
    }

    public onUnMount(callback: (e: this) => void) {
        const observer = new MutationObserver(() => { 
            if (!document.body.contains(this.dom)) {
                callback(this);

                Object.entries<EventType<T>[keyof EventType<T>]>(this.#events)
                    .forEach(([
                        type,
                        listener
                    ]) => {
                        this.dom.removeEventListener(type, listener as EventListener);
                    });

                observer.disconnect();
            }
        });

        observer.observe(document.body, { //  FIX: check observer  change document.body to this.dom
            childList: true, subtree: true,
        });

        return this;
    }
}

export type { ElementPropsType };

export default Element;
