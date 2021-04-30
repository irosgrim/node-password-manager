export const renameFile = (userId: number, originalName: string): string => {
    const timeInMilliseconds = new Date().getTime();
    return timeInMilliseconds +'_' + userId +'_' + originalName
}

export const stringIsJson = (str: string): boolean => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
