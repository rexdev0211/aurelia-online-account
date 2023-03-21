export class FilterHiddenValueConverter {
    toView(value) {
        return value.filter(x => !x.isHidden)
    }
}

