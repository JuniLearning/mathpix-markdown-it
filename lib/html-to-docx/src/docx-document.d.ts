declare class DocxDocument {
    zip: any;
    htmlString: any;
    orientation: any;
    width: any;
    height: any;
    margins: any;
    availableDocumentSpace: any;
    title: any;
    subject: any;
    creator: any;
    keywords: any;
    description: any;
    lastModifiedBy: any;
    revision: any;
    createdAt: any;
    modifiedAt: any;
    headerType: any;
    header: any;
    font: any;
    fontSize: any;
    complexScriptFontSize: any;
    tableRowCantSplit: any;
    lastNumberingId: any;
    lastMediaId: any;
    lastHeaderId: any;
    stylesObjects: any;
    numberingObjects: any;
    relationshipFilename: any;
    relationships: any;
    mediaFiles: any;
    headerObjects: any;
    documentXML: any;
    constructor({ zip, htmlString, orientation, margins, title, subject, creator, keywords, description, lastModifiedBy, revision, createdAt, modifiedAt, headerType, header, font, fontSize, complexScriptFontSize, table, }: {
        zip: any;
        htmlString: any;
        orientation: any;
        margins: any;
        title: any;
        subject: any;
        creator: any;
        keywords: any;
        description: any;
        lastModifiedBy: any;
        revision: any;
        createdAt: any;
        modifiedAt: any;
        headerType: any;
        header: any;
        font: any;
        fontSize: any;
        complexScriptFontSize: any;
        table: any;
    });
    generateContentTypesXML(): string;
    generateCoreXML(): string;
    generateDocumentXML(): string;
    generateSettingsXML(): string;
    generateWebSettingsXML(): string;
    generateStylesXML(): string;
    generateFontTableXML(): string;
    generateNumberingXML(): string;
    appendRelationships(xmlFragment: any, relationships: any): void;
    generateRelsXML(): any;
    createNumbering(listElements: any): any;
    createMediaFile(base64String: any): {
        id: any;
        fileContent: any;
        fileNameWithExtension: string;
    };
    createDocumentRelationships(fileName: string, type: any, target: any, targetMode?: string): number;
    generateHeaderXML(vTree: any): {
        headerId: any;
        headerXML: import("xmlbuilder2/lib/interfaces").XMLBuilder;
    };
}
export default DocxDocument;
