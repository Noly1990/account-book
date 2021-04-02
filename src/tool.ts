export function fileExt(path: string) {
    return path.substr(path.lastIndexOf('.'));
}


export function formatDate(d: Date) {
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()
    return `${year}-${month <= 9 ? '0' + month : month}-${day <= 9 ? '0' + day : day}`
}