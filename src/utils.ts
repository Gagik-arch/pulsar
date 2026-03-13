export function camelToKebab(str: string) {
    return str.replace(/[A-Z]/g, match => '-' + match.toLowerCase());
}

export function setupClassName(
    className?: ((classList: DOMTokenList) => void) | string | undefined,
    dom?: Element
) {
    if (!dom || !className) return;

    if (typeof className === 'function') {
        className(dom.classList);
    } else {
        if (dom.className !== className) {
            dom.className = className;
        }
    }
}


export function setupInnerHtml(
    oldChild: HTMLElement,
    newChild: HTMLElement
) {
    if (oldChild.innerHTML !== newChild.innerHTML) {
        oldChild.innerHTML = newChild.innerHTML
    }
}

export function setupStyle(
    style: HTMLElement['style'] | undefined,
    dom: HTMLElement
) {
    if (!style || !dom) return;

    Object.entries(style)
        .forEach(([
            property,
            value
        ]) => {
            if (!value) return;

            dom.style.setProperty(camelToKebab(property), value.toString());
        });
}

export const isObject = (val: unknown): val is Record<string, unknown> => val !== null && typeof val === 'object';

export const isPlainObject = (val: unknown): val is Record<string, unknown> => Object.prototype.toString.call(val) === '[object Object]';

export const isEqualObjects = (a: unknown, b: unknown): boolean => {
    if (Object.is(a, b)) return true;

    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((v, i) => isEqualObjects(v, b[i]));
    }

    if (isPlainObject(a) && isPlainObject(b)) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        if (keysA.length !== keysB.length) return false;

        for (const key of keysA) {
            if (!Object.prototype.hasOwnProperty.call(b, key)) {
                return false;
            }
            if (!isEqualObjects(a[key], b[key])) return false;
        }

        return true;
    }

    return false;
};

export function mergeAttributes(
    oldChild: HTMLElement,
    newChild: HTMLElement
) {
    for (let i = 0; i < newChild.getAttributeNames().length; i++) {
        const oldChildAtt = oldChild.attributes[i]
        const newChildAtt = newChild.attributes[i]
        if (oldChildAtt.name === newChildAtt.name && oldChildAtt.value !== newChildAtt.value) {
            oldChild.setAttribute(oldChildAtt.name, newChildAtt.value)
        }
    }
}