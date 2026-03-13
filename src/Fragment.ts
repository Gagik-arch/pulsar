function Fragment(children: (HTMLElement | SVGElement | string)[]) { 
    const fragment = document.createDocumentFragment();
    fragment.append(...children);
    return fragment;
}

export default Fragment;
