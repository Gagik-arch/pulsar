
import { Store, Element } from '../../src/main';

function App() {
    const store = new Store<string[]>([])

    const input = new Element<HTMLInputElement>({
        tagName: 'input',
        props: {
            name: 'input',
        }
    });

    return (
        [

            new Element<HTMLDivElement>({
                tagName: 'div',
                props: {
                    children: [
                        input.dom,


                        new Element<HTMLButtonElement>({
                            tagName: 'button',
                            props: {
                                children: ['click'],
                                events: {
                                    onclick: (e) => {
                                    }
                                }
                            }
                        }).dom,
                    ]
                }
            }).dom,

            new Element<HTMLDivElement>({
                tagName: 'div',
                props: {
                    children: [
                        new Element<HTMLDivElement>({
                            tagName: 'div',
                            props: {
                                children: ['click'],

                            }
                        }).dom
                    ],
                }
            }).dom
        ]
    );
}

export default App;
