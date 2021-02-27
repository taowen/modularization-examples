import { use, Widget } from "@autonomy-design-sample/entity-archetype";
import * as React from 'react';
import type { GreetingWordsGateway } from "../Public/GreetingWordsGateway";

const greetingWordsGateway = use<GreetingWordsGateway>();

export class HomePage extends Widget {
    
    private words = greetingWordsGateway.getGreetingWords();

    constructor(props: {}) {
        super(props);
    }

    public render() {
        return <div>{this.words}</div>;
    }
}