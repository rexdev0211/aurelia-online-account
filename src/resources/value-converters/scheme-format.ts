export class SchemeFormatValueConverter {
    toView(value: string) {
        return (value.toLowerCase() === 'clear')
            ? 'Transfer'
            : value;
    }
}

