export const hyperlinkFormatter = (row, cell, value, columnDef, dataContext) => {
    if (value && typeof value === 'string') {
        const matchUrl = value.match(/^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/i);
        if (matchUrl && Array.isArray(matchUrl)) {
            return `<a href="${matchUrl[0]}">' + value + '</a>`;
        }
    }
    return '';
};
//# sourceMappingURL=hyperlinkFormatter.js.map