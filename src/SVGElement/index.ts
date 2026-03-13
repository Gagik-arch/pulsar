import type {
    SVGElementConstructorType, SVGTags, SVGElementPropsType
} from './types';

const svgNS = 'http://www.w3.org/2000/svg';

class SVGElement <T extends SVGTags > {
    public dom: T;
    public key?: string | number | undefined = undefined;

    public constructor({
        tagName,
        props: {
            children,
            className,
            style,
            ...props
        },
        rootElement,
    }: SVGElementConstructorType) {
        this.dom = document.createElementNS(svgNS, tagName) as T;

        if (rootElement) {
            rootElement.appendChild(this.dom);
        }

        this.setProps(
            {
                className,
                children,
                style,
                ...props,
            }
        );
    }

    public setProps(
        {
            className,
            children,
            style,
            ...props
        }: SVGElementConstructorType['props']
    ) {
        if (className) {
            this.dom.setAttribute('class', className);
        }

        if (children) {
            this.dom.replaceChildren(...children);
        }

        Object.entries(props)
            .forEach(([
                name,
                value
            ]) => {
                this.dom.setAttribute(name, value as string);
            });

        return this;
    }

    public onMount(callback: (e:this) => void) {
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

    public onUnMount(callback:(e:this)=>void) {
        const observer = new MutationObserver(() => {
            if (!document.body.contains(this.dom)) {
                callback(this);
            }
        });

        observer.observe(document.body, {
            childList: true, subtree: true,
        });

        return this;
    }
}

export type { SVGElementPropsType };

export default SVGElement;
