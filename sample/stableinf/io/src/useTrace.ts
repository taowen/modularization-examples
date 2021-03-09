let executionTraces: string[] | undefined;

// 高频率的日志追踪，无法用常规的日志框架来实现
export function useTrace(realm: symbol) {
    const t = function (template: TemplateStringsArray, ...subsititutions: any[]) {
        if (!useTrace.shouldTrace(realm)) {
            return;
        }
        const message = String.raw(
            template,
            ...subsititutions.map((s) => (typeof s === 'string' ? s : new String(s))),
        );
        if (executionTraces) {
            executionTraces.push(message);
        } else {
            useTrace.output(message);
        }
    };
    t.execute = <T>(message: string, cb: () => T): T  => {
        if (!useTrace.shouldTrace(realm)) {
            return cb();
        }
        if (executionTraces) {
            executionTraces.push(`>>> ${message}`);
            try {
                return cb();
            } finally {
                executionTraces.push(`<<< ${message}`);
            }
        }
        executionTraces = [];
        try {
            return cb();
        } finally {
            useTrace.output(message, executionTraces);
            executionTraces = undefined;
        }
    }
    t.wrap = <T extends Function>(message: string, cb: T): T => {
        return function(this: any, ...args: any[]) {
            return t.execute(message, () => cb.apply(this, args));
        } as any;
    }
    return t;
}

useTrace.shouldTrace = (realm: symbol) => {
    return false;
};

useTrace.output = console.debug;

