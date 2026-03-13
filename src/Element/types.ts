export type HTMLTags = keyof HTMLElementTagNameMap;

export type HTMLElementTags = HTMLElementTagNameMap[HTMLTags];

export type Tags = HTMLElementTagNameMap[HTMLTags];

export type Children = string | ChildNode | undefined | null | DocumentFragment | HTMLElement;

type Handlers = Omit<GlobalEventHandlers, 'addEventListener' | 'removeEventListener'>;

export type EventType<T extends HTMLElement> = {
    [K in keyof Handlers]?: Handlers[K] extends ((this: T, ev: infer E) => void) | null
        ? (ev: E) => void
        : never;
};

export type Dataset = Record<`data-${string}`, string>;

export type ElementPropsType<T extends HTMLElementTags = HTMLElement>
    = Omit<Partial<T>, 'children' | 'className' | 'style'> & Dataset & {
        children?: (Children)[] | undefined;
        className?: string | undefined;
        events?: EventType<T>;
        style?: Partial<CSSStyleDeclaration> | undefined;
        key?: string;
        includeKey?: string;
    };

export interface ElementConstructorType<T extends HTMLElementTags> {
    tagName: HTMLTags;
    props: ElementPropsType<T>;
    rootElement?: HTMLElement | null;
}

