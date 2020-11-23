export declare const endTag: (arg: string) => RegExp;
export declare const getTextWidth: () => number;
export declare const isNotBackticked: (str: string, tag: string) => boolean;
export declare const includesSimpleMathTag: (str: string, tag?: string) => boolean;
export declare const includesMultiMathBeginTag: (str: any, tag: any) => RegExp | null;
export declare const includesMultiMathTag: (str: any, tag: any) => boolean;
export declare const arraysCompare: (a1: any, a2: any) => any;
export declare const arrayDelElement: (arr: any, el: any) => any;
export declare const arrayResortFromElement: (arr: any, el: any, notReverse?: boolean, nextEl?: number) => any[];
export declare const uid: () => string;
